import type { ReactNode } from 'react';
import type { C11nEnv } from '@pega/pcore-pconnect-typedefs/interpreter/c11n-env';
import { getMappedKey } from './utils';

type ViewMetadata = ReturnType<ReturnType<typeof PCore.getViewResources>['fetchViewResources']>;

/** Load missing case view resources only when the host exposes the API. */
export async function loadCaseViewResources(
  name: string,
  className: string,
  pConnect: C11nEnv
): Promise<ViewMetadata> {
  const caseID = pConnect.getCaseInfo()?.getKey();
  const client = PCore.getRestClient();
  if (!caseID || !client.doesRestApiExist('loadView')) throw new Error('View unavailable');
  const response = await client.invokeRestApi(
    'loadView',
    { queryPayload: { caseID, caseClassName: className, viewID: name } },
    pConnect.getContextName()
  );
  const resources = PCore.getViewResources();
  await resources.updateViewResources(response.data);
  return resources.fetchViewResources(name, pConnect, className);
}

/** Reuse page/embedded-page metadata; a containing case can supply missing resources. */
export async function loadViewResources(
  name: string,
  className: string,
  pConnect: C11nEnv
): Promise<ViewMetadata> {
  const viewName = getMappedKey(name);
  const viewClass = className || pConnect.getCaseInfo()?.getClassName() || '';
  const cached = PCore.getViewResources().fetchViewResources(viewName, pConnect, viewClass);
  const metadata = cached?.type
    ? cached
    : await loadCaseViewResources(viewName, viewClass, pConnect);
  if (!metadata?.type) throw new Error('View unavailable');
  return metadata;
}

/** Preserve the host page reference, including embedded pages, in an isolated child. */
export function createReadOnlyView(metadata: ViewMetadata, pConnect: C11nEnv): ReactNode {
  const context = pConnect.getContextName();
  const meta = {
    ...metadata,
    config: { ...metadata.config, readOnly: true, displayMode: 'DISPLAY_ONLY' }
  };
  const child = PCore.createPConnect({
    meta,
    options: { context, contextName: context, pageReference: pConnect.getPageReference() }
  }).getPConnect();
  child.setInheritedProp('readOnly', true);
  child.setInheritedProp('displayMode', 'DISPLAY_ONLY');
  return child.createComponent(meta) as ReactNode;
}
