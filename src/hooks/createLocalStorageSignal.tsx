import { createEffect, createSignal, Signal } from "solid-js";

function createLocalStorageSignal<T>(
  localStorageKey: string,
  initState: T
): Signal<T> {
  const [state, setState] = createSignal(initState);
  const currentValue = localStorage.getItem(localStorageKey);
  if (currentValue) {
    try {
      setState(JSON.parse(localStorage.getItem(localStorageKey)));
    } catch (error) {
      setState(() => initState);
    }
  } else {
    setState(() => initState);
  }

  createEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(state()));
  });

  return [state, setState];
}

export default createLocalStorageSignal;
