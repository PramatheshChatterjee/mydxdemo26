import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import ExpandableCard from './index';
import { getSamplePConnect, installSamplePCore } from './mock';

function SampleRuntime({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const restore = installSamplePCore();
    setReady(true);
    return restore;
  }, []);
  return ready ? (
    <Box sx={{ width: '100%', maxWidth: 640, mx: 'auto', p: { xs: 1, sm: 3 } }}>{children}</Box>
  ) : null;
}

const meta: Meta<typeof ExpandableCard> = {
  title: 'CustomUI/Expandable Card',
  component: ExpandableCard,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <SampleRuntime>
        <Story />
      </SampleRuntime>
    )
  ],
  argTypes: { getPConnect: { control: false }, subHeaderBadgeProps: { control: 'object' } }
};
export default meta;
type Story = StoryObj<typeof ExpandableCard>;

export const Default: Story = {
  args: {
    getPConnect: getSamplePConnect,
    header: 'Information',
    iconName: 'InfoOutlined',
    foregroundColor: '#EC008C',
    backgroundColor: '#FCE4F2',
    subHeaderMode: 'text',
    subHeaderText: '',
    summaryText: '',
    showSummary: true,
    additionalHeaderViewName: '',
    detailsViewName: '',
    viewClassName: '',
    defaultExpanded: false,
    allowToggle: true
  }
};

export const User: Story = {
  args: {
    ...Default.args,
    header: 'Alex Morgan',
    iconName: 'PersonOutline',
    subHeaderText: 'Account manager',
    summaryText: 'Toronto office · Active team member',
    detailsViewName: 'UserDetails'
  }
};

export const Customer: Story = {
  args: {
    ...Default.args,
    header: 'Jordan Taylor',
    iconName: 'PeopleOutline',
    foregroundColor: '#176A45',
    backgroundColor: '#E7F4ED',
    subHeaderMode: 'badge',
    subHeaderText: 'Premier customer',
    subHeaderBadgeComponent: 'Dxd_CustomUI_IconBadge',
    subHeaderBadgeProps: {
      header: 'Premier customer',
      iconName: 'StarOutline',
      foregroundColor: '#176A45',
      backgroundColor: '#E7F4ED'
    },
    additionalHeaderViewName: 'CustomerHeader',
    detailsViewName: 'CustomerDetails',
    defaultExpanded: true
  }
};

export const CreditCard: Story = {
  name: 'Credit Card',
  args: {
    ...Default.args,
    header: 'Everyday rewards',
    iconName: 'CreditCard',
    foregroundColor: '#3155A4',
    backgroundColor: '#EAF0FC',
    subHeaderText: 'Visa · •••• 4821',
    summaryText: 'Available credit: $8,450.00\nNext payment due October 18, 2026',
    detailsViewName: 'CreditCardDetails'
  }
};

export const CarModel: Story = {
  name: 'Car Model',
  args: {
    ...Default.args,
    header: 'Aurora Touring',
    iconName: 'DirectionsCarOutlined',
    foregroundColor: '#855116',
    backgroundColor: '#FFF3DF',
    subHeaderText: '2026 · Hybrid',
    detailsViewName: 'CarDetails',
    defaultExpanded: true,
    allowToggle: false
  }
};

export const InvalidValues: Story = {
  args: {
    ...Default.args,
    header: 'Unsupported icon and color fallbacks',
    iconName: 'NotAnIcon',
    foregroundColor: 'invalid',
    backgroundColor: 'url(invalid)',
    subHeaderText: '',
    summaryText: 'The card uses its default information icon and colors.'
  }
};

export const UnavailableView: Story = {
  args: {
    ...Default.args,
    header: 'Details unavailable',
    detailsViewName: 'MissingView',
    defaultExpanded: true
  }
};

export const LongContent: Story = {
  args: {
    ...User.args,
    header: 'A very long customer name that wraps comfortably on smaller screens',
    summaryText:
      'reference-without-spaces-0123456789012345678901234567890123456789012345678901234567890123456789'
  }
};
