const assert = require("node:assert/strict");
const test = require("node:test");
const { packingPublicationMiddleware, COLD_CHAIN_UID } = require("./packing-publication.ts");
const { validatePackingPublication } = require("./seasonal-packing-policy.ts");
const copy = value => JSON.parse(JSON.stringify(value));

// Synthetic inputs only; none are approved operating values.
function setting() {
  return {
    Enabled: true, PackagingCostModel: "continuous_weight", PackingPolicyVersion: "fixture-v1",
    MinimumDryIceAmount: 2, DryIceBlockWeightLb: 2, DryIcePricePerLb: 1,
    PackagingBoxes: [{ PackagingTier: "m330", Name: "Synthetic", UnitCost: 10,
      LengthIn: 10, WidthIn: 11, HeightIn: 12, MaxTotalWeightLb: 40,
      TareWeightLb: 1, MaxFitUnits: 10, FitRuleId: "fixture-fit", DryIceFitUnitsPerLb: 0.5 }],
    SeasonalPackingPolicies: [{ Name: "Synthetic", Revision: "fixture-season", Active: true,
      ApprovedBy: "synthetic-fixture", ApprovedAt: "2026-09-19T00:00:00Z", ApprovalReference: "test-only",
      EffectiveFrom: "2026-09-20", EffectiveThrough: "2026-12-31", DelayAllowanceHours: 4,
      MaxExposureHours: 72, MaxGrossWeightLb: 40, AllowGround: true, Allow330: true,
      ExposureRules: [{ Service: "GROUND", BoxTier: "m330", ThroughHours: 24, DryIceBlocksPerBox: 1 }, { Service: "GROUND", BoxTier: "m330", ThroughHours: 72, DryIceBlocksPerBox: 3 }] }],
  };
}
function harness(draft = setting(), duringPublish = () => {}) {
  let published = { previous: true }, calls = 0;
  const reads = [];
  const strapi = {
    documents: () => ({ findOne: async params => { reads.push(params); return copy(draft); } }),
    db: {
      transaction: async work => {
        const before = copy(published);
        try { return await work(); } catch (error) { published = before; throw error; }
      },
      query: () => ({ findOne: async params => { reads.push(params); return copy(published); } }),
    },
  };
  const middleware = packingPublicationMiddleware(strapi, message => Object.assign(new Error(message), { name: "ValidationError" }));
  const next = async () => {
    calls++; published = { ...copy(draft), id: 42, documentId: "fixture-doc", publishedAt: "2026-09-20T00:00:00Z" };
    duringPublish(published);
    return { documentId: "fixture-doc", entries: [{ id: 42 }] };
  };
  return { run: context => middleware({ uid: COLD_CHAIN_UID, action: "publish", params: { documentId: "fixture-doc" }, ...context }, next),
    state: () => ({ published, calls, reads }) };
}

test("valid publication checks the populated draft and actual inserted version", async () => {
  const h = harness(); await h.run();
  assert.equal(h.state().calls, 1);
  assert.deepEqual(h.state().reads.map(r => r.populate.SeasonalPackingPolicies), [{ populate: { ExposureRules: true } }, { populate: { ExposureRules: true } }]);
  assert.deepEqual(h.state().reads[1].where, { id: 42, documentId: "fixture-doc", publishedAt: { $ne: null } });
});

test("incomplete publication never replaces the old policy", async () => {
  const draft = setting(); draft.PackagingBoxes[0].DryIceFitUnitsPerLb = null;
  const h = harness(draft);
  await assert.rejects(h.run(), { name: "ValidationError" });
  assert.deepEqual(h.state().published, { previous: true }); assert.equal(h.state().calls, 0);
});

test("a changed actual version fails the postcheck and rolls back in the transaction harness", async () => {
  const h = harness(setting(), published => { published.SeasonalPackingPolicies[0].ApprovedBy = ""; });
  await assert.rejects(h.run(), /missing_policy_approval/);
  assert.equal(h.state().calls, 1); assert.deepEqual(h.state().published, { previous: true });
});

for (const action of ["create", "update"]) test(`${action} cannot bypass review with status published`, async () => {
  const h = harness(); await assert.rejects(h.run({ action, params: { status: "published", data: setting() } }), /Save cold-chain settings as a draft/);
  assert.equal(h.state().calls, 0);
});

for (const action of ["unpublish", "delete"]) test(`${action} cannot remove the cold-chain policy or its withdrawal signal`, async () => {
  for (const draft of [setting(), { Enabled: false }]) {
    const h = harness(draft);
    await assert.rejects(h.run({ action }), { name: "ValidationError", message: /Keep cold-chain settings published/ });
    assert.equal(h.state().calls, 0);
    assert.deepEqual(h.state().published, { previous: true });
  }
  const unrelated = harness();
  await unrelated.run({ uid: "api::article.article", action });
  assert.equal(unrelated.state().calls, 1);
});

test("draft editing and unrelated content types pass through", async () => {
  const draft = harness(); await draft.run({ action: "update", params: { status: "draft" } }); assert.equal(draft.state().reads.length, 0);
  const other = harness(); await other.run({ uid: "api::article.article" }); assert.equal(other.state().reads.length, 0);
});

test("disabled settings can be published to withdraw shipping without inventing a fallback", async () => {
  const h = harness({ Enabled: false }); await h.run(); assert.equal(h.state().published.Enabled, false);
});

test("publication rejects ambiguous coverage, impossible ice space and missing price", () => {
  const overlap = setting(); overlap.SeasonalPackingPolicies.push({ ...copy(overlap.SeasonalPackingPolicies[0]), Revision: "second" });
  assert.throws(() => validatePackingPublication(overlap), /overlapping_policy_periods/);
  const space = setting(); space.PackagingBoxes[0].MaxFitUnits = 2;
  assert.throws(() => validatePackingPublication(space), /no_box_for_policy_limit/);
  const price = setting(); price.DryIcePricePerLb = null;
  assert.throws(() => validatePackingPublication(price), /invalid_ice_inputs/);
});

test("block mass and explicit service/box quantities are required before publishing", () => {
  for (const block of [undefined, null, 0, -1]) {
    const draft = setting(); draft.DryIceBlockWeightLb = block;
    assert.throws(() => validatePackingPublication(draft), /invalid_ice_inputs/);
  }
  const legacy = setting(); legacy.SeasonalPackingPolicies[0].ExposureRules = [{ ThroughHours: 72, DryIceMultiplier: 3 }];
  assert.throws(() => validatePackingPublication(legacy), /invalid_exposure_rule/);
  const impossible = setting(); impossible.DryIceBlockWeightLb = 30;
  assert.throws(() => validatePackingPublication(impossible), /no_box_for_policy_limit/);
});

test("draft/publish and nested component schemas are wired to the guarded singleton", () => {
  const schema = require("../api/cold-chain-setting/content-types/cold-chain-setting/schema.json");
  assert.equal(schema.options.draftAndPublish, true);
  assert.equal(schema.attributes.SeasonalPackingPolicies.component, "checkout.seasonal-packing-policy");
  const policy = require("../components/checkout/seasonal-packing-policy.json");
  assert.equal(policy.collectionName, "components_checkout_seasonal_packing_policies");
});
