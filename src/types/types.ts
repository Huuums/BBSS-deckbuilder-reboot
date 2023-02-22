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

export type FilterTypes =
  | "skill"
  | "position"
  | "name"
  | "rarity"
  | "type"
  | "team";

export type Filters = Partial<{
  skill: Skill[];
  position: (Position | "batters" | "pitchers")[];
  name: string;
  rarity: Rarity[];
  type: Statstype[];
  team: Team[];
}>;

export type Position = BattingPosition | PitchingPosition;

export type Statstype = "MNT" | "STR" | "DEX" | "INT" | "GP" | "SP";

export type Team =
  | "Shining Angels"
  | "Cruel Pumas"
  | "River City High"
  | "Mystic Unicorns"
  | "Zenonia Knights"
  | "Forest Elves"
  | "Perfect Lions"
  | "Victory Swallows";

export type TrainerSkillRanks = {
  "1": SkillRanks;
  "2": SkillRanks;
  "3": SkillRanks;
  "4": SkillRanks;
  "5": SkillRanks;
};

export type RankLevels = 0 | 1 | 2 | 3 | 4 | 5;

export type SkillRanks = Partial<Record<Skill, RankLevels>>;

export type SkillDiff = Partial<
  Record<Skill, { levelDiff: number; valueDiff: number; from: number }>
>;

export type SkillData = [Skill, RankLevels, SkillValue];

export type SkillValue = number;

export type Trainer = TrainerData &
  TrainerSettings & {
    isCustomTrainer?: boolean;
    trainerId?: string;
    isNew?: boolean;
  };

export type TrainerSettings = {
  useSkin: boolean;
  stars: RankLevels;
  potential: RosterTrainer["potential"];
  customName: string;
  trans: RankLevels;
};

export type TrainerData = {
  name: TrainerNames;
  rarity: Rarity;
  position: BattingPosition | PitchingPosition;
  type: Statstype[];
  bonusTeam: Team[];
  skills: TrainerSkillRanks;
  hasSkin: boolean;
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
    Record<
      "0" | BattingPosition | PitchingPosition,
      number | Record<RankLevels, number>
    >
  >;
};

export type Roster = Partial<Record<TrainerNames, RosterTrainer>>;
export type RosterCustomTrainers = Record<string, CustomTrainer>;

export type RosterTrainer = {
  stars: RankLevels;
  potential: [Skill | "", Skill | "", Skill | ""] | [];
  useSkin: boolean;
  customName: string;
  trans: RankLevels;
};

export type CustomTrainer = RosterTrainer & {
  trainer: TrainerNames;
  isCustomTrainer: true;
  isNew?: boolean;
  trainerId: string;
};

export type Deck = DeckSlot[];

export type DeckSlot = Trainer | "empty";

export type User = {
  uid: string;
  roster: string;
  username: string;
} | null;

export type TrainerNames =
  | "Soyoon"
  | "Zero"
  | "Yeomra"
  | "Rache"
  | "Francis"
  | "MED"
  | "Taesung"
  | "Nicki"
  | "Mary"
  | "Artamiel"
  | "Lucis"
  | "Scofield"
  | "Hayley"
  | "Annie"
  | "Code-J"
  | "Echo"
  | "Lazi"
  | "Claris"
  | "Hathor"
  | "Isis"
  | "Ceres"
  | "Kunio"
  | "Eve"
  | "Lilith"
  | "Belita"
  | "Dragona"
  | "Regret"
  | "Leon"
  | "Rowena"
  | "Violet"
  | "Leonie"
  | "Pluto"
  | "Valentine"
  | "Ditto"
  | "Psyker"
  | "Penelope"
  | "Misako"
  | "Hannibal"
  | "Aliana"
  | "Allen"
  | "MK-3"
  | "Miho"
  | "Captain Jack"
  | "Psyche"
  | "Hunter G"
  | "Soldia"
  | "Bora"
  | "Lucia"
  | "Hellfire"
  | "Zhizi"
  | "Base Angel"
  | "Onestone"
  | "Boomiger"
  | "Yomi"
  | "Anetta"
  | "Shuri"
  | "Popo"
  | "Tera"
  | "Cami"
  | "Stinger"
  | "Drake"
  | "John Roger"
  | "Dice"
  | "Lupina"
  | "Sherlia"
  | "Amir"
  | "Reuben"
  | "Marcus"
  | "Gryllson"
  | "Wendell"
  | "Snipe"
  | "Wendy"
  | "Serena"
  | "Venomizer"
  | "Magmizer"
  | "Lilo"
  | "Casta"
  | "Firelord"
  | "Aqualord"
  | "Zett"
  | "Kang"
  | "Nick"
  | "Roland"
  | "Choco"
  | "Soda"
  | "Mocha"
  | "Frill"
  | "Aria"
  | "Bill"
  | "Pansy"
  | "Johanna"
  | "Kinsley"
  | "Velvet"
  | "Ziz"
  | "Behemoth"
  | "Leviathan"
  | "Mav"
  | "Bebe"
  | "Camilla"
  | "Freyja"
  | "Hyper"
  | "Loki"
  | "Sun Wukong"
  | "Nox"
  | "Caroline"
  | "Anubis"
  | "Bastet"
  | "Dion"
  | "Roy"
  | "Ines"
  | "Clefina"
  | "Rachel"
  | "Michaella"
  | "Tsubaki"
  | "Luther"
  | "Flamesh"
  | "Britra"
  | "Chael"
  | "Helga"
  | "Seiryu"
  | "Kai"
  | "Nina"
  | "Sohyang"
  | "Ara"
  | "King Tiger"
  | "Luna"
  | "Daphne"
  | "Kyoko"
  | "Zia"
  | "Magnus"
  | "Monique"
  | "Sophie"
  | "Nameless"
  | "Mei Mei"
  | "Albert"
  | "Base Hero"
  | "Tauric"
  | "Helen"
  | "NOM"
  | "Golden Boy"
  | "Elfin"
  | "Lucy"
  | "Policia"
  | "Basedevil"
  | "Pi"
  | "Kryzer"
  | "Mia"
  | "Zena"
  | "Liew"
  | "Guy-E"
  | "Velour"
  | "Medica"
  | "Scumbag Joe"
  | "Rose"
  | "Riki"
  | "Lina"
  | "Kate"
  | "Rex"
  | "Flora"
  | "Paris"
  | "Eia"
  | "Patricia"
  | "Siren"
  | "Brokel"
  | "Gladius"
  | "Pazuzu"
  | "Hell Guy"
  | "Zen"
  | "Pale"
  | "Talas"
  | "Acro"
  | "Soun"
  | "Nio"
  | "Liuxia"
  | "Liuxing"
  | "Nahyun"
  | "Eunwoo"
  | "Genie"
  | "Marvel"
  | "Titania"
  | "Kalisto"
  | "Brant"
  | "Drucker"
  | "Daisy"
  | "Phrygia"
  | "Wonhee"
  | "Hilary"
  | "Matilda"
  | "Sarah"
  | "Eva"
  | "Liz"
  | "Jorge"
  | "Ruric"
  | "Gabe"
  | "Micky";

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface CustomEvents {
      // use:model
      keydown: KeyboardEvent;
    }
  }
}
export type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

export type FilterEntry = Entry<Filters>;

export type ElementType<T> =
  // is type T an array of elements of type U? If so, return U. Otherwise, return the "never" type (the input is not an array).
  T extends (infer U)[] ? U : never;
