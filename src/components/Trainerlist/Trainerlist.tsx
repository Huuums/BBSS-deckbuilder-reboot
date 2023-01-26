import Trainer from "@components/Trainer/Trainer";
import {
  Component,
  createMemo,
  createSignal,
  For,
  Suspense,
  Switch,
  Match,
  Show,
} from "solid-js";
import trainerImages from "../../assets/images/trainer";
import {
  Deck,
  DeckSlot,
  FilterEntry,
  Filters,
  RankLevels,
  Skill,
  Trainer as TrainerType,
  TrainerNames,
} from "@localtypes/types";

import { battingPositions, pitchingPositions } from "@assets/positions";
import TrainerPotential from "@components/TrainerPotential";
import TrainerUpgradeSelector from "@components/TrainerUpgradeSelector";
import RadioButton from "@components/RadioButton";
import TrainerSearch from "@components/TrainerSearch";
import { createStore } from "solid-js/store";
import {
  Accordion,
  AccordionButton,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
} from "solid-headless";
import { IoChevronUpOutline } from "solid-icons/io";
import { HiOutlineX } from "solid-icons/hi";

type TrainerlistProps = {
  useRoster?: boolean;
  removeTrainerFromDeck?: (trainer: TrainerType["name"]) => void;
  removeTrainerFromRoster?: (trainer: TrainerType["name"]) => void;
  addTrainer?: (trainer: DeckSlot) => void;
  deck?: Deck;
  trainers: TrainerType[];
  onMouseEnterTrainerAvatar?: (trainer: TrainerType) => void;
  onMouseLeaveTrainerAvatar?: () => void;
  onMouseEnterUpgradeSelector?: (
    trainer: TrainerType,
    stars: RankLevels
  ) => void;
  onMouseLeaveUpgradeSelector?: () => void;
  updateTrainer: <K extends keyof TrainerType>(
    trainerName: string,
    valuesToUpdate: Partial<Record<K, TrainerType[K]>>
  ) => void;
  potentialListView?: boolean;
  rosterView?: boolean;
  setPotentialSelectionTrainer?: (name: TrainerNames | "") => void;
  potentialSelectionTrainer?: TrainerNames | "";
  trainerSkillContribution?: Partial<
    Record<TrainerNames, { default: number; encyclopedia: number }>
  >;
  deckSkillValue?: {
    default: number;
    encyclopedia: number;
  };
  updateAllTrainers?: <K extends keyof TrainerType>(
    valuesToUpdate: Partial<Record<K, TrainerType[K]>>
  ) => void;
  isDeckBuilder?: boolean;
};

