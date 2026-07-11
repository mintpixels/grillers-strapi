/**
 * One-off legal-content migration for the marketing-only toll-free SMS
 * program. The public Privacy Policy stores its SMS disclosure in both the
 * legacy `Content` blocks and the structured `Body`; keep both copies aligned.
 * The SMS Program Terms currently render from `Content` only.
 *
 * Runs at bootstrap and is gated by a store key. Bump the version to rerun a
 * reviewed revision on a future deploy.
 */

export const MARKETING_SMS_LEGAL_PAGES_VERSION =
  "marketing-sms-legal-pages-2026-07-11-v2";

const LEGAL_PAGE_UID = "api::legal-page.legal-page";
const STORE_KEY = "marketing-sms-legal-pages-version";

type RichTextBlock = Record<string, any>;

type LegalPageRecord = {
  documentId: string;
  Slug?: string;
  Content?: RichTextBlock[];
  Body?: Array<Record<string, any>>;
};

const heading = (text: string): RichTextBlock => ({
  type: "heading",
  level: 2,
  children: [{ type: "text", text }],
});

const paragraph = (text: string): RichTextBlock => ({
  type: "paragraph",
  children: [{ type: "text", text }],
});

const paragraphChildren = (children: RichTextBlock[]): RichTextBlock => ({
  type: "paragraph",
  children,
});

export const PRIVACY_SMS_PARAGRAPHS = [
  paragraph(
    "For this SMS program, if you affirmatively opt in to Griller's Pride Marketing Texts, we use your mobile number to send recurring automated marketing and promotional text messages, including seasonal specials, product announcements, promotional offers, and holiday sales deadlines. Message frequency varies, up to 6 messages per month; message and data rates may apply. Consent is not a condition of purchase."
  ),
  paragraph(
    "We keep a record of your consent, including the date, enrollment source, and consent language shown to you. Reply STOP to any message to unsubscribe at any time, or HELP for help. Your mobile information, text messaging originator opt-in data, and consent will not be shared with third parties or affiliates for their marketing or promotional purposes. We may share this information with service providers only as needed to operate the messaging program and subject to confidentiality obligations. Full program details are in our SMS Program Terms."
  ),
];

export const MARKETING_SMS_TERMS_CONTENT: RichTextBlock[] = [
  paragraph(
    "Griller's Pride Marketing Texts is a recurring automated SMS marketing program operated by Grillerspride, LLC (\"Griller's Pride\"). Messages may include seasonal specials, product announcements, promotional offers, and holiday sales deadlines."
  ),
  heading("Enrollment & Express Written Consent"),
  paragraph(
    "You enroll by entering your mobile number, affirmatively checking the unchecked marketing-text opt-in box during account signup or on another clearly labeled Griller's Pride marketing form, and submitting the form. The checkbox is optional and is never a condition of purchase. By completing that action, you provide your express written consent to receive recurring automated marketing and promotional text messages from Griller's Pride at the number provided. We keep a record of your consent, including the date, enrollment source, and consent language shown to you."
  ),
  heading("Message Frequency & Cost"),
  paragraph(
    "Message frequency varies, up to 6 messages per month. Message and data rates may apply according to your mobile plan. Carriers are not liable for delayed or undelivered messages."
  ),
  heading("Opt Out & Help"),
  paragraphChildren([
    { type: "text", text: "Reply " },
    { type: "text", text: "STOP", bold: true },
    {
      type: "text",
      text: " to any message to unsubscribe at any time; you will receive a single confirmation message and no further marketing texts unless you opt in again. Reply ",
    },
    { type: "text", text: "HELP", bold: true },
    {
      type: "text",
      text: " for help, or contact us at (770) 454-8108 or peter@grillerspride.com.",
    },
  ]),
  heading("Privacy"),
  paragraphChildren([
    {
      type: "text",
      text: "Your mobile number and consent records are handled as described in our ",
    },
    {
      type: "link",
      url: "/page/privacy-policy",
      children: [{ type: "text", text: "Privacy Policy" }],
    },
    {
      type: "text",
      text: ". We do not sell your phone number. Your mobile information, text messaging originator opt-in data, and consent will not be shared with third parties or affiliates for their marketing or promotional purposes. We may share this information with service providers only as needed to operate the messaging program and subject to confidentiality obligations.",
    },
  ]),
];

