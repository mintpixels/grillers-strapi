export const ATLANTA_DELIVERY_ZONES_VERSION =
  "atlanta-delivery-zones-2026-05-16-v2";

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
  return {
    ZipCode: seed.zip,
    DeliveryDay: seed.day,
    Weekdays: [DAY_TO_WEEKDAY[seed.day]],
    CutoffHourLocal: 12,
    FreeDeliveryThresholdCents: 25000,
    Rate250PlusCents: 0,
    Rate150To249Cents: seed.rate150,
    Rate100To149Cents: seed.rate100,
    Rate50To99Cents: seed.rate50,
    Rate0To49Cents: seed.rate0,
    IsActive: true,
    SortOrder: index + 1,
    Notes:
      "Seeded from footer-pages-copy-2026-04-27 Atlanta delivery rate table.",
    publishedAt: new Date().toISOString(),
  };
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

  for (const [index, seed] of ATLANTA_DELIVERY_ZONES.entries()) {
    const data = seedToData(seed, index);
    const existing = await strapi.documents(ZONE_UID).findMany({
      filters: { ZipCode: { $eq: seed.zip } },
      limit: 1,
    });
    const currentZone = Array.isArray(existing) ? existing[0] : null;

    if (currentZone?.documentId) {
      await strapi.documents(ZONE_UID).update({
        documentId: currentZone.documentId,
        data,
        status: "published",
      });
      updated += 1;
    } else {
      await strapi.documents(ZONE_UID).create({ data, status: "published" });
      created += 1;
    }
  }

  await store.set({ key: STORE_KEY, value: targetVersion });
  strapi.log.info(
    `[sync-atlanta-delivery-zones] synced ${ATLANTA_DELIVERY_ZONES.length} zones to ${targetVersion}; created=${created} updated=${updated}`
  );
}
