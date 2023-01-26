import { Component, For } from "solid-js";
import { battingPositions, pitchingPositions } from "@assets/positions";
import { Position } from "@localtypes/types";
import RadioButton from "@components/RadioButton";
import Checkbox from "@components/Checkbox";

type PositionChoiceProps =
  | (
      | {
          currentPosition: Position | "0" | "batters" | "pitchers";
          onChange: (val: Position | "0" | "batters" | "pitchers") => void;
          allowMultiple?: false;
        }
      | {
          currentPosition?: (Position | "0" | "batters" | "pitchers")[];
          onChange: (
            isChecked: boolean,
            value: Position | "0" | "batters" | "pitchers"
          ) => void;
          allowMultiple: true;
        }
    ) & { withAll?: boolean };

const PositionChoice: Component<PositionChoiceProps> = (props) => {
  return (
    <>
      {" "}
      <div class="space-x-3 flex lg:flex-nowrap basis-full lg:basis-auto lg:flex-1 items-start">
        <h4 class="text-gray-200 font-medium h-full w-16 mt-2.5 lg:w-auto">
          Batting
        </h4>
        <div class="h-full flex flex-wrap flex-1">
          <For each={battingPositions.concat(props.withAll ? "All" : [])}>
            {(val) =>
              !props.allowMultiple ? (
                <RadioButton
                  onClick={(value) =>
                    value === props.currentPosition
                      ? props.onChange("0")
                      : props.onChange(value)
                  }
                  name="position"
                  class="mr-1 mb-1 basis-11"
                  value={val === "All" ? "batters" : val}
                  isActive={val === props.currentPosition}
                />
              ) : (
                <Checkbox
                  label={val}
                  onChange={props.onChange}
                  name="position"
                  class="mr-1 mb-1 basis-11"
                  value={val === "All" ? "batters" : val}
                  isChecked={props.currentPosition?.some?.(
                    (entry) =>
                      entry === val || (val === "All" && entry === "batters")
                  )}
                />
              )
            }
          </For>
        </div>
      </div>
      <div class="flex space-x-3 lg:flex-nowrap items-start basis-full lg:basis-auto flex-1 mt-2 lg:mt-0">
        <h4 class="text-gray-200 font-medium h-full w-16 mt-2.5 lg:w-auto">
          Pitching
        </h4>
        <div class="flex-1 flex flex-wrap">
          <For each={pitchingPositions.concat(props.withAll ? "All" : [])}>
            {(val) =>
              !props.allowMultiple ? (
                <RadioButton
                  onClick={(value) =>
                    value === props.currentPosition
                      ? props.onChange("0")
                      : props.onChange(value)
                  }
                  name="position"
                  class="mr-1 mb-1 basis-11"
                  value={val === "All" ? "pitchers" : val}
                  isActive={val === props.currentPosition}
                />
              ) : (
                <Checkbox
                  label={val}
                  onChange={props.onChange}
                  name="position"
                  class="mr-1 mb-1 basis-11"
                  value={val === "All" ? "pitchers" : val}
                  isChecked={props.currentPosition?.some?.(
                    (entry) =>
                      entry === val || (val === "All" && entry === "pitchers")
                  )}
                />
              )
            }
          </For>
        </div>
      </div>
    </>
  );
};

export default PositionChoice;
