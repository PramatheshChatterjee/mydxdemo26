import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

const meta = {
  title: 'CustomUI/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    iconName: 'LocalHospital',
    label: 'Medical',
    foregroundColor: '#0057FF',
    backgroundColor: '#EAF4FF'
  },
  argTypes: {
    iconName: { control: 'text' },
    label: { control: 'text' },
    foregroundColor: { control: 'color' },
    backgroundColor: { control: 'color' }
  }
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Email: Story = {
  args: {
    iconName: 'Email',
    label: 'Email',
    foregroundColor: '#168447',
    backgroundColor: '#E6F8EE'
  }
};

export const Favourite: Story = {
  args: {
    iconName: 'Favorite',
    label: 'Favourite',
    foregroundColor: '#EC008C',
    backgroundColor: '#FCE4F2'
  }
};

export const Medical: Story = {
  render: () => (
    <div style={{ display: 'grid', justifyItems: 'start', gap: '0.75rem' }}>
      <Badge />
    </div>
  )
};
