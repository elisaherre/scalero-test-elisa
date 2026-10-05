# Technical Test Notes

## Part 1 — Campaign Email

### Approach

I built the campaign as a single HTML email using a 600px table-based layout for compatibility across email clients, including desktop Outlook.

Critical styles are inlined, while responsive and dark-mode styles that require media queries are included in the `<head>`.

### Email Compatibility

- Light mode is the default/fallback experience.
- Dark mode is implemented as progressive enhancement using `prefers-color-scheme`, including alternate image assets where needed.
- CTA buttons include VML fallbacks for desktop Outlook.
- A hidden preheader with whitespace padding is included to control inbox preview text.
- Images were exported from the provided Figma design and included locally for the exercise.

### Assumptions

- The provided 600px desktop and 340px mobile Figma frames were used as the primary visual references.
- Placeholder links are used where production URLs were not provided.
- Local image paths are used for the exercise; production assets would use hosted absolute URLs.
- Rendering may vary between email clients and should be validated with dedicated email testing tools before production.

## Part 2 — Dynamic Newsletter

### Approach

I converted the provided static newsletter into a dynamic Liquid template using the supplied customer, offers, and configuration data while preserving the original email markup as much as possible.

Offer selection follows the order defined in the configuration rather than the offer catalog.

Before rendering, offers are validated for:

- Customer community eligibility.
- Required fields for the corresponding block type.
- Previous use elsewhere in the email.
- The block's configured maximum number of offers.

Retargeting uses the customer's retargeting offer IDs in their provided order. The `small-callout` block renders only when exactly three valid offers are available, while `triple-small` supports partial final rows while preserving the three-column email layout.

Offer codes are rendered only when present.

### Disclaimers

Disclaimers are generated only for rendered offers and follow their render order. Empty disclaimers are skipped, duplicate disclaimer text is rendered once, and `{community_name}` is replaced with the customer's current community name.

### Local Liquid Runtime

I used LiquidJS to render and test the template locally with the supplied JSON fixtures.

`render.mjs` loads the customer, offers, and configuration data to simulate values that would normally be supplied by an ESP.

A local `number_with_commas` filter is registered for formatting. This is a testing helper rather than a standard Liquid filter and would need to be mapped to the equivalent functionality in the target ESP.

### Assumptions and Limitations

The implementation focuses on the supplied configuration and test data.

Block processing is implemented explicitly by section rather than through a fully generic renderer. With additional production context, I would confirm the target ESP's Liquid dialect before consolidating repeated selection logic.

The supplied second `small-callout` and final `promo` do not produce visible output with the supplied fixture data under the eligibility and validation rules.

## AI Usage

I used ChatGPT as a development, learning, and review tool, including:

- Reviewing email HTML/CSS compatibility, responsive behavior, dark mode, and Outlook VML.
- Learning Liquid syntax and templating concepts, as Liquid was new to me.
- Reasoning through offer selection, validation, rendering, and edge cases.
- Debugging and reviewing the local Liquid implementation.

## Testing

For Part 1, I manually reviewed the email at the target 600px desktop and 340px mobile widths and used browser emulation to review light and dark variants.

For Part 2, I rendered the template locally using LiquidJS and reviewed customer fallbacks, number formatting, eligibility, required fields, duplicate prevention, retargeting priority, maximum offer counts, optional offer codes, partial `triple-small` rows, and disclaimer behavior.

## What I Would Do Next

Given additional time and production tooling, I would:

- Run cross-client tests in Litmus or Email on Acid, particularly for Outlook, Gmail, and Apple Mail.
- Move local assets to the production ESP/CDN and replace placeholder URLs.
- Validate the Liquid template against the target ESP's supported Liquid dialect.
- Refactor repeated selection logic where supported by the target ESP.

## Running Part 2 Locally

From the project directory:

```bash
npm install
node part2/render.mjs
```
