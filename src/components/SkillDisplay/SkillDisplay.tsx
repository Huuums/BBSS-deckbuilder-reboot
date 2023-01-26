import skillDefinitions from "@assets/json/skillDefinitions";
import Skill from "@components/Skill/Skill";
import {
  Position,
  RankLevels,
  Skill as SkillNames,
  SkillData,
  SkillDiff,
  SkillType,
  SkillValue,
  TrainerNames,
} from "@localtypes/types";

import {
  sortByGradeAndLevel,
  sortSkillGroupsByCategory,
} from "@utils/skillHelpers";
import { IoStarHalfSharp, IoStarSharp } from "solid-icons/io";
import { Component, For, Switch, Match, createMemo } from "solid-js";

type SkillDisplayProps = {
  skillInformationDeck: {
    skillData: SkillData[];
    listOfBestSkillsDefault: Partial<Record<SkillNames, SkillData>>;
    listOfBestSkillsEncyclopedia: Partial<Record<SkillNames, SkillData>>;
    bestSkillsValueDefault: number;
    bestSkillsValueEncyclopedia: number;
    trainerContribution: Partial<
      Record<
        SkillNames,
        Partial<Record<TrainerNames, { total: number; potential: number }>>
      >
    >;
  };
  skillInformationTemp:
    | {
        skillData: SkillData[];
        listOfBestSkillsDefault: Partial<Record<SkillNames, SkillData>>;
        listOfBestSkillsEncyclopedia: Partial<Record<SkillNames, SkillData>>;
        bestSkillsValueDefault: number;
        bestSkillsValueEncyclopedia: number;
      }
    | undefined;
  diff?: SkillDiff;
  targetPosition?: Position;
};

