import * as MaterialIcons from '@mui/icons-material';

import StyledBadge from './styles';
import { hexColor } from '../shared/utils';

export interface BadgeProps {
  iconName?: string;
  label?: string;
  foregroundColor?: string;
  backgroundColor?: string;
}

const DEFAULT_FOREGROUND = '#0057FF';
const DEFAULT_BACKGROUND = '#EAF4FF';

export function Badge({
  iconName = 'LocalHospital',
  label = 'Medical',
  foregroundColor = DEFAULT_FOREGROUND,
  backgroundColor = DEFAULT_BACKGROUND
}: BadgeProps) {
  const name = typeof iconName === 'string' ? iconName.trim() : '';
  // Only resolve actual gallery exports, never inherited object properties.
  const Icon = Object.prototype.hasOwnProperty.call(MaterialIcons, name)
    ? MaterialIcons[name as keyof typeof MaterialIcons]
    : undefined;

  return (
    <StyledBadge
      style={{
        color: hexColor(foregroundColor, DEFAULT_FOREGROUND),
        backgroundColor: hexColor(backgroundColor, DEFAULT_BACKGROUND)
      }}
    >
      {Icon && <Icon aria-hidden='true' focusable='false' className='badge-icon' />}
      <span className='badge-label'>{label}</span>
    </StyledBadge>
  );
}
