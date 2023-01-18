import Modal from "@components/Modal";
import { useSaveCompleteRoster } from "@hooks/useSaveRoster";
import { classNames } from "@utils/commonHelpers";
import { Component, createSignal, Switch, Match, JSX } from "solid-js";
import Papa from "papaparse";
import { Skill, TrainerNames, Roster, RankLevels } from "@localtypes/types";

type ImportRosterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ImportRosterModal: Component<ImportRosterModalProps> = (props) => {
  const [view, setView] = createSignal<string>("spreadsheet");
  const saveRoster = useSaveCompleteRoster();

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
        try {
          const rosterObj = results.data.reduce<Roster>((acc, trainer) => {
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
          props.onClose();
        } catch (e) {
          console.log(e);
          new Error(e);
        }
      },
    });
  };

  const importFromJSON: JSX.EventHandler<HTMLInputElement, InputEvent> = async (
    e
  ) => {
    const parseJsonFile = (file: File) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) =>
          resolve(JSON.parse(event.target.result as string));
        fileReader.onerror = (error) => reject(error);
        fileReader.readAsText(file);
      });
    };
    try {
      const json: Partial<Record<TrainerNames, number>> = await parseJsonFile(
        e.currentTarget.files[0]
      );
      const rosterObj = Object.keys(json).reduce((acc, trainerName) => {
        acc[trainerName] = {
          stars: json[trainerName],
          potential: ["", "", ""],
        };
        return acc;
      }, {});
      saveRoster(rosterObj);
      props.onClose();
    } catch (e) {
      console.log(e);
      new Error(e);
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={() => props.onClose()}>
      <h2 class="text-gray-200 text-center my-3 text-2xl">Import Roster</h2>
      <div class="flex bg-gray-800 text-gray-300 mx-auto p-3">
        <button
          class={classNames(
            "basis-1/2 p-2",
            view() === "spreadsheet" ? "bg-gray-600 text-white" : ""
          )}
          onClick={() => setView("spreadsheet")}
        >
          Deckbuilder Spreadsheet by Argos2
        </button>
        <button
          class={classNames(
            "basis-1/2 p-2",
            view() === "deckbuilder-old" ? "bg-gray-600 text-white" : ""
          )}
          onClick={() => setView("deckbuilder-old")}
        >
          Old Deckbuilder Website
        </button>
      </div>
      <Switch>
        <Match when={view() === "spreadsheet"}>
          <div class="p-3 text-gray-300">
            <ol class="list">
              <li>1. Open your copy of the Argos2 Deckbuilder Spreadsheet</li>
              <li>2. Choose the "Roster" sheet in the list at the bottom</li>
              <li>
                3. At the top left of the screen Go to "File" -&gt; "Download"
                -&gt; Click on "Comma Separated Values (.csv)"
              </li>
              <li>4. Upload the Downloaded File in the input below.</li>
              <li>5. The import is done.</li>
            </ol>
            <input type="file" onChange={importRosterFromCSV} accept=".csv" />
          </div>
        </Match>
        <Match when={view() === "deckbuilder-old"}>
          <div class="p-3 text-gray-300">
            <ol class="list">
              <li>
                1. Login on the old deckbuilder:{" "}
                <a href="https://basu2020-deckbuilder.netlify.app/login">
                  https://basu2020-deckbuilder.netlify.app/login
                </a>
              </li>
              <li>
                2. Go to the Roster page:{" "}
                <a href="https://basu2020-deckbuilder.netlify.app/roster">
                  https://basu2020-deckbuilder.netlify.app/roster
                </a>
              </li>
              <li>3. Click on Export Roster</li>
              <li>4. Upload the Downloaded File in the input below.</li>
              <li>5. The import is done.</li>
            </ol>
            <input type="file" onChange={importFromJSON} accept=".json" />
          </div>
        </Match>
      </Switch>
    </Modal>
  );
};

export default ImportRosterModal;
