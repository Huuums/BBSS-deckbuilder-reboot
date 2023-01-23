import { Accessor, onCleanup } from "solid-js";

export default function pressedESC(
  el: HTMLElement,
  callback: Accessor<() => void>
) {
  const onkeyup = (e: KeyboardEvent) => e.key === "Escape" && callback()?.();
  el.addEventListener("keyup", onkeyup);

  onCleanup(() => document.body.removeEventListener("onkeyup", onkeyup));
}

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      // use:model
      pressedESCDirective: () => unknown;
    }
  }
}
