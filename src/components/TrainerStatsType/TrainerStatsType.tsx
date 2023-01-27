import { Trainer } from "@localtypes/types";
import { classNames, getStatsTypeImg } from "@utils/commonHelpers";
import { Component, Match, Switch } from "solid-js";

type TrainerTypeProps = {
  large?: boolean;
  type: Trainer["type"] | undefined;
  class?: string;
};

const TrainerStatsType: Component<TrainerTypeProps> = (props) => {
  return (
    <Switch>
      <Match when={!props.type}>{null}</Match>
      <Match when={props.type.length === 2}>
        <div
          class={classNames(
            "relative h-full",
            props.large ? "w-16 h-16" : "w-6"
          )}
        >
          <img
            class={classNames(
              "absolute left-0 ",
              props.large ? "h-10 top-1 left-0" : "h-5 top-0.5"
            )}
            src={getStatsTypeImg(props.type[0])}
          />
          <img
            class={classNames(
              "absolute",
              props.large ? "h-12 bottom-1 -right-1" : "h-5 bottom-0.5 left-3"
            )}
            src={getStatsTypeImg(props.type[1])}
          />
        </div>
      </Match>
      <Match when={props.type.length === 1}>
        <div class="relative flex items-center">
          <img
            class={classNames(props.large ? "w-10 h-10" : "w-6 h-6")}
            src={getStatsTypeImg(props.type[0])}
          />
        </div>
      </Match>
    </Switch>
  );
};

export default TrainerStatsType;
