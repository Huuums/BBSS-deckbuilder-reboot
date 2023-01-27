import { For } from "solid-js";
import {
  RankLevels,
  Skill as SkillNames,
  SkillDiff,
  SkillRanks,
  Trainer,
} from "@localtypes/types";
import type { Component } from "solid-js";
import Skill from "@components/Skill";
import skillDefinitions from "@assets/json/skillDefinitions";

type SimpleSkillListProps = {
  skills: SkillRanks;
  potential: Trainer["potential"];
  diff: SkillDiff;
};

const SimpleSkillList: Component<SimpleSkillListProps> = (props) => {
  return (
    <div class="grid grid-cols-1 content-start sm:grid-cols-2 gap-x-3 gap-y-1 flex-1 w-full max-w-sm sm:max-w-lg sm:basis-44">
      <For each={Object.keys(props.skills)}>
        {(key: SkillNames) => (
          <Skill
            grade={skillDefinitions[key].skillGrade}
            rank={
              Math.min(
                props.skills[key] +
                  props.potential.filter((val) => val === key).length,
                5
              ) as RankLevels
            }
            diff={props.diff?.[key]?.levelDiff}
            class="flex-1"
            potential={
              (props.potential.filter?.((val) => val === key)?.length || 0) as
                | 0
                | 1
                | 2
            }
            name={key}
          />
        )}
      </For>
    </div>
  );
};

export default SimpleSkillList;
