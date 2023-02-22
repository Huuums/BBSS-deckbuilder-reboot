import { For, Switch, Match, Component } from "solid-js";
import inactiveUpgrade from "@assets/images/common/UpgradeInactive.png";
import activeUpgrade from "@assets/images/common/UpgradeActive.png";
import transActive from "@assets/images/common/TransActive.png";
import fullUpgrade from "@assets/images/common/FullUpgrade.png";
import { classNames } from "@utils/commonHelpers";
import { RankLevels } from "@localtypes/types";

type TrainerUpgradeSelectorProps = {
  onChange: (stars: RankLevels) => void;
  onChangeTrans?: (translevel: RankLevels) => void;
  onMouseEnter?: (stars: RankLevels) => void;
  onMouseLeave?: () => void;
  ignoreUpdateCheck?: boolean;
  activeUpgrade: number;
  activeTrans: number;
  class?: string;
};

const TrainerUpgradeSelector: Component<TrainerUpgradeSelectorProps> = (
  props
) => {
  const stars = [1, 2, 3, 4, 5];
  const trans = [1, 2, 3, 4, 5];

  return (
    <>
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
                    : (el !== props.activeUpgrade || props.activeTrans > 0) &&
                      props.onChange(el)
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
      <div
        class={classNames("flex justify-between py-1 space-x-0.5", props.class)}
      >
        <For each={trans}>
          {(el: RankLevels) => {
            return (
              <button
                class="flex-1"
                onClick={() =>
                  props.ignoreUpdateCheck
                    ? props.onChangeTrans(el)
                    : el !== props.activeTrans && props.onChangeTrans(el)
                }
              >
                <Switch>
                  <Match when={el > props.activeTrans || !props.activeTrans}>
                    <img
                      src={inactiveUpgrade}
                      class={el !== props.activeTrans && "hover:opacity-70"}
                      alt={`Activate ${el} star upgrade`}
                    />
                  </Match>
                  <Match when={el <= props.activeTrans}>
                    <img
                      src={transActive}
                      class={el !== props.activeTrans && "hover:opacity-70"}
                      alt={`Activate ${el} transcendence upgrade`}
                    />
                  </Match>
                </Switch>
              </button>
            );
          }}
        </For>
      </div>
    </>
  );
};

export default TrainerUpgradeSelector;
