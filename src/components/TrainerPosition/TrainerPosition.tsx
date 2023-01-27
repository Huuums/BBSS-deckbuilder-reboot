import { BattingPosition, PitchingPosition } from "@localtypes/types";
import { Component, createMemo, mergeProps } from "solid-js";
import { pitchingPositions } from "@assets/positions";
import { classNames } from "@utils/commonHelpers";
import batterIcon from "@assets/images/common/batter.png";
import pitcherIcon from "@assets/images/common/pitcher.png";

type TrainerPositionProps = {
  position: BattingPosition | PitchingPosition;
  class?: string;
  large?: boolean;
};

const TrainerPosition: Component<TrainerPositionProps> = (props) => {
  const newProps = mergeProps({ class: "inline-flex" }, props);

  const isPitcher = createMemo(() =>
    pitchingPositions.some((val) => val === newProps.position)
  );

  return (
    <div
      class={classNames(
        isPitcher() ? "bg-custom-pitching" : "bg-custom-batting",
        props.large ? "w-12 py-1" : "w-10",
        "rounded-xl justify-center items-center",
        newProps.class
      )}
    >
      <img
        class={classNames("mr-0.5 ", props.large ? "h-4 w-4" : "h-3.5 w-3.5")}
        src={isPitcher() ? pitcherIcon : batterIcon}
      />
      <span class="text-sm font-semibold">{newProps.position}</span>
    </div>
  );
};

export default TrainerPosition;
