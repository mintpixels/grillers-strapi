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
      // Synchronous on purpose. The strapi-algolia plugin spreads the
      // transformer's return value directly without awaiting it (see the
      // plugin's afterUpdateAndCreate path) — making this `async`
      // returns a Promise, spread of which yields {} → every record
      // becomes an objectID-only stub. This was the historical state
      // and explains #93 stub records as well; it shipped previously
      // because the index had been populated by other one-off paths
      // outside this code. Keep this fn sync until/unless the plugin
      // upstream awaits transformers.
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
        return record;
      },
    },
  },
  graphql: {
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      // Playground/introspection/tracing are dev conveniences and info-disclosure
      // surfaces in production. Token-authenticated queries (how the storefront
      // reads Strapi) are unaffected by turning them off.
      playgroundAlways: env("NODE_ENV") !== "production",
      apolloServer: {
        tracing: env("NODE_ENV") !== "production",
        introspection: env("NODE_ENV") !== "production",
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
