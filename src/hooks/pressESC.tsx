import { onCleanup } from "solid-js";

export default function pressedESC(el, accessor) {
  const onkeyup = (e: KeyboardEvent) => e.key === "Escape" && accessor()?.();
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
