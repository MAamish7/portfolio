'use client';

import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type * as THREE from 'three';

import type { Pointer } from '@/hooks/useMousePosition';

type FloatingGeometryProps = {
  pointer: React.MutableRefObject<Pointer>;
  /** Which exhibit is on stage — swapped as the projects section scrolls. */
  variant?: 'torus' | 'lattice' | 'icosa';
  /** Shrunk on narrow viewports so the exhibit doesn't swamp the copy. */
  scale?: number;
};

/**
 * The wireframe + glass objects orbiting the hero. `Float` handles the idle
 * bob; the group leans toward the pointer for a parallax feel.
 */
export function FloatingGeometry({ pointer, variant = 'torus', scale = 1 }: FloatingGeometryProps) {
  const group = useRef<THREE.Group>(null);
  const wire = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) {
      const targetY = pointer.current.nx * 0.35;
      const targetX = -pointer.current.ny * 0.25;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    }
    if (wire.current) {
      wire.current.rotation.z += delta * 0.16;
      wire.current.rotation.x += delta * 0.08;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
      wire.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group} scale={scale}>
      {/* Central wireframe exhibit */}
      <mesh ref={wire} position={[0, 0, 0]}>
        {variant === 'torus' ? <torusKnotGeometry args={[1.25, 0.32, 160, 24]} /> : null}
        {variant === 'lattice' ? <icosahedronGeometry args={[1.7, 1]} /> : null}
        {variant === 'icosa' ? <octahedronGeometry args={[1.8, 0]} /> : null}
        <meshBasicMaterial color="#4F8CFF" wireframe transparent opacity={0.16} />
      </mesh>

      {/* Glossy accent spheres drifting around it */}
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.6}>
        <mesh position={[2.9, 1.1, -1.4]}>
          <sphereGeometry args={[0.42, 48, 48]} />
          <MeshDistortMaterial
            color="#4FE3E3"
            distort={0.32}
            speed={1.6}
            roughness={0.08}
            metalness={0.85}
            emissive="#0d3d54"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.9} floatIntensity={1.2}>
        <mesh position={[-3.1, -1.2, -0.6]}>
          <icosahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color="#A46BFF"
            roughness={0.15}
            metalness={0.9}
            emissive="#2a1150"
            emissiveIntensity={0.7}
          />
        </mesh>
      </Float>

      <Float speed={0.9} rotationIntensity={0.4} floatIntensity={2}>
        <mesh position={[2.1, -1.9, 1.1]} rotation={[0.6, 0.3, 0]}>
          <torusGeometry args={[0.44, 0.11, 24, 90]} />
          <meshStandardMaterial color="#4F8CFF" roughness={0.2} metalness={0.95} />
        </mesh>
      </Float>
    </group>
  );
}
