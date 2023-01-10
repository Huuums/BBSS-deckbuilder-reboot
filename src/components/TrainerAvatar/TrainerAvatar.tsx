import { classNames } from "@utils/commonHelpers";
import { Component, createEffect, JSX } from "solid-js";

type TrainerAvatarProps = {
  src: string;
  name: string;
  class?: string;
  onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  disabled?: boolean;
  trainerDeckIndex?: number;
};

const TrainerAvatar: Component<TrainerAvatarProps> = (props) => {
  createEffect(() => {
    console.log(props.trainerDeckIndex);
  });
  return (
    <div class={classNames("bg-gray-700 relative", props.class)}>
      <button
        type="button"
        class="relative flex"
        onClick={(e) => props.onClick(e)}
        disabled={props.disabled}
      >
        <img src={props.src} alt={props.name} />
      </button>
      <div
        class={classNames(
          props.trainerDeckIndex !== undefined && props.trainerDeckIndex !== -1
            ? "bg-gray-800 opacity-70 absolute top-0 left-0 bottom-0 right-0 pointer-events-none"
            : "hidden"
        )}
      />

      <div
        class={classNames(
          props.trainerDeckIndex !== undefined && props.trainerDeckIndex !== -1
            ? "flex justify-center items-center text-3xl text-gray-200 absolute top-0 left-0 bottom-0 right-0 pointer-events-none"
            : "hidden"
        )}
      >
        {" "}
        {props.trainerDeckIndex + 1}
      </div>
    </div>
  );
};

export default TrainerAvatar;
