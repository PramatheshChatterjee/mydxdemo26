# Expandable Card

`Dxd_CustomUI_ExpandableCard` is a CustomUI Widget for project `mydxdemo26`, organization `Dxd`. Its implementation follows the installed DX Builder widget template with a `withConfiguration` entry point, configuration schema, shared CSP nonce setup, stories, and tests.

The supplied conversation did not contain an accessible mock-up image. The layout therefore follows the written specification: icon avatar on the left, heading and optional subheader, an additional header view, a separated collapsed summary, and an expandable details view. Exact visual matching requires the reference image.

## App Studio configuration

Add **Expandable Card** to a case or page view. Set **Header**, **Subheader text**, and **Collapsed summary** to static text or Pega property references using the value-input editor. Pega resolves property references before rendering; the component never parses property paths or reads arbitrary case fields itself.

| Property                                               | Default                       | Purpose                                                                                                                                                                                   |
| ------------------------------------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `iconName`                                             | `InfoOutlined`                | Any export from the installed MUI Icons 6.5.0 package; invalid names use the information icon.                                                                                            |
| `header`                                               | `Information`                 | Heading to the right of the avatar.                                                                                                                                                       |
| `foregroundColor`                                      | `#EC008C`                     | Avatar icon and heading color.                                                                                                                                                            |
| `backgroundColor`                                      | `#FCE4F2`                     | Avatar background.                                                                                                                                                                        |
| `subHeaderMode`                                        | `text`                        | `text` or `badge`.                                                                                                                                                                        |
| `subHeaderText`                                        | Empty                         | Optional text or IconBadge label.                                                                                                                                                         |
| `subHeaderBadgeComponent`                              | `Dxd_CustomUI_IconBadge`      | Component key of an installed IconBadge widget.                                                                                                                                           |
| `subHeaderIconName`                                    | `InfoOutlined`                | Icon forwarded to the badge.                                                                                                                                                              |
| `subHeaderForegroundColor`, `subHeaderBackgroundColor` | Inherit header/ avatar colors | Badge colors.                                                                                                                                                                             |
| `subHeaderBadgeProps`                                  | None                          | TypeScript-only object with `header`, `iconName`, `foregroundColor`, `backgroundColor`; overrides the individual badge properties. Those individual properties are exposed in App Studio. |
| `showSummary`, `summaryText`                           | `true`, empty                 | Optional summary shown only while details are collapsed.                                                                                                                                  |
| `additionalHeaderViewName`                             | Empty                         | Named view shown in either state.                                                                                                                                                         |
| `detailsViewName`                                      | Empty                         | Named view mounted only while expanded. No toggle appears without a details view.                                                                                                         |
| `viewClassName`                                        | Current case class            | Class of the named views. Set explicitly for page or embedded data views.                                                                                                                 |
| `defaultExpanded`                                      | `false`                       | Initial state; changes to this configuration reset the state.                                                                                                                             |
| `allowToggle`                                          | `true`                        | Set false for a fixed, noninteractive card using `defaultExpanded`.                                                                                                                       |

Colors accept three-, four-, six-, or eight-digit hex values; invalid values use defaults. Boolean values accept booleans or Pega's string `"true"`/`"false"`. Missing optional content is omitted. Long text wraps without hiding it.

## Pega view and badge integration

Views use the current PConnect context and page reference. The component first checks `PCore.getViewResources()`. For an uncached view in a case context, it loads resources via the registered `loadView` API and updates the resource store. For page views without a case ID, include the view resources in the containing page response. Missing resources and failed requests display “Content unavailable.” Stale responses cannot replace a newly configured view.

Each view renders through Pega's component factory in an isolated child context with `readOnly: true` and `displayMode: DISPLAY_ONLY`. Use display views without action widgets; read-only field inheritance does not disable arbitrary actions defined inside a configured view. No field values are updated by the card.

Badge mode delegates to the registered IconBadge widget via `createComponent`. Install that widget separately and configure its component key. The card forwards the four documented badge properties; absent or failing widgets fall back to the subheader label. The Storybook badge is a mock, not a second production implementation.

## Building blocks and theme

The local `react-sdk-components` source was inspected before implementation: `SelectableCard` handles record selection, `AssignmentCard` hosts assignment actions, and `FieldGroup` supplies a simple field-group label without avatar, subheader, or header-view slots. None supports this card's composition. There were no reusable Avatar or IconBadge components in that SDK source. The card therefore uses MUI 6.5.0 presentation components. Configured Pega views retain the host's existing field implementations.

[styles.ts](./styles.ts) extends Cosmos `themeDefinition` with `components['expandable-card']` tokens and resolves them with `ThemeMachine` using the active Cosmos theme. The component obtains that theme through Cosmos `useTheme` and passes it explicitly to `StyledExpandableCardWrapper`, a styled-components `styled.div`. The wrapper uses the theme's font and the resolved card tokens for its surface, border, and radius; inherited typography and colors also feed the local MUI theme. Padding, avatar size, and gap tokens control the inner layout. The default Cosmos definition is not mutated.

`ExpandableCardProps` is a standalone type with explicit header and avatar properties. It references `IconBadgeProps` only for the optional nested badge configuration. [ExpandableCardContent.tsx](./ExpandableCardContent.tsx) contains `ExpandableCardView`, `ExpandableCardHeaderBadge`, and their error boundary; these component-specific names avoid library export collisions.

Supporting arbitrary valid icon export names retains the complete MUI icon catalog in the component bundle. This is an intentional bundle-size tradeoff; [CardIcon.tsx](./CardIcon.tsx) contains the lookup in one place.

## Samples and validation

Run `npm run startStorybook` and open **CustomUI / Expandable Card**. Stories include **Default**, **User**, **Customer**, **Credit Card**, **Car Model**, invalid inputs, unavailable views, and long content. Car Model demonstrates fixed expansion; Customer demonstrates an IconBadge subheader and the additional header view.

```sh
npm run _lint:types
npm run lint
npm run validate-schema -- Dxd_CustomUI_ExpandableCard
npm test -- --runInBand --coverage=false src/components/Dxd_CustomUI_ExpandableCard/demo.test.tsx
npm run createLib -- CustomUI 1.0.0 true Current
npm run buildComponent -- Dxd_CustomUI_ExpandableCard false false
```

Library initialization is needed only on a fresh checkout without local DX Builder archives. When prompted to upgrade existing source, answer **No**; this component already uses the current APIs. Local archives and generated bundles are ignored by Git.

The Storybook runtime supplies mock view metadata and display content. Publishing and a live Infinity smoke test remain environment-specific steps: verify property bindings, class resolution, named-view resource loading, and the separately installed IconBadge widget in the target application.
