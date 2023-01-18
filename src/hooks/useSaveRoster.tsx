import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { useAuth } from "./useAuth";
import { updateRosterTrainer, setRosterById } from "@api/rosterQueries";
import {
  Roster,
  RosterTrainer,
  Trainer,
  TrainerNames,
} from "@localtypes/types";

export const useSaveTrainer = () => {
  const user = useAuth();
  const mutation = createMutation(updateRosterTrainer, {
    onMutate: async ({ trainer, value }) => {
      await queryClient.cancelQueries({
        queryKey: ["roster", user()?.roster],
      });

      const previousRoster: Roster = queryClient.getQueryData([
        "roster",
        user()?.roster,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<Trainer[]>(["roster", user()?.roster], (old) =>
        old.map((val) => (val.name === trainer ? { ...val, ...value } : val))
      );

      // Return a context object with the snapshotted value
      return { previousRoster };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ["roster", user()?.roster],
        context.previousRoster
      );
    },
  });
  const queryClient = useQueryClient();

  const saveTrainer = (
    trainername: TrainerNames,
    trainervalues: Partial<RosterTrainer>
  ) => {
    mutation.mutate({
      id: user()?.roster,
      value: trainervalues,
      trainer: trainername,
    });
  };
  return saveTrainer;
};

export const useSaveCompleteRoster = () => {
  const user = useAuth();
  const mutation = createMutation(setRosterById, {
    onSettled() {
      queryClient.invalidateQueries(["roster", user()?.roster]);
    },
  });
  const queryClient = useQueryClient();

  const saveRoster = (roster: Roster) => {
    mutation.mutate({
      id: user()?.roster,
      value: roster,
    });
  };
  return saveRoster;
};
