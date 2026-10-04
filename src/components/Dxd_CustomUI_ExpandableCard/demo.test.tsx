import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Configuration } from '@pega/cosmos-react-core';
import type { C11nEnv } from '@pega/pcore-pconnect-typedefs/interpreter/c11n-env';
import ExpandableCard from './index';
import type { ExpandableCardProps } from './types';

const host = globalThis as typeof globalThis & { PCore: typeof PCore };
let originalPCore: typeof PCore;
let createComponent: jest.Mock;
let setInheritedProp: jest.Mock;
let fetchViewResources: jest.Mock;
let invokeRestApi: jest.Mock;
let updateViewResources: jest.Mock;
let getPConnect: NonNullable<ExpandableCardProps['getPConnect']>;

beforeEach(() => {
  originalPCore = host.PCore;
  createComponent = jest.fn(meta => <div>{meta.config.name || meta.config.header}</div>);
  setInheritedProp = jest.fn();
  fetchViewResources = jest.fn(name => ({ type: 'View', config: { name } }));
  invokeRestApi = jest.fn();
  updateViewResources = jest.fn().mockResolvedValue(undefined);
  const parent = {
    getContextName: () => 'app/case-2',
    getPageReference: () => 'caseInfo.content.Customer',
    getCaseInfo: () => ({ getKey: () => 'CASE-2', getClassName: () => 'Demo-Work' }),
    createComponent
  } as unknown as C11nEnv;
  getPConnect = () => parent;
  host.PCore = {
    getViewResources: () => ({ fetchViewResources, updateViewResources }),
    getRestClient: () => ({ invokeRestApi, doesRestApiExist: () => true }),
    createPConnect: jest.fn(() => ({ getPConnect: () => ({ createComponent, setInheritedProp }) }))
  } as unknown as typeof PCore;
});

afterEach(() => {
  host.PCore = originalPCore;
});

function card(props: ExpandableCardProps = {}) {
  return (
    <Configuration disableDefaultFontLoading>
      <ExpandableCard getPConnect={getPConnect} {...props} />
    </Configuration>
  );
}

