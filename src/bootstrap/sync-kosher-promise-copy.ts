/**
 * One-off content migration: replace the homepage "A Kosher Promise" body
 * with the approved copy from grillers-pride-strategy issue #54.
 *
 * Runs at bootstrap; gated by a store key so it only fires when the
 * version constant below changes. Bump KOSHER_PROMISE_BODY_VERSION to
 * force a re-run on the next deploy.
 */

export const KOSHER_PROMISE_BODY_VERSION = "2026-04-30-v1"

const APPROVED_BODY_TEXT =
  "Atlanta Kashruth Commission supervised since 2002. A full-time mashgiach on every shift. Custom-cut insulated containers and food-grade dry ice, calibrated for the exact distance from our dock to your door. We treat every order like the one we'd want at our own Shabbos table — because some of them are."

const APPROVED_BODY_BLOCKS = [
  {
    type: "paragraph",
    children: [{ type: "text", text: APPROVED_BODY_TEXT }],
  },
]

const STORE_KEY = "kosher-promise-body-version"

export async function syncKosherPromiseCopy({
  strapi,
  targetVersion,
}: {
  strapi: any
  targetVersion: string
}): Promise<void> {
  const store = strapi.store({
    environment: "",
    type: "plugin",
    name: "grillers-bootstrap",
  })

  const current = await store.get({ key: STORE_KEY })
  if (current === targetVersion) {
    strapi.log.info(
      `[sync-kosher-promise-copy] already at version ${targetVersion}, skipping`
    )
    return
  }

  const home = await strapi.documents("api::home.home").findFirst({
    populate: { Sections: { populate: "*" } },
  })

  if (!home) {
    strapi.log.warn(
      "[sync-kosher-promise-copy] no Home single-type document found; skipping"
    )
    return
  }

  const sections = Array.isArray((home as any).Sections)
    ? [...(home as any).Sections]
    : []

  let touched = false
  const updatedSections = sections.map((section: any) => {
    if (section?.__component !== "home.kosher-promise") return section
    touched = true
    return { ...section, Content: APPROVED_BODY_BLOCKS }
  })

  if (!touched) {
    strapi.log.warn(
      "[sync-kosher-promise-copy] no home.kosher-promise component found in Sections"
    )
    return
  }

  await strapi.documents("api::home.home").update({
    documentId: (home as any).documentId,
    data: { Sections: updatedSections },
    status: "published",
  })

  await store.set({ key: STORE_KEY, value: targetVersion })

  strapi.log.info(
    `[sync-kosher-promise-copy] homepage Kosher Promise body synced to version ${targetVersion}`
  )
}
