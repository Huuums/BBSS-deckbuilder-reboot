import { createEffect, ParentComponent, Show } from "solid-js";
import { Portal } from "solid-js/web";
import clickOutside from "@hooks/clickOutside";
import { classNames } from "@utils/commonHelpers";
import pressedESC from "@hooks/pressESC";
import { HiOutlineX } from "solid-icons/hi";

//don't remove this.
//eslint-disable-next-line
const clickOutsideDirective = clickOutside;
const pressedESCDirective = pressedESC;

type ModalProps = {
  onClose: () => void;
  isOpen: boolean;
};

const Modal: ParentComponent<ModalProps> = (props) => {
  let modalWrapper: HTMLDivElement;

  createEffect(() => {
    props.isOpen && modalWrapper.focus();
  });

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="h-screen w-screen absolute top-0 left-0 right-0 bottom-0 bg-gray-600 opacity-60 z-10" />
        <div class="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center z-20">
          <div
            ref={modalWrapper}
            tabindex={0}
            use:clickOutsideDirective={() => props.onClose()}
            use:pressedESCDirective={() => props.onClose()}
            class={classNames(
              "flex-1 max-w-sm px-4 sm:px-0 lg:max-w-3xl bg-gray-800 relative"
            )}
          >
            <div class="absolute top-1 right-1">
              <button onClick={() => props.onClose()}>
                <HiOutlineX class="w-8 h-8 stroke-white" />
              </button>
            </div>
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Modal;
