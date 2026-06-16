export const ATLANTA_DELIVERY_ZONES_VERSION =
  "atlanta-delivery-zones-2026-06-16-v3-7band";

const ZONE_UID = "api::atlanta-delivery-zone.atlanta-delivery-zone";
const STORE_KEY = "atlanta-delivery-zones-version";

const DAY_TO_WEEKDAY: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

type ZoneSeed = {
  zip: string;
  day: "Tuesday" | "Wednesday";
  rate150: number;
  rate100: number;
  rate50: number;
  rate0: number;
};

const ATLANTA_DELIVERY_ZONES: ZoneSeed[] = [
  {
    zip: "30005",
    day: "Tuesday",
    rate150: 3750,
    rate100: 4000,
    rate50: 4250,
    rate0: 4500,
  },
  {
    zip: "30009",
    day: "Tuesday",
    rate150: 2250,
    rate100: 2500,
    rate50: 2750,
    rate0: 3000,
  },
  {
    zip: "30022",
    day: "Tuesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30033",
    day: "Wednesday",
    rate150: 2000,
    rate100: 2250,
    rate50: 2500,
    rate0: 2750,
  },
  {
    zip: "30062",
    day: "Tuesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30067",
    day: "Tuesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30068",
    day: "Tuesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30071",
    day: "Tuesday",
    rate150: 1500,
    rate100: 1750,
    rate50: 2000,
    rate0: 2250,
  },
  {
    zip: "30075",
    day: "Tuesday",
    rate150: 1500,
    rate100: 1750,
    rate50: 2000,
    rate0: 2250,
  },
  {
    zip: "30079",
    day: "Wednesday",
    rate150: 2250,
    rate100: 2500,
    rate50: 2750,
    rate0: 3000,
  },
  {
    zip: "30092",
    day: "Tuesday",
    rate150: 1500,
    rate100: 1750,
    rate50: 2000,
    rate0: 2250,
  },
  {
    zip: "30093",
    day: "Tuesday",
    rate150: 1750,
    rate100: 2000,
    rate50: 2250,
    rate0: 2500,
  },
  {
    zip: "30097",
    day: "Tuesday",
    rate150: 2500,
    rate100: 2750,
    rate50: 3000,
    rate0: 3250,
  },
  {
    zip: "30319",
    day: "Wednesday",
    rate150: 1500,
    rate100: 1750,
    rate50: 2000,
    rate0: 2250,
  },
  {
    zip: "30322",
    day: "Wednesday",
    rate150: 2000,
    rate100: 2250,
    rate50: 2500,
    rate0: 2750,
  },
  {
    zip: "30324",
    day: "Wednesday",
    rate150: 1500,
    rate100: 1750,
    rate50: 2000,
    rate0: 2250,
  },
  {
    zip: "30326",
    day: "Wednesday",
    rate150: 2000,
    rate100: 2250,
    rate50: 2500,
    rate0: 2750,
  },
  {
    zip: "30327",
    day: "Wednesday",
    rate150: 1500,
    rate100: 1750,
    rate50: 2000,
    rate0: 2250,
  },
  {
    zip: "30328",
    day: "Tuesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30329",
    day: "Wednesday",
    rate150: 1000,
    rate100: 1250,
    rate50: 1500,
    rate0: 1750,
  },
  {
    zip: "30338",
    day: "Tuesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30339",
    day: "Tuesday",
    rate150: 1750,
    rate100: 2000,
    rate50: 2250,
    rate0: 2500,
  },
  {
    zip: "30340",
    day: "Wednesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30341",
    day: "Wednesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30342",
    day: "Wednesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30345",
    day: "Wednesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30346",
    day: "Wednesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30350",
    day: "Tuesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
  {
    zip: "30360",
    day: "Tuesday",
    rate150: 1250,
    rate100: 1500,
    rate50: 1750,
    rate0: 2000,
  },
];

function seedToData(seed: ZoneSeed, index: number) {
  // 7-band SAMADMIN backfill (#266). The original seed only carries 4
  // distinct charge tiers (rate0/50/100/150) plus a free $250+ tier. We
  // populate the new 7 bands additively so existing behavior is preserved
  // until Peter edits the finer bands in the admin:
  //   $1-29.99  & $30-49.99   <- legacy rate0 (0-49)
  //   $50-99.99               <- legacy rate50
  //   $100-149.99             <- legacy rate100
  //   $150-249                <- legacy rate150
  //   $250-349.99 & $350+     <- legacy Rate250Plus (0 = free above threshold)
  return {
    ZipCode: seed.zip,
    DeliveryDay: seed.day,
    Weekdays: [DAY_TO_WEEKDAY[seed.day]],
    CutoffHourLocal: 12,
    // Standard $250 free-delivery threshold. Because this is <= 25000, copying
    // the (free) Rate250PlusCents into the $250-349.99/$350+ bands below is
    // safe: those bands only become free once the order has cleared the same
    // $250 threshold. The sevenBandBackfillPatch free-threshold guard mirrors
    // this assumption for existing rows whose threshold may exceed $250.
    FreeDeliveryThresholdCents: 25000,
    Rate250PlusCents: 0,
    Rate150To249Cents: seed.rate150,
    Rate100To149Cents: seed.rate100,
    Rate50To99Cents: seed.rate50,
    Rate0To49Cents: seed.rate0,
    // 7-band fields (additive; mirror legacy tiers as defaults).
    Rate1To29Cents: seed.rate0,
    Rate30To49Cents: seed.rate0,
    Rate50To99BandCents: seed.rate50,
    Rate100To149BandCents: seed.rate100,
    Rate150To249BandCents: seed.rate150,
    Rate250To349Cents: 0,
    Rate350PlusCents: 0,
    IsActive: true,
    SortOrder: index + 1,
    Notes:
      "Seeded from footer-pages-copy-2026-04-27 Atlanta delivery rate table. 7-band fields backfilled from legacy tiers 2026-06-16; tune $1-29.99/$30-49.99 and $250-349.99/$350+ in admin per SAMADMIN.",
    publishedAt: new Date().toISOString(),
  };
}

// Builds a minimal, edit-safe patch that backfills ONLY the new 7-band fields
// that are still null/undefined on an existing zone row. Each new band is
// derived from that row's CURRENT legacy value (so owner edits are honored),
// falling back to the seed's legacy tier when the legacy value is also unset.
// Returns {} when every new band is already populated, so the caller can skip
// the write and keep the version-gated sync idempotent.
function sevenBandBackfillPatch(
  currentZone: any,
  seed: ZoneSeed,
  strapi: any
): Record<string, number> {
  const legacy0to49 = currentZone?.Rate0To49Cents ?? seed.rate0;
  const legacy50to99 = currentZone?.Rate50To99Cents ?? seed.rate50;
  const legacy100to149 = currentZone?.Rate100To149Cents ?? seed.rate100;
  const legacy150to249 = currentZone?.Rate150To249Cents ?? seed.rate150;
  const legacy250plus = currentZone?.Rate250PlusCents ?? 0;
  const freeThreshold = currentZone?.FreeDeliveryThresholdCents ?? 25000;

  const desired: Record<string, number> = {
    Rate1To29Cents: legacy0to49,
    Rate30To49Cents: legacy0to49,
    Rate50To99BandCents: legacy50to99,
    Rate100To149BandCents: legacy100to149,
    Rate150To249BandCents: legacy150to249,
  };

  // FREE-THRESHOLD GUARD: legacy Rate250PlusCents defaults to 0 (= free)
  // because free delivery historically kicked in at the standard $250
  // threshold. If THIS row's free threshold is above $250 (25000 cents),
  // copying that 0 into the $250-349.99 and $350+ bands would make those
  // bands free before the order actually clears the row's real free
  // threshold. In that case we leave both bands unset (null) and warn so an
  // editor sets them manually. Only backfill them from the legacy free tier
  // when the row uses the standard <= $250 threshold.
  if (freeThreshold <= 25000) {
    desired.Rate250To349Cents = legacy250plus;
    desired.Rate350PlusCents = legacy250plus;
  } else {
    const stillMissing250Bands =
      currentZone?.Rate250To349Cents === null ||
      currentZone?.Rate250To349Cents === undefined ||
      currentZone?.Rate350PlusCents === null ||
      currentZone?.Rate350PlusCents === undefined;
    if (stillMissing250Bands) {
      strapi.log.warn(
        `[sync-atlanta-delivery-zones] zip=${seed.zip} has FreeDeliveryThresholdCents=${freeThreshold} (> 25000); ` +
          `leaving Rate250To349Cents/Rate350PlusCents unset to avoid wrongly-free bands. Set these manually in admin.`
      );
    }
  }

  const patch: Record<string, number> = {};
  for (const [field, value] of Object.entries(desired)) {
    const existingValue = currentZone?.[field];
    if (existingValue === null || existingValue === undefined) {
      patch[field] = value;
    }
  }
  return patch;
}

export async function syncAtlantaDeliveryZones({
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
      `[sync-atlanta-delivery-zones] already at version ${targetVersion}, skipping`
    );
    return;
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let skippedDraftDivergence = 0;

  for (const [index, seed] of ATLANTA_DELIVERY_ZONES.entries()) {
    const existing = await strapi.documents(ZONE_UID).findMany({
      filters: { ZipCode: { $eq: seed.zip } },
      limit: 1,
    });
    const currentZone = Array.isArray(existing) ? existing[0] : null;

    if (currentZone?.documentId) {
      // DRAFT-DIVERGENCE GUARD: updating with status:"published" publishes the
      // ENTIRE document, which would also ship any unrelated unpublished draft
      // edits an editor has staged on this zone. Compare the draft version
      // against the published version: if the row has no published version yet,
      // or the draft has been modified more recently than the published copy,
      // the draft diverges -> skip and warn for manual review rather than
      // silently publishing someone's in-progress edits.
      const [draftVersion, publishedVersion] = await Promise.all([
        strapi
          .documents(ZONE_UID)
          .findOne({ documentId: currentZone.documentId, status: "draft" }),
        strapi
          .documents(ZONE_UID)
          .findOne({ documentId: currentZone.documentId, status: "published" }),
      ]);

      const draftUpdatedAt = draftVersion?.updatedAt
        ? new Date(draftVersion.updatedAt).getTime()
        : null;
      const publishedUpdatedAt = publishedVersion?.updatedAt
        ? new Date(publishedVersion.updatedAt).getTime()
        : null;

      const draftDiverges =
        !publishedVersion ||
        (draftUpdatedAt !== null &&
          publishedUpdatedAt !== null &&
          draftUpdatedAt > publishedUpdatedAt);

      if (draftDiverges) {
        strapi.log.warn(
          `[sync-atlanta-delivery-zones] zip=${seed.zip} (documentId=${currentZone.documentId}) has a draft that diverges from its published version; ` +
            `skipping 7-band backfill to avoid publishing unrelated draft edits. Apply manually after reviewing the draft.`
        );
        skippedDraftDivergence += 1;
        continue;
      }

      // NON-DESTRUCTIVE backfill: only fill the new 7-band fields that are
      // still null on the existing row, derived from THIS row's current legacy
      // values (preserving any owner edits) with the seed as fallback. Never
      // overwrite legacy rates, threshold, Notes, IsActive, SortOrder, or a
      // band the owner has already set. Skip the write entirely if nothing is
      // missing, so re-running this version is idempotent and edit-safe.
      const patch = sevenBandBackfillPatch(currentZone, seed, strapi);
      if (Object.keys(patch).length === 0) {
        skipped += 1;
        continue;
      }
      await strapi.documents(ZONE_UID).update({
        documentId: currentZone.documentId,
        data: patch,
        status: "published",
      });
      updated += 1;
    } else {
      await strapi.documents(ZONE_UID).create({
        data: seedToData(seed, index),
        status: "published",
      });
      created += 1;
    }
  }

  await store.set({ key: STORE_KEY, value: targetVersion });
  strapi.log.info(
    `[sync-atlanta-delivery-zones] synced ${ATLANTA_DELIVERY_ZONES.length} zones to ${targetVersion}; created=${created} updated=${updated} skipped=${skipped} skippedDraftDivergence=${skippedDraftDivergence}`
  );
}
