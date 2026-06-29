export default {
  routes: [
    {
      method: "GET",
      path: "/gp-upload-files/reviews",
      handler: "gp-upload-file.listReviews",
    },
    {
      method: "POST",
      path: "/gp-upload-files/:id/caption",
      handler: "gp-upload-file.updateCaption",
    },
  ],
}
