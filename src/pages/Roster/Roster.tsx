import ImportRosterModal from "@components/ImportRosterModal";
import Trainerlist from "@components/Trainerlist";
import { useAuth } from "@hooks/useAuth";
import useRoster from "@hooks/useRoster";
import { useSaveCustomTrainer, useSaveTrainer } from "@hooks/useSaveRoster";
import { Trainer, TrainerNames } from "@localtypes/types";
import { classNames } from "@utils/commonHelpers";

import { Component, Switch, Match, createSignal, createEffect } from "solid-js";

const Roster: Component = () => {
  const saveTrainer = useSaveTrainer();
  const { updateCustomTrainer, removeCustomTrainer, addCustomTrainer } =
    useSaveCustomTrainer();

  const [showImportModal, setShowImportModal] = createSignal(false);

  const user = useAuth();

  const [showPotentialView, setShowPotentialView] = createSignal(false);

  const [potentialSelectionTrainer, setPotentialSelectionTrainer] =
    createSignal<TrainerNames | "">("");

  const [rosterQuery] = useRoster();

  createEffect(() => {
    if (user()) {
      rosterQuery.refetch();
    }
  });

  const updateTrainer = <K extends keyof Trainer>(
    trainerId: Trainer["name"],
    valuesToUpdate: Record<K, Trainer[K]>
  ) => {
    console.log(trainerId, valuesToUpdate);
    saveTrainer(trainerId, valuesToUpdate);
  };

  return (
    <section
      aria-labelledby="primary-heading"
      class="min-w-0 flex-1 h-full max-h-screen min-h-screen flex-col overflow-hidden overflow-y-auto"
    >
      <h1 class="text-center text-4xl text-gray-100 mb-4">Roster Management</h1>
      <div class="flex justify-center my-4">
        <button
          class="bg-green-600 text-white p-2"
          onClick={() => setShowImportModal(true)}
        >
          Import Roster
        </button>
        <ImportRosterModal
          isOpen={showImportModal()}
          onClose={() => setShowImportModal(false)}
        />
      </div>
      <div class="flex max-w-5xl bg-gray-800 text-gray-300 mx-auto">
        <button
          class={classNames(
            "basis-1/2 p-2",
            !showPotentialView() ? "bg-gray-600 text-white" : ""
          )}
          onClick={() => setShowPotentialView(false)}
        >
          Set Trainer Rank
        </button>
        <button
          class={classNames(
            "basis-1/2 p-2",
            showPotentialView() ? "bg-gray-600 text-white" : ""
          )}
          onClick={() => setShowPotentialView(true)}
        >
          Set Potential
        </button>
      </div>
      <div class="flex flex-col mx-auto">
        <Switch>
          <Match
            when={
              rosterQuery.isLoading ||
              rosterQuery.isFetching ||
              rosterQuery.isRefetching
            }
          >
            Loading...
          </Match>
          <Match when={rosterQuery.data}>
            <Trainerlist
              setPotentialSelectionTrainer={(name: TrainerNames | "") =>
                setPotentialSelectionTrainer(name)
              }
              trainers={rosterQuery?.data.trainers}
              updateTrainer={updateTrainer}
              updateCustomTrainer={updateCustomTrainer}
              addCustomTrainer={addCustomTrainer}
              removeCustomTrainer={removeCustomTrainer}
              rosterView
              potentialListView={showPotentialView()}
              potentialSelectionTrainer={potentialSelectionTrainer()}
            />
          </Match>
        </Switch>
      </div>
    </section>
  );
};

export default Roster;
