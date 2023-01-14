import { RankLevels, Rarity, Trainer as TrainerType } from "@localtypes/types";
import { Component, JSX, Show } from "solid-js";

import TrainerPosition from "@components/TrainerPosition";
import TrainerBorder from "@components/TrainerBorder";
import TrainerAvatar from "@components/TrainerAvatar";
import TrainerStatsType from "@components/TrainerStatsType";
import TrainerUpgradeSelector from "@components/TrainerUpgradeSelector";
import { classNames } from "@utils/commonHelpers";

type TrainerProps = {
  src: string;
  onClickAvatar?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onMouseEnterAvatar?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onMouseLeaveAvatar?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onClickExchange?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onMouseEnterUpgradeSelector?: (stars: RankLevels) => void;
  onMouseLeaveUpgradeSelector?: () => void;
  trainerDeckIndex?: number;
  class?: string;
  cannotAddTrainer?: boolean;
  showButtonsOnAvatar?: boolean;
  trainer: TrainerType;
  onChange?: <K extends keyof TrainerType>(
    values: Record<K, TrainerType[K]>
  ) => void;
  markedForExchange?: boolean;
  imgClass?: string;
  onlyAvatarAndStars?: boolean;
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
    <Show
      when={props.onlyAvatarAndStars}
      fallback={
        <TrainerBorder
          withGlow
          rarity={props.trainer.rarity}
          class={props.class}
        >
          <TrainerAvatar
            imgClass={props.imgClass}
            name={props.trainer.name}
            src={props.src}
            onClickAvatar={(e) => props.onClickAvatar?.(e)}
            disabled={props.cannotAddTrainer}
            onMouseEnter={(e) => props.onMouseEnterAvatar?.(e)}
            onMouseLeave={(e) => props.onMouseLeaveAvatar?.(e)}
            trainerDeckIndex={props.trainerDeckIndex}
            showButtons={props.showButtonsOnAvatar}
            markedForExchange={props.markedForExchange}
            onClickExchange={(e) => props.onClickExchange(e)}
          />
          <div class="bg-gray-200 h-8 relative flex justify-between items-center">
            <TrainerStatsType type={props.trainer.type} />
            <TrainerPosition
              position={props.trainer.position}
              class="mr-1 inline-flex"
            />
          </div>
          <TrainerUpgradeSelector
            onChange={(stars) => props.onChange({ stars })}
            onMouseEnter={(stars) => props.onMouseEnterUpgradeSelector?.(stars)}
            onMouseLeave={() => props.onMouseLeaveUpgradeSelector?.()}
            activeUpgrade={props.trainer.stars}
            class="bg-gray-700 relative"
          />
          <div class="relative bg-gray-800 text-gray-200 font-semibold flex justify-between flex-wrap">
            <div class="basis-full flex">
              <button
                class={classNames(
                  "flex justify-center p-0.5 basis-1/2 items-center text-xs py-1",
                  getBackgroundAndTextRarityClass(props.trainer.rarity),
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
                getBorderRarityClass(props.trainer.rarity)
              )}
            >
              {props.trainer.name}
            </h3>
          </div>
        </TrainerBorder>
      }
    >
      <TrainerBorder withGlow rarity={props.trainer.rarity} class={props.class}>
        <TrainerAvatar
          name={props.trainer.name}
          src={props.src}
          onClickAvatar={(e) => props.onClickAvatar?.(e)}
          disabled={props.cannotAddTrainer}
          onMouseEnter={(e) => props.onMouseEnterAvatar?.(e)}
          onMouseLeave={(e) => props.onMouseLeaveAvatar?.(e)}
          trainerDeckIndex={props.trainerDeckIndex}
          showButtons={props.showButtonsOnAvatar}
          markedForExchange={props.markedForExchange}
          onClickExchange={(e) => props.onClickExchange(e)}
        />
        <TrainerUpgradeSelector
          onChange={(stars) => props.onChange({ stars })}
          onMouseEnter={(stars) => props.onMouseEnterUpgradeSelector?.(stars)}
          onMouseLeave={() => props.onMouseLeaveUpgradeSelector?.()}
          activeUpgrade={props.trainer.stars}
          class="bg-gray-700 relative"
        />
      </TrainerBorder>
    </Show>
  );
};

export default Trainer;
