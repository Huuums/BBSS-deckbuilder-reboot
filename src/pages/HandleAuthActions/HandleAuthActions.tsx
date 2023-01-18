import { Switch, Match } from "solid-js";
import { Navigate, useSearchParams } from "@solidjs/router";

import type { Component } from "solid-js";

const HandleAuthActions: Component = () => {
  const [params] = useSearchParams();

  return (
    <Switch>
      <Match when={params.mode === "resetPassword"}>
        <Navigate
          href="/reset-password"
          state={{ resetCode: params.oobCode }}
        />
      </Match>
    </Switch>
  );
};

export default HandleAuthActions;
