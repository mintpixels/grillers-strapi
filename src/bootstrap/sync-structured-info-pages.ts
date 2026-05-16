export const STRUCTURED_INFO_PAGES_VERSION =
  "structured-info-pages-2026-05-16-v1";

const LEGAL_PAGE_UID = "api::legal-page.legal-page";
const STORE_KEY = "structured-info-pages-version";

type LegalPageRecord = {
  documentId: string;
  Slug?: string;
  Title?: string;
  Body?: Array<Record<string, any>>;
};

const GROUND_OR_OVERNIGHT_TABLE = {
  __component: "info.comparison-table",
  Heading: "Ground or Overnight?",
  Intro:
    "We show you both options at checkout. Pick whichever lands on the date you want.",
  DecisionLabel: "Decision point",
  LeftOptionLabel: "UPS Ground",
  RightOptionLabel: "UPS Overnight",
  Rows: [
    {
      Label: "When it makes sense",
      LeftValue: "Your address is within UPS 3-day transit.",
      RightValue: "Your address is 4+ days transit by Ground.",
    },
    {
      Label: "Dispatch days",
      LeftValue:
        "Mondays for 3-day zones; Mondays and Tuesdays for 2-day zones.",
      RightValue: "Daily as needed.",
    },
    {
      Label: "Checkout calendar",
      LeftValue: "Eligible dates reflect the Ground method and your UPS zone.",
      RightValue: "Eligible dates reflect Overnight availability.",
    },
  ],
  Caption:
    "Enter your address in the cart and checkout will calculate eligible dates automatically.",
};

export async function syncStructuredInfoPages({
  strapi,
  targetVersion,
}: {
  strapi: any;
  targetVersion: string;
}): Promise<void> {
  const store = strapi.store({
    environment: "",
    type: "plugin",
    name: "grillers-bootstrap",
  });

  const current = await store.get({ key: STORE_KEY });
  if (current === targetVersion) {
    strapi.log.info(
      `[sync-structured-info-pages] already at version ${targetVersion}, skipping`
    );
    return;
  }

  const page = await findLegalPage(strapi, "shipping-ups");
  if (!page) {
    strapi.log.warn(
      "[sync-structured-info-pages] no shipping-ups legal page found; skipping"
    );
    return;
  }

  const body = Array.isArray(page.Body) ? page.Body : [];
  if (
    body.some(
      (block) =>
        block?.__component === "info.comparison-table" &&
        block?.Heading === GROUND_OR_OVERNIGHT_TABLE.Heading
    )
  ) {
    await store.set({ key: STORE_KEY, value: targetVersion });
    strapi.log.info(
      `[sync-structured-info-pages] shipping-ups already has ${GROUND_OR_OVERNIGHT_TABLE.Heading}; marked ${targetVersion}`
    );
    return;
  }

  let replaced = false;
  const nextBody = body.map((block) => {
    if (
      block?.__component === "info.section" &&
      block?.Title === GROUND_OR_OVERNIGHT_TABLE.Heading
    ) {
      replaced = true;
      return GROUND_OR_OVERNIGHT_TABLE;
    }
    return stripComponentIds(block);
  });

  if (!replaced) {
    strapi.log.warn(
      `[sync-structured-info-pages] no ${GROUND_OR_OVERNIGHT_TABLE.Heading} section found on shipping-ups; skipping`
    );
    return;
  }

  await strapi.documents(LEGAL_PAGE_UID).update({
    documentId: page.documentId,
    data: { Body: nextBody },
    status: "published",
  });

  await store.set({ key: STORE_KEY, value: targetVersion });

  strapi.log.info(
    `[sync-structured-info-pages] migrated shipping-ups ${GROUND_OR_OVERNIGHT_TABLE.Heading} to info.comparison-table`
  );
}

async function findLegalPage(strapi: any, slug: string) {
  const results = (await strapi.documents(LEGAL_PAGE_UID).findMany({
    filters: { Slug: { $eq: slug } },
    populate: {
      Body: { populate: "*" },
    },
    limit: 1,
  })) as LegalPageRecord[];

  return Array.isArray(results) ? results[0] : null;
}

function stripComponentIds(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripComponentIds);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== "id")
        .map(([key, nested]) => [key, stripComponentIds(nested)])
    );
  }

  return value;
}
