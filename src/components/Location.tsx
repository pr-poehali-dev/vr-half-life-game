import { useRef } from 'react';
import { Text, Box } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface LocationProps {
  name: string;
  position: [number, number, number];
  color: string;
  isActive: boolean;
  onClick: () => void;
}

export const Location = ({ name, position, color, isActive, onClick }: LocationProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (isActive && meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 3) * 0.3;
    }
    if (isActive && lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(clock.elapsedTime * 3) * 0.5;
    }
  });

  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid">
        <Box
          ref={meshRef}
          args={[4, 3, 4]}
          castShadow
          receiveShadow
          onClick={onClick}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.3}
            emissive={color}
            emissiveIntensity={isActive ? 0.5 : 0.1}
          />
        </Box>
      </RigidBody>

      <Text
        position={[0, 2.5, 0]}
        fontSize={0.6}
        color={isActive ? '#ffffff' : color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {name}
      </Text>

      {isActive && (
        <pointLight
          ref={lightRef}
          position={[0, 3, 0]}
          intensity={2}
          color={color}
          distance={15}
          castShadow
        />
      )}

      <mesh position={[0, 0.05, 0]}>
        <ringGeometry args={[4.5, 5, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.6 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
