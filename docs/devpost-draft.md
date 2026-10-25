# Devpost copy — ScopePay

Status: draft copy. Real sandbox invoice creation has been verified. Do not submit until the running-app video link exists. Public source: https://github.com/matiasluparia-star/scopepay . The text below accurately describes the implemented design; confirm behavior before claiming completion.

## Name
ScopePay

## Tagline
Local AI for clearer freelance scope, with human-approved PayPal invoice drafts.

## Inspiration
A freelance job often starts as an informal message. Turning it into a bill can quietly turn an unpriced “also” into unpaid work or create a price nobody agreed to. We wanted a tiny workspace that makes the boundary between agreed work and unresolved scope visible before invoicing.

## What it does
ScopePay classifies an English project brief locally, suggests a relevant scope check and extracts explicitly priced deliverables. Every unpriced line stays visible for review. Freelancers can edit the quote, resolve mixed currencies and approve customer details and prices. The server then creates a draft invoice through PayPal's sandbox Invoicing API. The app never sends the invoice or collects money. Tax is not calculated.

## How we built it
The interface uses React and Vinext, with server routes deployed as a Cloudflare Worker. A small multinomial Naive Bayes model trains on 32 original synthetic sentences and runs in the browser. It selects a useful scope question for data, web, design or writing work. Strict deterministic parsing handles prices, while integer minor units prevent floating-point total errors. A separate server adapter obtains a PayPal sandbox OAuth token and creates an Invoicing v2 draft only after explicit approval. Secrets never enter the browser bundle.

## Challenges
We chose to keep statistical inference away from monetary authority. A category suggestion may be uncertain; a monetary amount cannot be guessed. Unsupported text is therefore preserved as unresolved scope. Edits invalidate approval so a previously checked quote cannot silently change before invoicing.

## Accomplishments
A focused brief-to-draft workflow with local analysis, transparent model limitations, editable source-backed line items, exact totals and a sandbox-only PayPal adapter. Automated tests cover the core boundaries. The deployed server created a genuine sandbox invoice with DRAFT status, verified on October 25, 2026.

## What we learned
A small model can contribute a useful check without needing authority over a payment. The approval step, source trace and honest handling of missing information are part of the product, not merely safeguards around it.

## What's next
Evaluate the classifier with real permissioned briefs, improve language coverage, and explore tax-aware invoicing and delivery milestones. Invoice sending and real payments would require separate explicit authorization and a production security review.

## Built with
React; TypeScript; JavaScript; Vinext; Cloudflare Workers; local Naive Bayes classification; PayPal OAuth 2.0; PayPal Invoicing REST API v2.

## Testing instructions
Follow the README. Use an English example brief, analyze it, review or edit each amount, acknowledge any unresolved scope, enter a sandbox customer email and approve the quote. With server-side sandbox credentials configured, create a draft and verify its ID in the PayPal sandbox business dashboard. No real payment is involved.

## AI disclosure
ChatGPT Work assisted with planning, implementation, original synthetic training examples, testing and documentation. The app itself runs a small local statistical classifier; it does not call ChatGPT or an LLM.
