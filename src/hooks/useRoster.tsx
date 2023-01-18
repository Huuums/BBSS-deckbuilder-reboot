import { getRosterById } from "@api/rosterQueries";
import { Trainer } from "@localtypes/types";
import { createQuery } from "@tanstack/solid-query";
import { useAuth } from "./useAuth";

function useRoster(id?: string) {
  const user = useAuth();

  return createQuery<Trainer[], Error>(
    () => ["roster", id || user()?.roster],
    () => getRosterById(undefined, id || user()?.roster),
    {
      staleTime: Infinity,
    }
  );
}

export default useRoster;
