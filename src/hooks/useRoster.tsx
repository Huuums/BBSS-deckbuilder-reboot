import { getRosterById } from "@api/rosterQueries";
import { Trainer } from "@localtypes/types";
import { createQuery, CreateQueryResult } from "@tanstack/solid-query";
import { useAuth } from "./useAuth";

function useRoster(
  id?: () => string
): [
  CreateQueryResult<
    { isShared: boolean; trainers: Trainer[]; owner: string },
    Error
  >,
  () => string
] {
  const user = useAuth();

  const query = createQuery<
    { isShared: boolean; trainers: Trainer[]; owner: string },
    Error
  >(
    () => ["roster", id?.() || user()?.roster],
    () => getRosterById(undefined, id?.() || user()?.roster),
    {
      staleTime: Infinity,
    }
  );

  return [query, () => id?.() || user()?.roster];
}

export default useRoster;
