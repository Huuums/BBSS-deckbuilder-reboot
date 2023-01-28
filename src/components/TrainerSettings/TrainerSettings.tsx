import { createSignal, Show } from "solid-js";
import RadioButton from "@components/RadioButton";
import Trainer from "@components/Trainer/Trainer";
import {
  Trainer as TrainerType,
  TrainerSettings as TrainerSettingsType,
} from "@localtypes/types";
import type { Component } from "solid-js";

type TrainerSettingsProps = {
  trainer: TrainerType;
  src: string;
  updateTrainer: <K extends keyof TrainerSettingsType>(
    valuesToUpdate: Partial<Record<K, TrainerSettingsType[K]>>
  ) => void;
};

const TrainerSettings: Component<TrainerSettingsProps> = (props) => {
  const [customName, setCustomName] = createSignal(
    //eslint-disable-next-line
    props.trainer?.customName || ""
  );
  const [useSkin, setUseSkin] = createSignal(
    //eslint-disable-next-line
    props.trainer?.useSkin || false);

  return (
    <>
      <div class="w-full bg-gray-800 p-2 flex flex-wrap justify-center">
        <Trainer
          onlyAvatarAndStars
          trainer={props.trainer}
          src={props.src}
          class="h-full basis-20"
        />
        <div class="flex basis-full flex-col lg:flex-row lg:flex-wrap flex-1 justify-between text-gray-200">
          <h4 class="basis-full text-gray-200 font-semibold text-center">
            {props.trainer.name}
          </h4>
          <div class="basis-full lg:basis-auto flex-1">
            <label class="text-gray-200 font-medium lg:w-auto">Trainer </label>
            <div class="relative flex items-center bg-gray-900">
              <input
                value={customName() || ""}
                type="text"
                class="h-12 w-full border-0 bg-transparent pl-4 pr-4 text-white  placeholder-gray-500 focus:ring-0 sm:text-sm"
                placeholder={"Custom Trainername"}
                onInput={(e) => setCustomName(e.currentTarget.value)}
              />
            </div>
          </div>
        </div>
        <div class="flex flex-1 flex-wrap mt-3 ">
          <label class="text-gray-200 font-medium lg:w-auto basis-full">
            Use Skin?
          </label>
          <Show
            when={props.trainer.hasSkin}
            fallback={
              <span class="text-gray-200">
                This Trainer does not have a skin
              </span>
            }
          >
            <div class="inline-flex space-x-2">
              <RadioButton
                value={true}
                label="Yes"
                onClick={(val) => {
                  setUseSkin(val);
                }}
                isActive={useSkin()}
              />
              <RadioButton
                value={false}
                label="No"
                onClick={(val) => {
                  setUseSkin(val);
                }}
                isActive={!useSkin()}
              />
            </div>
          </Show>
        </div>
      </div>
      <div>
        <button
          type="submit"
          class="flex w-full mt-5 justify-center mx-auto rounded-md border border-transparent max-w-xs bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() =>
            props.updateTrainer({
              customName: customName(),
              useSkin: useSkin(),
            })
          }
        >
          Save
        </button>
      </div>
    </>
  );
};

export default TrainerSettings;
