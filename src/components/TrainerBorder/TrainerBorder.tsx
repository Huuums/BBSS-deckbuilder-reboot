import { Rarity } from "@localtypes/types";
import { classNames } from "@utils/commonHelpers";
import type { ParentComponent } from "solid-js";

type TrainerBorderProps = {
  withGlow?: boolean;
  rarity: Rarity;
  class?: string;
};

const glowDisabled = false;

const getBgGradientColorClass = (rarity: Rarity) => {
  switch (rarity) {
    case "N":
      return "trainer-border-N";
    case "R":
      return "trainer-border-R";
    case "SR":
      return "trainer-border-SR";
    case "SSR":
      return "trainer-border-SSR";
    case "UR":
      return "trainer-border-UR";
  }
};

const TrainerBorder: ParentComponent<TrainerBorderProps> = (props) => {
  return (
    <div
      class={classNames(
        "relative border-4",
        getBgGradientColorClass(props.rarity),
        props.class
      )}
    >
      {props.withGlow && (
        <div
          class={classNames(
            "m-[-4px] absolute top-0 bottom-0 left-0 right-0",
            props.rarity,
            !glowDisabled ? "trainer-glow" : ""
          )}
        />
      )}
      {props.children}
    </div>
  );
};

export default TrainerBorder;
