import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const { mouse } = useThree();
  
  const count = 3000; // Increased count
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;     
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25; 
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25; 
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Constant complex rotation
    ref.current.rotation.x -= delta / 40;
    ref.current.rotation.y -= delta / 50;
    ref.current.rotation.z += delta / 100;

    // React to mouse
    const x = (mouse.x * window.innerWidth) / 5000;
    const y = (mouse.y * window.innerHeight) / 5000;
    
    ref.current.rotation.x += y;
    ref.current.rotation.y += x;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f3ff"
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

// Simple grid floor to give depth
function GridFloor() {
  return (
    <gridHelper 
        args={[30, 30, 0xff00ff, 0x00f3ff]} 
        position={[0, -5, 0]} 
        rotation={[0, 0, 0]}
    />
  );
}

export const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-dark-950">
      <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
         <fog attach="fog" args={['#050505', 5, 20]} />
        <ambientLight intensity={0.5} />
        <ParticleField />
        <GridFloor />
      </Canvas>
      {/* Vignetts & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-dark-950/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-dark-950/40 to-dark-950" />
    </div>
  );
};