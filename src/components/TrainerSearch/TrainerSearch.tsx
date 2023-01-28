import bonusTeams, { teamAbbreviations } from "@assets/bonusteams";
import CheckboxList from "@components/CheckboxList";

import SearchInput from "@components/SearchInput";
import {
  BattingPosition,
  ElementType,
  Filters,
  PitchingPosition,
  Skill,
} from "@localtypes/types";
import type { Component } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import teamImages from "@assets/images/teams";
import rarities from "@assets/rarities";
import statsTypes from "@assets/statsTypes";
import INT from "@assets/images/common/INT.png";
import STR from "@assets/images/common/STR.png";
import MNT from "@assets/images/common/MNT.png";
import DEX from "@assets/images/common/DEX.png";
import SP from "@assets/images/common/SP.png";
import GP from "@assets/images/common/GP.png";
import { battingPositions, pitchingPositions } from "@assets/positions";
import Combobox from "@components/Combobox";
import skillDefinitions from "@assets/json/skillDefinitions";

const typeImages = {
  INT,
  STR,
  MNT,
  DEX,
  SP,
  GP,
};

type TrainerSearchProps = {
  filters: Filters;
  setFilters: SetStoreFunction<Filters>;
};

const TrainerSearch: Component<TrainerSearchProps> = (props) => {
  const updateFilter = <T extends keyof Omit<Filters, "name">>(
    key: T,
    isChecked: boolean,
    val: ElementType<Omit<Filters, "name">[T]>
  ) => {
    //this works fuck off typescript
    if (isChecked) props.setFilters(key, (prev) => prev.concat(val));
    if (!isChecked)
      //this works fuck off typescript
      props.setFilters(key, (prev) => prev.filter((el) => el !== val));
  };

  return (
    <div class="flex flex-col flex-1 space-y-4">
      <div class="flex flex-wrap space-y-2 lg:space-y-0 space-x-0 lg:space-x-2">
        <div class="basis-full lg:basis-auto flex-1">
          <label class="text-gray-200 font-medium lg:w-auto">Trainer </label>
          <SearchInput
            onInput={(e) => props.setFilters("name", e.currentTarget.value)}
            placeholder="Enter Trainer Name"
          />
        </div>
        <div class="flex-1 basis-full lg:basis-auto">
          <label class="text-gray-200 font-medium lg:w-auto">Skill</label>
          <Combobox
            clearable
            options={Object.keys(skillDefinitions)}
            onChange={(val: Skill | "") =>
              props.setFilters("skill", val === "" ? [] : [val])
            }
            placeholder="Enter Skill Name"
            value={props.filters.skill?.[0]}
            valueDisplayText={props.filters.skill?.[0]}
          />
        </div>
      </div>
      <div class="flex">
        <CheckboxList
          options={["All"].concat(battingPositions)}
          label="Batting"
          onChange={(isChecked, val: BattingPosition | "All") => {
            if (val === "All") {
              props.setFilters("position", (prev) =>
                prev.length === battingPositions.length ? [] : battingPositions
              );
            } else {
              updateFilter("position", isChecked, val);
            }
          }}
          checkboxIsChecked={(val: BattingPosition | "All") =>
            val !== "All" && props.filters.position.includes(val)
          }
          checkboxLabel={(val) => <>{val}</>}
          checkboxClass={"w-[70px] h-10"}
          class="flex-1"
        />
        <CheckboxList
          options={["All"].concat(pitchingPositions)}
          label="Pitching"
          onChange={(isChecked, val: PitchingPosition | "All") => {
            if (val === "All") {
              props.setFilters("position", (prev) =>
                prev.length === pitchingPositions.length
                  ? []
                  : pitchingPositions
              );
            } else {
              updateFilter("position", isChecked, val);
            }
          }}
          checkboxIsChecked={(val: PitchingPosition | "All") =>
            val !== "All" && props.filters.position.includes(val)
          }
          checkboxLabel={(val) => <>{val}</>}
          checkboxClass={"w-[70px] h-10"}
          class="flex-1"
        />
      </div>
      <CheckboxList
        options={rarities}
        label="Rarity"
        onChange={(isChecked, val) => updateFilter("rarity", isChecked, val)}
        checkboxIsChecked={(val) => props.filters.rarity.includes(val)}
        checkboxLabel={(val) => <>{val}</>}
        checkboxClass={"w-[70px] h-10"}
      />
      <CheckboxList
        options={statsTypes}
        label="Type"
        onChange={(isChecked, val) => updateFilter("type", isChecked, val)}
        checkboxIsChecked={(val) => props.filters.type.includes(val)}
        checkboxLabel={(val) => (
          <div class="flex items-center">
            <img
              class="w-6 h-6 mr-0.5"
              src={typeImages[val]}
              alt={teamAbbreviations[val]}
            />
            {val}
          </div>
        )}
        checkboxClass={"w-[70px] h-10"}
      />
      <CheckboxList
        options={bonusTeams}
        label="Team"
        onChange={(isChecked, val) => updateFilter("team", isChecked, val)}
        checkboxIsChecked={(val) => props.filters.team.includes(val)}
        checkboxLabel={(val) => (
          <div class="flex items-center">
            <img
              class="w-7 h-7 mr-0.5"
              src={teamImages[val]}
              alt={teamAbbreviations[val]}
            />
            {teamAbbreviations[val]}
          </div>
        )}
        checkboxClass={"w-[70px] h-10"}
      />
      <div class="flex" />
    </div>
  );
};

export default TrainerSearch;
