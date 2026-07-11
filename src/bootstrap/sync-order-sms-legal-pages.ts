/**
 * Versioned legal-content migration for the order-specific transactional SMS
 * program. These dedicated pages intentionally do not modify the marketing
 * SMS terms or the site's general privacy policy.
 */

export const ORDER_SMS_LEGAL_PAGES_VERSION =
  "order-sms-legal-pages-2026-07-11-v3";

const LEGAL_PAGE_UID = "api::legal-page.legal-page";
const STORE_KEY = "order-sms-legal-pages-version";

type RichTextBlock = Record<string, any>;

type LegalPageDefinition = {
  Slug: string;
  Title: string;
  Content: RichTextBlock[];
  SEO: {
    metaTitle: string;
    metaDescription: string;
    metaRobots: "index, follow";
  };
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

export const ORDER_SMS_TERMS_CONTENT: RichTextBlock[] = [
  paragraph(
    "Griller's Pride Order Updates is an automated, non-promotional text messaging program operated by Grillerspride, LLC (\"Griller's Pride\"). If you choose UPS shipping and opt in at checkout for a particular order, the first message is a required enrollment confirmation. Any later messages are limited to actual UPS shipping and tracking updates for that order. Pickup-ready and local-delivery messages are not part of the launch program."
  ),
  heading("Enrollment & Order-Specific Consent"),
  paragraph(
    "You enroll for a specific UPS-shipped order by entering your mobile number and affirmatively checking the unchecked Griller's Pride Order Updates box at checkout before placing the order. The checkbox is shown only for UPS shipping, is optional, and checkout works without selecting it. Consent is not a condition of purchase. By selecting the box and placing the order, you consent to receive recurring automated enrollment, UPS shipping, and tracking text messages solely for that order at the number provided. You represent that you are the subscriber or customary user of that number."
  ),
  heading("Message Frequency & Cost"),
  paragraph(
    "Message frequency varies, up to 6 messages per order, including the enrollment confirmation. Message and data rates may apply according to your mobile plan. Griller's Pride and wireless carriers are not liable for delayed or undelivered messages."
  ),
  heading("Non-Marketing Scope"),
  paragraph(
    "Griller's Pride Order Updates does not send promotions, product offers, review requests, or other marketing messages. Order confirmations, payment receipts, cancellation notices, and refund notices continue to be delivered by email unless Griller's Pride separately tells you otherwise. Enrollment in Griller's Pride marketing texts is separate from this program and requires separate consent."
  ),
  heading("Opt Out & Help"),
  paragraphChildren([
    { type: "text", text: "Reply " },
    { type: "text", text: "STOP", bold: true },
    {
      type: "text",
      text: " to unsubscribe from future Griller's Pride Order Updates; you may receive one confirmation message. Reply ",
    },
    { type: "text", text: "HELP", bold: true },
    {
      type: "text",
      text: " for help, or contact us at (770) 454-8108 or peter@grillerspride.com. After opting out, use email or phone support for order status. Reply START to resume messages only where a still-valid order consent applies.",
    },
  ]),
  heading("Privacy"),
  paragraphChildren([
    {
      type: "text",
      text: "We handle your mobile number, order context, and consent record as described in the ",
    },
    {
      type: "link",
      url: "/page/order-sms-privacy",
      children: [{ type: "text", text: "Griller's Pride Order Updates Privacy Notice" }],
    },
    {
      type: "text",
      text: ". Your mobile information, text messaging originator opt-in data, and consent will not be shared with third parties or affiliates for their marketing or promotional purposes.",
    },
  ]),
];

export const ORDER_SMS_PRIVACY_CONTENT: RichTextBlock[] = [
  paragraph(
    "This notice applies only to Griller's Pride Order Updates, the optional, order-specific program for enrollment confirmation plus UPS shipping and tracking text notifications. It supplements, and does not replace, other Griller's Pride privacy notices. The program is operated by Grillerspride, LLC (\"Griller's Pride\")."
  ),
  heading("Information We Collect"),
  paragraph(
    "When you opt in, we collect the mobile number you provide and evidence of your consent, including the date and time, enrollment source, disclosure language and version, and the related cart or order identifier. We also use the minimum order and UPS fulfillment context needed to send accurate shipping and tracking updates. Program records may include opt-out and help requests, message delivery status and error data, and technical details such as IP address or user agent when available."
  ),
  heading("How We Use It"),
  paragraph(
    "We use this information solely to operate and secure Griller's Pride Order Updates: to document your order-specific consent, send the required enrollment confirmation and accurate UPS shipping or tracking notifications for that order, honor STOP, START, and HELP requests, investigate delivery problems, provide support, and meet legal and carrier compliance obligations. We do not use consent to this program to send marketing or promotional texts."
  ),
  heading("How We Share It"),
  paragraph(
    "We do not sell your mobile number or program data. All the above categories exclude text messaging originator opt-in data and consent; this information won’t be shared with any third parties. This restriction does not prevent us from using service providers solely to deliver and support the messages you requested; they receive only the minimum mobile and order data needed and may not use it for their own marketing. We may also disclose other information when required by law or to protect rights, safety, and program integrity."
  ),
  heading("Retention & Security"),
  paragraph(
    "We retain mobile, consent, order-context, opt-out, and message records only as long as reasonably necessary to operate the program, document consent and compliance, resolve delivery or support issues, and satisfy applicable legal obligations. We use reasonable administrative, technical, and organizational safeguards designed to protect this information, but no storage or transmission method is completely secure."
  ),
  heading("Your Choices & Help"),
  paragraphChildren([
    { type: "text", text: "Consent is optional and is not a condition of purchase. Reply " },
    { type: "text", text: "STOP", bold: true },
    { type: "text", text: " to unsubscribe from Griller's Pride Order Updates or " },
    { type: "text", text: "HELP", bold: true },
    {
      type: "text",
      text: " for help. Choosing not to receive texts does not affect your order; use email or phone support for status instead. Consent to a separate marketing-text program is governed by its own enrollment and terms.",
    },
  ]),
  heading("Contact & Program Terms"),
  paragraphChildren([
    {
      type: "text",
      text: "For privacy questions or requests, call (770) 454-8108 or email peter@grillerspride.com. See the ",
    },
    {
      type: "link",
      url: "/page/order-sms-terms",
      children: [{ type: "text", text: "Griller's Pride Order Updates Terms" }],
    },
    { type: "text", text: " for complete program details." },
  ]),
];

export const ORDER_SMS_LEGAL_PAGES: LegalPageDefinition[] = [
  {
    Slug: "order-sms-terms",
    Title: "Griller's Pride Order Updates Terms",
    Content: ORDER_SMS_TERMS_CONTENT,
    SEO: {
      metaTitle: "Order Updates SMS Terms | Griller's Pride",
      metaDescription:
        "Terms for optional Griller's Pride UPS shipping and tracking texts, including consent, frequency, costs, STOP, HELP, and privacy.",
      metaRobots: "index, follow",
    },
  },
  {
    Slug: "order-sms-privacy",
    Title: "Griller's Pride Order Updates Privacy Notice",
    Content: ORDER_SMS_PRIVACY_CONTENT,
    SEO: {
      metaTitle: "Order Updates SMS Privacy | Griller's Pride",
      metaDescription:
        "How Griller's Pride collects, uses, shares, retains, and protects information for optional UPS shipping and tracking texts.",
      metaRobots: "index, follow",
    },
  },
];

export async function syncOrderSmsLegalPages({
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
      `[sync-order-sms-legal-pages] already at version ${targetVersion}, skipping`
    );
    return;
  }

  const existing = (await strapi.documents(LEGAL_PAGE_UID).findMany({
    filters: {
      Slug: { $in: ORDER_SMS_LEGAL_PAGES.map((page) => page.Slug) },
    },
    limit: ORDER_SMS_LEGAL_PAGES.length,
  })) as Array<{ documentId?: string; Slug?: string }>;

  const bySlug = new Map(
    (Array.isArray(existing) ? existing : [])
      .filter((page) => page?.Slug)
      .map((page) => [page.Slug as string, page])
  );

  for (const page of ORDER_SMS_LEGAL_PAGES) {
    const currentPage = bySlug.get(page.Slug);
    if (currentPage?.documentId) {
      await strapi.documents(LEGAL_PAGE_UID).update({
        documentId: currentPage.documentId,
        data: page,
        status: "published",
      });
      continue;
    }

    await strapi.documents(LEGAL_PAGE_UID).create({
      data: page,
      status: "published",
    });
  }

  await store.set({ key: STORE_KEY, value: targetVersion });
  strapi.log.info(
    `[sync-order-sms-legal-pages] published dedicated order-update SMS legal pages at version ${targetVersion}`
  );
}
