import { shouldExcludeFromSearch } from "../src/utils/public-catalog";

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
        if (shouldExcludeFromSearch(record)) return null;
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
