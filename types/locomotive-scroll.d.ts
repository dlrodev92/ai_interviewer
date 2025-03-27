declare module 'locomotive-scroll' {
  export interface LocomotiveScrollOptions {
    el?: HTMLElement;
    smooth?: boolean;
    multiplier?: number;
    class?: string;
    reloadOnContextChange?: boolean;
    touchMultiplier?: number;
    smoothMobile?: boolean;
  }

  interface ScrollInstance {
    scroll: {
      y: number;
    };
  }

  export default class LocomotiveScroll {
    constructor(options: LocomotiveScrollOptions);
    destroy(): void;
    scrollTo(x: number, y: number, duration: number): void;
    update(): void;
    scroll: {
      instance: ScrollInstance;
    };
  }
}
