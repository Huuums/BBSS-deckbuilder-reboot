import { HiOutlineSearch } from "solid-icons/hi";
import type { Component, JSX } from "solid-js";

type SearchInputProps = JSX.InputHTMLAttributes<HTMLInputElement>;

const SearchInput: Component<SearchInputProps> = (props) => {
  return (
    <div class="relative flex items-center bg-gray-900">
      <HiOutlineSearch class="pointer-events-none ml-2 h-5 w-5 stroke-gray-500" />
      <input
        value={props.value || ""}
        type="text"
        class="h-12 w-full border-0 bg-transparent pl-4 pr-4 text-white  placeholder-gray-500 focus:ring-0 sm:text-sm"
        placeholder={props.placeholder}
        onInput={props.onInput}
      />
    </div>
  );
};

export default SearchInput;
