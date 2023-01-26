import type { JSX } from "solid-js";
import { Accessor, onCleanup } from "solid-js";

export default function clickOutside(
  el: HTMLElement,
  callback: Accessor<JSX.EventHandler<HTMLElement, MouseEvent>>
) {
  const onClick: JSX.EventHandler<HTMLElement, MouseEvent> = (e) =>
    !el.contains(e.target) && callback()?.(e);
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      // use:model
      clickOutsideDirective: JSX.EventHandler<HTMLElement, MouseEvent>;
    }
  }
}
