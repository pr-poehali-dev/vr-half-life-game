import { VRGame } from '@/components/VRGame';
import { Suspense } from 'react';

const Index = () => {
  return (
    <div className="w-full h-screen bg-background">
      <Suspense fallback={
        <div className="w-full h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse">🚀</div>
            <h2 className="text-2xl font-bold text-foreground">Загрузка мира...</h2>
            <p className="text-muted-foreground">Инициализация Half-Life: Aftermath</p>
          </div>
        </div>
      }>
        <VRGame />
      </Suspense>
    </div>
  );
};

export default Index;
