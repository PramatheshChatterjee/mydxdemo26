import { Component, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Typography } from '@mui/material';
import { createReadOnlyView, loadViewResources } from '../shared/pegaViews';
import type { ExpandableCardProps, IconBadgeProps } from './types';

type Connection = Pick<ExpandableCardProps, 'getPConnect'>;

/** Isolate unavailable views/widgets, including failures when their children render. */
export class ExpandableCardContentBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    // A factory call may succeed before one of its descendants throws during render.
    // React error boundaries catch that later failure and preserve the rest of the card.
    return { failed: true };
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Render a configured view using the host's metadata and component factory. */
export function ExpandableCardView({
  name,
  className,
  getPConnect
}: Connection & { name: string; className: string }) {
  const pConnect = getPConnect?.();
  const context = pConnect?.getContextName();
  const pageReference = pConnect?.getPageReference();
  const caseInfo = pConnect?.getCaseInfo();
  const caseID = caseInfo?.getKey();
  const viewClass = className || caseInfo?.getClassName() || '';
  const [content, setContent] = useState<{ key: string; node: ReactNode }>();
  // Scope loaded content to both the view and its data context. Two cases can use
  // the same view name without being allowed to reuse each other's rendered content.
  const resourceKey = JSON.stringify([name, viewClass, context, pageReference, caseID]);
  const unavailable = (
    <Typography role='status' variant='body2'>
      Content unavailable.
    </Typography>
  );

  useEffect(() => {
    let active = true;
    async function load() {
      if (!pConnect || typeof PCore === 'undefined') throw new Error('No Pega context');
      const metadata = await loadViewResources(name, viewClass, pConnect);
      if (!active) return;
      const node = createReadOnlyView(metadata, pConnect);
      setContent({ key: resourceKey, node });
    }
    load().catch(() => {
      if (active) setContent({ key: resourceKey, node: null });
    });
    return () => {
      // A pending request may finish after collapse, unmount, or a configuration change.
      // Its metadata may enter the cache, but it must not replace the current UI.
      active = false;
    };
  }, [pConnect, name, viewClass, context, pageReference, caseID, resourceKey]);

  if (content?.key !== resourceKey) {
    return (
      <Typography role='status' variant='body2'>
        Loading content…
      </Typography>
    );
  }
  return (
    <ExpandableCardContentBoundary key={resourceKey} fallback={unavailable}>
      {content.node ?? unavailable}
    </ExpandableCardContentBoundary>
  );
}

/** Delegate badge rendering to the separately registered widget. */
export function ExpandableCardHeaderBadge({
  componentName,
  badgeProps,
  getPConnect
}: Connection & { componentName: string; badgeProps: IconBadgeProps }) {
  const { header, ...iconProps } = badgeProps;
  const fallback = (
    <Typography
      variant='body2'
      sx={{ color: iconProps.foregroundColor, fontSize: 'inherit' }}
    >
      {header}
    </Typography>
  );
  let content: ReactNode;
  try {
    // The host resolves the configured component key, including application overrides.
    // Catch factory failures here; the boundary below handles descendant render failures.
    content = getPConnect?.().createComponent({
      type: componentName,
      config: { ...iconProps, label: header, readOnly: true }
    });
  } catch {
    return fallback;
  }
  return (
    <ExpandableCardContentBoundary
      key={JSON.stringify([componentName, badgeProps])}
      fallback={fallback}
    >
      {content ?? fallback}
    </ExpandableCardContentBoundary>
  );
}
