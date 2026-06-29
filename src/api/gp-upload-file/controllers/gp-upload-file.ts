type CaptionUpdateBody = {
  caption?: string | null
  expectedCaption?: string | null
}

const MEDIA_REVIEW_UID = "api::gp-media-review.gp-media-review" as any

function normalizeCaption(value: unknown) {
  if (value === null || typeof value === "undefined") return null
  if (typeof value !== "string") return String(value)
  return value
}

function parseUploadFileIds(value: unknown) {
  const input = Array.isArray(value) ? value.join(",") : String(value || "")
  return Array.from(
    new Set(
      input
        .split(",")
        .map((item) => Number(item.trim()))
        .filter((id) => Number.isInteger(id) && id > 0)
    )
  ).slice(0, 200)
}

export default {
  async listReviews(ctx: any) {
    const ids = parseUploadFileIds(ctx.query.ids)

    if (!ids.length) {
      ctx.body = { data: [] }
      return
    }

    const reviews = await strapi.db.query(MEDIA_REVIEW_UID).findMany({
      where: {
        UploadFileId: {
          $in: ids,
        },
      },
      select: ["UploadFileId", "ReviewPayload", "updatedAt"],
    })

    ctx.body = {
      data: reviews.map((review) => ({
        uploadFileId: review.UploadFileId,
        caption: review.ReviewPayload || null,
        updatedAt: review.updatedAt || null,
      })),
    }
  },

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

    const existingReview = await strapi.db.query(MEDIA_REVIEW_UID).findOne({
      where: { UploadFileId: id },
      select: ["id", "UploadFileId", "ReviewPayload"],
    })
    const currentCaption =
      normalizeCaption(existingReview?.ReviewPayload) ||
      normalizeCaption(file.caption)

    if (
      Object.prototype.hasOwnProperty.call(body, "expectedCaption") &&
      (currentCaption || null) !== expectedCaption
    ) {
      ctx.status = 409
      ctx.body = {
        error: {
          message: "Upload file caption changed before the review was saved.",
          currentCaption: currentCaption || null,
        },
      }
      return
    }

    try {
      if (existingReview) {
        await strapi.db.query(MEDIA_REVIEW_UID).update({
          where: { id: existingReview.id },
          data: {
            UploadName: file.name || null,
            ReviewPayload: caption,
          },
        })
      } else {
        await strapi.db.query(MEDIA_REVIEW_UID).create({
          data: {
            UploadFileId: id,
            UploadName: file.name || null,
            ReviewPayload: caption,
          },
        })
      }
    } catch (error) {
      strapi.log.error(
        `[gp-upload-file] failed to update review payload for upload file ${id}`,
        error
      )

      ctx.status = 500
      ctx.body = {
        error: {
          message: "Could not update Strapi upload file review.",
        },
      }
      return
    }

    ctx.body = {
      id,
      name: file.name,
      caption: caption || null,
    }
  },
}
