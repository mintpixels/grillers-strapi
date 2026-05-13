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
      transformerCallback: async (_indexName, record) => {
        // Only drop explicit drafts. Treating null Status as "assume
        // published" because the MedusaProduct.Status field on Strapi
        // entries is unreliable — 706 of 767 entries have it set to null
        // (#114 — backfill pending) even though the underlying Medusa
        // products are real published items the storefront uses. Filtering
        // on Status === "published" excluded almost everything, which is
        // how #93's search-coverage incident happened.
        if (record?.MedusaProduct?.Status === "draft") return null;
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
