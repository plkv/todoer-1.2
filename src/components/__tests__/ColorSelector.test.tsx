import React from 'react';
import { render, screen } from '@testing-library/react';
import { ColorSelector } from '../ColorSelector';

describe('ColorSelector', () => {
  it('renders color selector', () => {
    render(<ColorSelector value={''} onChange={() => {}} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
}); 