import { classNames } from "@utils/commonHelpers";

type RadioButtonProps<T extends string | number> = {
  isActive?: boolean;
  onClick?: (val: T) => void;
  value: T;
  label?: string;
  class?: string;
};

const RadioButton = <T extends string | number>(props: RadioButtonProps<T>) => {
  return (
    <label
      class={classNames(
        "border py-3 px-3 flex items-center flex-1 justify-center text-sm font-medium uppercase cursor-pointer focus:outline-none",
        props.isActive ? "bg-gray-400 text-gray-700" : "bg-gray-600 text-white",
        props.class
      )}
    >
      <input
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
