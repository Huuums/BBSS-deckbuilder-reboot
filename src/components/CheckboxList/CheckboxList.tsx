import { For, JSX } from "solid-js";
import Checkbox from "@components/Checkbox/Checkbox";
import { classNames } from "@utils/commonHelpers";

type CheckboxListProps<T> = {
  label: string;
  checkboxLabel: (val: T) => JSX.Element;
  options: T[];
  onChange: (isChecked: boolean, val: T) => void;
  checkboxIsChecked: (val: T) => boolean;
  class?: string;
  checkboxClass?: string;
};

const CheckboxList = <T extends object | string>(
  props: CheckboxListProps<T>
) => {
  return (
    <div
      class={classNames(
        "lg:flex-nowrap items-center basis-full lg:basis-auto flex-1 mt-2 lg:mt-0",
        props.class
      )}
    >
      <label class="text-gray-200 font-medium lg:w-auto">{props.label}</label>
      <div class="flex flex-wrap flex-1">
        <For each={props.options}>
          {(val) => (
            <Checkbox
              label={props.checkboxLabel(val)}
              onChange={props.onChange}
              name="position"
              class={classNames("mr-1 mb-1 select-none", props.checkboxClass)}
              value={val}
              isChecked={props.checkboxIsChecked(val)}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default CheckboxList;
