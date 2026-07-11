const assert = require("node:assert/strict");
const test = require("node:test");

const {
  ORDER_SMS_LEGAL_PAGES,
  ORDER_SMS_LEGAL_PAGES_VERSION,
  ORDER_SMS_PRIVACY_CONTENT,
  ORDER_SMS_TERMS_CONTENT,
  syncOrderSmsLegalPages,
} = require("./sync-order-sms-legal-pages.ts");

function flatten(value) {
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (!value || typeof value !== "object") return "";
  return [value.text, value.url, flatten(value.children)]
    .filter(Boolean)
    .join(" ");
}

function createStrapi({ currentVersion = null, existing = [] } = {}) {
  const calls = {
    findMany: [],
    create: [],
    update: [],
    storeGet: [],
    storeSet: [],
    info: [],
  };

  const documents = {
    async findMany(args) {
      calls.findMany.push(args);
      return existing;
    },
    async create(args) {
      calls.create.push(args);
    },
    async update(args) {
      calls.update.push(args);
    },
  };

  return {
    calls,
    strapi: {
      documents(uid) {
        assert.equal(uid, "api::legal-page.legal-page");
        return documents;
      },
      log: {
        info(message) {
          calls.info.push(message);
        },
      },
      store(scope) {
        assert.deepEqual(scope, {
          environment: "",
          type: "plugin",
          name: "grillers-bootstrap",
        });
        return {
          async get(args) {
            calls.storeGet.push(args);
            return currentVersion;
          },
          async set(args) {
            calls.storeSet.push(args);
          },
        };
      },
    },
  };
}

test("defines two dedicated order-update pages without touching marketing slugs", () => {
  assert.deepEqual(
    ORDER_SMS_LEGAL_PAGES.map((page) => page.Slug),
    ["order-sms-terms", "order-sms-privacy"]
  );

  for (const page of ORDER_SMS_LEGAL_PAGES) {
    assert.ok(page.SEO.metaDescription.length >= 50);
    assert.ok(page.SEO.metaDescription.length <= 160);
    assert.ok(!["sms-terms", "privacy-policy"].includes(page.Slug));
  }
});

test("terms state the order-specific consent, delivery-only scope, and carrier disclosures", () => {
  const text = flatten(ORDER_SMS_TERMS_CONTENT);

  for (const phrase of [
    "Griller's Pride Order Updates",
    "particular order",
    "required enrollment confirmation",
    "actual UPS shipping and tracking updates",
    "unchecked",
    "checkout works without selecting it",
    "Consent is not a condition of purchase",
    "up to 6 messages per order",
    "Message and data rates may apply",
    "not liable for delayed or undelivered messages",
    "does not send promotions",
    "STOP",
    "HELP",
    "(770) 454-8108",
    "peter@grillerspride.com",
    "/page/order-sms-privacy",
  ]) {
    assert.match(text, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("privacy notice limits collection and sharing to operation of the order-update program", () => {
  const text = flatten(ORDER_SMS_PRIVACY_CONTENT);

  for (const phrase of [
    "mobile number you provide",
    "evidence of your consent",
    "related cart or order identifier",
    "minimum order and fulfillment context",
    "solely to operate and secure",
    "do not use consent to this program to send marketing",
    "All the above categories exclude text messaging originator opt-in data and consent",
    "won’t be shared with any third parties",
    "service providers solely to deliver and support",
    "Retention & Security",
    "STOP",
    "HELP",
    "/page/order-sms-terms",
  ]) {
    assert.match(text, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("migration updates an existing page, creates the missing page, and publishes both", async () => {
  const { strapi, calls } = createStrapi({
    existing: [{ documentId: "terms-document", Slug: "order-sms-terms" }],
  });

  await syncOrderSmsLegalPages({
    strapi,
    targetVersion: ORDER_SMS_LEGAL_PAGES_VERSION,
  });

  assert.deepEqual(calls.findMany, [
    {
      filters: {
        Slug: { $in: ["order-sms-terms", "order-sms-privacy"] },
      },
      limit: 2,
    },
  ]);
  assert.equal(calls.update.length, 1);
  assert.equal(calls.update[0].documentId, "terms-document");
  assert.equal(calls.update[0].data.Slug, "order-sms-terms");
  assert.equal(calls.update[0].status, "published");
  assert.equal(calls.create.length, 1);
  assert.equal(calls.create[0].data.Slug, "order-sms-privacy");
  assert.equal(calls.create[0].status, "published");
  assert.deepEqual(calls.storeSet, [
    {
      key: "order-sms-legal-pages-version",
      value: ORDER_SMS_LEGAL_PAGES_VERSION,
    },
  ]);
});

test("migration skips document writes when the version is already applied", async () => {
  const { strapi, calls } = createStrapi({
    currentVersion: ORDER_SMS_LEGAL_PAGES_VERSION,
  });

  await syncOrderSmsLegalPages({
    strapi,
    targetVersion: ORDER_SMS_LEGAL_PAGES_VERSION,
  });

  assert.equal(calls.findMany.length, 0);
  assert.equal(calls.update.length, 0);
  assert.equal(calls.create.length, 0);
  assert.equal(calls.storeSet.length, 0);
  assert.match(calls.info[0], /already at version/);
});
