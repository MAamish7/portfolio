'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import type { Pointer } from '@/hooks/useMousePosition';

type ParticleGalaxyProps = {
  count?: number;
  radius?: number;
  pointer: React.MutableRefObject<Pointer>;
};

/**
 * A spiral-arm particle field rendered as a single Points object.
 *
 * Positions and colours are baked once into buffer attributes; per-frame work
 * is limited to rotating the group and easing it toward the pointer, so the
 * cost stays flat regardless of particle count.
 */
export function ParticleGalaxy({ count = 6000, radius = 9, pointer }: ParticleGalaxyProps) {
  const points = useRef<THREE.Points>(null);

  const { positions, colors, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const inner = new THREE.Color('#4FE3E3');
    const mid = new THREE.Color('#4F8CFF');
    const outer = new THREE.Color('#A46BFF');
    const branches = 4;
    const spin = 1.15;
    const randomness = 0.55;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 0.7) * radius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = r * spin;

      // Randomness biased toward the galactic plane so the disc stays readable.
      const rand = () =>
        Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      positions[i3] = Math.cos(branchAngle + spinAngle) * r + rand();
      positions[i3 + 1] = rand() * 0.4;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + rand();

      const t = r / radius;
      const color = inner
        .clone()
        .lerp(mid, Math.min(t * 1.6, 1))
        .lerp(outer, Math.max(t - 0.45, 0) * 1.8);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      scales[i] = Math.random() * 0.8 + 0.2;
    }

    return { positions, colors, scales };
  }, [count, radius]);

  useFrame((state, delta) => {
    const group = points.current;
    if (!group) return;

    group.rotation.y += delta * 0.045;
    // Ease toward the pointer rather than snapping — reads as camera drift.
    const targetX = pointer.current.ny * 0.22 - 0.32;
    const targetZ = pointer.current.nx * 0.12;
    group.rotation.x += (targetX - group.rotation.x) * 0.035;
    group.rotation.z += (targetZ - group.rotation.z) * 0.035;
    group.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.18;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
