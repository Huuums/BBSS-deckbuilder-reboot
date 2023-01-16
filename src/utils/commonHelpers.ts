import { FilterTypes, Statstype } from "@localtypes/types";
import DEX from "@assets/images/common/DEX.png";
import STR from "@assets/images/common/STR.png";
import INT from "@assets/images/common/INT.png";
import MNT from "@assets/images/common/MNT.png";
import GP from "@assets/images/common/GP.png";
import SP from "@assets/images/common/SP.png";

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ").trim();
}

export function getStatsTypeImg(type: Statstype) {
  switch (type) {
    case "DEX":
      return DEX;
    case "STR":
      return STR;
    case "INT":
      return INT;
    case "MNT":
      return MNT;
    case "SP":
      return SP;
    case "GP":
      return GP;
  }
}

export const replaceFirstOccasionWithValue = <T>(
  arr: T[],
  value: T,
  valueToReplace: T
) => {
  const firstIndexOfNull = arr.indexOf(valueToReplace);
  return arr.map((row, i) => (i === firstIndexOfNull ? value : row));
};

export const replaceValueAtIndex = <T>(arr: T[], value: T, index: number) => {
  return arr.map((row, i) => (i === index ? value : row));
};

export const filterTypeToName: Record<FilterTypes, string> = {
  skill: "Skill",
  type: "Type",
  position: "Position",
  team: "Team",
  rarity: "Rarity",
  name: "Name",
};
