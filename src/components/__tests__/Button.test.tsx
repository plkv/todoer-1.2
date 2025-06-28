import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../ui/button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  it('renders with icon', () => {
    render(<Button icon={<span data-testid="icon">*</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
}); 