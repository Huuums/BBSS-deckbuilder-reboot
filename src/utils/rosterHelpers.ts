import { RosterTrainer, TrainerData, TrainerNames } from "@localtypes/types";

export const createRosterObject = (arr: TrainerData[]) =>
  arr.reduce<Partial<Record<TrainerNames, RosterTrainer>>>((acc, row) => {
    acc[row.name] = { stars: 1, potential: [], useSkin: false, customName: "" };
    return acc;
  }, {});
