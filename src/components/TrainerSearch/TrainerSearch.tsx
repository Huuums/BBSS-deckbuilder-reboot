import bonusTeams, { teamAbbreviations } from "@assets/bonusteams";
import CheckboxList from "@components/CheckboxList";

import SearchInput from "@components/SearchInput";
import { ElementType, Filters, Skill } from "@localtypes/types";
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
    val: ElementType<Filters[T]>
  ) => {
    if (isChecked) props.setFilters(key, (prev) => prev.concat(val));
    if (!isChecked)
      props.setFilters(key, (prev) => prev.filter((el) => el !== val));
  };

  return (
    <div class="flex flex-col flex-1 space-y-4">
      <div>
        <label class="text-gray-200 font-medium lg:w-auto">Trainer </label>
        <SearchInput
          onInput={(e) => props.setFilters("name", e.currentTarget.value)}
          placeholder="Enter Trainer Name"
        />
      </div>
      <div>
        <label class="text-gray-200 font-medium lg:w-auto">Skill</label>
        <Combobox
          options={Object.keys(skillDefinitions)}
          onChange={(val: Skill) => props.setFilters("skill", [val])}
          placeholder="Enter Skill Name"
          value={props.filters.skill?.[0]}
          valueDisplayText={props.filters.skill?.[0]}
        />
      </div>
      <div class="flex">
        <CheckboxList
          options={battingPositions}
          label="Batting"
          onChange={(isChecked, val) =>
            updateFilter("position", isChecked, val)
          }
          checkboxIsChecked={(val) => props.filters.position.includes(val)}
          checkboxLabel={(val) => <>{val}</>}
          checkboxClass={"w-[70px]"}
          class="flex-1"
        />
        <CheckboxList
          options={pitchingPositions}
          label="Pitching"
          onChange={(isChecked, val) =>
            updateFilter("position", isChecked, val)
          }
          checkboxIsChecked={(val) => props.filters.position.includes(val)}
          checkboxLabel={(val) => <>{val}</>}
          checkboxClass={"w-[70px]"}
          class="flex-1"
        />
      </div>
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
        checkboxClass={"w-[70px]"}
      />
      <CheckboxList
        options={rarities}
        label="Rarity"
        onChange={(isChecked, val) => updateFilter("rarity", isChecked, val)}
        checkboxIsChecked={(val) => props.filters.rarity.includes(val)}
        checkboxLabel={(val) => <>{val}</>}
        checkboxClass={"w-[70px]"}
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
        checkboxClass={"w-[70px]"}
      />

      <div class="flex" />
    </div>
  );
};

export default TrainerSearch;
