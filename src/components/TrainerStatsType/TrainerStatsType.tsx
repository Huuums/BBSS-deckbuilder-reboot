import { Trainer } from "@localtypes/types";
import { getStatsTypeImg } from "@utils/commonHelpers";
import { Component, Match, Switch } from "solid-js";

type TrainerTypeProps = { type: Trainer["type"] };

const TrainerStatsType: Component<TrainerTypeProps> = (props) => {
  return (
    <Switch>
      <Match when={props.type.length === 2}>
        <div class="relative w-6 h-full">
          <img
            class="absolute left-0 top-0.5 h-5"
            src={getStatsTypeImg(props.type[0])}
          />
          <img
            class="absolute left-3 bottom-0.5 h-5"
            src={getStatsTypeImg(props.type[1])}
          />
        </div>
      </Match>
      <Match when={props.type.length === 1}>
        <div class="relative">
          <img class="w-6 h-6" src={getStatsTypeImg(props.type[0])} />
        </div>
      </Match>
    </Switch>
  );
};

export default TrainerStatsType;
