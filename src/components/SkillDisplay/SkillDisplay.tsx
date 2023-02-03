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
import { classNames } from "@utils/commonHelpers";

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
          <div class="flex items-center justify-center space-x-2">
            <IoStarSharp class="w-8 h-8 fill-white line-through " />
            <span
              class={classNames(
                "shadow-maxSkill",
                "after:content-[''] after:absolute after:right-0 after:translate-x-full after:border-t-[.625rem] after:border-t-transparent after:border-l-[.5rem] after:border-l-gray-200 after:border-b-[.625rem] after:border-b-transparent",
                "before:content-[''] before:absolute before:left-0 before:-translate-x-full before:border-t-[.625rem] before:border-t-transparent before:border-r-[.5rem] before:border-r-gray-200 before:border-b-[.625rem] before:border-b-transparent",
                "mx-auto h-5 w-3 relative bg-gray-200 text-xs flex justify-center items-center "
              )}
            />
          </div>
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
          <div class="flex justify-center items-center space-x-2">
            <IoStarHalfSharp class="w-8 h-8 fill-white line-through " />
            <span
              class={classNames(
                "shadow-maxSkillEncyclopedia",
                "after:content-[''] after:absolute after:right-0 after:translate-x-full after:border-t-[.625rem] after:border-t-transparent after:border-l-[.5rem] after:border-l-gray-200 after:border-b-[.625rem] after:border-b-transparent",
                "before:content-[''] before:absolute before:left-0 before:-translate-x-full before:border-t-[.625rem] before:border-t-transparent before:border-r-[.5rem] before:border-r-gray-200 before:border-b-[.625rem] before:border-b-transparent",
                "mx-auto h-5 w-3 relative bg-gray-200 text-xs flex justify-center items-center "
              )}
            />
          </div>
        </div>
      </div>
      <div class="flex text-white items-center justify-center flex-col mt-3 mb-0 font-semibold">
        Max Skills
        <span class="text-2xl font-bold">
          {props.skillInformationTemp
            ? props.skillInformationTemp.skillData.filter((val) => val[1] === 5)
                .length
            : props.skillInformationDeck.skillData.filter((val) => val[1] === 5)
                .length}
        </span>
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