const Trainerlist: Component<TrainerlistProps> = (props) => {
  const [filters, setFilters] = createStore<Filters>({
    position: [],
    team: [],
    rarity: [],
    type: [],
  });
  const [sortBy, setSortBy] = createSignal<string>("Rarity");

  const visibleTrainers = createMemo(() => {
    let positionsToCheck = filters.position;
    //doing this for every trainer would be too expensive
    if (filters.position) {
      if (filters.position.includes("pitchers")) {
        positionsToCheck = positionsToCheck.concat(pitchingPositions);
      }
      if (filters.position.includes("batters")) {
        positionsToCheck = positionsToCheck.concat(battingPositions);
      }
    }

    const filteredTrainers = props.trainers.filter((trainer) => {
      return Object.entries(filters)
        .filter((entry) => entry[1] && entry[1].length > 0)
        .every(([type, value]: FilterEntry) => {
          switch (type) {
            case "name":
              return trainer.name.toLowerCase().includes(value.toLowerCase());
            case "position": {
              return positionsToCheck.includes(trainer.position);
            }
            case "rarity":
              return value.includes(trainer.rarity);
            case "team":
              return trainer.bonusTeam.some((team) => value.includes(team));
            case "type":
              return trainer.type.some((type) => value.includes(type));
            case "skill":
              return Object.keys(trainer.skills[trainer.stars]).some(
                (skill: Skill) => value.includes(skill)
              );
          }
        });
    });

    return filteredTrainers;
  });

  const sortedTrainers = () => {
    const trainersInDeck = (props.deck || [])
      .filter((val) => val !== "empty")
      .map((trainer) => (trainer as TrainerType).name);

    if (sortBy() === "Skill Compatibility") {
      return visibleTrainers().sort((a, b) => {
        if (trainersInDeck.includes(a.name)) {
          return -1;
        } else if (trainersInDeck.includes(b.name)) {
          return 1;
        }
        return (
          props.trainerSkillContribution[b.name]?.default -
          props.trainerSkillContribution[a.name]?.default
        );
      });
    } else if (sortBy() === "Skill Compatibility with Encyclopedia") {
      return visibleTrainers().sort((a, b) => {
        if (trainersInDeck.includes(a.name)) {
          return -1;
        } else if (trainersInDeck.includes(b.name)) {
          return 1;
        }
        return (
          props.trainerSkillContribution[b.name]?.encyclopedia -
          props.trainerSkillContribution[a.name]?.encyclopedia
        );
      });
    }
    return visibleTrainers();
  };

  return (
    <div class="flex flex-col">
      {props.isDeckBuilder && (
        <section class="max-w-full lg:max-w-5xl my-10 mx-auto w-full max-h-full text-gray-300">
          <Accordion defaultValue={undefined} toggleable>
            <AccordionItem value={"filter"} class="mt-2">
              <AccordionHeader>
                <AccordionButton
                  as="h2"
                  class={
                    "flex justify-center items-center bg-gray-800 py-2 text-xl text-center font-bold px-4"
                  }
                >
                  {({ isSelected }) => (
                    <>
                      Filtering
                      <div class="ml-auto">
                        <Show
                          when={!isSelected()}
                          fallback={<HiOutlineX class="w-8 h-8 text-gray-50" />}
                        >
                          <IoChevronUpOutline
                            class={`flex-0 transform rotate-180 w-8 h-8 text-gray-50 `}
                          />
                        </Show>
                      </div>
                    </>
                  )}
                </AccordionButton>
              </AccordionHeader>
              <AccordionPanel class="px-4 pt-4 pb-2 text-sm text-gray-900 bg-gray-800 dark:text-gray-50">
                <TrainerSearch filters={filters} setFilters={setFilters} />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </section>
      )}
      <Switch>
        <Match when={props.potentialListView}>
          <div class="flex flex-wrap">
            <For each={visibleTrainers().filter((val) => val.stars)}>
              {(trainer) => (
                <div class="basis-1/3 flex-grow max-w-1/2 mr-auto 2xl:basis-1/4 lg:basis-1/3 lg:flex-grow my-2 mx-2 2xl:max-w-1/3">
                  <TrainerPotential
                    trainer={trainer}
                    mode="large"
                    updateTrainer={(potential) =>
                      props.updateTrainer(trainer.name, { potential })
                    }
                  />
                </div>
              )}
            </For>
          </div>
        </Match>
        <Match when={!props.potentialListView}>
          <>
            {props.isDeckBuilder && (
              <div class="flex flex-wrap justify-between max-w-full px-5 -mb-2 mt-2">
                <div class="flex flex-1 mb-3 lg:mb-0 lg:flex-auto text-gray-200 justify-between lg:justify-start items-center font-semibold">
                  <span>Set all Trainer Ranks:</span>
                  <TrainerUpgradeSelector
                    ignoreUpdateCheck
                    onChange={(stars) => props.updateAllTrainers({ stars })}
                    activeUpgrade={5}
                    class="w-32 ml-2"
                  />
                </div>
                <div class="flex lg:hidden text-gray-200 items-center font-semibold overflow-hidden">
                  <div class="basis-20">Sort By:</div>
                  <div class="flex-1">
                    <select
                      class="bg-gray-900 text-ellipsis overflow-hidden w-full"
                      onChange={(e) => setSortBy(e.currentTarget.value)}
                    >
                      <option value="Rarity">Rarity</option>
                      <option value="Skill Compatibility">
                        Skill Compatibility
                      </option>
                      <option value="Skill Compatibility with Encyclopedia">
                        Skill Compatibility with Encyclopedia
                      </option>
                    </select>
                  </div>
                </div>
                <div class="hidden lg:flex flex-wrap text-gray-200 items-center font-semibold">
                  Sort By:
                  <RadioButton
                    onClick={(value) => setSortBy(value)}
                    value={"Rarity"}
                    isActive={sortBy() === "Rarity"}
                    class="mx-2 flex-grow-0 py-1.5"
                  />
                  <RadioButton
                    onClick={(value) => setSortBy(value)}
                    value={"Skill Compatibility"}
                    isActive={sortBy() === "Skill Compatibility"}
                    class="mx-2 py-1.5"
                  />{" "}
                  <RadioButton
                    onClick={(value) => setSortBy(value)}
                    value={"Skill Compatibility with Encyclopedia"}
                    isActive={
                      sortBy() === "Skill Compatibility with Encyclopedia"
                    }
                    class="mx-2 py-1.5 whitespace-nowrap"
                  />
                </div>
              </div>
            )}

            <div class="grid gap-x-1 lg:gap-x-2 gap-y-2 max-w-100 lg:grid-cols-auto grid-cols-auto-small p-5">
              <For each={sortedTrainers()}>
                {(trainer) => {
                  return (
                    <>
                      <Suspense
                        fallback={
                          <div role="status">
                            <svg
                              aria-hidden="true"
                              class="w-8 h-8 mr-2 animate-spin text-gray-600 fill-blue-600"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span class="sr-only">Loading...</span>
                          </div>
                        }
                      >
                        <Trainer
                          trainer={trainer}
                          updateTrainer={props.updateTrainer}
                          rosterView={props.rosterView}
                          trainerSkillContribution={
                            props.trainerSkillContribution[trainer.name]
                          }
                          deckSkillValue={props.deckSkillValue}
                          removeTrainerFromRoster={() => {
                            props.updateTrainer(trainer.name, {
                              stars: 0,
                              potential: [],
                            });
                          }}
                          setPotentialSelectionTrainer={(
                            name: TrainerNames | ""
                          ) => props.setPotentialSelectionTrainer(name)}
                          showPotentialSelectionSmall={
                            props.potentialSelectionTrainer === trainer.name
                          }
                          onClickAvatar={() =>
                            !props.deck?.some(
                              (el) => el !== "empty" && el.name === trainer.name
                            )
                              ? props.addTrainer?.(trainer)
                              : props.removeTrainerFromDeck?.(trainer.name)
                          }
                          onMouseEnterAvatar={() =>
                            props.onMouseEnterTrainerAvatar?.(trainer)
                          }
                          onMouseLeaveAvatar={() =>
                            props.onMouseLeaveTrainerAvatar?.()
                          }
                          onMouseEnterUpgradeSelector={(stars) =>
                            props.onMouseEnterUpgradeSelector?.(trainer, stars)
                          }
                          onMouseLeaveUpgradeSelector={() =>
                            props.onMouseLeaveTrainerAvatar?.()
                          }
                          src={trainerImages[trainer.name]}
                          trainerDeckIndex={props.deck?.findIndex(
                            (row) =>
                              row !== "empty" && row.name === trainer.name
                          )}
                          onChange={(values) =>
                            props.updateTrainer(trainer.name, values)
                          }
                        />
                      </Suspense>
                    </>
                  );
                }}
              </For>
            </div>
          </>
        </Match>
      </Switch>
    </div>
  );
};

export default Trainerlist;
