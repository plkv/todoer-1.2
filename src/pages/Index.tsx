import React from 'react';
import { PlannerView } from '@/components/PlannerView';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-2xl">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-bg-prim">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-content-prim">
            Добро пожаловать в Todoer
          </h1>
          <p className="mt-2 text-lg text-content-sec">
            Войдите, чтобы начать планировать свой день.
          </p>
          <Button onClick={login} variant="default" className="mt-6 text-style-p-m-semibold">
            Войти через Google
          </Button>
        </div>
      </div>
    );
  }

  return <PlannerView />;
};

export default Index;
