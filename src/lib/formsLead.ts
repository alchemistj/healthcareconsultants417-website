/**
 * Central Forms lead body. The browser posts straight to the intake.
 * Keys come from PUBLIC_FORMS_SITE_KEY and PUBLIC_FORMS_FORM_KEY.
 * No real keys are registered yet. Localhost and preview do not post.
 */

export const FORMS_LEAD_ENDPOINT = "https://forms.fluidframemarketing.com/api/lead";

/** Exact production host. Apex is a different origin and is not listed. */
export const PROD_HOSTS = ["www.healthcareconsultants417.com"] as const;

export type FormsCustomField = {
  label: string;
  value: string;
  type: "text";
};

export type FormsLeadBody = {
  siteKey: string;
  formKey: string;
  clientSubmissionId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  honeypot: string;
  formStartedAt: string;
  submittedAt: string;
  pageUrl: string;
  referrer: string | null;
  utm: {
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
  };
  customFields: Record<string, FormsCustomField>;
};

export type LeadKind = "success" | "invalid" | "unconfirmed" | "limited" | "not_production";

let attemptId: string | null = null;

export function currentAttemptId(): string {
  attemptId ??= crypto.randomUUID();
  return attemptId;
}

export function resetAttemptId(): void {
  attemptId = null;
}

export function formsEndpoint(hostname: string): string | null {
  const host = hostname.trim().toLowerCase().split(":")[0] ?? "";
  if (!PROD_HOSTS.includes(host as (typeof PROD_HOSTS)[number])) return null;
  return FORMS_LEAD_ENDPOINT;
}

export function formKeys(): { siteKey: string; formKey: string } {
  const env = import.meta.env as { PUBLIC_FORMS_SITE_KEY?: string; PUBLIC_FORMS_FORM_KEY?: string } | undefined;
  return {
    siteKey: env?.PUBLIC_FORMS_SITE_KEY ?? "",
    formKey: env?.PUBLIC_FORMS_FORM_KEY ?? "",
  };
}

export function buildLeadBody(input: {
  siteKey: string;
  formKey: string;
  clientSubmissionId: string;
  first: string;
  last: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  honeypot: string;
  formStartedAt: string;
  submittedAt: string;
  pageUrl: string;
  referrer: string | null;
  utm: FormsLeadBody["utm"];
}): FormsLeadBody {
  const customFields: Record<string, FormsCustomField> = {};
  const add = (key: string, label: string, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    customFields[key] = { label, value: trimmed, type: "text" };
  };
  add("first", "First", input.first);
  add("last", "Last", input.last);
  add("subject", "Subject", input.subject);
  const name = [input.first, input.last]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
  return {
    siteKey: input.siteKey,
    formKey: input.formKey,
    clientSubmissionId: input.clientSubmissionId,
    name,
    email: input.email.trim(),
    phone: input.phone.trim(),
    message: input.message.trim(),
    honeypot: input.honeypot,
    formStartedAt: input.formStartedAt,
    submittedAt: input.submittedAt,
    pageUrl: input.pageUrl,
    referrer: input.referrer,
    utm: input.utm,
    customFields,
  };
}

const STORED_ID = /^[0-9a-f-]{36}$/i;

export function classifyLeadResponse(
  status: number,
  json: { ok?: boolean; id?: string; saved?: boolean; duplicate?: boolean; conversionEligible?: boolean } | null,
): LeadKind {
  if (status === 429) return "limited";
  if (status === 200 && json?.ok === true && STORED_ID.test(json.id ?? "")) return "success";
  if (status === 400 && json?.ok === false && !json.saved) return "invalid";
  return "unconfirmed";
}
