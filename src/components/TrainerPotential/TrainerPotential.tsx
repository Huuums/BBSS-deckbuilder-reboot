import Trainer from "@components/Trainer/Trainer";
import trainerImages from "@assets/images/trainer";
import { Skill, Trainer as TrainerType } from "@localtypes/types";
import { Component, Switch, Match, createSignal } from "solid-js";
import { Select, createOptions } from "@thisbeyond/solid-select";

type TrainerPotentialProps = {
  mode: "large" | "small";
  trainer: TrainerType;
  updateTrainer: (potential: TrainerType["potential"]) => void;
};

const TrainerPotential: Component<TrainerPotentialProps> = (props) => {
  const [initialValue1] = createSignal(props.trainer.potential[0] || undefined);
  const [initialValue2] = createSignal(props.trainer.potential[1] || undefined);
  const [initialValue3] = createSignal(props.trainer.potential[2] || undefined);

  const potentialSkills = createOptions(
    Object.keys(props.trainer.skills?.[props.trainer.stars] || {}),
    {
      disable(value) {
        return (
          props.trainer.potential.filter((val) => val === value).length > 1
        );
      },
    }
  );

  //really have to get rid of solid-select package. It sucks
  //eslint-disable-next-line

  // TBD: get rid of shitty select component and then refactor all of this
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
        <div class="w-full bg-gray-800 p-2 flex flex-wrap justify-between ">
          <Trainer
            onlyAvatarAndStars
            trainer={props.trainer}
            src={trainerImages[props.trainer.name]}
            class="h-full basis-full lg:basis-auto lg:w-20"
          />
          <div class="flex flex-col lg:flex-row lg:flex-wrap flex-1 justify-between text-gray-200 lg:space-x-2">
            <h4 class="basis-full text-gray-200 font-semibold">
              {props.trainer.name}
            </h4>
            <div class="flex flex-col flex-1">
              <label class="font-medium">Potential 1</label>
              <Select
                initialValue={initialValue1() || undefined}
                onChange={(val: Skill) => {
                  val !== initialValue1() &&
                    props.updateTrainer([
                      val,
                      props.trainer.potential?.[1] || "",
                      props.trainer.potential?.[2] || "",
                    ] as TrainerType["potential"]);
                }}
                {...potentialSkills}
              />
            </div>
            <div class="flex flex-col flex-1">
              <label class="font-medium">Potential 2</label>
              <Select
                initialValue={initialValue2() || undefined}
                onChange={(val: Skill) => {
                  val !== initialValue2() &&
                    props.updateTrainer([
                      props.trainer.potential?.[0] || "",
                      val,
                      props.trainer.potential?.[2] || "",
                    ] as TrainerType["potential"]);
                }}
                {...potentialSkills}
              />
            </div>
            <div class="flex flex-col flex-1">
              <label class="font-medium">Potential 3</label>
              <Select
                initialValue={initialValue3() || undefined}
                onChange={(val: Skill) => {
                  val !== initialValue3() &&
                    props.updateTrainer([
                      props.trainer.potential?.[0] || "",
                      props.trainer.potential?.[1] || "",
                      val,
                    ] as TrainerType["potential"]);
                }}
                {...potentialSkills}
              />
            </div>
          </div>
        </div>
      </Match>
    </Switch>
  );
};

export default TrainerPotential;
