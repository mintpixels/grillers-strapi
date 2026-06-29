import { errors } from "@strapi/utils"

type CaptionUpdateBody = {
  caption?: string | null
  expectedCaption?: string | null
}

function normalizeCaption(value: unknown) {
  if (value === null || typeof value === "undefined") return null
  if (typeof value !== "string") return String(value)
  return value
}

export default {
  async updateCaption(ctx: any) {
    const id = Number(ctx.params.id)
    const body = (ctx.request.body || {}) as CaptionUpdateBody
    const caption = normalizeCaption(body.caption)
    const expectedCaption = normalizeCaption(body.expectedCaption)

    if (!Number.isInteger(id) || id < 1) {
      return ctx.badRequest("A valid upload file id is required.")
    }

    if (caption && caption.length > 50000) {
      return ctx.badRequest("Caption payload is too large.")
    }

    const file = await strapi.db.query("plugin::upload.file").findOne({
      where: { id },
      select: ["id", "name", "caption"],
    })

    if (!file) {
      return ctx.notFound("Upload file not found.")
    }

    if (
      Object.prototype.hasOwnProperty.call(body, "expectedCaption") &&
      (file.caption || null) !== expectedCaption
    ) {
      ctx.status = 409
      ctx.body = {
        error: {
          message: "Upload file caption changed before the review was saved.",
          currentCaption: file.caption || null,
        },
      }
      return
    }

    const uploadService = strapi.plugin("upload").service("upload")

    let updated
    try {
      updated = await uploadService.updateFileInfo(id, { caption })
    } catch (error) {
      if (error instanceof errors.NotFoundError) {
        return ctx.notFound("Upload file not found.")
      }

      strapi.log.error(
        `[gp-upload-file] failed to update caption for upload file ${id}`,
        error
      )

      ctx.status = 500
      ctx.body = {
        error: {
          message: "Could not update Strapi upload file caption.",
        },
      }
      return
    }

    ctx.body = {
      id: updated.id,
      name: updated.name,
      caption: updated.caption || null,
    }
  },
}
