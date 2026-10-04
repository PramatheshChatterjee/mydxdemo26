import { render, screen } from '@testing-library/react';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders a read-only label with a decorative icon on its left', () => {
    const { container } = render(<Badge />);
    const label = screen.getByText('Payable');
    const icon = screen.getByTestId('ArrowUpwardIcon');
    expect(label.previousElementSibling).toBe(icon);
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('focusable', 'false');
    expect(container.querySelector('button, input, a, [tabindex]')).toBeNull();
  });

  it('updates the gallery icon, static text and both colours from configuration', () => {
    const { rerender } = render(<Badge />);
    rerender(
      <Badge
        iconName='ArrowDownward'
        label='Receivable'
        foregroundColor='#168447'
        backgroundColor='#E6F8EE'
      />
    );
    expect(screen.queryByTestId('ArrowUpwardIcon')).not.toBeInTheDocument();
    expect(screen.getByTestId('ArrowDownwardIcon')).toBeInTheDocument();
    expect(screen.getByText('Receivable').parentElement).toHaveStyle({
      color: '#168447',
      backgroundColor: '#E6F8EE'
    });
    rerender(<Badge iconName='FavoriteOutlined' label='Favourite' foregroundColor='#EC008C' />);
    expect(screen.getByTestId('FavoriteOutlinedIcon')).toBeInTheDocument();
    expect(screen.getByText('Favourite').parentElement).toHaveStyle({ color: '#EC008C' });
  });

  it.each(['NotAnIcon', 'constructor', '__proto__', ''])(
    'handles invalid icon name %s',
    iconName => {
      const { container } = render(<Badge iconName={iconName} label='Still visible' />);
      expect(screen.getByText('Still visible')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeNull();
    }
  );

  it('falls back for invalid colours and accepts trimmed short hex values', () => {
    const { rerender } = render(<Badge foregroundColor='red' backgroundColor='#GGGGGG' />);
    expect(screen.getByText('Payable').parentElement).toHaveStyle({
      color: '#0057FF',
      backgroundColor: '#EAF4FF'
    });
    rerender(<Badge iconName=' ArrowDownward ' foregroundColor=' #123 ' backgroundColor='#fff' />);
    expect(screen.getByTestId('ArrowDownwardIcon')).toBeInTheDocument();
    expect(screen.getByText('Payable').parentElement).toHaveStyle({
      color: '#112233',
      backgroundColor: '#ffffff'
    });
  });
});
