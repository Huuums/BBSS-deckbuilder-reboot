import { For } from "solid-js";
import type { Component } from "solid-js";
import bonusTeams, { teamAbbreviations } from "@assets/bonusteams";
import Checkbox from "@components/Checkbox";
import { Team } from "@localtypes/types";
import teamImages from "@assets/images/teams";

type TeamChoiceProps = {
  onChange: (isChecked: boolean, val: Team) => void;
  currentTeams: Team[] | undefined;
};

const TeamChoice: Component<TeamChoiceProps> = (props) => {
  return (
    <div class="flex space-x-3 lg:flex-nowrap items-center basis-full lg:basis-auto flex-1 mt-2 lg:mt-0">
      <h4 class="text-gray-200 font-medium h-full w-16 lg:w-auto mt-2.5">
        Team
      </h4>
      <div class="flex flex-wrap flex-1">
        <For each={bonusTeams}>
          {(val) => (
            <Checkbox
              label={
                <div class="flex items-center">
                  <img
                    class="w-6 h-6 mr-0.5"
                    src={teamImages[val]}
                    alt={teamAbbreviations[val]}
                  />
                  {teamAbbreviations[val]}
                </div>
              }
              onChange={props.onChange}
              name="position"
              class="mr-1 mb-1 basis-20 flex-grow-0 flex-shrink-0 select-none"
              value={val}
              isChecked={props.currentTeams?.some?.((entry) => entry === val)}
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default TeamChoice;
