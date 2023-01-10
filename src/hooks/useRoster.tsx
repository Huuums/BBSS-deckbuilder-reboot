import { getRosterById } from "@api/rosterQueries";
import { Roster } from "@localtypes/types";
import { createQuery } from "@tanstack/solid-query";
import { useAuth } from "./useAuth";

function useRoster(id?: string): {
  roster: Roster;
  error: Error;
  isLoading: boolean;
} {
  const user = useAuth();

  const query = createQuery<Roster | null, Error>(
    () => ["roster", id || user?.roster],
    () => getRosterById(undefined, id || user.roster),
    {
      staleTime: Infinity,
    }
  );

  return { roster: query.data, error: query.error, isLoading: query.isLoading };
}

export default useRoster;
