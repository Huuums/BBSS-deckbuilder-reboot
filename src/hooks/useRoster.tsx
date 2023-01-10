import { Roster } from "@localtypes/types";
import { createQuery } from "@tanstack/solid-query";
import { createEffect, createSignal, Signal } from "solid-js";

function useRoster<T>(id?: string): Signal<T> {
  const { user } = useAuth();

  const query = createQuery<Roster>(
    () => ["roster", id || user?.roster],
    getRosterById,
    {
      staleTime: Infinity,
    }
  );

  return { data: query.data, error: query.error, isLoading: query.isLoading };
}

export default useRoster;
