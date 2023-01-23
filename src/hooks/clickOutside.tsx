import { Accessor, onCleanup } from "solid-js";

export default function clickOutside(
  el: HTMLElement,
  callback: Accessor<() => void>
) {
  const onClick = (e) => !el.contains(e.target) && callback()?.();
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      // use:model
      clickOutsideDirective: () => unknown;
    }
  }
}
