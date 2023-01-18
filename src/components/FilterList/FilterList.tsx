import { Filter } from "@localtypes/types";
import { filterTypeToName } from "@utils/commonHelpers";
import { HiOutlineX } from "solid-icons/hi";
import { Component, For } from "solid-js";

type FilterListProps = { filters: Filter[]; removeTrainerFromRoster: (index: number) => void };

const FilterList: Component<FilterListProps> = (props) => {
  return (
    <div class="w-full mx-auto max-w-2xl gap-y-2 gap-x-2 grid grid-cols-3">
      <For each={props.filters}>
        {([filterType, value], i) => (
          <div class="bg-gray-800 flex justify-between text-gray-300 p-2">
            <span class="whitespace-nowrap text-ellipsis overflow-hidden">
              {filterTypeToName[filterType]}: {value}
            </span>
            <button
              class="ml-auto text-red-500"
              onClick={() => props.removeTrainerFromRoster(i())}
            >
              <HiOutlineX />
            </button>
          </div>
        )}
      </For>
    </div>
  );
};

export default FilterList;
