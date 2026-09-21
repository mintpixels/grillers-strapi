/* Boot the real GraphQL plugin against an isolated copy and disposable SQLite.
 * Build/type checks do not construct Strapi's runtime GraphQL schema.
 */
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const assert = require("node:assert/strict");

async function child(fixture) {
  // This fixture needs no outbound connections, credentials, customer records,
  // search indexing or email delivery. Catch accidental new external clients.
  require("node:net").Socket.prototype.connect = function () {
    throw new Error("Outbound connections are disabled in the GraphQL boot fixture");
  };
  global.fetch = async () => {
    throw new Error("Outbound requests are disabled in the GraphQL boot fixture");
  };
  const { compileStrapi, createStrapi } = require("@strapi/strapi");
  const context = await compileStrapi({ appDir: fixture });
  const app = createStrapi({ ...context, serveAdminPanel: false });
  try {
    await app.load();
    assert.equal(app.plugin("graphql").config("shadowCRUD"), true);
    assert.ok(app.components["checkout.fulfillment-transit-rule"]);
    // Exercise the real document middleware/database, not only a fake next().
    // Disabled synthetic data does not claim approval of any operating policy.
    const uid = "api::cold-chain-setting.cold-chain-setting";
    const documents = app.documents(uid);
    const populate = { SeasonalPackingPolicies: { populate: { ExposureRules: true } } };
    const draft = await documents.create({ status: "draft", data: {
      Enabled: false,
      SeasonalPackingPolicies: [{ Name: "Isolated fixture", Revision: "fixture-only", Active: false,
        ExposureRules: [{ ThroughHours: 24, DryIceMultiplier: 1 }] }],
    } });
    await documents.publish({ documentId: draft.documentId });
    const before = await documents.findOne({ documentId: draft.documentId, status: "published", populate });
    assert.equal(before.Enabled, false);
    assert.equal(before.SeasonalPackingPolicies[0].Revision, "fixture-only");
    assert.equal(Number(before.SeasonalPackingPolicies[0].ExposureRules[0].ThroughHours), 24);
    assert.equal(app.components["checkout.seasonal-packing-policy"].collectionName,
      "components_checkout_seasonal_packing_policies");
    for (const action of ["unpublish", "delete"]) {
      await assert.rejects(documents[action]({ documentId: draft.documentId }), {
        name: "ValidationError", message: /Keep cold-chain settings published/,
      });
      assert.deepEqual(await documents.findOne({ documentId: draft.documentId, status: "published", populate }), before);
    }
    console.log("PACKING_DOCUMENT_GUARD_OK: disabled publication and nested components preserved after unpublish/delete rejection");
    console.log("GRAPHQL_BOOT_OK: real Strapi startup and calendar shadow CRUD completed");
  } finally {
    await app.destroy();
  }
}

if (process.argv[2] === "--isolated-child") {
  child(process.argv[3]).then(() => process.exit(0)).catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
} else {
  const project = path.resolve(__dirname, "..");
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "gp-graphql-boot-"));
  try {
    // Deliberately exclude .env, databases, uploads and all local runtime state.
    for (const entry of ["package.json", "tsconfig.json", "config", "src", "types"]) {
      const source = path.join(project, entry);
      if (fs.existsSync(source)) fs.cpSync(source, path.join(fixture, entry), { recursive: true });
    }
    fs.mkdirSync(path.join(fixture, "public", "uploads"), { recursive: true });
    fs.symlinkSync(path.join(project, "node_modules"), path.join(fixture, "node_modules"), "dir");

    // Preserve the actual GraphQL and all other application schema/plugin code.
    // Only external search/cloud integrations are disabled in this fixture.
    const pluginFile = path.join(fixture, "config", "plugins.ts");
    const originalPlugins = fs.readFileSync(pluginFile, "utf8");
    assert.match(originalPlugins, /export default/);
    fs.writeFileSync(pluginFile, originalPlugins.replace("export default", "const applicationPlugins =") + `
export default (context) => ({
  ...applicationPlugins(context),
  "strapi-algolia": { enabled: false },
  cloud: { enabled: false },
});
`);
    const env = {
      PATH: process.env.PATH,
      NODE_ENV: "test",
      DATABASE_CLIENT: "sqlite",
      DATABASE_FILENAME: ".tmp/graphql-boot.db",
      APP_KEYS: "isolated-graphql-key-one,isolated-graphql-key-two",
      ADMIN_JWT_SECRET: "isolated-graphql-admin-secret",
      API_TOKEN_SALT: "isolated-graphql-api-salt",
      TRANSFER_TOKEN_SALT: "isolated-graphql-transfer-salt",
      JWT_SECRET: "isolated-graphql-user-secret",
      STRAPI_TELEMETRY_DISABLED: "true",
      STRAPI_DISABLE_UPDATE_NOTIFICATION: "true",
      HOST: "127.0.0.1",
      PORT: "0",
    };
    const result = spawnSync(process.execPath, [__filename, "--isolated-child", fixture], {
      cwd: fixture, env, encoding: "utf8", timeout: 120000, maxBuffer: 4 * 1024 * 1024,
    });
    if (result.error) throw result.error;
    if (result.status !== 0) {
      process.stderr.write(result.stdout || "");
      process.stderr.write(result.stderr || "");
      process.exitCode = 1;
    } else {
      assert.match(result.stdout, /GRAPHQL_BOOT_OK/);
      assert.match(result.stdout, /PACKING_DOCUMENT_GUARD_OK/);
      console.log("GRAPHQL_BOOT_OK: isolated SQLite; GraphQL enabled; external integrations disabled");
      console.log("PACKING_DOCUMENT_GUARD_OK: native publication, nested readback and rejected removal preserve the published policy");
    }
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
}
