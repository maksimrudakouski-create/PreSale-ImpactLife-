const PARTICLE_COUNT = 20;

/** Decorative CSS-only bokeh field for calm access screens. */
export function AnimatedBokehBackground() {
  return (
    <div aria-hidden="true" className="login-bokeh pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}
