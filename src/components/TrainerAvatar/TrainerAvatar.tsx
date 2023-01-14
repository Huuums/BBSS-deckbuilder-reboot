import { classNames } from "@utils/commonHelpers";
import { HiOutlineSwitchHorizontal } from "solid-icons/hi";
import { Component, JSX } from "solid-js";

type TrainerAvatarProps = {
  src: string;
  name: string;
  class?: string;
  imgClass?: string;
  onClickAvatar?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onMouseEnter?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onMouseLeave?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  onClickExchange?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
  disabled?: boolean;
  showButtons?: boolean;
  trainerDeckIndex?: number;
  markedForExchange?: boolean;
};

const TrainerAvatar: Component<TrainerAvatarProps> = (props) => {
  return (
    <div class={classNames("bg-gray-700 relative", props.class)}>
      <button
        class="relative flex justify-center w-full"
        onClick={(e) => props.onClickAvatar(e)}
        onMouseEnter={(e) => props.onMouseEnter?.(e)}
        onMouseLeave={(e) => props.onMouseLeave?.(e)}
        disabled={props.disabled}
      >
        <img src={props.src} alt={props.name} class={props.imgClass} />
        {props.showButtons && (
          <div class="absolute top-0 left-0 bottom-0 right-0 flex justify-end items-end pb-2 pr-2">
            <button
              class={classNames(
                "rounded-full p-2 bg-gray-400 hover:bg-gray-300",
                props.markedForExchange ? "bg-blue-400 hover:bg-blue-300" : ""
              )}
              title="Set Trainer to exchange with another one"
              onClick={(e) => {
                props.onClickExchange?.(e);
                e.stopPropagation();
              }}
            >
              <HiOutlineSwitchHorizontal class="h-6 w-6" />
            </button>
          </div>
        )}
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
