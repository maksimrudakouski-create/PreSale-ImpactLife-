declare module "vanta/dist/vanta.net.min" {
  type VantaEffect = {
    destroy: () => void;
  };

  type VantaNetOptions = {
    el: HTMLElement;
    THREE: typeof import("three");
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
    spacing: number;
    touchControls: boolean;
  };

  const createNet: (options: VantaNetOptions) => VantaEffect;

  export default createNet;
}
