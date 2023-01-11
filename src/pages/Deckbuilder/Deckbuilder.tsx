import trainers from "@assets/json/trainers";
import DeckDisplay from "@components/DeckDisplay";
import Trainerlist from "@components/Trainerlist";
import { Deck, DeckTrainer, Trainer } from "@localtypes/types";
import { replaceFirstOccasionWithValue } from "@utils/commonHelpers";
import useRoster from "@hooks/useRoster";
import { Component, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

// type DeckbuilderProps = {};

const Deckbuilder: Component = () => {
  const [deck, setDeck] = createStore<Deck>([
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

  createEffect(() => {
    setTrainerList(
      useRosterTrainers()
        ? trainers.map((row) => ({ ...row, ...roster?.[row.name] }))
        : trainers.map((row) => ({ ...row, stars: 1, potential: {} }))
    );
  });
  const addTrainerToDeck = (trainer: DeckTrainer) => {
    setDeck((prev) => replaceFirstOccasionWithValue(prev, trainer, "empty"));
  };

  const removeTrainerFromDeck = (trainer: Trainer["name"]) => {
    setDeck((el) => el !== "empty" && el.name === trainer, "empty");
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

  return (
    <>
      <section
        aria-labelledby="primary-heading"
        class="flex h-full min-w-0 flex-1 flex-col"
      >
        <DeckDisplay
          deck={deck}
          removeTrainer={removeTrainerFromDeck}
          updateTrainer={updateTrainer}
        />
        <Trainerlist
          trainers={trainerList}
          addTrainer={addTrainerToDeck}
          removeTrainer={removeTrainerFromDeck}
          deck={deck}
          updateTrainer={updateTrainer}
        />
        ;{/* Your content */}
      </section>

      <aside class="hidden lg:block lg:flex-shrink-0 ">
        <div class="relative flex h-full w-80 flex-col overflow-y-auto border-r border-gray-200 bg-gray-800 p-3">
          <h3 class="text-gray-200 text-2xl">Skills</h3>
        </div>
      </aside>
    </>
  );
};

export default Deckbuilder;
