# ScopePay

**Clear scope. Confident invoices.** A small mobile-friendly workspace for independent freelancers: classify a brief locally, extract explicitly priced deliverables, resolve ambiguous scope, and create a human-approved PayPal **sandbox draft invoice**.

## Current verification status

The local classifier, parser, editable quote and approval reset were tested. Eight automated tests cover currency arithmetic, ambiguous scope, classifier hold-outs, payloads and mocked sandbox transport. **Real PayPal sandbox integration verified on 2026-10-25.** The hosted server authenticated successfully and created invoice `INV2-H824-EB7N-AJRR-M4XJ`, status `DRAFT`, for EUR 50.00. The response came from the PayPal sandbox API, not a mock. This remains a development build, not a completed hackathon submission. Public source: https://github.com/matiasluparia-star/scopepay . Public demo video (1:47): https://www.youtube.com/watch?v=anzpNNk0v-U . On 2026-10-26 a fresh checkout passed all eight tests and npm run build completed successfully. Browser QA reconfirmed EUR 220.00 totals, unpriced-scope blocking and approval reset after edits. A fresh real sandbox call created invoice INV2-4M57-B4YQ-Y8V9-7688 in DRAFT status.

## Run

Node >=22.13 and pnpm (or npm) are required. Install using `npm install`, then `npm run dev`. The framework is React + Vinext on Cloudflare Workers. `npm test` runs standalone Node tests. `npm run build` creates the Worker production artifact. The preview runs at the URL printed by the development server.

For API calls create an ignored `.dev.vars` file in the checkout with these two keys:

```
PAYPAL_SANDBOX_CLIENT_ID=your_sandbox_client_id
PAYPAL_SANDBOX_CLIENT_SECRET=your_sandbox_client_secret
```

Use a REST app attached to a sandbox **business** account in the PayPal Developer dashboard. Do not use a live app. In hosted Sites, set both values as secrets using the Site runtime environment settings, then redeploy. Never commit these values or put them in client code. The app hard-codes `https://api-m.sandbox.paypal.com` and cannot accept a live endpoint. Model inference requires no service or key.

The host must enforce owner-private access as Sites does by default. Do not expose a shared credential-backed deployment publicly without authentication, authorization and rate limiting. For judging, provide a secured demo or let judges run with their own sandbox credentials. A public source repository can safely include this code, but must exclude `.dev.vars` and every other secret.

## Try it

1. Open the workspace in a browser. Choose Data cleanup and click Analyze brief.
2. Verify the three lines total EUR 220.00. Classification should be Data project.
3. Change a price, name, currency or email. Approval is reset after edits.
4. Choose Website and analyze it. The unpriced logo request is shown separately; it does not become a billable item. Resolve it by editing/adding priced items or explicitly excluding it, then acknowledge the scope check.
5. Use a PayPal sandbox personal account email as the customer for the API test. Review all invoice details. Check approval, then Create PayPal sandbox draft.
6. A successful response shows a genuine invoice ID from PayPal. Inspect it in the sandbox business account. No `/send` call is implemented; the invoice remains a draft, no email is sent, and no payment is collected.
7. Download quote JSON to retain a local copy. Browser refresh clears unsaved work.

## Small AI with explicit limits

The app trains a multinomial Naive Bayes text classifier in memory on **32 original synthetic English sentences**, eight each for data, web, design and writing. Add-one smoothing and log likelihoods score known vocabulary. Unknown text gets a general category. The classification selects a category-specific scope question, such as confirming row count for data processing or revision limits for design. A log-score margin above two is labelled a strong model signal; it is **not a calibrated probability**.

The classifier is intentionally small and privacy-preserving. It is not an LLM and does not infer arbitrary scope or produce prose. Money extraction uses strict deterministic parsing, not ML. Each priced line must follow `Deliverable — 120 EUR` (USD/GBP and the corresponding symbols also work). Amounts use decimal points and at most two decimals. Unsupported formatting, unpriced lines and mixed currencies are flagged for explicit review. Quantities are fixed at one, so line amounts are totals. This is not a tax calculation or legally compliant invoicing product; no VAT/tax is calculated. It does not determine what tax the user owes.

The four held-out classifier examples test basic behavior only, not real-world generalization. Evaluate with representative freelancer briefs before expanding this model. Spanish and multilingual classification are not supported in this version.

## Architecture

- `lib/scope.mjs`: original training corpus, classifier, exact amount parser, quote validation and invoice payload mapping.
- `app/page.tsx`: responsive, browser-local analysis and review; no raw brief upload.
- `app/api/status/route.ts`: reports whether sandbox credentials are configured, never their values.
- `app/api/invoice/route.ts`: same-origin validation and input limits, then server-only PayPal transport.
- `lib/paypal.mjs`: OAuth client credentials and Invoicing v2 draft creation. Error responses omit provider bodies and secret values.
- `tests/scope.test.mjs`: deterministic behavior and mocked HTTP contracts. Mock tests do not prove live integration.

Only reviewed item names, prices, currency and customer email go to the server and PayPal. No persistent customer database exists. Sites may process normal hosting/access logs. Credentials remain server-side. The current demo has no send, capture, refund or live-money route.

## Remaining before submission

Completed: genuine sandbox draft creation, fresh-checkout tests and production build, public captioned demo video, and Devpost technical draft fields. Hosted access remains owner-private; use the repository setup route for judging. Remaining: entrant review, legal declarations and final submission. Mobile styling is implemented; an actual iPhone test was not performed. Official rules rechecked on 2026-10-26; deadline November 12 at 21:00 Europe/Madrid.

## References

- https://developer.paypal.com/api/invoicing/v2/invoices-create
- https://paypalaihackathon.devpost.com/rules

## AI assistance and authorship

Developed with ChatGPT Work assistance for planning, code, original synthetic training examples, tests and writing. The entrant should review the implementation and describe their own participation accurately. No affiliation with or endorsement by PayPal is claimed.

## License

MIT. See LICENSE. All training examples and favicon artwork were authored for this project. Framework and dependencies retain their respective licenses.
