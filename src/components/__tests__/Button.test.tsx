import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../ui/button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Test</Button>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  it('renders with icon', () => {
    render(<Button><span data-testid="icon">*</span></Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
}); 