import { useRef, useState } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { Location } from './Location';

export const GameWorld = () => {
  const { camera } = useThree();
  const [currentLocation, setCurrentLocation] = useState(0);

  const locations = [
    { name: 'БУНКЕР', position: [0, 0, 0], color: '#8E9196' },
    { name: 'КАРАНТИН', position: [20, 0, 0], color: '#0EA5E9' },
    { name: 'ЛАБОРАТОРИЯ', position: [0, 0, -20], color: '#F97316' },
    { name: 'ЗАВОД', position: [-20, 0, 0], color: '#ea384c' }
  ];

  return (
    <>
      <PointerLockControls />
      
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[100, 0.1, 100]} position={[0, 0, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      </RigidBody>

      {locations.map((location, index) => (
        <Location
          key={index}
          name={location.name}
          position={location.position as [number, number, number]}
          color={location.color}
          isActive={currentLocation === index}
          onClick={() => setCurrentLocation(index)}
        />
      ))}

      <InteractiveObjects />
      
      <HazardZone position={[20, 0.5, 0]} />
      
      <AnomalyField position={[0, 2, -20]} />
      
      <IndustrialMachinery position={[-20, 0, 0]} />
    </>
  );
};

const InteractiveObjects = () => {
  return (
    <group position={[0, 0, 0]}>
      <GrabbableBox position={[-2, 1, -3]} />
      <GrabbableBox position={[2, 1, -3]} />
      <GrabbableBox position={[0, 1, -4]} />
      
      <GrabbableSphere position={[0, 2, -2]} />
      <GrabbableSphere position={[1, 2.5, -2]} />
    </group>
  );
};

const GrabbableBox = ({ position }: { position: [number, number, number] }) => {
  const [grabbed, setGrabbed] = useState(false);
  const rigidBodyRef = useRef<any>();

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders="cuboid"
      mass={1}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <Box
        args={[0.5, 0.5, 0.5]}
        castShadow
        onClick={() => setGrabbed(!grabbed)}
        onPointerOver={() => document.body.style.cursor = 'grab'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <meshStandardMaterial
          color={grabbed ? '#F97316' : '#8E9196'}
          roughness={0.6}
          metalness={0.4}
          emissive={grabbed ? '#F97316' : '#000000'}
          emissiveIntensity={grabbed ? 0.3 : 0}
        />
      </Box>
    </RigidBody>
  );
};

const GrabbableSphere = ({ position }: { position: [number, number, number] }) => {
  const [grabbed, setGrabbed] = useState(false);
  const rigidBodyRef = useRef<any>();

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders="ball"
      mass={0.5}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <Sphere
        args={[0.3, 32, 32]}
        castShadow
        onClick={() => setGrabbed(!grabbed)}
        onPointerOver={() => document.body.style.cursor = 'grab'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <meshStandardMaterial
          color={grabbed ? '#0EA5E9' : '#8E9196'}
          roughness={0.4}
          metalness={0.6}
          emissive={grabbed ? '#0EA5E9' : '#000000'}
          emissiveIntensity={grabbed ? 0.4 : 0}
        />
      </Sphere>
    </RigidBody>
  );
};

const HazardZone = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial
          color="#0EA5E9"
          emissive="#0EA5E9"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#0EA5E9"
        anchorX="center"
        anchorY="middle"
      >
        ☢️ ОПАСНАЯ ЗОНА
      </Text>
    </group>
  );
};

const AnomalyField = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 1] = Math.random() * 3;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.2;
    }
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(clock.elapsedTime + i) * 0.01;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#F97316"
          emissive="#F97316"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      <Text
        position={[0, -1, 0]}
        fontSize={0.4}
        color="#F97316"
        anchorX="center"
        anchorY="middle"
      >
        ⚡ АНОМАЛИЯ
      </Text>
    </group>
  );
};

const IndustrialMachinery = ({ position }: { position: [number, number, number] }) => {
  const gearRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (gearRef.current) {
      gearRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group position={position}>
      <group ref={gearRef}>
        <Cylinder args={[1.5, 1.5, 0.3, 8]} castShadow>
          <meshStandardMaterial
            color="#ea384c"
            roughness={0.8}
            metalness={0.9}
          />
        </Cylinder>
        <Cylinder args={[1.2, 1.2, 0.4, 8]} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial
            color="#8E9196"
            roughness={0.7}
            metalness={0.95}
          />
        </Cylinder>
      </group>
      
      <RigidBody type="fixed">
        <Box args={[0.5, 3, 0.5]} position={[-2, 1.5, 0]} castShadow>
          <meshStandardMaterial
            color="#8E9196"
            roughness={0.9}
            metalness={0.8}
          />
        </Box>
        <Box args={[0.5, 3, 0.5]} position={[2, 1.5, 0]} castShadow>
          <meshStandardMaterial
            color="#8E9196"
            roughness={0.9}
            metalness={0.8}
          />
        </Box>
      </RigidBody>

      <pointLight position={[0, 3, 0]} intensity={1} color="#ea384c" distance={8} />
      
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#ea384c"
        anchorX="center"
        anchorY="middle"
      >
        ⚙️ МЕХАНИЗМЫ
      </Text>
    </group>
  );
};
