# Expandable Card

`Dxd_CustomUI_ExpandableCard` is a read-only **Template / DETAILS** component for presenting a person, customer account, payment card, or product. It combines a header avatar, text or IconBadge subheader, a persistent summary view, and details loaded only on expansion.

## Usage variations

- **User:** text subheader, collapsed summary, and expandable details.
- **Customer:** independently colored header and IconBadge subheader, plus a summary view visible in both states.
- **Customer Text Subheader:** the same customer using the matching text size and foreground color, without a subheader background.
- **Credit Card:** multiline collapsed summary and payment details.
- **Car Model:** fixed expanded details with `allowToggle: false`.

Storybook also covers default values, invalid inputs, unavailable views, and long content. Its input table reads property names, descriptions, and defaults directly from [config.json](./config.json). The preview supplies the host connection internally; `getPConnect` is absent from its public props and controls.

## Configuration

Add **Expandable Card** as a Details template. Pega resolves VALUEINPUT property references before rendering. The card never parses arbitrary property paths.

| Properties                                             | Purpose / default                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `header`, `iconName`                                   | Heading and Material UI icon export name; `Information`, `InfoOutlined`.                                     |
| `foregroundColor`, `backgroundColor`                   | Header icon/text foreground and avatar-only background; `#000000`, `#E9EEF3`. Header text has no background. |
| `headerProps`                                          | Optional TypeScript `IconBadgeProps` object overriding individual header fields.                             |
| `subHeaderMode`, `subHeaderText`                       | `text` or `badge`; optional text or badge label.                                                             |
| `subHeaderBadgeComponent`                              | Installed badge component key; `Dxd_CustomUI_IconBadge`.                                                     |
| `subHeaderIconName`                                    | Subheader badge icon; `InfoOutlined`.                                                                        |
| `subHeaderForegroundColor`, `subHeaderBackgroundColor` | Independent subheader colors; `#000000`, `#FFFFFF`. Text mode uses only the foreground color.                |
| `subHeaderBadgeProps`                                  | Optional independent `IconBadgeProps` object overriding individual subheader fields.                         |
| `summaryViewName`                                      | Named summary view visible in both states.                                                                   |
| `showSummary`, `summaryText`                           | Optional text shown only when collapsed; `true`, empty.                                                      |
| `detailsViewName`                                      | Named view mounted only when expanded. Empty omits the toggle.                                               |
| `viewClassName`                                        | Defaults to current case class. Specify the class for embedded page views.                                   |
| `defaultExpanded`, `allowToggle`                       | Initial expansion and whether users can toggle; `false`, `true`.                                             |

`ExpandableCardProps` composes `IconBadgeProps`, whose fields are `header`, `iconName`, `foregroundColor`, and `backgroundColor`. Header and subheader objects never inherit each other's values. App Studio exposes the individual fields; object props are available to TypeScript consumers. Colors accept 3-, 4-, 6-, or 8-digit hex values. Invalid values use the independent defaults. Booleans accept boolean values and serialized `"true"` / `"false"`.

**Migration:** replace existing `additionalHeaderViewName` configuration with `summaryViewName`. Its behavior remains a persistent view. The component is now registered as a Details template instead of a Widget.

## Shared utilities and Pega integration

[Shared utilities](../shared/utils.ts) normalize text, booleans, and hex colors and resolve host key mappings. [Shared Pega view helpers](../shared/pegaViews.ts) reuse cached resources, capability-check the `loadView` API before loading missing case resources, and create isolated read-only child views using the current context and page reference. Embedded pages retain their page reference. Pages without a case ID require view resources in the containing response; missing resources display “Content unavailable.” Stale responses cannot replace the current view.

Each view inherits `readOnly: true` and `displayMode: DISPLAY_ONLY`. Use display views without action widgets; read-only field inheritance does not disable arbitrary actions. The card does not update field values.

Badge mode delegates to the registered widget through the host factory. The adapter maps `IconBadgeProps.header` to the installed widget's `label` input. Missing widgets fall back to styled text. Storybook mocks the Pega runtime and renders the real badge implementation.

## Theme

[Styles](./styles.ts) follow [Pega's Constellation design-token guidance](https://docs.pega.com/bundle/platform/page/platform/user-experience/design-tokens-constellation.html). Base tokens are the customization surface: `base.spacing`, `base.font-family`, `base.font-size`, `base.font-weight`, `base.line-height`, `base.letter-spacing`, `base.border-radius`, `base.palette.primary-background`, `base.palette.foreground-color`, `base.palette.border-line`, and `base.shadow.focus`.

`ThemeMachine` resolves inherited card tokens without mutating the Cosmos definition. Layout spacing and avatar dimensions scale with base spacing; typography and keyboard focus also follow the application theme. The existing MUI presentation layer receives the relevant Cosmos typography. Explicit header and subheader color inputs override their own regions; the card surface continues to follow the application theme.

Supporting arbitrary MUI icon export names retains the installed icon catalog in the bundle.

The card typography tokens are `components.expandable-card.header-font-size` (`1.5em` relative to the card's base font), `subheader-font-size` (inherited from `base.font-size`), and `subheader-icon-size` (`1.25em` relative to badge text). A 16px base gives a 24px header, 16px subheader, and 20px badge icon; the default 14px Cosmos base gives 21px, 14px, and 17.5px. Both subheader modes share the same text-size token. The card passes its badge sizes through scoped CSS custom properties; standalone IconBadge sizing retains its existing defaults. Text-only subheaders and badge text fallbacks have no background.

## Validation

```sh
npm run _lint:types
npm run lint
npm run validate-schema -- Dxd_CustomUI_ExpandableCard
npm test -- --runInBand --coverage=false
npm run build-storybook
```

A live Pega smoke test should verify Details-template placement, property bindings, class resolution, named-view resources, and the installed IconBadge widget. Storybook uses a mocked host and does not establish live Platform or Launchpad compatibility.