test.each(['constructor', '__esModule', 'NotAnIcon'])(
  'falls back for invalid icon %s and colors',
  iconName => {
    render(card({ iconName, foregroundColor: 'bad', backgroundColor: 'url(bad)' }));
    expect(screen.getByRole('heading', { name: 'Information' })).toHaveStyle({ color: '#EC008C' });
    expect(screen.getByTestId('InfoOutlinedIcon')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  }
);

test('renders a valid configurable icon to the left of the heading', () => {
  render(card({ header: 'Balance', iconName: 'ArrowDownward', foregroundColor: '#123456' }));
  const icon = screen.getByTestId('ArrowDownwardIcon');
  const heading = screen.getByRole('heading', { name: 'Balance' });
  expect(icon.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(heading).toHaveStyle({ color: '#123456' });
});

test('updates the styled wrapper when the application Cosmos theme changes', () => {
  const themedCard = (fontFamily: string, background: string) => (
    <Configuration
      disableDefaultFontLoading
      theme={{
        base: {
          'font-family': fontFamily,
          'border-radius': '12px',
          palette: { 'primary-background': background }
        }
      }}
    >
      <ExpandableCard header='Themed card' />
    </Configuration>
  );
  const { rerender } = render(themedCard('serif', '#102030'));
  expect(screen.getByRole('region', { name: 'Themed card' })).toHaveStyle({
    fontFamily: 'serif',
    backgroundColor: '#102030',
    borderRadius: '12px'
  });
  rerender(themedCard('monospace', '#405060'));
  expect(screen.getByRole('region', { name: 'Themed card' })).toHaveStyle({
    fontFamily: 'monospace',
    backgroundColor: '#405060',
    borderRadius: '12px'
  });
});

test('loads details only on expansion and restores the collapsed summary', async () => {
  render(card({ header: 'Customer', summaryText: 'Summary', detailsViewName: 'CustomerDetails' }));
  expect(screen.getByText('Summary')).toBeVisible();
  expect(fetchViewResources).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Expand Customer' }));
  expect(await screen.findByText('CustomerDetails')).toBeVisible();
  expect(screen.queryByText('Summary')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Collapse Customer' })).toHaveAttribute(
    'aria-expanded',
    'true'
  );
  fireEvent.click(screen.getByRole('button', { name: 'Collapse Customer' }));
  expect(screen.getByText('Summary')).toBeVisible();
  expect(screen.queryByText('CustomerDetails')).not.toBeInTheDocument();
});

test('keeps the header view visible and uses an isolated, read-only Pega context', async () => {
  render(
    card({
      additionalHeaderViewName: 'HeaderView',
      detailsViewName: 'DetailsView',
      defaultExpanded: true,
      viewClassName: 'Demo-Data-Customer'
    })
  );
  expect(await screen.findByText('HeaderView')).toBeVisible();
  expect(await screen.findByText('DetailsView')).toBeVisible();
  expect(PCore.createPConnect).toHaveBeenCalledWith(
    expect.objectContaining({
      options: {
        context: 'app/case-2',
        contextName: 'app/case-2',
        pageReference: 'caseInfo.content.Customer'
      }
    })
  );
  expect(fetchViewResources).toHaveBeenCalledWith(
    'DetailsView',
    getPConnect(),
    'Demo-Data-Customer'
  );
  expect(setInheritedProp).toHaveBeenCalledWith('readOnly', true);
  expect(setInheritedProp).toHaveBeenCalledWith('displayMode', 'DISPLAY_ONLY');
  expect(createComponent).toHaveBeenCalledWith(
    expect.objectContaining({
      config: expect.objectContaining({ readOnly: true, displayMode: 'DISPLAY_ONLY' })
    })
  );
});

test('supports fixed expansion, string booleans, and configured state updates', async () => {
  const { rerender } = render(
    card({
      detailsViewName: 'Details',
      defaultExpanded: 'true',
      allowToggle: 'false',
      summaryText: 'Summary'
    })
  );
  expect(await screen.findByText('Details')).toBeVisible();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  rerender(
    card({
      detailsViewName: 'Details',
      defaultExpanded: 'false',
      allowToggle: 'false',
      showSummary: 'false',
      summaryText: 'Summary'
    })
  );
  expect(screen.queryByText('Details')).not.toBeInTheDocument();
  expect(screen.queryByText('Summary')).not.toBeInTheDocument();
});

test('uses distinct accessible IDs for multiple cards', () => {
  render(
    <>
      {card({ header: 'First', detailsViewName: 'A' })}
      {card({ header: 'Second', detailsViewName: 'B' })}
    </>
  );
  const first = screen.getByRole('button', { name: 'Expand First' }).getAttribute('aria-controls');
  const second = screen
    .getByRole('button', { name: 'Expand Second' })
    .getAttribute('aria-controls');
  expect(first).not.toEqual(second);
  expect(document.getElementById(first!)).toBeInTheDocument();
  expect(document.getElementById(second!)).toBeInTheDocument();
});

test('delegates badge props to the installed widget and falls back when unavailable', () => {
  const { rerender } = render(
    card({
      subHeaderMode: 'badge',
      subHeaderBadgeComponent: 'Acme_UI_IconBadge',
      subHeaderBadgeProps: {
        header: 'Active',
        iconName: 'ArrowUpward',
        foregroundColor: '#123456',
        backgroundColor: '#fff'
      }
    })
  );
  expect(createComponent).toHaveBeenCalledWith({
    type: 'Acme_UI_IconBadge',
    config: {
      header: 'Active',
      iconName: 'ArrowUpward',
      foregroundColor: '#123456',
      backgroundColor: '#fff',
      readOnly: true
    }
  });
  createComponent.mockImplementation(() => {
    throw new Error('Missing widget');
  });
  rerender(card({ subHeaderMode: 'badge', subHeaderText: 'Text fallback' }));
  expect(screen.getByText('Text fallback')).toBeVisible();
});

test('loads uncached view resources through PCore and then renders them', async () => {
  fetchViewResources.mockReturnValueOnce(undefined);
  invokeRestApi.mockResolvedValue({ data: { uiResources: {} } });
  render(card({ detailsViewName: 'Details', defaultExpanded: true }));
  expect(await screen.findByText('Details')).toBeVisible();
  expect(invokeRestApi).toHaveBeenCalledWith(
    'loadView',
    {
      queryPayload: { caseID: 'CASE-2', caseClassName: 'Demo-Work', viewID: 'Details' }
    },
    'app/case-2'
  );
  expect(updateViewResources).toHaveBeenCalledWith({ uiResources: {} });
});

test('handles rejected view loads without crashing the card', async () => {
  fetchViewResources.mockReturnValue(undefined);
  invokeRestApi.mockRejectedValue(new Error('Unavailable'));
  render(card({ header: 'Customer', detailsViewName: 'Missing', defaultExpanded: true }));
  expect(await screen.findByText('Content unavailable.')).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Customer' })).toBeVisible();
});

test('ignores stale requests when the view changes', async () => {
  let resolveOld: (value: unknown) => void = () => undefined;
  fetchViewResources.mockImplementation(name =>
    name === 'Old' ? undefined : { type: 'View', config: { name } }
  );
  invokeRestApi.mockReturnValue(
    new Promise(resolve => {
      resolveOld = resolve;
    })
  );
  const { rerender } = render(card({ detailsViewName: 'Old', defaultExpanded: true }));
  await waitFor(() => expect(invokeRestApi).toHaveBeenCalledTimes(1));
  rerender(card({ detailsViewName: 'New', defaultExpanded: true }));
  expect(await screen.findByText('New')).toBeVisible();
  await act(async () => {
    resolveOld({ data: {} });
  });
  expect(screen.getByText('New')).toBeVisible();
  expect(screen.queryByText('Content unavailable.')).not.toBeInTheDocument();
});
