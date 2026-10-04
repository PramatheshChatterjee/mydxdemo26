import type { ReactNode } from 'react';
import { Chip, Stack, Typography } from '@mui/material';
import type { C11nEnv } from '@pega/pcore-pconnect-typedefs/interpreter/c11n-env';
import CardIcon from './CardIcon';

const sampleViews: Record<string, Record<string, string>> = {
  UserDetails: {
    Email: 'alex.morgan@example.com',
    Role: 'Account manager',
    Location: 'Toronto, Canada'
  },
  CustomerHeader: { 'Customer since': '2021', Relationship: 'Personal banking' },
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
    // Story-only stand-in for the separately installed DX widget.
    return (
      <Chip
        size='small'
        icon={<CardIcon name={meta.config?.iconName as string} />}
        label={meta.config?.header as string}
        sx={{
          color: meta.config?.foregroundColor as string,
          bgcolor: meta.config?.backgroundColor as string,
          '& .MuiChip-icon': { color: 'inherit' }
        }}
      />
    );
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
    getViewResources: () => ({
      fetchViewResources: (name: string) => ({ type: 'View', config: { name } })
    }),
    createPConnect: () => ({ getPConnect: getSamplePConnect })
  } as unknown as typeof PCore;
  return () => {
    host.PCore = previous;
  };
}
