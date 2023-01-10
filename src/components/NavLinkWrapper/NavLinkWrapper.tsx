import { useHref, useLocation, useResolvedPath } from "@solidjs/router";
import { createMemo, mergeProps, Component, splitProps, JSX } from "solid-js";
import { AnchorProps } from "@solidjs/router";
import { normalizePath } from "@utils/routerHelpers";

type NavLinkWrapperProps = Omit<AnchorProps, "children"> & {
  children: JSX.Element | ((isActive: boolean) => JSX.Element);
};

//own implementation of A component from solidjs/router to allow passing isActive to its children
const NavLinkWrapper: Component<NavLinkWrapperProps> = (props) => {
  const newProps = mergeProps(
    { inactiveClass: "inactive", activeClass: "active", children: undefined },
    props
  );
  const [, rest] = splitProps(newProps, [
    "href",
    "state",
    "class",
    "activeClass",
    "inactiveClass",
    "end",
  ]);
  const to = useResolvedPath(() => newProps.href);
  const href = useHref(to);
  const location = useLocation();
  const isActive = createMemo(() => {
    const to_ = to();
    if (to_ === undefined) return false;
    const path = normalizePath(to_.split(/[?#]/, 1)[0]).toLowerCase();
    const loc = normalizePath(location.pathname).toLowerCase();
    return newProps.end ? path === loc : loc.startsWith(path);
  });

  return (
    <a
      link
      {...rest}
      href={href() || newProps.href}
      state={JSON.stringify(newProps.state)}
      classList={{
        ...(newProps.class && { [newProps.class]: true }),
        [newProps.inactiveClass!]: !isActive(),
        [newProps.activeClass!]: isActive(),
        ...rest.classList,
      }}
      aria-current={isActive() ? "page" : undefined}
    >
      {typeof props.children === "function"
        ? props.children(isActive())
        : props.children}
    </a>
  );
};

export default NavLinkWrapper;
