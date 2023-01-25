import { Accessor, onCleanup } from "solid-js";

export default function pressedESC(
  el: HTMLElement,
  callback: Accessor<() => void>
) {
  const onkeydown = (e: KeyboardEvent) => {
    console.log(el, e.defaultPrevented);
    if (e.key === "Escape") callback()?.();
    return false;
  };
  el.addEventListener("keydown", onkeydown);

  onCleanup(() => el.removeEventListener("onkeydown", onkeydown));
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
