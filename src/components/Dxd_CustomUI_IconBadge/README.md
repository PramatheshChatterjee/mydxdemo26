# Icon Badge

`Dxd_mydxdemo26_Badge` is a read-only Pega Constellation widget for page and case views. It displays a rounded pill with a Material UI icon on the left of a static text label. It has no click action, input binding or keyboard tab stop. Screen readers read the label; the icon is decorative.

## App Studio configuration

After publishing the `mydxdemo26` library to your Pega Infinity application, add **Icon Badge** to a page or case view and configure these four text settings:

| Prop              | Purpose                                                                                                                                            | Default       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `iconName`        | Case-sensitive export name from the [MUI icon gallery](https://mui.com/material-ui/material-icons/), including variants such as `FavoriteOutlined` | `ArrowUpward` |
| `label`           | Static badge text                                                                                                                                  | `Payable`     |
| `foregroundColor` | Hex colour shared by the icon and text                                                                                                             | `#0057FF`     |
| `backgroundColor` | Hex colour of the pill                                                                                                                             | `#EAF4FF`     |

The settings are declared in [config.json](./config.json). The label is a literal string, not a case property. No `getPConnect` call is needed. Labels can wrap within the available width.

| Example    | Icon            | Label        | Foreground | Background |
| ---------- | --------------- | ------------ | ---------- | ---------- |
| Payable    | `ArrowUpward`   | `Payable`    | `#0057FF`  | `#EAF4FF`  |
| Receivable | `ArrowDownward` | `Receivable` | `#168447`  | `#E6F8EE`  |
| Magenta    | `Favorite`      | `Favourite`  | `#EC008C`  | `#FCE4F2`  |

Use a leading `#` for colours. Three, four, six and eight hexadecimal digits are supported. Invalid colours use the corresponding default. Icon names are trimmed; blank or unknown names hide the icon and retain the label. Choose foreground/background pairs with readable contrast.

All exports from the installed `@mui/icons-material` version are available. This intentionally includes the gallery in the bundle so App Studio can select an icon at runtime without a separate asset server. It increases bundle size compared with a fixed shortlist of icons.

## Local preview and validation

From the project root:

```sh
npm ci
npm run startStorybook
```

Open `http://localhost:6040` and select **Dxd → Badge → Mockup** for the two sample badges. The individual stories expose all four settings as controls.

```sh
npm run _lint:types
npx eslint src/components/Dxd_mydxdemo26_Badge
npm test -- --runInBand --coverage=false src/components/Dxd_mydxdemo26_Badge
npm run validate-schema -- Dxd_mydxdemo26_Badge
npm run buildComponent -- Dxd_mydxdemo26_Badge
```

The repository uses Pega library mode. On a **fresh checkout without local library archives**, initialize the library once before building/publishing:

```sh
npm run createLib -- mydxdemo26 1.0.0 Y Current
```

This creates local archives under `store/` (ignored by Git). Do not use this initialization command to switch an existing library with unsaved components; use the Pega library workflow instead.

To deploy, configure your server/application/ruleset in [tasks.config.json](../../../tasks.config.json), run `npm run authenticate`, then `npm run publishLibVersion`. Publishing requires your Pega environment and credentials; local build/validation does not publish anything.
