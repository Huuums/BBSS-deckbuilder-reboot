import clickOutside from "@hooks/clickOutside";
import { classNames } from "@utils/commonHelpers";
import { HiOutlineSearch } from "solid-icons/hi";
import { For, createSignal, JSX, createEffect, Switch, Match } from "solid-js";

//don't remove this.
//eslint-disable-next-line
const clickOutsideDirective = clickOutside;

type ComboboxProps<T extends string | number | object> = {
  onChange?: (value: T | string, event) => void;
  onInput?: JSX.EventHandler<HTMLInputElement, Event>;
  options: T[];
  value?: T;
  valueDisplayText?: string;
  placeholder?: string;
  filterFn?: (value: T, i: number, arr: T[]) => boolean;
  optionIsDisabled?: (value: T) => boolean;
  optionLabel?: ((option: T) => JSX.Element) | keyof T;
  clearable?: boolean;
  icon?: JSX.Element;
};

const Combobox = <T extends string | number | object>(
  props: ComboboxProps<T>
) => {
  let input: HTMLInputElement;
  const optionRefs: [HTMLLIElement, boolean][] = [];

  const [highlightedIndex, setHighlightedIndex] = createSignal(null);
  const [isOpen, setIsOpen] = createSignal(false);
  const [searchValue, setSearchValue] = createSignal("");

  createEffect(() => {
    if (highlightedIndex() !== null) {
      optionRefs[highlightedIndex()][0].scrollIntoView(false);
    }
  });

  const getNextHighlightIndex = (prev: number | null, value: number | null) => {
    if (value === null) return null;
    if (prev === null && value < 0) {
      return optionRefs[optionRefs.length + value][1]
        ? getNextHighlightIndex(prev, value - 1)
        : props.options.length - 1;
    }
    if (prev === null && value > 0) {
      return optionRefs[-1 + value][1]
        ? getNextHighlightIndex(prev, value + 1)
        : -1 + value;
    }
    if (prev + value < 0 || prev + value > optionRefs.length - 1) return null;
    if (optionRefs[prev + value][1]) {
      return getNextHighlightIndex(prev, value > 0 ? value + 1 : value - 1);
    }
    return prev + value;
  };

  const updateHighlightedIndex = (value: 1 | -1 | null) => {
    setHighlightedIndex((prev) => getNextHighlightIndex(prev, value));
  };

  const options = () => {
    const filteredOptions = props.filterFn
      ? props.options.filter(props.filterFn)
      : props.options.filter((val) =>
          typeof val === "string"
            ? val.toLowerCase().includes(searchValue().toLowerCase())
            : true
        );

    if (props.clearable) {
      return (["-"] as T[]).concat(filteredOptions);
    }
    return filteredOptions;
  };

  const handleSpecialKeys: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    e
  ) => {
    switch (e.key) {
      case "ArrowDown":
        updateHighlightedIndex(1);
        break;
      case "ArrowUp":
        updateHighlightedIndex(-1);
        break;
      case "Enter":
        if (highlightedIndex() !== null) {
          if (options()[highlightedIndex()] === "-") {
            props.onChange("", e);
          } else {
            props.onChange(options()[highlightedIndex()], e);
          }
          setIsOpen(false);
          return;
        }
        break;
      case "Escape":
        if (isOpen()) {
          e.stopPropagation();
        }
        setIsOpen(false);
        setSearchValue("");
    }
  };

  return (
    <div class="relative" use:clickOutsideDirective={() => setIsOpen(false)}>
      <div class="relative flex items-center bg-gray-900">
        {props.icon || (
          <HiOutlineSearch class="pointer-events-none ml-2 h-5 w-5 stroke-gray-500" />
        )}
        <input
          onFocus={() => setIsOpen(true)}
          onClick={() => (!isOpen() ? setIsOpen(true) : null)}
          ref={input}
          value={isOpen() ? searchValue() : props.valueDisplayText || ""}
          type="text"
          class="h-12 w-full border-0 bg-transparent pl-4 pr-4 text-white  placeholder-gray-500 focus:ring-0 sm:text-sm"
          placeholder={props.placeholder}
          onInput={(e) => {
            setSearchValue(e.currentTarget.value);
            if (!isOpen()) setIsOpen(true);
            props.onInput?.(e);
          }}
          on:keydown={(e) => {
            handleSpecialKeys(e);
          }}
        />
      </div>
      <ul
        class={classNames(
          "text-sm text-gray-400 absolute z-20 left-0 right-0 bg-gray-900 shadow-2xl max-h-[250px] overflow-auto",
          !isOpen() ? "hidden" : ""
        )}
      >
        <For each={options()}>
          {(option: T, i) => (
            <li
              ref={(el) => {
                optionRefs[i()] = [el, props.optionIsDisabled?.(option)];
              }}
              role="button"
              aria-disabled={props.optionIsDisabled?.(option)}
              onClick={(e) => {
                if (
                  option !== props.value &&
                  !props.optionIsDisabled?.(option)
                ) {
                  if (option === "-") {
                    props.onChange?.("", e);
                  } else {
                    props.onChange?.(option, e);
                  }
                  setIsOpen(false);
                }
              }}
              class={classNames(
                "group flex cursor-default select-none items-center px-3 py-2 ",
                i() === highlightedIndex() || props.value === option
                  ? "bg-gray-800 text-white"
                  : "",
                props.optionIsDisabled?.(option) && props.value !== option
                  ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-800 hover:text-white"
              )}
            >
              <Switch>
                <Match when={typeof option === "function"}>
                  {(props.optionLabel as (val: T) => JSX.Element)?.(option)}
                </Match>
                <Match when={typeof option === "string"}>
                  <span class="ml-3 flex-auto truncate">
                    {option as string}
                  </span>
                </Match>
                <Match when={typeof option === "number"}>
                  <span class="ml-3 flex-auto truncate">
                    {option.toString()}
                  </span>
                </Match>
              </Switch>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default Combobox;
