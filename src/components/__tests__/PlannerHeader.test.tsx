import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlannerHeader } from '../PlannerHeader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlannerStateProvider } from '@/hooks/usePlannerState';

const queryClient = new QueryClient();

describe('PlannerHeader', () => {
  it('renders Today button', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PlannerStateProvider>
          <PlannerHeader />
        </PlannerStateProvider>
      </QueryClientProvider>
    );
    expect(screen.getByText('Today')).toBeInTheDocument();
  });
}); 