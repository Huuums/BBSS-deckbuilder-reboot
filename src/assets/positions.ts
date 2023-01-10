import { BattingPosition, PitchingPosition } from "@localtypes/types";

const positions = [
  {
    value: "batting",
    label: "Batting",
  },
  {
    value: "pitching",
    label: "Pitching",
  },
  {
    value: "1B",
    label: "1B",
  },
  {
    value: "2B",
    label: "2B",
  },
  {
    value: "3B",
    label: "3B",
  },
  {
    value: "C",
    label: "C",
  },
  {
    value: "CF",
    label: "CF",
  },
  {
    value: "LF",
    label: "LF",
  },
  {
    value: "RF",
    label: "RF",
  },
  {
    value: "SS",
    label: "SS",
  },
  {
    value: "SP",
    label: "SP",
  },
  {
    value: "RP",
    label: "RP",
  },
  {
    value: "CP",
    label: "CP",
  },
];

export const battingPositions: BattingPosition[] = [
  "1B",
  "2B",
  "3B",
  "C",
  "CF",
  "LF",
  "RF",
  "SS",
];

export const pitchingPositions: PitchingPosition[] = ["SP", "RP", "CP"];

export default positions;
