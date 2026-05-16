export const PRODUCT_HECHSHER_METADATA_VERSION =
  "product-hechsher-metadata-2026-05-16-v1";

const PRODUCT_UID = "api::product.product";
const STORE_KEY = "product-hechsher-metadata-version";

const HECHSHER_FIELDS = [
  "ChassidishShchita",
  "CHK",
  "RabbiWeissmandl",
  "OU",
  "StarK",
  "RabbiTeitelbaum",
  "CRC",
  "Lubavitch",
] as const;

type HechsherField = (typeof HECHSHER_FIELDS)[number];

type ProductRecord = {
  documentId: string;
  Title?: string;
  Metadata?: Record<string, unknown> | null;
  MedusaProduct?: {
    Handle?: string;
    Variants?: Array<{
      Sku?: string;
      Title?: string;
    }>;
  } | null;
};

const PATTERNS: Record<HechsherField, RegExp[]> = {
  ChassidishShchita: [
    /\bchk\b/i,
    /chk supervision/i,
    /david ellio?t/i,
    /weissmandl/i,
    /rubashkin/i,
    /teitelbaum/i,
    /lubavitch/i,
    /star[-\s]?k/i,
    /\bcrc\b/i,
    /central rabbinical/i,
    /hisachdus/i,
    /chassidish/i,
    /shor\s?habor/i,
    /aarons/i,
    /agristar/i,
  ],
  CHK: [/\bchk\b/i, /chk supervision/i, /david ellio?t/i],
  RabbiWeissmandl: [/weissmandl/i, /rubashkin/i],
  OU: [/\bou\b/i, /orthodox union/i],
  StarK: [/star[-\s]?k/i],
  RabbiTeitelbaum: [/teitelbaum/i],
  CRC: [/\bcrc\b/i, /central rabbinical/i, /hisachdus/i],
  Lubavitch: [/lubavitch/i],
};

export async function syncProductHechsherMetadata({
  strapi,
  targetVersion,
}: {
  strapi: any;
  targetVersion: string;
}): Promise<void> {
  const store = strapi.store({
    environment: "",
    type: "plugin",
    name: "grillers-bootstrap",
  });

  const current = await store.get({ key: STORE_KEY });
  if (current === targetVersion) {
    strapi.log.info(
      `[sync-product-hechsher-metadata] already at version ${targetVersion}, skipping`
    );
    return;
  }

  const products = (await strapi.documents(PRODUCT_UID).findMany({
    fields: ["documentId", "Title"],
    populate: {
      Metadata: { populate: "*" },
      MedusaProduct: {
        populate: {
          Variants: { populate: "*" },
        },
      },
    },
    limit: 1000,
  })) as ProductRecord[];

  let updated = 0;
  const counts = Object.fromEntries(
    HECHSHER_FIELDS.map((field) => [field, 0])
  ) as Record<HechsherField, number>;

  for (const product of products || []) {
    const inferred = inferHechsherMetadata(product);
    const metadata = product.Metadata || {};
    const shouldUpdate = HECHSHER_FIELDS.some((field) => {
      if (!inferred[field]) return false;
      return metadata[field] !== true;
    });

    if (!shouldUpdate) continue;

    await strapi.documents(PRODUCT_UID).update({
      documentId: product.documentId,
      data: {
        Metadata: {
          ...metadata,
          ...inferred,
        },
      },
      status: "published",
    });

    for (const field of HECHSHER_FIELDS) {
      if (inferred[field]) counts[field] += 1;
    }
    updated += 1;
  }

  await store.set({ key: STORE_KEY, value: targetVersion });

  strapi.log.info(
    `[sync-product-hechsher-metadata] inferred hechsher metadata from legacy product titles for ${updated}/${
      products.length
    } products; counts=${JSON.stringify(counts)}`
  );
}

function inferHechsherMetadata(product: ProductRecord) {
  const text = productText(product);
  return Object.fromEntries(
    HECHSHER_FIELDS.map((field) => [
      field,
      PATTERNS[field].some((pattern) => pattern.test(text)),
    ])
  ) as Record<HechsherField, boolean>;
}

function productText(product: ProductRecord) {
  return [
    product.Title,
    product.MedusaProduct?.Handle,
    ...(product.MedusaProduct?.Variants || []).flatMap((variant) => [
      variant.Sku,
      variant.Title,
    ]),
  ]
    .filter(Boolean)
    .join(" ");
}
