import Trainer from "@components/Trainer/Trainer";
import trainerImages from "@assets/images/trainer";
import { Trainer as TrainerType } from "@localtypes/types";
import { Component, Switch, Match } from "solid-js";
import Combobox from "@components/Combobox";

type TrainerPotentialProps = {
  mode: "large" | "small";
  trainer: TrainerType;
  updateTrainer: (potential: TrainerType["potential"]) => void;
};

const TrainerPotential: Component<TrainerPotentialProps> = (props) => {
  const options = () =>
    Object.keys(props.trainer.skills?.[props.trainer.stars] || {});

  return (
    <Switch>
      <Match when={props.trainer.stars === 0}>
        <div class="w-full bg-gray-800 p-2 flex justify-between">
          <Trainer
            onlyAvatarAndStars
            trainer={props.trainer}
            src={trainerImages[props.trainer.name]}
            class="h-full w-20"
          />
          <div class="flex flex-wrap flex-1 justify-between space-x-2 text-gray-200">
            <h4 class="basis-full text-gray-200 font-semibold mx-2">
              {props.trainer.name}
            </h4>
            <h5>
              A Trainer with rank 0 cannot have Potential. Please set the
              Trainer rank first.
            </h5>
          </div>
        </div>
      </Match>
      <Match when={props.mode === "large"}>
        <div class="w-full bg-gray-800 p-2 flex flex-wrap justify-center">
          <Trainer
            onlyAvatarAndStars
            trainer={props.trainer}
            src={trainerImages[props.trainer.name]}
            class="h-full basis-20"
          />
          <div class="flex basis-full flex-col lg:flex-row lg:flex-wrap flex-1 justify-between text-gray-200 lg:space-x-2">
            <h4 class="basis-full text-gray-200 font-semibold text-center">
              {props.trainer.name}
            </h4>
            <div class="flex flex-col flex-1">
              <label class="font-medium">Potential 1</label>
              <Combobox
                value={props.trainer.potential?.[0]}
                valueDisplayText={props.trainer.potential?.[0]}
                placeholder="Potential 1"
                optionIsDisabled={(val) =>
                  props.trainer.potential.filter((skill) => skill === val)
                    .length >= 2 || val === "Switch Hitter"
                }
                onChange={(val) => {
                  props.updateTrainer([
                    val,
                    props.trainer.potential?.[1] || "",
                    props.trainer.potential?.[2] || "",
                  ] as TrainerType["potential"]);
                }}
                options={options()}
              />
            </div>
            <div class="flex flex-col flex-1">
              <label class="font-medium">Potential 2</label>
              <Combobox
                options={options()}
                placeholder="Potential 2"
                value={props.trainer.potential?.[1]}
                valueDisplayText={props.trainer.potential?.[1]}
                optionIsDisabled={(val) =>
                  props.trainer.potential.filter((skill) => skill === val)
                    .length >= 2
                }
                onChange={(val) => {
                  props.updateTrainer([
                    props.trainer.potential?.[0] || "",
                    val,
                    props.trainer.potential?.[2] || "",
                  ] as TrainerType["potential"]);
                }}
              />
            </div>
            <div class="flex flex-col flex-1">
              <label class="font-medium">Potential 3</label>
              <Combobox
                optionIsDisabled={(val) =>
                  props.trainer.potential.filter((skill) => skill === val)
                    .length >= 2
                }
                placeholder="Potential 3"
                value={props.trainer.potential?.[2]}
                valueDisplayText={props.trainer.potential?.[2]}
                onChange={(val) => {
                  console.log(val);
                  props.updateTrainer([
                    props.trainer.potential?.[0] || "",
                    props.trainer.potential?.[1] || "",
                    val,
                  ] as TrainerType["potential"]);
                }}
                options={options()}
              />
            </div>
          </div>
        </div>
      </Match>
    </Switch>
  );
};

export default TrainerPotential;
