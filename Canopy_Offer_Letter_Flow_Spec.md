# CANOPY — Offer Letter Flow

**UX Specification & Implementation Guide**
_From Offer to Signed — The Complete Handshake_

Green Jobs Board · February 2026

---

## 1. The Problem Today

When an employer drags a candidate to the "Offer" stage on Canopy's Kanban board, the only thing that happens is `Application.stage` gets set to `"offer."` No timestamp is recorded, no notification is sent, no data is captured. The offer stage is functionally identical to every other stage — just a label on a column.

This creates three problems. The employer has to leave Canopy to draft an offer letter, re-entering data that already exists in the system. The candidate has no idea they've received an offer unless the employer contacts them outside the platform. And the transition from "offered" to "hired" captures nothing about the terms, the signing process, or the timeline — which means the post-hire ecosystem has no foundation to build on.

> **What the API actually does today:** `PATCH /api/canopy/roles/[id]/applications/[appId]` with `{ stage: "offer" }` → Updates the stage field. No `offeredAt` timestamp. No notification. No email. No offer-specific logic. Identical to moving to any other stage.

---

## 2. The Complete Offer-to-Hire Flow

The flow is designed around three principles: Canopy generates the offer letter from data it already has, the candidate experiences the offer inside the platform, and the actual signing happens externally with Canopy serving as the orchestrator — not the signer.

### Step 1 — Employer Drags to Offer Stage

The employer drags a candidate card to the "Offer" column on the Kanban board. Instead of silently updating the stage, Canopy opens the **Offer Details Modal** — a required step before the offer can proceed.

### Step 2 — Offer Details Modal

A modal appears with fields pre-populated from the Job and Application data. The employer confirms or adjusts:

- **Offered salary** (pre-filled from `Job.salaryMin`/`salaryMax`)
- **Start date**
- **Department**
- **Reporting manager** (dropdown of org members)
- **Custom notes** (personal message to the candidate)

This is the data capture moment that feeds the entire post-hire ecosystem.

### Step 3 — Offer Letter Preview

Canopy generates a branded offer letter using the org's logo, colors, font, and mission statement combined with the offer details. The employer sees a live preview and can edit the body text. The letter is not a legal contract — it's a professional summary of the offer terms within a branded template.

### Step 4 — Signing Method Selection

Before sending, the employer selects how signing will be handled. Three options:

- **Paste a signing link** (DocuSign, HelloSign, etc.)
- **Upload a signing document**
- **Mark as "handle offline"**

This step is what bridges Canopy to external signing tools without trying to replace them.

### Step 5 — Offer Sent to Candidate

The employer clicks "Send Offer Letter." Canopy sets the `offeredAt` timestamp, creates an `OfferRecord`, sends a notification and email to the candidate ("You've received an offer from [Company]"), and the Kanban card shows an **"Offer Sent"** badge.

### Step 6 — Candidate Views Offer

The candidate opens the offer in Canopy at `/jobs/applications/[id]/offer`. They see the branded letter with the full terms. If the employer provided a signing link, a clear CTA appears below the letter: "Ready to sign? Your employer has provided a signing link." The `viewedAt` timestamp is recorded and the Kanban badge updates to **"Offer Viewed."**

### Step 7 — External Signing

The candidate clicks the signing link and is taken to DocuSign, HelloSign, or whatever tool the employer uses. They sign the offer externally. For "offline" offers, this happens via email, in person, or however the employer handles it. **Canopy is not involved in this step.**

### Step 8 — Employer Confirms Signature

The employer returns to Canopy and either: the signing status updates automatically (future webhook integration), or the employer clicks "Mark as Signed" on the candidate card. The Kanban badge updates to **"Offer Signed"** and the `signedAt` timestamp is recorded.

### Step 9 — Drag to Hired: One-Click Transition

