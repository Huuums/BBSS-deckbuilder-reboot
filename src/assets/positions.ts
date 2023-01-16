import { BattingPosition, PitchingPosition } from "@localtypes/types";

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

const positions = ["Batters", "Pitchers"].concat(
  battingPositions,
  pitchingPositions
);

export default positions;
