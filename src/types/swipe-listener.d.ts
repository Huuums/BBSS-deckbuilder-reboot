declare module "swipe-listener" {
  interface SwipeInterface {
    off: () => void;
  }

  function SwipeListener(
    element: HTMLElement,
    options?: {
      deltaHorizontal?: number; // Minimum number of pixels traveled to count as a horizontal swipe.
      deltaVertical?: number; // Minimum number of pixels traveled to count as a vertical swipe.
      lockAxis?: boolean; // Delta for horizontal swipe
      minHorizontal?: number; // Delta for vertical swipe
      minVertical?: number; // Prevents scrolling when swiping.
      mouse?: boolean; // Select only one axis to be true instead of multiple.
      preventScroll?: boolean; // Listen for touch events
      touch?: boolean; // Listen for mouse events
    }
  ): SwipeInterface | undefined;

  export = SwipeListener;
}
