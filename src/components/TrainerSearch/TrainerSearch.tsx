import { classNames, filterTypeToName } from "@utils/commonHelpers";
import { HiOutlineSearch } from "solid-icons/hi";
import {
  batch,
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  JSX,
  Match,
  on,
  Switch,
} from "solid-js";
import clickOutside from "@hooks/clickOutside";
import teamImages from "@assets/images/teams";
import bonusTeams from "@assets/bonusteams";
import skillDefinitions from "@assets/json/skillDefinitions";
import positions from "@assets/positions";
import statsTypes from "@assets/statsTypes";
import rarities from "@assets/rarities";
import { getStatsTypeImg } from "@utils/commonHelpers";
import {
  FilterTypes,
  Position,
  Rarity,
  SkillDefinition,
  Statstype,
  Team,
} from "@localtypes/types";

//don't remove this.
//eslint-disable-next-line
const clickOutsideDirective = clickOutside;

type TrainerSearchProps = {
  onChange?: (values: [FilterTypes, string]) => void;
};

type FilterOption = {
  label: string;
  shortcut: FilterTypes;
};

const TrainerSearch: Component<TrainerSearchProps> = (props) => {
  let input: HTMLInputElement | null;
  const dropdownElements: HTMLLIElement[] = [];
  const [highlightedIndex, setHighlightedIndex] = createSignal<number | null>(
    null
  );
  const [filtertype, setFilterType] = createSignal<FilterTypes>("name");
  const [searchValue, setSearchValue] = createSignal<string>("");

  const [isFocus, setIsFocus] = createSignal<boolean>(false);

  const options: FilterOption[] = [
    {
      label: "Search by Team",
      shortcut: "team",
    },
    {
      label: "Search by Skill",
      shortcut: "skill",
    },
    { label: "Search by Position", shortcut: "position" },
    { label: "Search by Rarity", shortcut: "rarity" },
    { label: "Search by Type", shortcut: "type" },
  ];

  const updateHighlightedIndex = (value: 1 | -1 | null) => {
    setHighlightedIndex((prev) => {
      if (value === null) return null;
      if (prev === null) {
        return value === -1 ? dropdownOptions().length - 1 : 0;
      }
      if (prev === 0 && value === -1) return null;
      if (prev === dropdownOptions().length - 1 && value === 1) return null;
      return prev + value;
    });
  };

  createEffect(
    on(
      filtertype,
      () => {
        input.focus();

        batch(() => {
          setHighlightedIndex(null);
          setSearchValue("");
        });
      },
      { defer: true }
    )
  );

  createEffect(() => {
    if (highlightedIndex() !== null) {
      dropdownElements[highlightedIndex()].scrollIntoView(false);
    }
  });

  const updateSearchValue: JSX.EventHandler<HTMLInputElement, InputEvent> = (
    e
  ) => {
    if (!isFocus()) {
      setIsFocus(true);
    }
    const option = options.find(
      (option) => e.currentTarget.value === `${option.shortcut}:`
    );
    if (option) {
      batch(() => {
        setFilterType(option.shortcut);
        setSearchValue("");
      });
    } else {
      setSearchValue(e.currentTarget.value);
    }
    setHighlightedIndex(null);
  };

  const handleSpecialKeys: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    e
  ) => {
    switch (e.key) {
      case "ArrowDown":
        updateHighlightedIndex(1);
        break;
      case "ArrowUp":
        updateHighlightedIndex(-1);
        break;
      case "Enter":
        if (!searchValue() && highlightedIndex() === null) return;

        switch (filtertype()) {
          case "name": {
            if (highlightedIndex() !== null) {
              setFilterType(
                (dropdownOptions() as FilterOption[])[highlightedIndex()]
                  .shortcut
              );
            } else {
              props.onChange([
                filtertype().split(":")[0] as FilterTypes,
                searchValue(),
              ]);
            }
            break;
          }
          case "skill": {
            if (highlightedIndex() !== null) {
              props.onChange([
                filtertype().split(":")[0] as FilterTypes,
                (dropdownOptions() as SkillDefinition[])[highlightedIndex()]
                  .name,
              ]);
              setFilterType("name");
            } else {
              props.onChange([
                filtertype().split(":")[0] as FilterTypes,
                searchValue(),
              ]);
              setFilterType("name");
            }
            break;
          }
          default: {
            if (highlightedIndex() === null) {
              props.onChange([
                filtertype().split(":")[0] as FilterTypes,
                searchValue(),
              ]);
              setFilterType("name");
            } else {
              props.onChange([
                filtertype().split(":")[0] as FilterTypes,
                (dropdownOptions() as string[])[highlightedIndex()],
              ]);
              setFilterType("name");
            }
          }
        }
        break;
      case "Escape":
        if (filtertype() === "name") {
          setIsFocus(false);
        }
        setFilterType("name");
    }
  };

  const matchesSearchValue = <
    T extends Record<string, string | object> | string,
    K extends keyof T
  >(
    searchValue: string,
    arr: T[],
    keys?: K[]
  ) => {
    if (!searchValue) return arr;
    return arr.filter((val) => {
      if (typeof val === "string") {
        return val.includes(searchValue.trim());
      }

      return keys.some((key) => {
        const currentValue = Array.isArray(val) ? key : val[key];
        if (typeof currentValue === "string") {
          return currentValue
            .toLowerCase()
            .includes(searchValue.toLowerCase().trim());
        }
        return false;
      });
    });
  };
  const dropdownOptions = createMemo(() => {
    switch (filtertype()) {
      case "name":
        return matchesSearchValue(searchValue(), options, [
          "shortcut",
          "label",
        ]);
      case "team":
        return matchesSearchValue(searchValue(), bonusTeams);
      case "skill":
        return matchesSearchValue(
          searchValue(),
          Object.values(skillDefinitions),
          ["name"]
        );
      case "position":
        return matchesSearchValue(searchValue(), positions);
      case "type":
        return matchesSearchValue(searchValue(), statsTypes);
      case "rarity":
        return matchesSearchValue(searchValue(), rarities);
    }
  });

  return (
    <div class="relative z-10 my-4 overflow-visible">
      <div
        //eslint-disable-next-line
        use:clickOutsideDirective={() => setIsFocus(false)}
        class="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 bg-gray-900 shadow-2xl transition-all"
      >
        <div class="relative flex items-center">
          {filtertype() !== null && (
            <span class="flex w-[90px] items-center h-12 border-gray-500 bg-gray-800 px-3 text-gray-300 sm:text-sm">
              {filterTypeToName[filtertype()]}:
            </span>
          )}
          <HiOutlineSearch class="pointer-events-none ml-2 h-5 w-5 stroke-gray-500" />
          <input
            onFocus={() => setIsFocus(true)}
            onClick={() => (!isFocus() ? setIsFocus(true) : null)}
            ref={input}
            value={searchValue()}
            type="text"
            class="h-12 w-full border-0 bg-transparent pl-18 pr-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
            placeholder={
              filtertype() === "name"
                ? "Enter Trainername or choose another Filter type"
                : `Type or select the ${
                    filterTypeToName[filtertype()]
                  } name and press Enter`
            }
            onInput={(e) => updateSearchValue(e)}
            onKeyDown={(e) => handleSpecialKeys(e)}
          />
          {filtertype() !== "name" && (
            <span class="absolute right-2 ml-3 flex text-xs font-semibold text-gray-400">
              <button
                onClick={() => setFilterType("name")}
                class="flex items-center"
              >
                <kbd class="font-sans mx-1 p-1 flex items-center justify-center rounded border bg-dark-800 font-semibold sm:mx-1 border-gray-400 ">
                  ESC
                </kbd>{" "}
                <span class="underline">to reset filtertype</span>
              </button>
            </span>
          )}
        </div>
        <ul
          class={classNames(
            "text-sm text-gray-400 absolute z-20 left-0 right-0 bg-gray-900 shadow-2xl max-h-[250px] overflow-auto",
            !isFocus() ? "hidden" : ""
          )}
        >
          <Switch>
            <Match when={filtertype() === "name"}>
              <For each={dropdownOptions()}>
                {(option: FilterOption, i) => (
                  <li
                    ref={dropdownElements[i()]}
                    role="button"
                    onClick={() => setFilterType(option.shortcut)}
                    class={classNames(
                      "group flex cursor-default select-none items-center rounded-md px-3 py-2 hover:bg-gray-800 hover:text-white",
                      i() === highlightedIndex() ? "bg-gray-800 text-white" : ""
                    )}
                  >
                    <span class="ml-3 flex-auto truncate">{option.label}</span>
                    <span class="ml-3 flex-none text-xs font-semibold text-gray-400">
                      <kbd class="font-sans">{option.shortcut}:</kbd>
                      {/* <kbd class="font-sans">N</kbd> */}
                    </span>
                  </li>
                )}
              </For>
            </Match>
            <Match when={filtertype() === "team"}>
              <For each={dropdownOptions()}>
                {(option: Team, i) => (
                  <li
                    ref={dropdownElements[i()]}
                    role="button"
                    onClick={() => {
                      props.onChange(["team", option]);
                      setFilterType("name");
                    }}
                    class={classNames(
                      "group flex cursor-default select-none items-center rounded-md px-3 py-2 hover:bg-gray-800 hover:text-white",
                      i() === highlightedIndex() ? "bg-gray-800 text-white" : ""
                    )}
                  >
                    <img class="h-6 w-6 flex-none" src={teamImages[option]} />

                    <span class="ml-3 flex-auto truncate">{option}</span>
                  </li>
                )}
              </For>
            </Match>
            <Match when={filtertype() === "skill"}>
              <For each={dropdownOptions()}>
                {(option: SkillDefinition, i) => (
                  <li
                    ref={dropdownElements[i()]}
                    role="button"
                    onClick={() => {
                      props.onChange(["skill", option.name]);
                      setFilterType("name");
                    }}
                    class={classNames(
                      "group flex cursor-default select-none items-center rounded-md px-3 py-2 hover:bg-gray-800 hover:text-white",
                      i() === highlightedIndex() ? "bg-gray-800 text-white" : ""
                    )}
                  >
                    <span class="ml-3 flex-auto truncate">{option.name}</span>
                  </li>
                )}
              </For>
            </Match>
            <Match when={filtertype() === "position"}>
              <For each={dropdownOptions()}>
                {(option: Position, i) => (
                  <li
                    ref={dropdownElements[i()]}
                    role="button"
                    onClick={() => {
                      props.onChange(["position", option]);
                      setFilterType("name");
                    }}
                    class={classNames(
                      "group flex cursor-default select-none items-center rounded-md px-3 py-2 hover:bg-gray-800 hover:text-white",
                      i() === highlightedIndex() ? "bg-gray-800 text-white" : ""
                    )}
                  >
                    <span class="ml-3 flex-auto truncate">{option}</span>
                  </li>
                )}
              </For>
            </Match>
            <Match when={filtertype() === "type"}>
              <For each={dropdownOptions()}>
                {(option: Statstype, i) => (
                  <li
                    ref={dropdownElements[i()]}
                    role="button"
                    onClick={() => {
                      props.onChange(["type", option]);
                      setFilterType("name");
                    }}
                    class={classNames(
                      "group flex cursor-default select-none items-center rounded-md px-3 py-2 hover:bg-gray-800 hover:text-white",
                      i() === highlightedIndex() ? "bg-gray-800 text-white" : ""
                    )}
                  >
                    <img
                      class="h-6 w-6 flex-none"
                      src={getStatsTypeImg(option)}
                    />
                    <span class="ml-3 flex-auto truncate">{option}</span>
                  </li>
                )}
              </For>
            </Match>
            <Match when={filtertype() === "rarity"}>
              <For each={dropdownOptions()}>
                {(option: Rarity, i) => (
                  <li
                    ref={dropdownElements[i()]}
                    role="button"
                    onClick={() => {
                      props.onChange(["rarity", option]);
                      setFilterType("name");
                    }}
                    class={classNames(
                      "group flex cursor-default select-none items-center rounded-md px-3 py-2 hover:bg-gray-800",
                      i() === highlightedIndex() ? "bg-gray-800" : ""
                    )}
                  >
                    <span class="ml-3 flex-auto truncate">{option}</span>
                  </li>
                )}
              </For>
            </Match>
          </Switch>
        </ul>
      </div>
    </div>
  );
};

export default TrainerSearch;
