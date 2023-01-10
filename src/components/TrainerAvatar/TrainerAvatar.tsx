import { classNames } from "@utils/commonHelpers";
import type { Component } from "solid-js";

type TrainerAvatarProps = { src: string; name: string; class?: string };

const TrainerAvatar: Component<TrainerAvatarProps> = (props) => {
  return (
    <div class={classNames("bg-gray-700 relative", props.class)}>
      <button type="button" class="relative flex">
        <img src={props.src} alt={props.name} />
      </button>
    </div>
  );
};

export default TrainerAvatar;
