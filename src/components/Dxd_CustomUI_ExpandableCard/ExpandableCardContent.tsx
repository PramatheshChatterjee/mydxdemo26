import { Component, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Typography } from '@mui/material';
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
      // Reuse metadata already supplied by the containing view. Only fetch from the
      // registered API when metadata is absent and this context has a case ID.
      const resources = PCore.getViewResources();
      let metadata = resources.fetchViewResources(name, pConnect, viewClass);
      if (!metadata?.type) {
        const client = PCore.getRestClient();
        if (!caseID || !client.doesRestApiExist('loadView')) throw new Error('View unavailable');
        const response = await client.invokeRestApi(
          'loadView',
          {
            queryPayload: { caseID, caseClassName: viewClass, viewID: name }
          },
          context
        );
        await resources.updateViewResources(response.data);
        // Registering resources also makes their dependent components available to
        // the host factory; reading the resource store again uses that processed metadata.
        metadata = resources.fetchViewResources(name, pConnect, viewClass);
      }
      if (!active) return;
      if (!metadata?.type) throw new Error('View unavailable');
      // An isolated child context prevents read-only settings from affecting sibling views.
      const child = PCore.createPConnect({
        meta: {
          ...metadata,
          config: { ...metadata.config, readOnly: true, displayMode: 'DISPLAY_ONLY' }
        },
        options: { context, contextName: context, pageReference }
      }).getPConnect();
      child.setInheritedProp('readOnly', true);
      child.setInheritedProp('displayMode', 'DISPLAY_ONLY');
      // Delegate field rendering and property binding to the host rather than
      // interpreting metadata or reproducing the SDK's field components here.
      const node = child.createComponent({
        ...metadata,
        config: { ...metadata.config, readOnly: true, displayMode: 'DISPLAY_ONLY' }
      }) as ReactNode;
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
  const fallback = <Typography variant='body2'>{badgeProps.header}</Typography>;
  let content: ReactNode;
  try {
    // The host resolves the configured component key, including application overrides.
    // Catch factory failures here; the boundary below handles descendant render failures.
    content = getPConnect?.().createComponent({
      type: componentName,
      config: { ...badgeProps, readOnly: true }
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
