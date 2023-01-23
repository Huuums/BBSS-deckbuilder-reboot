import trainers from "@assets/json/trainers";
import DeckDisplay from "@components/DeckDisplay";
import Trainerlist from "@components/Trainerlist";

import {
  Deck,
  DeckSlot,
  Position,
  RankLevels,
  Roster,
  RosterTrainer,
  Trainer,
  TrainerNames,
} from "@localtypes/types";
import {
  classNames,
  replaceFirstOccasionWithValue,
  replaceValueAtIndex,
} from "@utils/commonHelpers";
import useRoster from "@hooks/useRoster";
import {
  batch,
  Component,
  createEffect,
  createMemo,
  createSignal,
  on,
  onMount,
  Show,
} from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import SkillDisplay from "@components/SkillDisplay";
import {
  getBestSkills,
  getBestSkillsInDeck,
  getSkillLevelDiff,
  getSkillLevelsSum,
  makeSkillData,
  sumValuesOfBestSkills,
} from "@utils/skillHelpers";
import ChangedTrainerDisplay from "@components/ChangedTrainerDisplay";
import PositionChoice from "@components/PositionChoice";
import { A, Params, useSearchParams } from "@solidjs/router";
import { Toggle } from "solid-headless";
import { useAuth } from "@hooks/useAuth";
import clickOutside from "@hooks/clickOutside";
import { swipeLeft, swipeRight } from "@hooks/swipe";
import { HiOutlineX } from "solid-icons/hi";

//don't remove this.
//eslint-disable-next-line
const clickOutsideDirective = clickOutside;
const swipeLeftDirective = swipeLeft;
const swipeRightDirective = swipeRight;

// type DeckbuilderProps = {};

const getTrainersFromParams = (params: Params | undefined): Partial<Roster> => {
  if (!params || !params.trainers) return undefined;
  return Object.fromEntries(
    JSON.parse(atob(decodeURIComponent(params.trainers)))
  );
};

const setInitialTrainerList = (paramTrainers: Partial<Roster> | undefined) => {
  return trainers.map<Trainer>((trainer) => {
    if (paramTrainers !== undefined && paramTrainers[trainer.name]) {
      return { ...trainer, ...paramTrainers[trainer.name] };
    }
    return { ...trainer, stars: 1, potential: [] };
  });
};

