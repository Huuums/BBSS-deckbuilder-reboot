import trainers from "@assets/json/trainers";
import DeckDisplay from "@components/DeckDisplay";
import Trainerlist from "@components/Trainerlist";
import {
  Deck,
  DeckSlot,
  RankLevels,
  SkillRanks,
  Trainer,
} from "@localtypes/types";
import {
  replaceFirstOccasionWithValue,
  replaceValueAtIndex,
} from "@utils/commonHelpers";
import useRoster from "@hooks/useRoster";
import { Component, createEffect, createSignal, on } from "solid-js";
import { createStore } from "solid-js/store";
import SkillDisplay from "@components/SkillDisplay";
import { getSkillLevelDiff, getSkillLevelsSum } from "@utils/skillHelpers";
import ChangedTrainerDisplay from "@components/ChangedTrainerDisplay";

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

  const [useRosterTrainers, setUseRosterTrainers] = createSignal(false);
  const { roster } = useRoster();

  const [trainerList, setTrainerList] = createStore<Trainer[]>([]);
  const [skills, setSkills] = createSignal<SkillRanks>({});
  const [tempDeck, setTempDeck] = createSignal<Deck | null>(null);
  const [exchangeIndex, setExchangeIndex] = createSignal<number | null>(null);

  createEffect(() => {
    if (!deck().every((el) => el === "empty")) {
      setSkills(() => getSkillLevelsSum(deck()));
    }
  });

  const updateExchangeIndex = (i: number) => {
    setExchangeIndex((prev) => (i === prev ? null : i));
  };

  createEffect(() => {
    setTrainerList(
      useRosterTrainers()
        ? trainers.map((row) => ({ ...row, ...roster?.[row.name] }))
        : trainers.map((row) => ({ ...row, stars: 1, potential: {} }))
    );
  });
  const addTrainerToDeck = (trainer: DeckSlot) => {
    setDeck((prev) => {
      if (exchangeIndex() !== null) {
        return replaceValueAtIndex(prev, trainer, exchangeIndex());
      }
      return replaceFirstOccasionWithValue(prev, trainer, "empty");
    });
  };

  createEffect(
    on(deck, () => {
      setExchangeIndex(null);
    })
  );

  const removeTrainerFromDeck = (trainer: Trainer["name"]) => {
    setExchangeIndex(null);
    setDeck((prev) =>
      prev.map((el) => (el !== "empty" && el.name === trainer ? "empty" : el))
    );
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
    if (
      deck().includes("empty") &&
      !deck().find((row) => row !== "empty" && row.name === trainer.name)
    ) {
      const tempDeck = replaceFirstOccasionWithValue(deck(), trainer, "empty");
      setTempDeck(tempDeck);
    } else if (exchangeIndex() !== null) {
      const tempDeck = replaceValueAtIndex(deck(), trainer, exchangeIndex());
      setTempDeck(tempDeck);
    }
  };

  const tempSkills = () => (tempDeck() ? getSkillLevelsSum(tempDeck()) : null);

  const skillDiff = () =>
    tempDeck() ? getSkillLevelDiff(tempSkills(), skills()) : null;

  const trainerDiff = (): [Trainer, Trainer] | null => {
    if (!tempDeck()) return null;

    const index = tempDeck().findIndex((tempTrainer, i) => {
      const activeTrainer = deck()[i];
      if (activeTrainer === "empty" || tempTrainer === "empty") return false;
      return (
        activeTrainer.name !== tempTrainer.name ||
        activeTrainer.stars !== tempTrainer.stars
      );
    });

    return [deck()[index], tempDeck()[index]] as [Trainer, Trainer];
  };

  return (
    <>
      <section
        aria-labelledby="primary-heading"
        class="min-w-0 flex-1 h-full max-h-screen min-h-screen flex-col overflow-hidden overflow-y-auto"
      >
        <DeckDisplay
          deck={deck()}
          tempDeck={tempDeck()}
          removeTrainer={removeTrainerFromDeck}
          updateTrainer={updateTrainer}
          onMouseEnterTrainerAvatar={onMouseEnterTrainerAvatar}
          onMouseLeaveTrainerAvatar={() => setTempDeck(null)}
          onMouseEnterUpgradeSelector={onMouseEnterTrainerUpgrade}
          onMouseLeaveUpgradeSelector={() => setTempDeck(null)}
          updateExchangeIndex={updateExchangeIndex}
          exchangeIndex={exchangeIndex()}
        />
        <Trainerlist
          trainers={trainerList}
          addTrainer={addTrainerToDeck}
          removeTrainer={removeTrainerFromDeck}
          deck={deck()}
          onMouseEnterTrainerAvatar={onMouseEnterTrainerAvatar}
          onMouseLeaveTrainerAvatar={() => setTempDeck(null)}
          onMouseEnterUpgradeSelector={onMouseEnterTrainerUpgrade}
          onMouseLeaveUpgradeSelector={() => setTempDeck(null)}
          updateTrainer={updateTrainer}
        />
        ;{/* Your content */}
      </section>

      <aside class="hidden lg:block lg:flex-shrink-0">
        <div class="flex max-h-screen h-full w-80 flex-col overflow-y-auto border-r border-gray-200 bg-gray-800 p-3">
          {tempDeck() !== null && !deck().includes("empty") && (
            <ChangedTrainerDisplay trainerDiff={trainerDiff()} />
          )}
          <SkillDisplay
            activeSkills={tempSkills() || skills()}
            diff={skillDiff()}
            categorize
          />
        </div>
      </aside>
    </>
  );
};

export default Deckbuilder;
