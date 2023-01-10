import { DeckTrainer, Rarity, Trainer as TrainerType } from "@localtypes/types";
import { Component } from "solid-js";

import TrainerPosition from "@components/TrainerPosition";
import TrainerBorder from "@components/TrainerBorder";
import TrainerAvatar from "@components/TrainerAvatar";
import TrainerStatsType from "@components/TrainerStatsType";
import TrainerUpgradeSelector from "@components/TrainerUpgradeSelector";
import { classNames } from "@utils/commonHelpers";

type TrainerProps = TrainerType & {
  src: string;
  onClickAvatar: (trainer: DeckTrainer) => void;
  trainerDeckIndex?: number;
  class?: string;
  cannotAddTrainer?: boolean;
};

const getBorderRarityClass = (rarity: Rarity) => {
  switch (rarity) {
    case "N":
      return "border-rarity-N";
    case "R":
      return "border-rarity-R";
    case "SR":
      return "border-rarity-SR";
    case "SSR":
      return "border-rarity-SSR";
    case "UR":
      return "border-rarity-UR";
  }
};

const getBackgroundAndTextRarityClass = (rarity: Rarity) => {
  switch (rarity) {
    case "N":
      return "bg-rarity-N text-gray-100";
    case "R":
      return "bg-rarity-R text-gray-100";
    case "SR":
      return "bg-rarity-SR text-gray-100";
    case "SSR":
      return "bg-rarity-SSR text-gray-100";
    case "UR":
      return "bg-rarity-UR text-gray-900";
  }
};

const Trainer: Component<TrainerProps> = (props) => {
  return (
    <TrainerBorder withGlow rarity={props.rarity} class={props.class}>
      <TrainerAvatar
        name={props.name}
        src={props.src}
        onClick={() => props.onClickAvatar(props.name)}
        disabled={props.cannotAddTrainer}
        trainerDeckIndex={props.trainerDeckIndex}
      />
      <div class="bg-gray-200 h-8 relative flex justify-between items-center">
        <TrainerStatsType type={props.type} />
        <TrainerPosition position={props.position} class="mr-1 inline-flex" />
      </div>
      <TrainerUpgradeSelector
        onChange={(stars) => console.log(stars, props.name)}
        activeUpgrade={2}
        class="bg-gray-700 relative"
      />
      <div class="relative bg-gray-800 text-gray-200 font-semibold flex justify-between flex-wrap">
        <div class="basis-full flex">
          <button
            class={classNames(
              "flex justify-center p-0.5 basis-1/2 items-center text-xs py-1",
              getBackgroundAndTextRarityClass(props.rarity),
              "basis-1/2"
            )}
            onClick={() => null /*togglePotentialSelection(props.name)*/}
          >
            Potential
          </button>

          <button
            class={classNames(
              "flex text-gray-300 justify-center items-center text-center text-xs py-1",
              "basis-1/2"
            )}
            onClick={() => null /*showTrainerInfo(props.name) */}
          >
            Details
          </button>
        </div>
        <h3
          class={classNames(
            "border-t border-rarity-UR basis-full text-ellipsis overflow-hidden whitespace-nowrap p-1",
            getBorderRarityClass(props.rarity)
          )}
        >
          {props.name}
        </h3>
      </div>
    </TrainerBorder>
  );
};

export default Trainer;
