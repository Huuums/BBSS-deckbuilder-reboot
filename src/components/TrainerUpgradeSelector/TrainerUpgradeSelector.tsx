import { For, Switch, Match, Component } from "solid-js";
import inactiveUpgrade from "@assets/images/common/UpgradeInactive.png";
import activeUpgrade from "@assets/images/common/UpgradeActive.png";
import fullUpgrade from "@assets/images/common/FullUpgrade.png";
import { classNames } from "@utils/commonHelpers";
import { RankLevels } from "@localtypes/types";

type TrainerUpgradeSelectorProps = {
  onChange: (stars: RankLevels) => void;
  onMouseEnter?: (stars: RankLevels) => void;
  onMouseLeave?: () => void;
  ignoreUpdateCheck?: boolean;
  activeUpgrade: number;
  class?: string;
};

const TrainerUpgradeSelector: Component<TrainerUpgradeSelectorProps> = (
  props
) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      class={classNames("flex justify-between py-1 space-x-0.5", props.class)}
    >
      <For each={stars}>
        {(el: RankLevels) => {
          return (
            <button
              onClick={() =>
                props.ignoreUpdateCheck
                  ? props.onChange(el)
                  : el !== props.activeUpgrade && props.onChange(el)
              }
              onMouseEnter={() =>
                el !== props.activeUpgrade && props.onMouseEnter?.(el)
              }
              onMouseLeave={() => props.onMouseLeave?.()}
            >
              <Switch>
                <Match when={props.activeUpgrade === 5}>
                  <img
                    src={fullUpgrade}
                    class={el !== props.activeUpgrade && "hover:opacity-70"}
                    alt={`Activate ${el} star upgrade`}
                  />
                </Match>
                <Match when={el > props.activeUpgrade}>
                  <img
                    src={inactiveUpgrade}
                    class={el !== props.activeUpgrade && "hover:opacity-70"}
                    alt={`Activate ${el} star upgrade`}
                  />
                </Match>
                <Match when={el <= props.activeUpgrade}>
                  <img
                    src={activeUpgrade}
                    class={el !== props.activeUpgrade && "hover:opacity-70"}
                    alt={`Activate ${el} star upgrade`}
                  />
                </Match>
              </Switch>
            </button>
          );
        }}
      </For>
    </div>
  );
};

export default TrainerUpgradeSelector;
