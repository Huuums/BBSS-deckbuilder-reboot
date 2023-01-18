import trainers from "@assets/json/trainers";
import DeckDisplay from "@components/DeckDisplay";
import Trainerlist from "@components/Trainerlist";
import {
  Deck,
  DeckSlot,
  Position,
  RankLevels,
  SkillRanks,
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
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
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
import { A } from "@solidjs/router";
import { Toggle } from "solid-headless";

// type DeckbuilderProps = {};

const Deckbuilder: Component = () => {
  const [deck, setDeck] = createSignal<Deck>([
    "empty",
    "empty",
    "empty",
    "empty",
    "empty",
    "empty",
  ]);

  const [useRosterTrainers, setUseRosterTrainers] = createSignal(true);
  const [targetPosition, setTargetPosition] = createSignal<Position | "0">("0");
  const rosterQuery = useRoster();

  const [potentialSelectionTrainer, setPotentialSelectionTrainer] =
    createSignal<TrainerNames | "">("");

  const [trainerList, setTrainerList] = createStore<Trainer[]>([]);
  const [skills, setSkills] = createSignal<SkillRanks>({});
  const [tempDeck, setTempDeck] = createSignal<Deck | null>(null);
  const [exchangeIndex, setExchangeIndex] = createSignal<number | null>(null);

  createEffect(() => {
    setSkills(() => getSkillLevelsSum(deck()));
  });

  const updateExchangeIndex = (i: number) => {
    setExchangeIndex((prev) => (i === prev ? null : i));
  };

  createEffect(
    on(useRosterTrainers, () => {
      setDeck(["empty", "empty", "empty", "empty", "empty", "empty"]);
      setTrainerList(
        useRosterTrainers()
          ? rosterQuery?.data?.filter((val) => val.stars !== 0) || []
          : trainers.map((row) => ({ ...row, stars: 1, potential: [] }))
      );
    })
  );

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
    on(deck, () => {
      setExchangeIndex(null);
    })
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
    setTrainerList(
      (el) => el.name === trainerName,
      (el) => ({ ...el, ...valuesToUpdate })
    );
  };

  const updateAllTrainers = <K extends keyof Trainer>(
    valuesToUpdate: Partial<Record<K, Trainer[K]>>
  ) => {
    setTrainerList((prev) =>
      prev.map((trainer) => ({ ...trainer, ...valuesToUpdate }))
    );
    //iffy but since whole trainerlist updates the reference in the deck to the trainer gets lost. Have to update it so trainers in deck and trainerlist stay in sync
    setDeck((prev) =>
      prev.map((deckslot) => {
        if (deckslot !== "empty") {
          return trainerList.find((trainer) => trainer.name === deckslot.name);
        }
        return deckslot;
      })
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
    tempSkills() ? getSkillLevelDiff(tempSkills(), skills()) : null;

  const trainerDiff = (): [[DeckSlot, DeckSlot], number] | null => {
    if (!tempDeck()) return null;

    let index;
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
        class="min-w-0 flex-1 h-full max-h-screen min-h-screen flex-col overflow-hidden overflow-y-auto"
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
              onChange={() => setUseRosterTrainers((prev) => !prev)}
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
                Use Roster trainers
              </span>
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

      <aside class="hidden lg:block lg:flex-shrink-0">
        <div class="flex max-h-screen h-full w-80 flex-col overflow-y-auto border-r border-gray-200 bg-gray-800 p-3">
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
