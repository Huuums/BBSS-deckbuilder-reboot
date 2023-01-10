export type Rarity = "N" | "R" | "SR" | "SSR" | "UR";

export type BattingPosition =
  | "1B"
  | "2B"
  | "3B"
  | "C"
  | "CF"
  | "LF"
  | "RF"
  | "SS";
export type PitchingPosition = "SP" | "RP" | "CP";

export type Statstype = "MNT" | "STR" | "DEX" | "INT" | "GP" | "SP";

export type Team =
  | "Shining Angels"
  | "Cruel Pumas"
  | "River City"
  | "Mystic Unicorns"
  | "Zenonia Knights"
  | "Forest Elves"
  | "Perfect Lions"
  | "Victory Swallows";

export type TrainerSkillRanks = {
  "1": Record<string, 1 | 2 | 3 | 4 | 5>;
  "2": Record<string, 1 | 2 | 3 | 4 | 5>;
  "3": Record<string, 1 | 2 | 3 | 4 | 5>;
  "4": Record<string, 1 | 2 | 3 | 4 | 5>;
  "5": Record<string, 1 | 2 | 3 | 4 | 5>;
};

export type Trainer = {
  name: string;
  rarity: Rarity;
  position: BattingPosition | PitchingPosition;
  type: Statstype[];
  comboEvents: string[];
  bonusTeam: Team[];
  skills: TrainerSkillRanks;
  order: number;
  rank?: 1 | 2 | 3 | 4 | 5;
};

export type SkillType =
  | "Resolve"
  | "Common"
  | "Batting Style"
  | "Batter Skills"
  | "Hand"
  | "Pitching Style"
  | "Pitch Type I"
  | "Pitch Type II"
  | "Pitch Type III"
  | "Pitch Type IV"
  | "Pitch Type V"
  | "Pitch Type VI";

export type Skill =
  | "1B's Resolve"
  | "2B's Resolve"
  | "3B's Resolve"
  | "C's Resolve"
  | "CF's Resolve"
  | "HR King Blessing"
  | "Idol's Swing"
  | "LF's Resolve"
  | "RF's Resolve"
  | "SS's Resolve"
  | "Switch Hitter"
  | "Top Batter Blessing"
  | "Big Bang"
  | "Framing"
  | "Full Swing"
  | "Golden Arm"
  | "Hit Master"
  | "Home Run Master"
  | "Horizontal Cut"
  | "Knuckleball Hunter"
  | "Power Batter"
  | "Provoke"
  | "Roadrunner"
  | "Tenacity"
  | "Tight Defense"
  | "Anti LH Pitcher"
  | "Anti RH Pitcher"
  | "Burst"
  | "Dash"
  | "Drive"
  | "High-Ball Batter"
  | "IF Catch God"
  | "IF Defense God"
  | "IF Throw God"
  | "Iron Wall"
  | "Low-Ball Batter"
  | "OF Catch God"
  | "OF Defense God"
  | "OF Throw God"
  | "Pull-Hit"
  | "Push-hit"
  | "Super Jump"
  | "Super Slide"
  | "Target Sighted"
  | "Twister"
  | "Walk Machine"
  | "Early Challenge"
  | "Error Prevention"
  | "Four-Seam Hunter"
  | "Gambler"
  | "Hustle"
  | "New Resolution"
  | "Point Man"
  | "Power Swing"
  | "Pure Survival"
  | "Scoring Chance"
  | "Short Swing"
  | "Slugger Power"
  | "Tactical Bunt"
  | "Chaser"
  | "Dbl Play Machine"
  | "Focused Defense"
  | "Human Magnet"
  | "No Stolen Bases"
  | "Terminator"
  | "Walk-Off Hit"
  | "CP's Resolve"
  | "Knuckleball"
  | "MRP's Resolve"
  | "Perfect Pitch"
  | "SP's Resolve"
  | "Super Left Arm"
  | "Super Right Arm"
  | "Supersonic Pitch"
  | "Accuracy Control"
  | "Circle Changeup"
  | "Double Step"
  | "Heavy Ball"
  | "Hit Blockade"
  | "Knuckle Curve"
  | "Man of Steel"
  | "Maximum Effort"
  | "Monstrous Pitch"
  | "Screwball"
  | "Shadow Trap"
  | "Slurve"
  | "Speed Control"
  | "Submarine"
  | "Super Fastball"
  | "Tornado"
  | "V-Slider"
  | "Anti LH Batter"
  | "Anti RH Batter"
  | "Bold"
  | "Changeup"
  | "Curve"
  | "Cutter"
  | "Forkball"
  | "Four-Seam"
  | "High Kick"
  | "Mr. Zero"
  | "Palmball"
  | "Power Pitch"
  | "Recover"
  | "SF Ball"
  | "Sinker"
  | "Slider"
  | "Slow Curve"
  | "Snake"
  | "Steel Arm"
  | "Two-Seam"
  | "Anti Walk"
  | "Changing Tides"
  | "Concentration"
  | "Fire Baller"
  | "Fortune"
  | "No Runs For You"
  | "Pin Point"
  | "Reliever"
  | "Shutter Man"
  | "Sidearm"
  | "Strikeout King"
  | "Underhand"
  | "Alert"
  | "Change of Mood"
  | "Confidence"
  | "Guardian"
  | "Rise of a Hero"
  | "Special Force";

export type SkillDefinition = {
  skillGrade: Rarity;
  type: SkillType;
  name: Skill;
  valuesByPosition: Partial<
    Record<"0" | BattingPosition | PitchingPosition, number>
  >;
};

export type Roster = Record<string, RosterTrainer>;

export type RosterTrainer = { rank: number; potential: Record<Skill, 1 | 2> };

export type Deck = [
  [Trainer["name"], RosterTrainer] | "empty",
  [Trainer["name"], RosterTrainer] | "empty",
  [Trainer["name"], RosterTrainer] | "empty",
  [Trainer["name"], RosterTrainer] | "empty",
  [Trainer["name"], RosterTrainer] | "empty",
  [Trainer["name"], RosterTrainer] | "empty"
];
