import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { useAuth } from "./useAuth";
import {
  updateRosterTrainer,
  setRosterById,
  updateCustomTrainer,
  removeCustomTrainer,
  addCustomTrainer,
} from "@api/rosterQueries";
import {
  CustomTrainer,
  Roster,
  RosterTrainer,
  Trainer,
  TrainerNames,
} from "@localtypes/types";
import { trainersObject } from "@assets/json/trainers";

export const useSaveTrainer = () => {
  const user = useAuth();
  const queryClient = useQueryClient();

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
      queryClient.setQueryData<{
        isShared: boolean;
        username: string;
        trainers: Trainer[];
      }>(["roster", user()?.roster], (old) => ({
        ...old,
        trainers: old.trainers.map((val) =>
          val.name === trainer && !val.isCustomTrainer
            ? { ...val, ...value }
            : val
        ),
      }));

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

export const useSaveCustomTrainer = () => {
  const user = useAuth();
  const queryClient = useQueryClient();

  const updateMutation = createMutation(updateCustomTrainer, {
    onMutate: async ({ trainerId, value }) => {
      await queryClient.cancelQueries({
        queryKey: ["roster", user()?.roster],
      });

      const previousRoster: Roster = queryClient.getQueryData([
        "roster",
        user()?.roster,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<{
        isShared: boolean;
        username: string;
        trainers: Trainer[];
      }>(["roster", user()?.roster], (old) => ({
        ...old,
        trainers: old.trainers.map((trainer) =>
          trainer.trainerId === trainerId ? { ...trainer, ...value } : trainer
        ),
      }));

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

  const addMutation = createMutation(addCustomTrainer, {
    onMutate: async ({ value }) => {
      await queryClient.cancelQueries({
        queryKey: ["roster", user()?.roster],
      });

      const previousRoster: Roster = queryClient.getQueryData([
        "roster",
        user()?.roster,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<{
        isShared: boolean;
        username: string;
        trainers: Trainer[];
      }>(["roster", user()?.roster], (old) => ({
        ...old,
        trainers: old.trainers.concat({
          ...trainersObject[value.trainer],
          ...value,
        }),
      }));

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

  const removeMutation = createMutation(removeCustomTrainer, {
    onMutate: async ({ trainerId }) => {
      await queryClient.cancelQueries({
        queryKey: ["roster", user()?.roster],
      });

      const previousRoster: Roster = queryClient.getQueryData([
        "roster",
        user()?.roster,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<{
        isShared: boolean;
        username: string;
        trainers: Trainer[];
      }>(["roster", user()?.roster], (old) => ({
        ...old,
        trainers: old.trainers.filter(
          (trainer) => trainer.trainerId !== trainerId
        ),
      }));

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

  const updateCustomTrainerMutation = (
    trainerId: CustomTrainer["trainerId"],
    trainervalues: Partial<CustomTrainer>
  ) => {
    updateMutation.mutate({
      rosterId: user()?.roster,
      trainerId,
      value: trainervalues,
    });
  };
  const addCustomTrainerMutation = (trainervalues: CustomTrainer) => {
    addMutation.mutate({
      rosterId: user()?.roster,
      value: trainervalues,
    });
  };
  const removeCustomTrainerMutation = (
    trainerId: CustomTrainer["trainerId"]
  ) => {
    removeMutation.mutate({
      rosterId: user()?.roster,
      trainerId,
    });
  };
  return {
    updateCustomTrainer: updateCustomTrainerMutation,
    addCustomTrainer: addCustomTrainerMutation,
    removeCustomTrainer: removeCustomTrainerMutation,
  };
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
