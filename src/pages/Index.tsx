import React from 'react';
import { PlannerView } from '@/components/PlannerView';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-style-h-l">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-bg-prim">
        <div className="text-center">
          <h1 className="text-style-h-xl font-bold text-content-prim">
            Добро пожаловать в Todoer
          </h1>
          <p className="mt-2 text-style-p-l-semibold text-content-sec">
            Войдите, чтобы начать планировать свой день.
          </p>
          <Button onClick={login} variant="primary" className="mt-6">
            Войти через Google
          </Button>
        </div>
      </div>
    );
  }

  return <PlannerView />;
};

export default Index;
