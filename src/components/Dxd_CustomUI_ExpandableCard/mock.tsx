import type { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import type { C11nEnv } from '@pega/pcore-pconnect-typedefs/interpreter/c11n-env';
import { Badge } from '../Dxd_CustomUI_IconBadge/Badge';
import type { BadgeProps } from '../Dxd_CustomUI_IconBadge/Badge';

const sampleViews: Record<string, Record<string, string>> = {
  UserDetails: {
    Email: 'alex.morgan@example.com',
    Role: 'Account manager',
    Location: 'Toronto, Canada'
  },
  CustomerSummary: { 'Customer since': '2021', Relationship: 'Personal banking' },
  CustomerDetails: { Name: 'Jordan Taylor', 'Customer ID': 'C-10428', Segment: 'Premier' },
  CreditCardDetails: {
    Network: 'Visa',
    'Card number': '•••• 4821',
    'Available credit': '$8,450.00',
    'Payment due': 'October 18, 2026'
  },
  CarDetails: {
    Model: '2026 Aurora Touring',
    Powertrain: 'Hybrid',
    Color: 'Pearl white',
    Mileage: '1,250 km'
  }
};

function SampleView({ name }: { name: string }) {
  const fields = sampleViews[name];
  if (!fields) throw new Error('Unknown sample view');
  return (
    <Stack spacing={1.5}>
      {Object.entries(fields).map(([label, value]) => (
        <Stack key={label} direction={{ xs: 'column', sm: 'row' }} spacing={0.5}>
          <Typography variant='body2' sx={{ minWidth: '9rem', fontWeight: 600 }}>
            {label}
          </Typography>
          <Typography variant='body2'>{value}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

const createComponent = (meta: { type: string; config?: Record<string, unknown> }): ReactNode => {
  if (meta.type === 'Dxd_CustomUI_IconBadge') {
    return <Badge {...(meta.config as BadgeProps)} />;
  }
  return <SampleView name={meta.config?.name as string} />;
};

const connection = {
  getContextName: () => 'storybook/card',
  getPageReference: () => 'caseInfo.content',
  getTarget: () => 'primary',
  getCaseInfo: () => ({ getKey: () => 'DEMO-1', getClassName: () => 'Demo-Work' }),
  setInheritedProp: () => undefined,
  createComponent
} as unknown as C11nEnv;

export const getSamplePConnect = () => connection;

export function installSamplePCore() {
  const host = globalThis as typeof globalThis & { PCore: typeof PCore };
  const previous = host.PCore;
  host.PCore = {
    getNameSpaceUtils: () => ({ getDefaultQualifiedName: (key: string) => key }),
    getEnvironmentInfo: () => ({ getKeyMapping: (key: string) => key }),
    getRestClient: () => ({ doesRestApiExist: () => false }),
    getViewResources: () => ({
      fetchViewResources: (name: string) =>
        sampleViews[name] ? { type: 'View', config: { name } } : undefined,
      updateViewResources: async () => undefined
    }),
    createPConnect: () => ({ getPConnect: getSamplePConnect })
  } as unknown as typeof PCore;
  return () => {
    host.PCore = previous;
  };
}
