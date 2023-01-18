import {
  RankLevels,
  Rarity,
  Skill as SkillNames,
  SkillValue,
} from "@localtypes/types";
import { classNames } from "@utils/commonHelpers";

import { IoStarHalfSharp, IoStarSharp } from "solid-icons/io";
import { Component, Match } from "solid-js";
import { Switch } from "solid-js";

type SkillProps = {
  grade: Rarity;
  rank: RankLevels;
  name: SkillNames;
  isBestSkill?: boolean;
  isBestSkillEncyclopedia?: boolean;
  value: SkillValue;
  valueDiff?: number;
  diff?: number;
};

const getBgClass = (grade: Rarity) => {
  switch (grade) {
    case "N":
      return "bg-gradient-to-r border-l-rarity-N from-rarity-N-dark via-rarity-N to-rarity-N";
    case "R":
      return "bg-gradient-to-r border-l-[#4d5aef] from-rarity-R-dark to-[#4d5aef]";
    case "SR":
      return "bg-gradient-to-r border-l-[#9768d1] from-rarity-SR-dark to-[#9768d1]";
    case "SSR":
      return "bg-gradient-to-r border-l-rarity-SSR from-rarity-SSR-dark to-rarity-SSR";
    case "UR":
      return "bg-gradient-to-r border-l-[#e1b307] from-rarity-UR-dark to-[#e1b307]";
  }
};

const Skill: Component<SkillProps> = (props) => {
  return (
    <div
      class={classNames(
        props.rank === 0
          ? "line-through bg-gray-600 border-l-gray-600"
          : getBgClass(props.grade),
        "overflow-visible h-8 p-1 pl-5 ml-4 mr-2 relative flex items-center",
        "after:content[''] after:top-0 after:absolute after:right-0 after:translate-x-full after:border-t-[1rem] after:border-t-transparent after:border-l-[.75rem] after:border-l-inherit after:border-b-[1rem] after:border-b-transparent"
      )}
    >
      <span
        class={classNames(
          props.rank === 5 ? "shadow-maxSkill" : "",

          "after:content-[''] after:absolute after:right-0 after:translate-x-full after:border-t-[.625rem] after:border-t-transparent after:border-l-[.5rem] after:border-l-gray-200 after:border-b-[.625rem] after:border-b-transparent",
          "before:content-[''] before:absolute before:left-0 before:-translate-x-full before:border-t-[.625rem] before:border-t-transparent before:border-r-[.5rem] before:border-r-gray-200 before:border-b-[.625rem] before:border-b-transparent",
          "absolute top-0 bottom-0 my-auto h-5 w-3 left-0 -translate-x-1/2 bg-gray-200 mask-hexagon text-xs flex justify-center items-center "
        )}
      >
        {props.rank}
      </span>
      {props.diff && (
        <Switch>
          <Match when={props.diff < 0}>
            <span
              class={classNames(
                "after:content-[''] after:absolute after:right-0 after:translate-x-full after:border-t-[.625rem] after:border-t-transparent after:border-l-[.5rem] after:border-l-red-400 after:border-b-[.625rem] after:border-b-transparent",
                "before:content-[''] before:absolute before:left-0 before:-translate-x-full before:border-t-[.625rem] before:border-t-transparent before:border-r-[.5rem] before:border-r-red-400 before:border-b-[.625rem] before:border-b-transparent",
                "absolute top-0 bottom-0 my-auto h-5 w-3 left-0 -translate-x-1/2 bg-red-400 mask-hexagon text-xs flex justify-center items-center z-50 animate-pulse-full"
              )}
            >
              {props.diff}
            </span>
          </Match>
          <Match when={props.diff > 0}>
            <span
              class={classNames(
                "after:content-[''] after:absolute after:right-0 after:translate-x-full after:border-t-[.625rem] after:border-t-transparent after:border-l-[.5rem] after:border-l-green-400 after:border-b-[.625rem] after:border-b-transparent",
                "before:content-[''] before:absolute before:left-0 before:-translate-x-full before:border-t-[.625rem] before:border-t-transparent before:border-r-[.5rem] before:border-r-green-400 before:border-b-[.625rem] before:border-b-transparent",
                "absolute top-0 bottom-0 my-auto h-5 w-3 left-0 -translate-x-1/2 bg-green-400 mask-hexagon text-xs flex justify-center items-center animate-pulse-full"
              )}
            >
              +{props.diff}
            </span>
          </Match>
        </Switch>
      )}
      <Switch>
        <Match when={!props.valueDiff}>
          <span class="text-white text-sm font-medium mr-1">
            [{props.value}]
          </span>
        </Match>
        <Match when={props.valueDiff > 0}>
          <span class="text-green-400 text-sm font-medium mr-1 animate-pulse-full">
            [+{props.valueDiff}]
          </span>
          <span class="text-white absolute text-sm font-medium mr-1 animate-pulse-full-reverse">
            [{props.value}]
          </span>
        </Match>
        <Match when={props.valueDiff < 0}>
          <span class="text-red-400 text-sm font-medium mr-1 animate-pulse-full">
            [{props.valueDiff}]
          </span>
          <span class="text-white absolute text-sm font-medium mr-1 animate-pulse-full-reverse">
            [{props.value}]
          </span>
        </Match>
      </Switch>
      <span class="text-gray-200 text-sm font-medium">{props.name}</span>
      <Switch>
        <Match when={props.isBestSkill}>
          <IoStarSharp class="ml-auto w-6 h-6 fill-white line-through " />
        </Match>
        <Match when={props.isBestSkillEncyclopedia}>
          <IoStarHalfSharp class="ml-auto w-6 h-6 fill-white line-through " />
        </Match>
      </Switch>
    </div>
  );
};

export default Skill;