const Deckbuilder: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuth();
  const [showSkillsOnMobile, setShowSkillsOnMobile] = createSignal(false);

  const [useRosterTrainers, setUseRosterTrainers] = createSignal<boolean>(
    searchParams.trainers === undefined ||
      (searchParams.trainers !== undefined &&
        searchParams.rosterid !== undefined)
  );
  const [rosterId] = createSignal<string | undefined>(searchParams.rosterid);
  const [rosterQuery, queryId] = useRoster(() => rosterId());

  onMount(() => {
    if (useRosterTrainers()) {
      if (!searchParams.rosterid) {
        setSearchParams({ rosterid: queryId?.() || user()?.roster });
      }
    }
  });

  const [targetPosition, setTargetPosition] = createSignal<Position | "0">("0");

  const [potentialSelectionTrainer, setPotentialSelectionTrainer] =
    createSignal<TrainerNames | "">("");

  const paramTrainers = getTrainersFromParams(searchParams);

  const [trainerList, setTrainerList] = createStore<Trainer[]>(
    setInitialTrainerList(paramTrainers)
  );
  const [deck, setDeck] = createSignal<(DeckSlot | undefined)[]>(
    paramTrainers
      ? trainerList
          .filter((trainer) => paramTrainers[trainer.name])
          .concat(
            Array(6 - Object.keys(paramTrainers || {})?.length).fill("empty")
          )
      : Array(6).fill("empty")
  );

  const [tempDeck, setTempDeck] = createSignal<Deck | null>(null);
  const [exchangeIndex, setExchangeIndex] = createSignal<number | null>(null);

  const skills = () => getSkillLevelsSum(deck());

  const updateExchangeIndex = (i: number) => {
    setExchangeIndex((prev) => (i === prev ? null : i));
  };

  createEffect(() => {
    if (useRosterTrainers() && rosterQuery?.data) {
      setTrainerList(
        reconcile(
          rosterQuery?.data.trainers.filter((trainer) => trainer.stars !== 0),
          { key: "name" }
        )
      );
      setDeck((prev) =>
        prev.map((val) =>
          val === "empty" ||
          trainerList.some((trainer) => trainer.name === val.name)
            ? val
            : "empty"
        )
      );
    } else if (!useRosterTrainers()) {
      setTrainerList(
        reconcile(
          trainers.map((trainer) => ({ ...trainer, stars: 1, potential: [] })),
          { key: "name", merge: true }
        )
      );
    }
  });

  const addTrainerToDeck = (trainer: DeckSlot) => {
    batch(() => {
      setDeck((prev) => {
        if (exchangeIndex() !== null) {
          return replaceValueAtIndex(prev, trainer, exchangeIndex());
        }
        return replaceFirstOccasionWithValue(prev, trainer, "empty");
      });
      setTempDeck(null);
    });
  };

  createEffect(
    on(
      deck,
      () => {
        setExchangeIndex(null);
        if (deck().every((val) => val === "empty")) {
          setSearchParams({ trainers: "" });
        } else {
          const trainers = (
            deck().filter((val) => val !== "empty") as Trainer[]
          ).map<[TrainerNames, RosterTrainer]>((val) => [
            val.name,
            { stars: val.stars, potential: val.potential },
          ]);

          setSearchParams({
            trainers: encodeURIComponent(btoa(JSON.stringify(trainers))),
          });
        }
      },
      { defer: true }
    )
  );

  const removeTrainerFromDeckFromDeck = (trainer: Trainer["name"]) => {
    batch(() => {
      setExchangeIndex(null);
      setDeck((prev) =>
        prev.map((el) => (el !== "empty" && el.name === trainer ? "empty" : el))
      );
      setTempDeck(null);
    });
  };

  const updateTrainer = <K extends keyof Trainer>(
    trainerName: Trainer["name"],
    valuesToUpdate: Partial<Record<K, Trainer[K]>>
  ) => {
    batch(() => {
      setTrainerList(
        (el) => el.name === trainerName,
        (el) => ({ ...el, ...valuesToUpdate })
      );
    });
  };

  const updateAllTrainers = <K extends keyof Trainer>(
    valuesToUpdate: Partial<Record<K, Trainer[K]>>
  ) => {
    setTrainerList(
      (prev) => prev !== undefined,
      (el) => ({ ...el, ...valuesToUpdate })
    );
  };

  const onMouseEnterTrainerUpgrade = (trainer: Trainer, stars: RankLevels) => {
    if (
      deck().find(
        (deckslot) => deckslot !== "empty" && deckslot.name === trainer.name
      )
    ) {
      const tempDeck = deck().map((deckslot) => {
        if (deckslot === "empty" || deckslot.name !== trainer.name) {
          return deckslot;
        }
        return { ...trainer, stars };
      });

      setTempDeck(tempDeck);
    } else if (exchangeIndex() !== null) {
      const tempDeck = replaceValueAtIndex(
        deck(),
        { ...trainer, stars },
        exchangeIndex()
      );
      setTempDeck(tempDeck);
    }
  };

  const onMouseEnterTrainerAvatar = (trainer: Trainer) => {
    let tempDeck = null;
    const trainerIndex = deck().findIndex(
      (slot) => slot !== "empty" && slot.name === trainer.name
    );

    if (
      exchangeIndex() === null &&
      !deck().includes("empty") &&
      trainerIndex === -1
    ) {
      setTempDeck(tempDeck);
      return;
    }

    if (
      exchangeIndex() !== null &&
      !deck().find((slot) => slot !== "empty" && slot.name === trainer.name)
    ) {
      tempDeck = replaceValueAtIndex(deck(), trainer, exchangeIndex());
    } else {
      const trainerIndex = deck().findIndex(
        (deckslot) => deckslot !== "empty" && deckslot.name === trainer.name
      );
      if (trainerIndex === -1) {
        tempDeck = replaceFirstOccasionWithValue(deck(), trainer, "empty");
      } else {
        tempDeck = replaceValueAtIndex(deck(), "empty", trainerIndex);
      }
    }

    setTempDeck(tempDeck);
  };

  const tempSkills = () => (tempDeck() ? getSkillLevelsSum(tempDeck()) : null);

  const skillDiff = () =>
    tempSkills()
      ? getSkillLevelDiff(tempSkills(), skills(), targetPosition())
      : null;

  const trainerDiff = (): [[DeckSlot, DeckSlot], number] | null => {
    if (!tempDeck()) return null;

    let index: number;
    if (exchangeIndex()) {
      if (deck[exchangeIndex()] !== tempDeck[exchangeIndex()]) {
        index = exchangeIndex();
      }
    }
    index = tempDeck().findIndex((tempTrainer, i) => {
      const activeTrainer = deck()[i];
      if (
        (activeTrainer === "empty" && tempTrainer !== "empty") ||
        (tempTrainer === "empty" && activeTrainer !== "empty")
      ) {
        return true;
      }
      if (activeTrainer === "empty" && tempTrainer === "empty") {
        return false;
      }
      if (activeTrainer !== "empty" && tempTrainer !== "empty") {
        return (
          activeTrainer.name !== tempTrainer.name ||
          activeTrainer.stars !== tempTrainer.stars
        );
      }
    });

    return [[deck()[index], tempDeck()[index]], index] as [
      [DeckSlot, DeckSlot],
      number
    ];
  };

  const skillInformation = createMemo(() => {
    const skillDataDeck = makeSkillData(skills(), targetPosition());

    const skillDataTemp =
      tempSkills() === null
        ? undefined
        : makeSkillData(tempSkills(), targetPosition());

    const bestSkills = getBestSkills(skillDataDeck);
    const bestSkillsTemp =
      tempSkills() !== null ? getBestSkills(skillDataTemp) : undefined;

    return {
      deck: {
        skillData: skillDataDeck,
        listOfBestSkillsDefault: bestSkills.listOfBestSkillsDefault,
        listOfBestSkillsEncyclopedia: bestSkills.listOfBestSkillsEncyclopedia,
        bestSkillsValueDefault: sumValuesOfBestSkills(
          Object.values(bestSkills.listOfBestSkillsDefault)
        ),
        bestSkillsValueEncyclopedia: sumValuesOfBestSkills(
          Object.values(bestSkills.listOfBestSkillsEncyclopedia)
        ),
      },
      temp:
        tempSkills() === null
          ? undefined
          : {
              skillData: skillDataTemp,
              listOfBestSkillsDefault: bestSkillsTemp?.listOfBestSkillsDefault,
              listOfBestSkillsEncyclopedia:
                bestSkillsTemp?.listOfBestSkillsEncyclopedia,
              bestSkillsValueDefault: sumValuesOfBestSkills(
                Object.values(bestSkillsTemp?.listOfBestSkillsDefault)
              ),
              bestSkillsValueEncyclopedia: sumValuesOfBestSkills(
                Object.values(bestSkillsTemp?.listOfBestSkillsEncyclopedia)
              ),
            },
    };
  });

  const trainerSkillContribution = createMemo(() => {
    if (!deck().includes("empty") && exchangeIndex() === null) {
      return {};
    }

    const isTrainerInDeck = deck().reduce((acc, deckslot) => {
      if (deckslot !== "empty") {
        acc[deckslot.name] = true;
      }
      return acc;
    }, {});

    return trainerList.reduce((acc, val) => {
      if (isTrainerInDeck[val.name]) {
        return acc;
      }
      const bestSkills =
        exchangeIndex() !== null
          ? getBestSkillsInDeck(
              replaceValueAtIndex(deck(), val, exchangeIndex()),
              targetPosition()
            )
          : getBestSkillsInDeck(
              replaceFirstOccasionWithValue(deck(), val, "empty"),
              targetPosition()
            );
      acc[val.name] = {
        default: sumValuesOfBestSkills(
          Object.values(bestSkills.listOfBestSkillsDefault)
        ),
        encyclopedia: sumValuesOfBestSkills(
          Object.values(bestSkills.listOfBestSkillsEncyclopedia)
        ),
      };
      return acc;
    }, {});
  });

  return (
    <>
      <section
        aria-labelledby="primary-heading"
        class="min-w-0 max-w-full flex-1 h-full max-h-screen min-h-screen flex-col lg:overflow-hidden lg:overflow-y-auto"
        use:swipeLeftDirective={(e) => {
          if (!e.closest("#deckviewer")) {
            setShowSkillsOnMobile(true);
          }

          const deckviewer = document.getElementById("deckviewer");
          if (
            deckviewer.scrollLeft + deckviewer.clientWidth ===
            deckviewer.scrollWidth
          ) {
            setShowSkillsOnMobile(true);
          }
        }}
      >
        <DeckDisplay
          deck={deck()}
          tempDeck={tempDeck()}
          removeTrainerFromDeck={removeTrainerFromDeckFromDeck}
          updateTrainer={updateTrainer}
          onMouseEnterTrainerAvatar={onMouseEnterTrainerAvatar}
          onMouseLeaveTrainerAvatar={() => setTempDeck(null)}
          onMouseEnterUpgradeSelector={onMouseEnterTrainerUpgrade}
          onMouseLeaveUpgradeSelector={() => setTempDeck(null)}
          updateExchangeIndex={updateExchangeIndex}
          exchangeIndex={exchangeIndex()}
          setPotentialSelectionTrainer={(name: TrainerNames | "") =>
            setPotentialSelectionTrainer(name)
          }
        />
        <PositionChoice
          onChange={(val) => setTargetPosition(val)}
          currentPosition={targetPosition()}
        />
        <div class="max-w-5xl mx-auto bg-gray-800 p-2">
          <div class="flex justify-center items-center mx-auto">
            <span class="mr-3 shrink-0 whitespace-nowrap">
              <span class="text-sm font-medium text-gray-400">
                Use Sandbox trainers
              </span>
            </span>
            <Toggle
              pressed={useRosterTrainers()}
              onChange={() =>
                setUseRosterTrainers((prev) => {
                  if (!prev) {
                    setTimeout(() => {
                      setSearchParams({
                        rosterid: queryId?.() || user()?.roster,
                      });
                    }, 200);
                  } else {
                    setSearchParams({ rosterid: "" });
                  }
                  return !prev;
                })
              }
              class={classNames(
                useRosterTrainers() ? "bg-gray-900" : "bg-gray-200",
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              )}
            >
              <span
                aria-hidden="true"
                class={classNames(
                  useRosterTrainers() ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                )}
              />
            </Toggle>
            <span class="ml-3 shrink-0">
              <span class="text-sm font-medium text-gray-400">
                Use{" "}
                <Show
                  when={
                    rosterQuery?.data?.owner && queryId?.() !== user()?.roster
                  }
                >
                  <span class="font-bold text-white">
                    {rosterQuery?.data?.owner}
                  </span>{" "}
                </Show>
                Roster trainers
              </span>
              {/* <input
                type="text"
                defaultValue={}
                placeholder="Enter Rosterid"
                class="bg-gray-900 border-0 placeholder-gray-500 p-1 ml-2"
                onChange={(e) => {
                  setSearchParams({ rosterid: e.currentTarget.value });
                  setRosterId(e.currentTarget.value);
                }}
              /> */}
            </span>
          </div>
        </div>
        <Show
          when={trainerList.length === 0 && useRosterTrainers()}
          fallback={
            <Trainerlist
              updateAllTrainers={updateAllTrainers}
              trainers={trainerList}
              addTrainer={addTrainerToDeck}
              removeTrainerFromDeck={removeTrainerFromDeckFromDeck}
              deckSkillValue={{
                default: skillInformation().deck.bestSkillsValueDefault,
                encyclopedia:
                  skillInformation().deck.bestSkillsValueEncyclopedia,
              }}
              deck={deck()}
              isDeckBuilder
              onMouseEnterTrainerAvatar={onMouseEnterTrainerAvatar}
              onMouseLeaveTrainerAvatar={() => setTempDeck(null)}
              onMouseEnterUpgradeSelector={onMouseEnterTrainerUpgrade}
              onMouseLeaveUpgradeSelector={() => setTempDeck(null)}
              updateTrainer={updateTrainer}
              trainerSkillContribution={trainerSkillContribution()}
              setPotentialSelectionTrainer={(name: TrainerNames | "") =>
                setPotentialSelectionTrainer(name)
              }
              potentialSelectionTrainer={potentialSelectionTrainer()}
            />
          }
        >
          <span class="text-gray-200 font-bold text-center mx-auto block text-3xl mt-20">
            Please setup your{" "}
            <A href="/roster" class="underline text-blue-200">
              Roster
            </A>{" "}
            if you want to use the Deckbuilder based on it
          </span>
        </Show>
      </section>
      <button
        class={
          "block fixed bg-gray-800 z-20 top-10 -right-1 p-2 border border-gray-200 text-gray-200 lg:hidden"
        }
        onClick={() => setShowSkillsOnMobile(true)}
      >
        Show Skills
      </button>
      <div
        class={classNames(
          showSkillsOnMobile()
            ? "fixed left-0 right-0 top-0 bottom-0 z-30 bg-gray-600 bg-opacity-75"
            : "hidden"
        )}
      />
      <aside
        use:clickOutsideDirective={() => {
          if (showSkillsOnMobile()) {
            setShowSkillsOnMobile(false);
          }
        }}
        class={classNames(
          "lg:block lg:flex-shrink-0",
          showSkillsOnMobile()
            ? "block fixed right-0 top-0 z-50 h-full"
            : "hidden"
        )}
      >
        <div class="fixed top-0 left-0 pt-2">
          <button
            type="button"
            class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setShowSkillsOnMobile(false)}
          >
            <span class="sr-only">Close sidebar</span>
            <HiOutlineX class="h-8 w-8 stroke-white" aria-hidden="true" />
          </button>
        </div>
        <div
          class="flex max-h-screen h-full w-80 flex-col overflow-y-auto border-r border-gray-200 bg-gray-800 p-3"
          use:swipeRightDirective={() => {
            if (showSkillsOnMobile()) setShowSkillsOnMobile(false);
          }}
        >
          {tempDeck() !== null && (
            <ChangedTrainerDisplay trainerDiff={trainerDiff()} />
          )}
          <SkillDisplay
            skillInformationTemp={skillInformation().temp}
            skillInformationDeck={skillInformation().deck}
            diff={skillDiff()}
          />
        </div>
      </aside>
    </>
  );
};

export default Deckbuilder;
