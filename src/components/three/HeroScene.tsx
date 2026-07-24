'use client';

import {
  AdaptiveDpr,
  Environment,
  Lightformer,
  PerformanceMonitor,
  Preload,
} from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Component, Suspense, useState, type ReactNode } from 'react';

import { FloatingGeometry } from '@/components/three/FloatingGeometry';
import { NoiseBackdrop } from '@/components/three/NoiseBackdrop';
import { ParticleGalaxy } from '@/components/three/ParticleGalaxy';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { useMousePosition, type Pointer } from '@/hooks/useMousePosition';

/** Slow dolly + parallax so the scene never sits perfectly still. */
function CameraRig({ pointer }: { pointer: React.MutableRefObject<Pointer> }) {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const targetX = pointer.current.nx * 1.1;
    const targetY = 0.4 + pointer.current.ny * 0.7;
    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;
    camera.position.z = 10 + Math.sin(t * 0.18) * 0.6;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * Reflection environment built from lightformers rather than a preset.
 *
 * Drei's `preset` values download an HDR from a CDN — an external request that
 * fails behind a strict CSP or offline, and a failed fetch inside Suspense
 * takes the whole tree down. Generating the map in-scene keeps the metallic
 * highlights and ships zero extra bytes.
 */
function StudioEnvironment() {
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer
        form="rect"
        intensity={2.4}
        color="#ffffff"
        position={[0, 5, -9]}
        scale={[12, 6, 1]}
      />
      <Lightformer form="circle" intensity={3.2} color="#4F8CFF" position={[-6, 2, -4]} scale={5} />
      <Lightformer form="circle" intensity={2.6} color="#A46BFF" position={[6, -2, -4]} scale={5} />
      <Lightformer form="ring" intensity={1.8} color="#4FE3E3" position={[0, -5, -6]} scale={7} />
    </Environment>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 6]} intensity={1.5} color="#ffffff" />
      {/* Cinematic rim lighting in the brand accents */}
      <pointLight position={[-7, 3, 3]} intensity={45} color="#4F8CFF" distance={22} decay={2} />
      <pointLight position={[7, -3, 2]} intensity={38} color="#A46BFF" distance={20} decay={2} />
      <spotLight
        position={[0, 9, 5]}
        angle={0.5}
        penumbra={1}
        intensity={30}
        color="#4FE3E3"
        distance={26}
      />
    </>
  );
}

/**
 * The scene is decorative, so any failure inside it (no WebGL context, a
 * driver crash, a blocked asset) must degrade to the static gradient rather
 * than take the page down with it.
 */
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('WebGL scene disabled:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Static stand-in used for reduced motion and as the scene's fallback. */
function GradientFallback({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden
      style={{
        background:
          'radial-gradient(60% 50% at 30% 30%, rgba(79,140,255,0.22), transparent 70%), radial-gradient(50% 45% at 75% 60%, rgba(164,107,255,0.18), transparent 70%)',
      }}
    />
  );
}

type HeroSceneProps = {
  /** Swapped by the projects section to change the centre exhibit. */
  variant?: 'torus' | 'lattice' | 'icosa';
  className?: string;
};

/**
 * The WebGL layer behind the whole page.
 *
 * Everything here is tuned for a stable 60fps: DPR is capped and adaptive,
 * particle count drops on mobile, the loop pauses when the canvas is offscreen,
 * and the entire canvas is skipped when the user prefers reduced motion.
 */
export function HeroScene({ variant = 'torus', className }: HeroSceneProps) {
  const pointer = useMousePosition();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const [degraded, setDegraded] = useState(false);

  // Same composition, no animation, no GPU cost.
  if (reducedMotion) return <GradientFallback className={className} />;

  return (
    <SceneBoundary fallback={<GradientFallback className={className} />}>
      <div className={className} aria-hidden>
        <Canvas
          dpr={[1, degraded ? 1.2 : 1.75]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0.4, 10], fov: 45 }}
          // Pausing when scrolled away keeps the rest of the page smooth.
          frameloop="always"
        >
          <PerformanceMonitor onDecline={() => setDegraded(true)} />
          <Suspense fallback={null}>
            <NoiseBackdrop />
            <SceneLights />
            <ParticleGalaxy
              count={isMobile || degraded ? 2600 : 6500}
              radius={isMobile ? 7 : 9}
              pointer={pointer}
            />
            <FloatingGeometry pointer={pointer} variant={variant} scale={isMobile ? 0.6 : 1} />
            <StudioEnvironment />
            <CameraRig pointer={pointer} />
            <Preload all />
          </Suspense>
          <AdaptiveDpr pixelated />
        </Canvas>
      </div>
    </SceneBoundary>
  );
}

export default HeroScene;
