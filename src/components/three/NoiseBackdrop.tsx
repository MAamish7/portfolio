'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural aurora backdrop.
 *
 * A single full-screen quad running value-noise fbm in the fragment shader —
 * it gives the scene depth and colour without any texture downloads.
 */
export function NoiseBackdrop() {
  const material = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#4F8CFF') },
      uColorB: { value: new THREE.Color('#A46BFF') },
      uColorC: { value: new THREE.Color('#4FE3E3') },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += delta * 0.12;
  });

  return (
    <mesh position={[0, 0, -9]} scale={[34, 20, 1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={
          /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorC;

          // Cheap hash-based value noise + 4-octave fbm.
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }

          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 4; i++) {
              value += amplitude * noise(p);
              p *= 2.03;
              amplitude *= 0.5;
            }
            return value;
          }

          void main() {
            vec2 uv = vUv;
            vec2 p = uv * 3.0;
            float n = fbm(p + vec2(uTime * 0.35, uTime * 0.18));
            float n2 = fbm(p * 1.7 - vec2(uTime * 0.22, uTime * 0.31));

            vec3 color = mix(uColorA, uColorB, smoothstep(0.25, 0.85, n));
            color = mix(color, uColorC, smoothstep(0.45, 0.95, n2) * 0.55);

            // Vignette so the glow stays behind the type instead of washing it out.
            float vignette = smoothstep(1.05, 0.15, length(uv - 0.5) * 1.7);
            float intensity = pow(n * n2, 1.4) * vignette;

            gl_FragColor = vec4(color * intensity * 2.4, intensity * 0.5);
          }
        `
        }
      />
    </mesh>
  );
}
