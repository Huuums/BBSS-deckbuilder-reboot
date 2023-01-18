import {
  RankLevels,
  Rarity,
  Trainer as TrainerType,
  TrainerNames,
} from "@localtypes/types";
import { Component, For, JSX, Show } from "solid-js";
import teamImages from "@assets/images/teams";

import TrainerPosition from "@components/TrainerPosition";
import TrainerBorder from "@components/TrainerBorder";
import TrainerAvatar from "@components/TrainerAvatar";
import TrainerStatsType from "@components/TrainerStatsType";
import TrainerUpgradeSelector from "@components/TrainerUpgradeSelector";
import { classNames } from "@utils/commonHelpers";

import clickOutside from "@hooks/clickOutside";

import TrainerPotential from "@components/TrainerPotential";

import Modal from "@components/Modal";
import { IoStarHalfSharp, IoStarSharp } from "solid-icons/io";

//don't remove this.
//eslint-disable-next-line
const clickOutsideDirective = clickOutside;

type TrainerProps = {
  src: string;
  onClickAvatar?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onMouseEnterAvatar?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onMouseLeaveAvatar?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onClickExchange?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  removeTrainerFromRoster?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onMouseEnterUpgradeSelector?: (stars: RankLevels) => void;
  onMouseLeaveUpgradeSelector?: () => void;
  setPotentialSelectionTrainer?: (name: TrainerNames | "") => void;
  showPotentialSelectionSmall?: boolean;
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
  updateTrainer?: <K extends keyof TrainerType>(
    trainerName: string,
    valuesToUpdate: Partial<Record<K, TrainerType[K]>>
  ) => void;
  rosterView?: boolean;
  trainerSkillContribution?:
    | { default: number; encyclopedia: number }
    | undefined;
  deckSkillValue?: {
    default: number;
    encyclopedia: number;
  };
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
        <TrainerBorder rarity={props.trainer.rarity} class={props.class}>
          {props.trainer?.bonusTeam?.length > 0 && (
            <div class="absolute flex top-1 left-1 m-auto p-0.5 z-[1] border-2 border-blue-400 bg-gray-800 rounded-2xl space-x-0.5">
              <For each={props.trainer.bonusTeam}>
                {(team) => <img class="w-7 h-7" src={teamImages[team]} />}
              </For>
            </div>
          )}
          <TrainerAvatar
            rosterView={props.rosterView}
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
            removeTrainerFromRoster={props.removeTrainerFromRoster}
            onClickExchange={(e) => props.onClickExchange(e)}
            class={props.trainer.stars === 0 ? "opacity-40" : ""}
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
              {props.deckSkillValue !== undefined && (
                <>
                  <div class="basis-1/2 border-r text-xs items-center flex border-gray-200 p-1">
                    <IoStarSharp class="w-4 h-4" />
                    {props.trainerSkillContribution?.default === undefined
                      ? "-"
                      : props.trainerSkillContribution?.default -
                        (props.deckSkillValue?.default || 0)}
                  </div>
                  <div class="basis-1/2 flex text-xs items-center border-gray-200 p-1">
                    <IoStarHalfSharp class="w-4 h-4" />
                    {props.trainerSkillContribution?.encyclopedia === undefined
                      ? "-"
                      : props.trainerSkillContribution?.encyclopedia -
                        (props.deckSkillValue?.encyclopedia || 0)}
                  </div>
                </>
              )}
            </div>
            <div class="basis-full flex">
              <button
                class={classNames(
                  "flex justify-center p-0.5 basis-1/2 items-center text-xs py-1",
                  getBackgroundAndTextRarityClass(props.trainer.rarity),
                  "basis-1/2"
                )}
                onClick={() =>
                  props.setPotentialSelectionTrainer(props.trainer.name)
                }
              >
                Potential
              </button>
              {props.showPotentialSelectionSmall && (
                <Modal
                  isOpen={props.showPotentialSelectionSmall}
                  onClose={() => props.setPotentialSelectionTrainer("")}
                >
                  <div class="2xl:basis-1/4 flex-grow my-2 mx-2 2xl:max-w-1/2">
                    <TrainerPotential
                      trainer={props.trainer}
                      mode="large"
                      updateTrainer={(potential) =>
                        props.updateTrainer(props.trainer.name, {
                          potential,
                        })
                      }
                    />
                  </div>
                </Modal>
              )}
              <button
                class={classNames(
                  "flex text-gray-300 justify-center items-center text-center text-xs py-1 cursor-not-allowed",
                  "basis-1/2"
                )}
                title="Will be added later"
                disabled
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
          onClickExchange={(e) => props.onClickExchange?.(e)}
        />
        <TrainerUpgradeSelector
          onChange={(stars) => props.onChange?.({ stars })}
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