The employer drags the candidate to "Hired." Because all the data was captured at the offer stage, this is now a **confirmation — not a form**. A compact confirmation card shows: name, role, department, manager, start date, salary. One click creates the `OrganizationMember` record with role `EMPLOYEE` and completes the transition.

---

## 3. Kanban Badge Progression

The candidate card on the Kanban board shows a status badge that progresses through the offer lifecycle. This gives the employer at-a-glance visibility into where every offer stands without clicking into individual records.

| Badge                  | Color  | Trigger                                | What It Tells the Employer                                          |
| ---------------------- | ------ | -------------------------------------- | ------------------------------------------------------------------- |
| **Offer Drafted**      | Gray   | Offer details saved but not sent       | The employer started the offer flow but hasn't sent the letter yet  |
| **Offer Sent**         | Yellow | Employer clicks "Send Offer Letter"    | The candidate has been notified and the letter is available to read |
| **Offer Viewed**       | Orange | Candidate opens the offer page         | The candidate has read the offer — ball is in their court           |
| **Awaiting Signature** | Blue   | Candidate clicks signing link          | The candidate has started the external signing process              |
| **Offer Signed**       | Green  | Employer marks signed or webhook fires | Ready to drag to Hired — the transition will be one click           |

---

## 4. The Candidate Experience

The candidate's offer view is the most emotionally important screen in Canopy. This is the moment they find out they got the job. The design should reflect that.

### 4.1 Notification & Email

When the employer sends the offer, the candidate receives both an in-app notification and an email. The email subject line is simple: "[Company Name] has extended you an offer." The email body contains a brief congratulatory message and a CTA button linking to the offer view in Canopy. No offer details are included in the email — the goal is to bring the candidate into the platform to read the full letter.

### 4.2 Offer Letter View

The offer renders at `/jobs/applications/[id]/offer` as a full-width, branded page. The org's logo, colors, and font family are applied. The letter content is structured but personal — not a wall of legal text. It includes:

- **Header:** Company logo, candidate name, date
- **Opening:** Congratulatory message (customizable by employer)
- **Role details:** Title, department, reporting manager, start date
- **Compensation:** Salary, any additional details the employer included
- **Company mission:** Pulled from `Organization.missionStatement` or `description`
- **Employer notes:** Any personal message the employer added in the modal
- **Next steps footer:** Signing instructions (see below)

### 4.3 The Signing Handoff

This is the critical UX moment — how the candidate transitions from reading the offer in Canopy to signing it externally. The design needs to make this feel like a natural next step, not a platform limitation.

**If the employer provided a signing link:**
Below the offer letter, a clearly delineated "Next Steps" section appears with a single, prominent button: "Review & Sign." Below the button, a small line of text reads: "You'll be taken to [DocuSign/HelloSign/employer's tool] to review and sign the formal offer document." The language frames the signing tool as the natural next step in the process, not as something separate from Canopy.

**If the employer selected "handle offline":**
The Next Steps section shows the employer's custom signing instructions (from their offer template settings), or a default message: "Your employer will reach out with signing details. If you have questions, you can message them directly." A link to the Messages thread with that employer is provided.

**If the employer uploaded a document:**
The Next Steps section shows a download button for the attached document with a message: "Your employer has attached the formal offer document for your review. Follow their instructions for signing and returning it."

> **Why no Accept/Decline buttons?** Offer negotiations almost always happen outside any platform — over email, phone, or in person. Adding Accept/Decline buttons creates the false expectation that clicking a button finalizes the offer. In reality, the candidate might want to negotiate salary, push the start date, or discuss benefits before accepting. The absence of these buttons is intentional — it avoids creating a workflow that doesn't match how offers actually work.

---

## 5. Employer Configuration

### 5.1 Offer Letter Template

Each organization can configure a default offer letter template in Settings. The template includes:

