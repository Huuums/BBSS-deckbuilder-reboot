import { classNames } from "@utils/commonHelpers";
import type { Component, JSX } from "solid-js";

type CheckboxProps = {
  class: string;
  isChecked?: boolean;
  name?: string;
  value: unknown;
  label: string | JSX.Element;
  onChange: (isChecked: boolean, value: unknown) => void;
};

const Checkbox: Component<CheckboxProps> = (props) => {
  return (
    <label
      class={classNames(
        "border px-1.5 py-2 flex items-center justify-center text-xs font-medium cursor-pointer focus-within:ring-2 focus-within:ring-blue-400",
        props.isChecked
          ? "bg-gray-400 text-gray-700"
          : "bg-gray-600 text-white",
        props.class
      )}
    >
      <input
        name={props.name}
        type="checkbox"
        checked={props.isChecked}
        class="sr-only"
        aria-labelledby={`${props.value}Picker`}
        onChange={(e) => props.onChange(e.currentTarget.checked, props.value)}
      />
      <span id={`${props.value}Picker`}>{props.label}</span>
    </label>
  );
};

export default Checkbox;
