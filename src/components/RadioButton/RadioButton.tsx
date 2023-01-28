import { classNames } from "@utils/commonHelpers";

type RadioButtonProps<T extends string | number | boolean> = {
  isActive?: boolean;
  onClick?: (val: T) => void;
  value: T;
  label?: string;
  class?: string;
  name?: string;
  disabled?: boolean;
};

const RadioButton = <T extends string | number | boolean>(
  props: RadioButtonProps<T>
) => {
  return (
    <label
      class={classNames(
        "border py-3 px-3 flex items-center justify-center text-sm font-medium cursor-pointer focus:outline-blue:200 ",
        props.isActive ? "bg-gray-400 text-gray-700" : "bg-gray-600 text-white",
        props.disabled ? "bg-gray-700 text-gray-300 cursor-not-allowed" : "",
        props.class
      )}
    >
      <input
        disabled={props.disabled}
        name={props.name}
        type="radio"
        class="sr-only"
        aria-labelledby={`${props.value}Picker`}
        onClick={() => props.onClick(props.value)}
      />
      <span id={`${props.value}Picker`}>{props.label || props.value}</span>
    </label>
  );
};

export default RadioButton;
