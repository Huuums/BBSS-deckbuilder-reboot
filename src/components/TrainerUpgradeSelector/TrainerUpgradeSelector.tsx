import { For, Switch, Match, Component } from "solid-js";
import inactiveUpgrade from "@assets/images/common/UpgradeInactive.png";
import activeUpgrade from "@assets/images/common/UpgradeActive.png";
import fullUpgrade from "@assets/images/common/FullUpgrade.png";
import { classNames } from "@utils/commonHelpers";

type TrainerUpgradeSelectorProps = {
  onChange: (rank: number) => void;
  activeUpgrade: number;
  class: string;
};

const TrainerUpgradeSelector: Component<TrainerUpgradeSelectorProps> = (
  props
) => {
  return (
    <div
      class={classNames("flex justify-between py-1 space-x-0.5", props.class)}
    >
      <For each={[1, 2, 3, 4, 5]}>
        {(el) => {
          return (
            <button onClick={() => props.onChange(el)}>
              <Switch>
                <Match when={props.activeUpgrade === 5}>
                  <img src={fullUpgrade} alt={`Activate ${el} star upgrade`} />
                </Match>
                <Match when={el > props.activeUpgrade}>
                  <img
                    src={inactiveUpgrade}
                    alt={`Activate ${el} star upgrade`}
                  />
                </Match>
                <Match when={el <= props.activeUpgrade}>
                  <img
                    src={activeUpgrade}
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
