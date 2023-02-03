import RadioButton from "@components/RadioButton";
import Skill from "@components/Skill";
import Trainer from "@components/Trainer";
import trainerImages from "../../assets/images/trainer";
import {
  Deck,
  Position,
  Trainer as TrainerType,
  Skill as SkillName,
} from "@localtypes/types";
import {
  getBestSkillsInDeck,
  getDeckSkillValue,
  getOptimalPotentialForDeck,
} from "@utils/skillHelpers";
import {
  Accordion,
  AccordionButton,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
} from "solid-headless";
import { HiOutlineX } from "solid-icons/hi";
import { IoChevronUpOutline } from "solid-icons/io";
import { Component, createSignal, Show, For } from "solid-js";
import skillDefinitions from "@assets/json/skillDefinitions";
import PositionChoice from "@components/PositionChoice";
import { classNames } from "@utils/commonHelpers";

type OptimalPotentialDisplayProps = {
  targetPosition: Position | "0";
  setTargetPosition: (val: Position | "0") => void;
  deck: Deck;
};

const OptimalPotentialDisplay: Component<OptimalPotentialDisplayProps> = (
  props
) => {
  const [maxURPotential, setMaxURPotential] = createSignal<0 | 1 | 2 | 3>(3);

  const optimalPotential = () => {
    if (props.deck.filter((val) => val !== "empty").length === 6) {
      return getOptimalPotentialForDeck(
        props.deck,
        maxURPotential(),
        props.targetPosition
      );
    }
    return undefined;
  };

  const deckValue = () => {
    return getDeckSkillValue(
      props.deck.map((val) =>
        val !== "empty"
          ? {
              ...val,
              potential:
                optimalPotential().optimalPotentialPerTrainer[val.name],
            }
          : val
      ),
      props.targetPosition
    );
  };

  return (
    <div class="flex flex-col px-2 py-4">
      <div class="px-3 lg:py-3 flex space-x-3 items-start justify-around max-w-5xl mx-auto flex-wrap ">
        <div class="flex basis-full text-white">
          <h4 class="text-white flex-1 text-center font-semibold mb-3">
            Player Position
          </h4>
        </div>
        <PositionChoice
          onChange={(val) => props.setTargetPosition(val)}
          currentPosition={props.targetPosition}
        />
      </div>
      <div class="flex flex-wrap justify-center">
        <label class="text-gray-200 font-medium lg:w-auto basis-full text-center mt-5 lg:mt-0">
          Maximum UR Grade Potential per Trainer{" "}
        </label>
        <div class="basis-full lg:basis-auto flex-1 flex space-x-2 flex-wrap mb-5 justify-center">
          <RadioButton
            class="w-10"
            isActive={maxURPotential() === 0}
            onClick={(e) => setMaxURPotential(e)}
            value={0}
          />{" "}
          <RadioButton
            class="w-10"
            isActive={maxURPotential() === 1}
            onClick={(e) => setMaxURPotential(e)}
            value={1}
          />{" "}
          <RadioButton
            class="w-10"
            isActive={maxURPotential() === 2}
            onClick={(e) => setMaxURPotential(e)}
            value={2}
          />{" "}
          <RadioButton
            class="w-10"
            isActive={maxURPotential() === 3}
            onClick={(e) => setMaxURPotential(e)}
            value={3}
          />
        </div>
      </div>
      <div class="max-w-sm flex space-x-5 mx-auto my-5">
        <div class="bg-gray-800 h-30 w-1/2 text-center border py-2 relative border-gray-200">
          <span class="font-bold text-3xl text-white align-self-center">
            {deckValue().deckValue}
          </span>

          <h4 class="text-gray-200 text-xs font-semibold mt-1 p-2">
            Deck Skillvalue optimal Potential
          </h4>
        </div>
        <div class="bg-gray-800 h-30 w-1/2 text-center border py-2 relative border-gray-200">
          <span class="font-bold text-3xl text-white align-self-center">
            {deckValue().deckValueEncyclopedia}
          </span>

          <h4 class="text-gray-200 text-xs font-semibold mt-1 p-2">
            Deck Skillvalue optimal Potential and Encyclopedia
          </h4>
        </div>
      </div>
      <Show when={optimalPotential()}>
        <div class="grid gap-y-2 gap-x-2 sm:grid-cols-2">
          <For each={props.deck}>
            {(trainer) => (
              <div class="flex bg-gray-900 border">
                <Trainer
                  onlyAvatarAndStars
                  class="w-24"
                  src={
                    (trainer as TrainerType).useSkin
                      ? trainerImages[`${(trainer as TrainerType).name}_skin`]
                      : trainerImages[(trainer as TrainerType).name] ||
                        trainerImages["placeholder"]
                  }
                  trainer={trainer as TrainerType}
                />
                <div class="flex flex-col flex-1 space-y-1 pr-2 pt-2">
                  <For
                    each={[
                      ...new Set(
                        optimalPotential().optimalPotentialPerTrainer[
                          (trainer as TrainerType).name
                        ]
                      ),
                    ]}
                  >
                    {(skill: SkillName) => (
                      <Skill
                        grade={skillDefinitions[skill].skillGrade}
                        name={skill}
                        potential={
                          optimalPotential().optimalPotentialPerTrainer[
                            (trainer as TrainerType).name
                          ].filter((row) => row === skill).length as 0 | 1 | 2
                        }
                      />
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
        </div>
        <Accordion defaultValue={undefined} toggleable>
          <AccordionItem value={"filter"} class="mt-2">
            <AccordionHeader>
              <AccordionButton
                as="h2"
                class={
                  "flex justify-center items-center bg-gray-900 text-white py-2 text-xl text-center font-bold px-4"
                }
              >
                {({ isSelected }) => (
                  <>
                    Best Potential Skills in order
                    <div class="ml-auto">
                      <Show
                        when={!isSelected()}
                        fallback={<HiOutlineX class="w-8 h-8 text-gray-50" />}
                      >
                        <IoChevronUpOutline
                          class={`flex-0 transform rotate-180 w-8 h-8 text-gray-50 `}
                        />
                      </Show>
                    </div>
                  </>
                )}
              </AccordionButton>
            </AccordionHeader>
            <AccordionPanel class="px-4 pt-4 pb-2 text-sm text-gray-900 bg-gray-900 dark:text-gray-50">
              <div class="flex flex-col space-y-1">
                <For each={optimalPotential().optimalPotentialSkillOrder}>
                  {(skill) => (
                    <Skill
                      grade={skill.skillGrade}
                      name={skill.skill}
                      rank={skill.rank}
                      potential={skill.maxPotentialOnSkill}
                    />
                  )}
                </For>
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Show>
    </div>
  );
};

export default OptimalPotentialDisplay;
