import DeckDisplay from "@components/DeckDisplay";
import Trainerlist from "@components/Trainerlist";
import { Deck, DeckTrainer, Trainer } from "@localtypes/types";
import { replaceFirstOccasionWithValue } from "@utils/commonHelpers";
import { Component } from "solid-js";
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

  const addTrainerToDeck = (trainer: DeckTrainer) => {
    setDeck((prev) => replaceFirstOccasionWithValue(prev, trainer, "empty"));
  };

  const removeTrainerFromDeck = (trainer: Trainer["name"]) => {
    setDeck((prev) => prev === trainer, "empty");
  };

  return (
    <>
      <section
        aria-labelledby="primary-heading"
        class="flex h-full min-w-0 flex-1 flex-col overflow-y-auto"
      >
        <h1 class="pl-5 text-3xl text-gray-100">Deck</h1>
        <DeckDisplay deck={deck} removeTrainer={removeTrainerFromDeck} />
        <Trainerlist
          useRoster
          addTrainer={addTrainerToDeck}
          removeTrainer={removeTrainerFromDeck}
          deck={deck}
        />
        ;{/* Your content */}
      </section>

      <aside class="hidden lg:block lg:flex-shrink-0 ">
        <div class="relative flex h-full w-96 flex-col overflow-y-auto border-r border-gray-200 bg-gray-800 p-3">
          <h3 class="text-gray-200 text-2xl">Skills</h3>
        </div>
      </aside>
    </>
  );
};

export default Deckbuilder;
