import * as icons from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';
import { textValue } from './utils';

// Use the installed export table, never a URL or a user-controlled module path.
// The full catalog intentionally supports every valid MUI 6.5 icon name.
export default function CardIcon({ name }: { name?: string }) {
  const key = textValue(name, 'InfoOutlined');
  // Icon exports start with an uppercase letter; exclude module bookkeeping keys.
  const Icon: SvgIconComponent =
    /^[A-Z][A-Za-z0-9]*$/.test(key) && Object.prototype.hasOwnProperty.call(icons, key)
      ? icons[key as keyof typeof icons]
      : icons.InfoOutlined;
  return <Icon aria-hidden fontSize='inherit' />;
}
