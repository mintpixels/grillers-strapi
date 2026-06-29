export default {
  routes: [
    {
      method: "POST",
      path: "/gp-upload-files/:id/caption",
      handler: "gp-upload-file.updateCaption",
    },
  ],
}
