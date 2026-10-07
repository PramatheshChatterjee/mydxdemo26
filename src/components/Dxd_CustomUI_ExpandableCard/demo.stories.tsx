import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import ExpandableCard from './index';
import type { ExpandableCardProps } from './types';
import config from './config.json';
import { getSamplePConnect, installSamplePCore } from './mock';

type PreviewProps = Omit<ExpandableCardProps, 'getPConnect'>;

// The host connection is runtime infrastructure, never a public Storybook input.
function PreviewCard(props: PreviewProps) {
  return <ExpandableCard {...props} getPConnect={getSamplePConnect} />;
}

const configArgTypes = Object.fromEntries(
  config.properties
    .filter(property => property.name && property.name in config.defaultConfig)
    .map(property => [
      property.name,
      {
        name: property.name,
        description: property.description,
        control:
          property.format === 'BOOLEAN'
            ? 'boolean'
            : property.format === 'SELECT'
              ? 'select'
              : 'text',
        ...(property.source
          ? {
              options: property.source.map(option => option.key),
              control: {
                type: 'select',
                labels: Object.fromEntries(
                  property.source.map(option => [option.key, option.value])
                )
              }
            }
          : {}),
        table: {
          defaultValue: {
            summary: JSON.stringify(
              config.defaultConfig[property.name as keyof typeof config.defaultConfig]
            )
          }
        }
      }
    ])
) as NonNullable<Meta<PreviewProps>['argTypes']>;

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

const meta: Meta<PreviewProps> = {
  title: 'CustomUI/Expandable Card',
  component: PreviewCard,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <SampleRuntime>
        <Story />
      </SampleRuntime>
    )
  ],
  parameters: {
    docs: {
      description: {
        component: `${config.description}\n\nUse this Details template for people, customer accounts, payment cards, or product summaries. Choose a text or IconBadge subheader, a persistent summary view, and details loaded on expansion. Disable allowToggle for a fixed card. Header text defaults to black (#000000) with no background; backgroundColor applies only to the avatar and defaults to light gray (#E9EEF3). Subheaders use an independent foreground color; their background applies only in badge mode. Typography tokens make the header 1.5 times the body size and both subheader modes match the body size (24px / 16px with a 16px base). The examples cover these variations and missing content. Input descriptions below come directly from config.json.`
      }
    }
  },
  argTypes: {
    ...configArgTypes,
    headerProps: {
      control: 'object',
      description:
        'IconBadgeProps for the header: header, iconName, foregroundColor, backgroundColor. Supplied values override individual header inputs.'
    },
    subHeaderBadgeProps: {
      control: 'object',
      description:
        'Independent IconBadgeProps for the subheader. Supplied values override individual subheader inputs; text mode uses only the foreground color.'
    }
  }
};
export default meta;
type Story = StoryObj<PreviewProps>;

export const Default: Story = {
  args: {
    ...config.defaultConfig,
    subHeaderMode: 'text'
  }
};

export const User: Story = {
  parameters: {
    docs: {
      description: { story: 'Text subheader and collapsed summary with details loaded on demand.' }
    }
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'Independent green header and blue IconBadge subheader, with a summary view visible in either state.'
      }
    }
  },
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
      foregroundColor: '#3155A4',
      backgroundColor: '#EAF0FC'
    },
    summaryViewName: 'CustomerSummary',
    detailsViewName: 'CustomerDetails',
    defaultExpanded: true
  }
};

export const CustomerText: Story = {
  name: 'Customer Text Subheader',
  parameters: {
    docs: {
      description: {
        story:
          'The same customer with a text-only subheader: matching badge text size and foreground color, with no background.'
      }
    }
  },
  args: { ...Customer.args, subHeaderMode: 'text' }
};

export const CreditCard: Story = {
  parameters: {
    docs: {
      description: { story: 'Payment card summary with multiline text and expandable details.' }
    }
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Fixed expanded card: details remain visible and no toggle is offered.'
      }
    }
  },
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
