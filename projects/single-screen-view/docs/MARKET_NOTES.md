# Demand and monetization notes

Prepared 2026-10-15. These are product hypotheses, not a revenue forecast.

## Evidence

One user reported the extension working in their setup. That validates one use case, not market demand, retention or willingness to pay.

Free tools already compete for browser-privacy users. The official Prism Shield listing advertises screen-resolution/DPR spoofing, per-feature controls and site exceptions, all free without an account. It is broader than this project; an equivalent one-display ScreenDetails feature has not been established. Source: https://chromewebstore.google.com/detail/prism-shield-browser-anti/innfkepkghdcalhcmlgkkmgcjebeoncf

Chrome Web Store does not pay per install. Under its Developer Agreement section 3.2, developers handle paid transactions and authentication themselves. Review the agreement before adding payment, especially the treatment of previously free copies in section 3.3. Source: https://developer.chrome.com/docs/webstore/program-policies/terms

## Assessment

The current product is a narrow, free/open-source beta. Active use and revenue cannot be predicted from the evidence available. A subscription for the current single-purpose toggle has weak support given free adjacent alternatives. Present revenue from this implementation is zero because it has no payment mechanism.

The most plausible early benefit is a public portfolio case, user feedback, and possible leads for browser-tool development. None guarantees paid work. Paid team setup, support or QA profiles are ideas to investigate if users request them, not validated paid features.

## Small next experiment

Release the free beta and use voluntary GitHub issues rather than installing tracking. As an internal decision threshold, aim for 20 external installs, a few returning users and three explicit requests for a paid feature. These numbers are proposed experiment targets, not market statistics. Ask users what problem recurs and what they currently do instead. Only then choose paid scope and pricing.

## Publication risk

Describe actual screen API substitution and event suppression. Do not promise universal concealment, native application coverage or successful passage of third-party assessments. Chrome's agreement section 4.4.1 addresses products that knowingly violate third-party terms; store reviewers determine acceptance. Broad permissions and the ancillary media diagnostic also require accurate disclosure and purpose justification.
