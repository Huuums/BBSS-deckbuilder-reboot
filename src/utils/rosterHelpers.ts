import { RosterTrainer, Trainer, TrainerNames } from "@localtypes/types";

export const createRosterObject = (
  arr: Omit<Trainer, "stars" | "potential">[]
) =>
  arr.reduce<Partial<Record<TrainerNames, RosterTrainer>>>((acc, row) => {
    acc[row.name] = { stars: 1, potential: [] };
    return acc;
  }, {});
