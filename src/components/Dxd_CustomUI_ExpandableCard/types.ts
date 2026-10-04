import type { C11nEnv } from '@pega/pcore-pconnect-typedefs/interpreter/c11n-env';

/** Configuration values can arrive as booleans or serialized boolean strings. */
export type ConfigurationBoolean = boolean | 'true' | 'false';

export interface IconBadgeProps {
  iconName?: string;
  header?: string;
  foregroundColor?: string;
  backgroundColor?: string;
}

/** Card configuration is independent of the optional nested badge's public API. */
export type ExpandableCardProps = {
  iconName?: string;
  header?: string;
  foregroundColor?: string;
  backgroundColor?: string;
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
  additionalHeaderViewName?: string;
  detailsViewName?: string;
  /** Optional class for the named views; defaults to the current case class. */
  viewClassName?: string;
  defaultExpanded?: ConfigurationBoolean;
  /** False displays the configured state without an interactive toggle. */
  allowToggle?: ConfigurationBoolean;
};
