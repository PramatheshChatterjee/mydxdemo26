import type { C11nEnv } from '@pega/pcore-pconnect-typedefs/interpreter/c11n-env';
import type { BadgeProps } from '../Dxd_CustomUI_IconBadge/Badge';

/** Configuration values can arrive as booleans or serialized boolean strings. */
export type ConfigurationBoolean = boolean | 'true' | 'false';

export type IconBadgeProps = Omit<BadgeProps, 'label'> & {
  header?: string;
};

/** Header and subheader share a shape, but have independent values and defaults. */
export type ExpandableCardProps = IconBadgeProps & {
  /** Overrides the individual header fields when supplied. */
  headerProps?: IconBadgeProps;
  /** Runtime connection supplied by the host; optional for standalone previews. */
  getPConnect?: () => C11nEnv;
  subHeaderText?: string;
  subHeaderMode?: 'text' | 'badge';
  /** Registered DX component key. The widget must be installed in the application. */
  subHeaderBadgeComponent?: string;
  subHeaderBadgeProps?: IconBadgeProps;
  subHeaderIconName?: string;
  subHeaderForegroundColor?: string;
  subHeaderBackgroundColor?: string;
  summaryText?: string;
  showSummary?: ConfigurationBoolean;
  summaryViewName?: string;
  detailsViewName?: string;
  /** Optional class for the named views; defaults to the current case class. */
  viewClassName?: string;
  defaultExpanded?: ConfigurationBoolean;
  /** False displays the configured state without an interactive toggle. */
  allowToggle?: ConfigurationBoolean;
};
