import { classNames } from "@utils/commonHelpers";

type RadioButtonProps<T extends string | number> = {
  isActive?: boolean;
  onClick?: (val: T) => void;
  value: T;
  label?: string;
  class?: string;
  name?: string;
};

const RadioButton = <T extends string | number>(props: RadioButtonProps<T>) => {
  return (
    <label
      class={classNames(
        "border py-3 px-3 flex items-center justify-center text-sm font-medium cursor-pointer focus:outline-blue:200 ",
        props.isActive ? "bg-gray-400 text-gray-700" : "bg-gray-600 text-white",
        props.class
      )}
    >
      <input
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
