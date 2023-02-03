import { Component, For } from "solid-js";
import { battingPositions, pitchingPositions } from "@assets/positions";
import { Position } from "@localtypes/types";
import RadioButton from "@components/RadioButton";

type PositionChoiceProps = {
  currentPosition: Position | "0";
  onChange: (val: Position | "0") => void;
};

const PositionChoice: Component<PositionChoiceProps> = (props) => {
  return (
    <>
      {" "}
      <div class="space-x-3 flex lg:flex-nowrap basis-full lg:basis-auto lg:flex-1 items-start">
        <h4 class="text-gray-200 font-medium h-full w-16 mt-2.5 ">Batting</h4>
        <div class="h-full flex flex-wrap flex-1">
          <For each={battingPositions}>
            {(val) => (
              <RadioButton
                onClick={(value) =>
                  value === props.currentPosition
                    ? props.onChange("0")
                    : props.onChange(value)
                }
                name="position"
                class="mr-1 mb-1 basis-11"
                value={val}
                isActive={val === props.currentPosition}
              />
            )}
          </For>
        </div>
      </div>
      <div class="flex space-x-3 lg:flex-nowrap items-start basis-full lg:basis-auto flex-1 mt-2 lg:mt-0">
        <h4 class="text-gray-200 font-medium h-full w-16 mt-2.5">Pitching</h4>
        <div class="flex-1 flex flex-wrap">
          <For each={pitchingPositions}>
            {(val) => (
              <RadioButton
                onClick={(value) =>
                  value === props.currentPosition
                    ? props.onChange("0")
                    : props.onChange(value)
                }
                name="position"
                class="mr-1 mb-1 basis-11"
                value={val}
                isActive={val === props.currentPosition}
              />
            )}
          </For>
        </div>
      </div>
    </>
  );
};

export default PositionChoice;
