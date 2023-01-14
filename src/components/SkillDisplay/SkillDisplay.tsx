import skillDefinitions from "@assets/json/skillDefinitions";
import Skill from "@components/Skill/Skill";
import {
  RankLevels,
  Skill as SkillNames,
  SkillDiff,
  SkillRanks,
  SkillType,
} from "@localtypes/types";

import {
  sortByGradeAndLevel,
  sortSkillGroupsByCategory,
} from "@utils/skillHelpers";
import { Component, For, Switch, Match, createMemo } from "solid-js";

type SkillDisplayProps = {
  activeSkills: SkillRanks;
  categorize?: boolean;
  diff?: SkillDiff;
};

const SkillDisplay: Component<SkillDisplayProps> = (props) => {
  const activeSkills = createMemo(() => {
    if (props.categorize) {
      const skillsGroupedByCategory = Object.entries(props.activeSkills).reduce<
        Partial<Record<SkillType | "Changes", [SkillNames, RankLevels][]>>
      >(
        (acc, [skillName, skillRank]) => {
          if (props.diff?.[skillName]) {
            //wtf typescript
            acc["Changes"].push([skillName as SkillNames, skillRank]);
          }
          const skillType = skillDefinitions[skillName].type;
          if (acc[skillType]) {
            acc[skillType].push([skillName, skillRank]);
          } else {
            acc[skillType] = [[skillName, skillRank]];
          }
          return acc;
        },
        props.diff
          ? {
              Changes: Object.entries(props.diff)
                .filter(([_key, diff]) => diff.from + diff.value === 0)
                .map(([key]) => [
                  //another wtf typescript
                  key as SkillNames,
                  0 as RankLevels,
                ]),
            }
          : {}
      );
      const entries = Object.entries(skillsGroupedByCategory)
        .map<[SkillType, [SkillNames, RankLevels][]]>(
          (group: [SkillType, [SkillNames, RankLevels][]]) => [
            group[0],
            group[1].sort(sortByGradeAndLevel),
          ]
        )
        .sort(sortSkillGroupsByCategory);

      return entries;
    }

    return Object.entries(props.activeSkills).sort(sortByGradeAndLevel);
  });

  return (
    <>
      <Switch>
        <Match when={props.categorize}>
          <div class="category">
            <For each={activeSkills()}>
              {([groupName, skillsList]) => (
                <>
                  <div class="text-xl text-gray-200 my-3">{groupName}</div>
                  <div class="space-y-1">
                    <For
                      each={typeof skillsList !== "number" ? skillsList : false} // type narrowing works like shit so have to do manually
                    >
                      {([skillName, skillRank]) => (
                        <>
                          <Skill
                            name={skillName}
                            rank={skillRank}
                            diff={props.diff && props.diff?.[skillName]?.value}
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
        </Match>
        <Match when={!props.categorize}>
          <div class="space-y-1">
            <For each={activeSkills()}>
              {([skillName, skillRank]: [SkillNames, RankLevels]) => (
                <>
                  <Skill
                    name={skillName}
                    rank={skillRank}
                    grade={skillDefinitions[skillName].skillGrade}
                  />
                </>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </>
  );
};

export default SkillDisplay;
