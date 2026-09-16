import { useEffect, useRef } from "react";

type VantaEffect = {
  destroy: () => void;
};

type VantaNetFactory = (options: {
  el: HTMLElement;
  THREE: typeof import("three");
  backgroundAlpha: number;
  backgroundColor: number;
  color: number;
  gyroControls: boolean;
  maxDistance: number;
  minHeight: number;
  minWidth: number;
  mouseControls: boolean;
  points: number;
  scale: number;
  scaleMobile: number;
  showDots: boolean;
  spacing: number;
  touchControls: boolean;
}) => VantaEffect;

type NetworkPoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const POINTS_PER_LAYER = 10;
const FALLBACK_POINT_COUNT = POINTS_PER_LAYER * POINTS_PER_LAYER;
const VANTA_MAX_DISTANCE = 20;
const FALLBACK_PARALLAX_DISTANCE = 16;

/** Canvas fallback that keeps the Net interaction available without WebGL. */
function InteractiveNetworkFallback() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!canvas || !context || reducedMotion.matches) return;

    const networkColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--vanta-net-color")
      .trim();
    const points: NetworkPoint[] = [];
    const pointer = { x: -1000, y: -1000 };
    const parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const createPoint = (): NetworkPoint => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
    });

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      while (points.length < FALLBACK_POINT_COUNT) points.push(createPoint());
      points.forEach((point) => {
        point.x = Math.min(point.x, width);
        point.y = Math.min(point.y, height);
      });
    };

    const updatePoint = (point: NetworkPoint) => {
      const pointerDistance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
      if (pointerDistance < 180) {
        point.vx += ((point.x - pointer.x) / pointerDistance) * 0.018;
        point.vy += ((point.y - pointer.y) / pointerDistance) * 0.018;
      }

      point.x += point.vx;
      point.y += point.vy;
      point.vx *= 0.994;
      point.vy *= 0.994;

      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;
      point.x = Math.max(0, Math.min(width, point.x));
      point.y = Math.max(0, Math.min(height, point.y));
    };

    const draw = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, width, height);
      parallax.x += (parallax.targetX - parallax.x) * 0.04;
      parallax.y += (parallax.targetY - parallax.y) * 0.04;
      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        parallax.x * pixelRatio,
        parallax.y * pixelRatio,
      );
      points.forEach(updatePoint);

      context.fillStyle = networkColor;
      context.globalAlpha = 0.8;
      points.forEach((point) => {
        context.beginPath();
        context.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(draw);
    };

    const trackPointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      parallax.targetX = ((pointer.x / width) - 0.5) * FALLBACK_PARALLAX_DISTANCE;
      parallax.targetY = ((pointer.y / height) - 0.5) * FALLBACK_PARALLAX_DISTANCE;
    };

    const resetParallax = () => {
      parallax.targetX = 0;
      parallax.targetY = 0;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", trackPointer);
    window.addEventListener("blur", resetParallax);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("blur", resetParallax);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 size-full" />;
}

/** Decorative Vanta Net canvas. It fails safely to a static background. */
export function VantaNetBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!container || reducedMotion.matches || typeof window.WebGLRenderingContext === "undefined") {
      return;
    }

    let cancelled = false;
    let effect: VantaEffect | undefined;

    void Promise.all([import("vanta/dist/vanta.net.min"), import("three")])
      .then(([netModule, three]) => {
        if (cancelled) return;

        const createNet = netModule.default as VantaNetFactory;
        effect = createNet({
          el: container,
          THREE: three,
          backgroundAlpha: 1,
          backgroundColor: 16777215,
          color: 16727937,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          points: POINTS_PER_LAYER,
          maxDistance: VANTA_MAX_DISTANCE,
          showDots: true,
          spacing: 15,
        });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      effect?.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className="vanta-net-fallback pointer-events-none absolute inset-0 overflow-hidden">
      <InteractiveNetworkFallback />
    </div>
  );
}