- **Header layout:** Logo placement, company name styling
- **Opening paragraph:** Default congratulatory text (editable per offer)
- **Closing paragraph:** Default sign-off text
- **Signing instructions:** Default text for the Next Steps footer (e.g., "Please sign and return via DocuSign within 5 business days")
- **Legal disclaimer:** Optional fine print (e.g., "This letter summarizes the offer terms. The formal employment agreement will be provided separately.")

The template uses the org's existing branding from `Organization.primaryColor`, `Organization.fontFamily`, and `Organization.logo`. Employers configure it once and every offer letter inherits the template, with the ability to customize individual letters before sending.

### 5.2 Default Signing Method

Organizations can set a default signing method in their settings so they don't have to select it for every offer:

- **Signing link (default tool):** The org specifies their preferred signing platform. When creating an offer, the signing link field is shown prominently.
- **Document upload:** The org typically sends a PDF for signing. The upload field is shown.
- **Handle offline:** The org manages signing outside of any digital tool. No signing fields are shown.

The default can always be overridden on a per-offer basis. This is a convenience setting, not a restriction.

---

## 6. Data Model

### 6.1 New Model: OfferRecord

| Field                   | Type            | Purpose                                                              |
| ----------------------- | --------------- | -------------------------------------------------------------------- |
| `id`                    | String @id      | Primary key (cuid)                                                   |
| `applicationId`         | String @unique  | Links to the Application record (one offer per application)          |
| `organizationId`        | String          | Org scoping for multi-tenant isolation                               |
| `createdById`           | String          | The OrganizationMember who created the offer                         |
| `salary`                | Int             | Offered salary in cents (consistent with existing salary fields)     |
| `salaryCurrency`        | String          | Currency code, default "USD"                                         |
| `startDate`             | DateTime        | Proposed start date                                                  |
| `department`            | String?         | Department assignment (feeds into OrganizationMember on hire)        |
| `managerId`             | String?         | Reporting manager (OrganizationMember ID)                            |
| `notes`                 | String?         | Personal message from employer to candidate                          |
| `letterContent`         | String @db.Text | The rendered offer letter body (saved after employer edits)          |
| `signingMethod`         | SigningMethod   | SIGNING_LINK \| DOCUMENT_UPLOAD \| OFFLINE                           |
| `signingLink`           | String?         | URL to external signing tool (DocuSign, HelloSign, etc.)             |
| `signingDocumentUrl`    | String?         | Uploaded document URL for download by candidate                      |
| `signingInstructions`   | String?         | Custom text shown in the Next Steps footer                           |
| `status`                | OfferStatus     | DRAFT \| SENT \| VIEWED \| AWAITING_SIGNATURE \| SIGNED \| WITHDRAWN |
| `sentAt`                | DateTime?       | When the offer letter was sent to the candidate                      |
| `viewedAt`              | DateTime?       | When the candidate first opened the offer page                       |
| `signedAt`              | DateTime?       | When the offer was marked as signed                                  |
| `withdrawnAt`           | DateTime?       | If the employer withdraws the offer before signing                   |
| `createdAt / updatedAt` | DateTime        | Standard timestamps                                                  |

### 6.2 New Enums

| Enum              | Values                                                     | Usage                                                                                  |
| ----------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **OfferStatus**   | DRAFT, SENT, VIEWED, AWAITING_SIGNATURE, SIGNED, WITHDRAWN | Tracks the lifecycle of the offer. Drives the Kanban badge and candidate view state.   |
| **SigningMethod** | SIGNING_LINK, DOCUMENT_UPLOAD, OFFLINE                     | Determines what the candidate sees in the Next Steps section of the offer letter view. |

### 6.3 Changes to Existing Models

