import { Trainer } from "@localtypes/types";

export const createRosterObject = (arr: Trainer[]) =>
  arr.reduce((acc, row) => {
    acc[row.name] = { stars: row.stars, potential: row.potential || {} };
    return acc;
  }, {});