export async function syncMarketingSmsLegalPages({
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
      `[sync-marketing-sms-legal-pages] already at version ${targetVersion}, skipping`
    );
    return;
  }

  const pages = (await strapi.documents(LEGAL_PAGE_UID).findMany({
    filters: { Slug: { $in: ["privacy-policy", "sms-terms"] } },
    populate: { Body: { populate: "*" } },
    status: "published",
    limit: 2,
  })) as LegalPageRecord[];

  const privacy = pages.find((page) => page.Slug === "privacy-policy");
  const smsTerms = pages.find((page) => page.Slug === "sms-terms");

  if (!privacy || !smsTerms) {
    const missing = [
      !privacy ? "privacy-policy" : null,
      !smsTerms ? "sms-terms" : null,
    ].filter(Boolean);
    strapi.log.warn(
      `[sync-marketing-sms-legal-pages] missing published legal page(s): ${missing.join(
        ", "
      )}; skipping`
    );
    return;
  }

  const privacyContent = replaceParagraphsAfterHeading(
    privacy.Content,
    "Text messages (SMS)",
    PRIVACY_SMS_PARAGRAPHS
  );
  const privacyBody = replacePrivacySmsBody(privacy.Body);

  if (!privacyContent || !privacyBody) {
    strapi.log.warn(
      "[sync-marketing-sms-legal-pages] privacy-policy SMS disclosure shape was not recognized; skipping without changing either legal page"
    );
    return;
  }

  await strapi.documents(LEGAL_PAGE_UID).update({
    documentId: privacy.documentId,
    data: {
      Content: privacyContent,
      Body: privacyBody,
    },
    status: "published",
  });

  await strapi.documents(LEGAL_PAGE_UID).update({
    documentId: smsTerms.documentId,
    data: { Content: MARKETING_SMS_TERMS_CONTENT },
    status: "published",
  });

  await store.set({ key: STORE_KEY, value: targetVersion });

  strapi.log.info(
    `[sync-marketing-sms-legal-pages] published marketing-only SMS legal copy at version ${targetVersion}`
  );
}

function replaceParagraphsAfterHeading(
  blocks: RichTextBlock[] | undefined,
  headingText: string,
  replacements: RichTextBlock[]
): RichTextBlock[] | null {
  if (!Array.isArray(blocks)) return null;

  const headingIndex = blocks.findIndex(
    (block) =>
      block?.type === "heading" && flattenRichText(block?.children) === headingText
  );
  if (headingIndex < 0) return null;

  const paragraphIndexes: number[] = [];
  for (let index = headingIndex + 1; index < blocks.length; index += 1) {
    if (blocks[index]?.type === "heading") break;
    if (blocks[index]?.type === "paragraph") paragraphIndexes.push(index);
    if (paragraphIndexes.length === replacements.length) break;
  }

  if (paragraphIndexes.length !== replacements.length) return null;

  const next = blocks.map((block) => stripComponentIds(block) as RichTextBlock);
  paragraphIndexes.forEach((index, replacementIndex) => {
    next[index] = replacements[replacementIndex];
  });
  return next;
}

function replacePrivacySmsBody(
  body: Array<Record<string, any>> | undefined
): Array<Record<string, any>> | null {
  if (!Array.isArray(body)) return null;

  let found = false;
  const next = body.map((block) => {
    const clean = stripComponentIds(block) as Record<string, any>;
    if (
      clean?.__component !== "info.section" ||
      clean?.Title !== "Text messages (SMS)"
    ) {
      return clean;
    }

    found = true;
    return { ...clean, Body: PRIVACY_SMS_PARAGRAPHS };
  });

  return found ? next : null;
}

function flattenRichText(children?: RichTextBlock[]): string {
  if (!Array.isArray(children)) return "";
  return children
    .map((child) => {
      if (child?.type === "text") return child.text || "";
      return flattenRichText(child?.children);
    })
    .join("");
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
