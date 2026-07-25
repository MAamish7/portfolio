import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  className?: string;
  /** Classes for the media itself, so the caller controls object-fit/position. */
  mediaClassName?: string;
  /** Stop capturing after this many frames — caps memory on long clips. */
  maxFrames?: number;
  /** Longest capture window before giving up and looping the video natively. */
  captureTimeoutMs?: number;
};

/**
 * Plays a video as a seamless boomerang.
 *
 * The clip is played through once while every decoded frame is copied into an
 * offscreen canvas; once enough frames exist the video is swapped for a canvas
 * that replays them forward then backward at 30fps, so the loop never cuts.
 *
 * If capture cannot finish — a decode error, a slow network, a browser without
 * canvas access to the media — the component falls back to the plain `<video>`
 * with native looping, so the background always shows something.
 */
export default function BoomerangVideoBg({
  src,
  className,
  mediaClassName,
  maxFrames = 180,
  captureTimeoutMs = 20000,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [framesReady, setFramesReady] = useState(false);
  const framesRef = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Honour reduced-motion: leave the video paused on its first frame and
    // never spin up the capture loop.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      video.loop = false;
      video.pause();
      return;
    }

    const frames: HTMLCanvasElement[] = [];
    let capturing = true;
    let lastTime = -1;
    const MAX_WIDTH = 960;

    /** Two frames are the minimum for a boomerang to mean anything. */
    const finishCapture = () => {
      if (!capturing) return;
      capturing = false;
      if (frames.length > 1) {
        framesRef.current = frames;
        setFramesReady(true);
      } else {
        // Nothing usable — let the element loop on its own.
        video.loop = true;
        void video.play().catch(() => {});
      }
    };

    const captureFrame = () => {
      if (!capturing || video.readyState < 2) return;
      if (video.currentTime === lastTime) return;
      lastTime = video.currentTime;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      const scale = Math.min(1, MAX_WIDTH / vw);
      const w = Math.round(vw * scale);
      const h = Math.round(vh * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      try {
        ctx.drawImage(video, 0, 0, w, h);
      } catch {
        // Some browsers refuse to draw protected media; fall back gracefully.
        finishCapture();
        return;
      }
      frames.push(canvas);

      if (frames.length >= maxFrames) finishCapture();
    };

    type VFCVideo = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
    };
    const vfcVideo = video as VFCVideo;
    const hasVFC = typeof vfcVideo.requestVideoFrameCallback === 'function';

    let rafId = 0;
    const rafLoop = () => {
      captureFrame();
      if (capturing) rafId = requestAnimationFrame(rafLoop);
    };

    const vfcLoop = () => {
      captureFrame();
      if (capturing && vfcVideo.requestVideoFrameCallback) {
        vfcVideo.requestVideoFrameCallback(vfcLoop);
      }
    };

    let started = false;
    const onLoaded = () => {
      if (started) return;
      started = true;
      void video.play().catch(() => {});
      if (hasVFC) {
        vfcVideo.requestVideoFrameCallback!(vfcLoop);
      } else {
        rafId = requestAnimationFrame(rafLoop);
      }
    };

    const onError = () => finishCapture();

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('ended', finishCapture);
    video.addEventListener('error', onError);
    if (video.readyState >= 1) onLoaded();

    // Backstop: never leave the visitor staring at a stalled first frame.
    const timeout = window.setTimeout(finishCapture, captureTimeoutMs);

    return () => {
      capturing = false;
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeout);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('ended', finishCapture);
      video.removeEventListener('error', onError);
    };
  }, [src, maxFrames, captureTimeoutMs]);

  useEffect(() => {
    if (!framesReady) return;
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const frames = framesRef.current;
    if (frames.length === 0) return;

    const first = frames[0];
    canvas.width = first.width;
    canvas.height = first.height;

    let index = 0;
    let direction = 1;
    let last = performance.now();
    const interval = 1000 / 30;
    let rafId = 0;

    const render = (now: number) => {
      if (now - last >= interval) {
        last = now;
        ctx.drawImage(frames[index], 0, 0);
        index += direction;
        // Bounce at both ends rather than wrapping, which is what removes the cut.
        if (index >= frames.length - 1) {
          index = frames.length - 1;
          direction = -1;
        } else if (index <= 0) {
          index = 0;
          direction = 1;
        }
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [framesReady]);

  // Release the captured frames when the component goes away.
  useEffect(
    () => () => {
      framesRef.current = [];
    },
    [],
  );

  return (
    <div className={className ?? 'absolute inset-0 h-full w-full'} aria-hidden>
      <video
        ref={videoRef}
        src={src}
        className={mediaClassName ?? 'h-full w-full object-cover'}
        style={{ display: framesReady ? 'none' : 'block' }}
        autoPlay
        muted
        playsInline
        preload="auto"
      />
      <canvas
        ref={displayCanvasRef}
        className={mediaClassName ?? 'h-full w-full object-cover'}
        style={{ display: framesReady ? 'block' : 'none' }}
      />
    </div>
  );
}
