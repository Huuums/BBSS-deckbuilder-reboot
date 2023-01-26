import { BattingPosition, PitchingPosition } from "@localtypes/types";

export const battingPositions: BattingPosition[] = [
  "C",
  "1B",
  "2B",
  "3B",
  "SS",
  "RF",
  "CF",
  "LF",
];

export const pitchingPositions: PitchingPosition[] = ["SP", "RP", "CP"];

const positions = ["Batters", "Pitchers"].concat(
  battingPositions,
  pitchingPositions
);

export default positions;