const SkillDisplay: Component<SkillDisplayProps> = (props) => {
  const activeSkills = createMemo(() => {
    const skillsGroupedByCategory = (
      props.skillInformationTemp || props.skillInformationDeck
    ).skillData.reduce<Partial<Record<SkillType | "Changes", SkillData[]>>>(
      (acc, skill) => {
        const [skillName] = skill;
        if (props.diff?.[skillName]) {
          //wtf typescript
          acc["Changes"].push(skill);
        }
        const skillType = skillDefinitions[skillName].type;
        if (acc[skillType]) {
          acc[skillType].push(skill);
        } else {
          acc[skillType] = [skill];
        }
        return acc;
      },
      props.diff
        ? {
            Changes: Object.entries(props.diff)
              .filter(([_key, diff]) => diff.from + diff.levelDiff === 0)
              .map(([key, diff]) => [
                //another wtf typescript
                key as SkillNames,
                0 as RankLevels,
                diff.valueDiff as SkillValue,
              ]),
          }
        : {}
    );
    const entries = Object.entries(skillsGroupedByCategory)
      .map<[SkillType, SkillData[]]>((group: [SkillType, SkillData[]]) => [
        group[0],
        group[1].sort(sortByGradeAndLevel),
      ])
      .sort(sortSkillGroupsByCategory);

    return entries;
  });

  return (
    <>
      <div class="flex space-x-2 mt-2">
        <div class="bg-gray-800 h-30 w-1/2 text-center border py-2 relative border-gray-200">
          <Switch>
            <Match
              when={
                !props.diff ||
                props.skillInformationTemp?.bestSkillsValueDefault ===
                  props.skillInformationDeck?.bestSkillsValueDefault
              }
            >
              <span class="font-bold text-3xl text-white align-self-center">
                {props.skillInformationDeck.bestSkillsValueDefault}
              </span>
            </Match>
            <Match
              when={
                // improvement
                props.diff &&
                props.skillInformationDeck.bestSkillsValueDefault <
                  props.skillInformationTemp.bestSkillsValueDefault
              }
            >
              <span class="font-bold text-3xl h-full mx-auto text-white animate-pulse-full-reverse">
                {props.skillInformationTemp.bestSkillsValueDefault}
              </span>
              <span class="font-bold text-3xl text-green-400 animate-pulse-full absolute left-0 right-0 text-center">
                +
                {props.skillInformationTemp.bestSkillsValueDefault -
                  props.skillInformationDeck.bestSkillsValueDefault}
              </span>
            </Match>
            <Match
              when={
                // improvement
                props.diff &&
                props.skillInformationDeck.bestSkillsValueDefault >
                  props.skillInformationTemp.bestSkillsValueDefault
              }
            >
              <span class="font-bold text-3xl h-full mx-auto text-white animate-pulse-full-reverse">
                {props.skillInformationTemp.bestSkillsValueDefault}
              </span>
              <span class="font-bold text-3xl text-red-400 animate-pulse-full absolute left-0 right-0 text-center">
                {props.skillInformationTemp.bestSkillsValueDefault -
                  props.skillInformationDeck.bestSkillsValueDefault}
              </span>
            </Match>
          </Switch>
          <h4 class="text-gray-200 text-xs font-semibold mt-1">
            Deck Skillvalue
          </h4>
          <IoStarSharp class="mx-auto mt-1 w-8 h-8 fill-white line-through " />
        </div>
        <div class="bg-gray-800 w-1/2 text-center border py-2 relative border-gray-200">
          <Switch>
            <Match
              when={
                !props.diff ||
                props.skillInformationTemp.bestSkillsValueEncyclopedia ===
                  props.skillInformationDeck.bestSkillsValueEncyclopedia
              }
            >
              <span class="font-bold text-3xl text-white align-self-center">
                {props.skillInformationDeck.bestSkillsValueEncyclopedia}
              </span>
            </Match>
            <Match
              when={
                // improvement
                props.diff &&
                props.skillInformationDeck.bestSkillsValueEncyclopedia <
                  props.skillInformationTemp.bestSkillsValueEncyclopedia
              }
            >
              <span class="font-bold text-3xl h-full mx-auto text-white animate-pulse-full-reverse">
                {props.skillInformationTemp.bestSkillsValueEncyclopedia}
              </span>
              <span class="font-bold text-3xl text-green-400 animate-pulse-full absolute left-0 right-0 text-center">
                +
                {props.skillInformationTemp.bestSkillsValueEncyclopedia -
                  props.skillInformationDeck.bestSkillsValueEncyclopedia}
              </span>
            </Match>
            <Match
              when={
                // improvement
                props.diff &&
                props.skillInformationDeck.bestSkillsValueEncyclopedia >
                  props.skillInformationTemp.bestSkillsValueEncyclopedia
              }
            >
              <span class="font-bold text-3xl h-full mx-auto text-white animate-pulse-full-reverse">
                {props.skillInformationTemp.bestSkillsValueEncyclopedia}
              </span>
              <span class="font-bold text-3xl text-red-400 animate-pulse-full absolute left-0 right-0 text-center">
                {props.skillInformationTemp.bestSkillsValueEncyclopedia -
                  props.skillInformationDeck.bestSkillsValueEncyclopedia}
              </span>
            </Match>
          </Switch>
          <h4 class="text-gray-200 text-xs font-semibold mt-1">
            Deck with Encyclopedia
          </h4>
          <IoStarHalfSharp class="mx-auto mt-1 w-8 h-8 fill-white line-through " />
        </div>
      </div>

      <div class="category">
        <For each={activeSkills()}>
          {([groupName, skillsList]) => (
            <>
              <div class="text-xl text-gray-200 my-3">{groupName}</div>
              <div class="space-y-1">
                <For
                  // type narrowing works like shit so have to do manually
                  each={typeof skillsList !== "number" ? skillsList : false}
                >
                  {([skillName, skillRank, skillValue]) => (
                    <>
                      <Skill
                        name={skillName}
                        rank={skillRank}
                        value={skillValue}
                        trainerContribution={
                          props.skillInformationDeck.trainerContribution[
                            skillName
                          ]
                        }
                        isBestSkill={
                          props.skillInformationTemp !== undefined
                            ? props.skillInformationTemp
                                .listOfBestSkillsDefault[skillName] !==
                                undefined && skillValue > 0
                            : props.skillInformationDeck
                                .listOfBestSkillsDefault[skillName] !==
                                undefined && skillValue > 0
                        }
                        isBestSkillEncyclopedia={
                          props.skillInformationTemp
                            ? props.skillInformationTemp
                                .listOfBestSkillsDefault[skillName] ===
                                undefined &&
                              props.skillInformationTemp
                                .listOfBestSkillsEncyclopedia[skillName] !==
                                undefined &&
                              skillValue > 0
                            : props.skillInformationDeck
                                .listOfBestSkillsDefault[skillName] ===
                                undefined &&
                              props.skillInformationDeck
                                .listOfBestSkillsEncyclopedia[skillName] !==
                                undefined &&
                              skillValue > 0
                        }
                        valueDiff={
                          props.diff && props.diff?.[skillName]?.valueDiff
                        }
                        diff={props.diff && props.diff?.[skillName]?.levelDiff}
                        grade={skillDefinitions[skillName].skillGrade}
                      />
                    </>
                  )}
                </For>
              </div>
            </>
          )}
        </For>
      </div>
    </>
  );
};

export default SkillDisplay;
