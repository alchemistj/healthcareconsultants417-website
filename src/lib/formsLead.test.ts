import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FORMS_LEAD_ENDPOINT,
  buildLeadBody,
  classifyLeadResponse,
  currentAttemptId,
  formsEndpoint,
  resetAttemptId,
} from "./formsLead.ts";

const UUID = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";

test("the intake URL is one literal string", () => {
  assert.equal(FORMS_LEAD_ENDPOINT, "https://forms.fluidframemarketing.com/api/lead");
});

test("only the www host may post", () => {
  assert.equal(formsEndpoint("www.healthcareconsultants417.com"), FORMS_LEAD_ENDPOINT);
  assert.equal(formsEndpoint("www.healthcareconsultants417.com:443"), FORMS_LEAD_ENDPOINT);
  assert.equal(formsEndpoint("healthcareconsultants417.com"), null);
  assert.equal(formsEndpoint("localhost"), null);
  assert.equal(formsEndpoint("healthcareconsultants417-website.vercel.app"), null);
});

test("lead body uses the attempt id and labels the extra fields", () => {
  const body = buildLeadBody({
    siteKey: "site",
    formKey: "form",
    clientSubmissionId: UUID,
    first: "Rachal",
    last: "Payne",
    email: "rachal@healthcareconsultants417.com",
    phone: "4177200818",
    subject: "Care",
    message: "Hello",
    honeypot: "",
    formStartedAt: "2026-11-02T12:00:00.000Z",
    submittedAt: "2026-11-02T12:00:05.000Z",
    pageUrl: "https://www.healthcareconsultants417.com/springfield/contact/",
    referrer: null,
    utm: { source: "a", medium: "b", campaign: "c", term: "d", content: "e" },
  });
  assert.equal(body.name, "Rachal Payne");
  assert.equal(body.clientSubmissionId, UUID);
  assert.equal(body.honeypot, "");
  assert.deepEqual(body.customFields.first, { label: "First", value: "Rachal", type: "text" });
  assert.deepEqual(body.customFields.last, { label: "Last", value: "Payne", type: "text" });
  assert.deepEqual(body.customFields.subject, { label: "Subject", value: "Care", type: "text" });
  assert.equal("smsConsent" in body.customFields, false);
});

test("empty extra fields are left out of customFields", () => {
  const body = buildLeadBody({
    siteKey: "",
    formKey: "",
    clientSubmissionId: UUID,
    first: " ",
    last: "",
    email: "",
    phone: "4177200818",
    subject: "",
    message: "",
    honeypot: "bot",
    formStartedAt: "2026-11-02T12:00:00.000Z",
    submittedAt: "2026-11-02T12:00:05.000Z",
    pageUrl: "https://www.healthcareconsultants417.com/",
    referrer: null,
    utm: { source: "", medium: "", campaign: "", term: "", content: "" },
  });
  assert.equal(body.name, "");
  assert.equal(body.honeypot, "bot");
  assert.deepEqual(body.customFields, {});
});

test("one attempt id is reused until reset", () => {
  resetAttemptId();
  const first = currentAttemptId();
  assert.equal(currentAttemptId(), first);
  assert.match(first, /^[0-9a-f-]{36}$/i);
  resetAttemptId();
  assert.notEqual(currentAttemptId(), first);
  resetAttemptId();
});

test("response classes match the Central Forms contract", () => {
  assert.equal(classifyLeadResponse(200, { ok: true, id: UUID, duplicate: true }), "success");
  assert.equal(classifyLeadResponse(400, { ok: false, saved: false }), "invalid");
  assert.equal(classifyLeadResponse(400, { ok: false, saved: true }), "unconfirmed");
  assert.equal(classifyLeadResponse(429, { ok: false }), "limited");
  assert.equal(classifyLeadResponse(503, null), "unconfirmed");
  assert.equal(classifyLeadResponse(200, { ok: true, id: "nope" }), "unconfirmed");
});
