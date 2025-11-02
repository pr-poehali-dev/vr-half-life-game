import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { Environment, Sky } from '@react-three/drei';
import { GameWorld } from './GameWorld';
import { useState } from 'react';

export const VRGame = () => {
  const [vrSupported, setVrSupported] = useState(true);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 z-10 bg-card/80 backdrop-blur-sm p-4 rounded border border-border">
        <h1 className="text-2xl font-bold text-foreground mb-2">Half-Life: Aftermath</h1>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>🎮 WASD - Движение</p>
          <p>🖱️ Мышь - Взгляд</p>
          <p>🖐️ Click - Захват объектов</p>
          <p>🥽 VR Button - VR режим</p>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        {vrSupported && <VRButton />}
      </div>

      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 75 }}
        onCreated={({ gl }) => {
          if (!('xr' in navigator)) {
            setVrSupported(false);
          }
        }}
      >
        <XR>
          <color attach="background" args={['#0a0d14']} />
          <fog attach="fog" args={['#0a0d14', 10, 50]} />

          <ambientLight intensity={0.1} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={0.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          
          <pointLight position={[0, 2, 0]} intensity={0.8} color="#F97316" distance={10} />
          <pointLight position={[-5, 1, -5]} intensity={0.6} color="#0EA5E9" distance={8} />

          <Physics gravity={[0, -9.81, 0]}>
            <GameWorld />
          </Physics>

          <Environment preset="night" />
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
            turbidity={10}
            rayleigh={0.5}
          />

          <EffectComposer>
            <Bloom intensity={0.3} luminanceThreshold={0.9} luminanceSmoothing={0.9} />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
            <ChromaticAberration offset={[0.001, 0.001]} />
          </EffectComposer>
        </XR>
      </Canvas>
    </div>
  );
};