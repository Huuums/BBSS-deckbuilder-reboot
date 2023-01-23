import { Accessor, onCleanup } from "solid-js";
import SwipeListener from "swipe-listener";

export function swipeLeft(
  el: HTMLElement,
  accessor: Accessor<(e: HTMLElement) => void>
) {
  const onSwipe = (e) =>
    e.detail.directions.left && accessor()?.(e.detail.target);
  const listener = SwipeListener(el, {
    minHorizontal: 75,
    deltaHorizontal: 100,
  });
  el.addEventListener("swipe", onSwipe);

  onCleanup(() => {
    listener.off();
    el.removeEventListener("swipe", onSwipe);
  });
}

export function swipeRight(
  el: HTMLElement,
  accessor: Accessor<(e: HTMLElement) => void>
) {
  const onSwipe = (e) =>
    e.detail.directions.right && accessor()?.(e.detail.target);
  const listener = SwipeListener(el, {
    minHorizontal: 75,
    deltaHorizontal: 100,
  });
  el.addEventListener("swipe", onSwipe);

  onCleanup(() => {
    listener.off();
    el.removeEventListener("swipe", onSwipe);
  });
}

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      swipeLeftDirective: (e: HTMLElement) => unknown;
      swipeRightDirective: (e: HTMLElement) => unknown;
    }
  }
}
