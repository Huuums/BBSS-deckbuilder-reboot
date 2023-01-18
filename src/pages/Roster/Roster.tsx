import ImportRosterModal from "@components/ImportRosterModal";
import Trainerlist from "@components/Trainerlist";
import { useAuth } from "@hooks/useAuth";
import useRoster from "@hooks/useRoster";
import { useSaveCompleteRoster, useSaveTrainer } from "@hooks/useSaveRoster";
import {
  Skill,
  Trainer,
  TrainerNames,
  Roster as RosterType,
  RankLevels,
} from "@localtypes/types";
import { classNames } from "@utils/commonHelpers";
import Papa from "papaparse";

import {
  Component,
  Switch,
  Match,
  createSignal,
  createEffect,
  JSX,
} from "solid-js";

const Roster: Component = () => {
  const saveTrainer = useSaveTrainer();
  const saveRoster = useSaveCompleteRoster();
  const [showImportModal, setShowImportModal] = createSignal(false);

  const user = useAuth();

  const [showPotentialView, setShowPotentialView] = createSignal(false);

  const [potentialSelectionTrainer, setPotentialSelectionTrainer] =
    createSignal<TrainerNames | "">("");

  const rosterQuery = useRoster();

  createEffect(() => {
    if (user()?.username) {
      rosterQuery.refetch();
    }
  });

  const importRosterFromCSV: JSX.EventHandler<HTMLInputElement, InputEvent> = (
    e
  ) => {
    const file = e.currentTarget.files[0];
    Papa.parse<{
      Name: TrainerNames;
      "Potential 1": Skill;
      "Potential 2": Skill;
      "Potential 3": Skill;
      Level: string;
    }>(file, {
      header: true,
      complete(results) {
        const rosterObj = results.data.reduce<RosterType>((acc, trainer) => {
          if (trainer.Name.includes("/")) {
            const trainerNames = trainer.Name.split("/");
            trainerNames.forEach((name) => {
              acc[name] = {
                stars: parseInt(trainer.Level || "0", 10) as RankLevels,
                potential: [
                  trainer["Potential 1"],
                  trainer["Potential 2"],
                  trainer["Potential 3"],
                ],
              };
            });
          } else {
            acc[trainer.Name] = {
              stars: parseInt(trainer.Level || "0", 10) as RankLevels,
              potential: [
                trainer["Potential 1"],
                trainer["Potential 2"],
                trainer["Potential 3"],
              ],
            };
          }
          return acc;
        }, {});
        saveRoster(rosterObj);
      },
    });
  };

  const updateTrainer = <K extends keyof Trainer>(
    trainerName: Trainer["name"],
    valuesToUpdate: Record<K, Trainer[K]>
  ) => {
    saveTrainer(trainerName, valuesToUpdate);
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
              trainers={rosterQuery.data}
              updateTrainer={updateTrainer}
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
