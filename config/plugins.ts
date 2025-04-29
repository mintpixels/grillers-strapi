export default () => ({
  // slugify: {
  //   enabled: true,
  //   config: {},
  // },
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
});
