function algoliaProductObjectID(record: any): string | null {
  const value =
    record?.medusa_product_id ||
    record?.MedusaProduct?.ProductId ||
    record?.documentId ||
    record?.id

  return value == null ? null : String(value)
}

export default ({ env }) => ({
  "strapi-algolia": {
    enabled: true,
    config: {
      apiKey: env("ALGOLIA_WRITE_KEY"),
      applicationId: env("ALGOLIA_APP_ID"),
      contentTypes: [
        {
          name: "api::product.product",
          populate: {
            FeaturedImage: {
              fields: ["url"],
            },
            // GalleryImages indexed for #116 — search results product cards
            // need them so the ProductCardCarousel renders chevrons / N-of-N
            // indicators, matching Bestsellers / PLP UX.
            GalleryImages: {
              fields: ["url"],
            },
            Metadata: "*",
            Categorization: {
              populate: "*",
            },
            MedusaProduct: {
              populate: {
                Variants: {
                  populate: "*",
                },
              },
            },
          },
          hideFields: ["Recipes"],
        },
      ],
      // Synchronous on purpose. Older strapi-algolia builds spread the
      // transformer's return value directly instead of awaiting it, which
      // turned async transformers into objectID-only records. Keeping this
      // sync works across both those builds and the current awaited path.
      transformerCallback: (_indexName, record) => {
        // Allowlist: keep null (Status field is unreliable per #114 —
        // backfill pending; storefront treats Strapi entries with a
        // linked MedusaProduct as published anyway) and explicit
        // "published". Drop "draft", "proposed", "rejected" — all
        // editor-managed states that shouldn't appear in search.
        const status = record?.MedusaProduct?.Status;
        if (status != null && status !== "published") return null;
        const skus: string[] = (record?.MedusaProduct?.Variants ?? [])
          .map((v: any) => v?.Sku ?? "")
          .filter(Boolean);
        if (skus.some((s) => s.startsWith("RM-") || s.startsWith("Z-"))) return null;
        const objectID = algoliaProductObjectID(record);
        if (!objectID) return null;
        return {
          ...record,
          objectID,
        };
      },
    },
  },
  graphql: {
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: true,
      apolloServer: {
        tracing: true,
        introspection: true,
      },
    },
  },
  "strapi-csv-import-export": {
    enabled: true,
    config: {
      authorizedExports: ["api::product.product"],
      authorizedImports: ["api::product.product"],
    },
  },
  "strapi-import-export": {
    enabled: true,
    config: {},
  },
});