| Model            | Change                      | Details                                                                                                                     |
| ---------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Application      | Add `offeredAt` field       | DateTime? — Set when the employer sends the offer. Parallels the existing `hiredAt` and `rejectedAt` fields.                |
| Application      | Add relation to OfferRecord | One-to-one relationship. An application can have at most one active offer.                                                  |
| Organization     | Add `offerTemplate` field   | String? @db.Text — JSON storing the org's default offer letter template (opening text, closing text, signing instructions). |
| Organization     | Add `defaultSigningMethod`  | SigningMethod? — The org's preferred signing method, used as default when creating new offers.                              |
| NotificationType | Add `OFFER_RECEIVED`        | New notification type triggered when an offer is sent to a candidate.                                                       |
| NotificationType | Add `OFFER_VIEWED`          | Notification to employer when the candidate views the offer letter.                                                         |

---

## 7. Routes

### 7.1 Employer Routes

| Route                              | Method    | Purpose                                                              |
| ---------------------------------- | --------- | -------------------------------------------------------------------- |
| `/api/canopy/offers`               | POST      | Create a new offer (draft or send immediately)                       |
| `/api/canopy/offers/[id]`          | GET/PATCH | Get or update offer details (edit terms, update status, mark signed) |
| `/api/canopy/offers/[id]/send`     | POST      | Send the offer to the candidate (triggers notification + email)      |
| `/api/canopy/offers/[id]/withdraw` | POST      | Withdraw an offer before it's signed                                 |
| `/api/canopy/offers/preview`       | POST      | Generate a letter preview from offer data + org template             |
| `/canopy/settings/offer-template`  | Page      | Configure default offer letter template and signing method           |

### 7.2 Candidate Routes

| Route                           | Method | Purpose                                                    |
| ------------------------------- | ------ | ---------------------------------------------------------- |
| `/jobs/applications/[id]/offer` | Page   | Candidate's offer letter view (branded, full-width)        |
| `/api/jobs/offers/[id]/view`    | POST   | Record that the candidate viewed the offer (sets viewedAt) |

---

## 8. Connection to the Post-Hire Ecosystem

The offer letter flow is the bridge between the existing ATS and the post-hire features described in the Canopy Post-Hire Ecosystem Spec. Here's how the offer data feeds forward:

| Offer Data        | Feeds Into                          | How                                                             |
| ----------------- | ----------------------------------- | --------------------------------------------------------------- |
| **department**    | `OrganizationMember.department`     | Pre-fills the employee record when dragged to Hired             |
| **managerId**     | `OrganizationMember.managerId`      | Sets the reporting relationship for the growth plan             |
| **startDate**     | `EmployeeTransition.transitionedAt` | Schedules the employee record creation date                     |
| **salary**        | Public board aggregate stats        | Feeds into anonymized compensation data for the career page     |
| **letterContent** | EmployeeTransition audit trail      | Preserved as a record of what was offered vs. actual employment |
| **signedAt**      | Hire confirmation flow              | Enables the one-click transition — all data already captured    |

> **The One-Click Hire:** Because the offer stage captures department, manager, start date, and salary, the transition from "Offer Signed" to "Hired" becomes a single confirmation click rather than a data entry form. The employer sees a compact card with all the details and simply confirms. This is the payoff of front-loading data capture into the offer stage.

---

## 9. What Canopy Is Not

The offer letter flow is designed to be valuable without overstepping into territory that creates legal liability or competes with established signing tools. These boundaries are intentional:

- **Not a contract signing tool:** Canopy generates a summary of offer terms, not a legally binding employment contract. The formal signing happens in DocuSign, HelloSign, or another tool the employer's legal team has approved.
- **Not a negotiation platform:** There are no Accept/Decline/Counter-Offer buttons. Real negotiations happen over calls and emails. Canopy provides the information layer, not the negotiation workflow.
- **Not an HRIS:** The offer captures enough data to bootstrap the employee record, but doesn't store tax forms, benefits elections, or compliance documents. Those belong in the employer's HR system.

The UX communicates these boundaries through design choices, not disclaimers. The absence of signing affordances, the presence of external signing links, and the language used throughout ("send" not "execute," "letter" not "contract") all reinforce what Canopy is: the place where the offer relationship lives, even though the legal formalities happen elsewhere.
