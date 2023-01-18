import { For } from "solid-js";
import { battingPositions, pitchingPositions } from "@assets/positions";
import type { Component } from "solid-js";
import { Position } from "@localtypes/types";
import { classNames } from "@utils/commonHelpers";
import RadioButton from "@components/RadioButton";

type PositionChoiceProps = {
  currentPosition?: Position | "0";
  onChange: (val: Position | "0") => void;
};

const PositionChoice: Component<PositionChoiceProps> = (props) => {
  return (
    <div class="bg-gray-800 p-3 flex space-x-3 items-center justify-around max-w-5xl mx-auto ">
      <div class="flex text-white">
        <h4 class="text-white">Choose Player Position:</h4>
      </div>
      <div class="space-x-3 flex items-center ">
        <h4 class="text-gray-200 font-medium">Batting</h4>
        <For each={battingPositions}>
          {(val) => (
            <RadioButton
              onClick={(value) =>
                value === props.currentPosition
                  ? props.onChange("0")
                  : props.onChange(value)
              }
              value={val}
              isActive={val === props.currentPosition}
            />
          )}
        </For>
      </div>
      <div class="flex space-x-3 items-center">
        <h4 class="text-gray-200 font-bold">Pitching</h4>
        <For each={pitchingPositions}>
          {(val) => (
            <RadioButton
              onClick={(value) =>
                value === props.currentPosition
                  ? props.onChange("0")
                  : props.onChange(value)
              }
              value={val}
              isActive={val === props.currentPosition}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default PositionChoice;
