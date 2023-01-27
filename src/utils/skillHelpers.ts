import {
  Deck,
  Position,
  RankLevels,
  Skill,
  SkillData,
  SkillDiff,
  SkillRanks,
  SkillType,
  SkillValue,
  Trainer,
} from "@localtypes/types";
import skillDefinitions from "@assets/json/skillDefinitions";
import { pitchingPositions } from "@assets/positions";

export const getSkillLevelsSum = (deck: Deck) => {
  const nonEmptyTrainers = deck.filter(
    (el): el is Required<Trainer> => el !== "empty"
  );

  return nonEmptyTrainers.reduce<SkillRanks>(
    (acc, trainer) => {
      const curTrainerSkills = Object.entries<RankLevels>(
        trainer.skills[trainer.stars]
      );

      curTrainerSkills.forEach(([skillName, skillLevel]) => {
        if (acc[skillName]) {
          acc[skillName] = Math.min(
            acc[skillName] +
              skillLevel +
              (trainer.potential.filter((row) => row === skillName).length ||
                0),
            5
          );
        } else {
          acc[skillName] = Math.min(
            skillLevel +
              (trainer.potential.filter((row) => row === skillName).length ||
                0),
            5
          );
        }
      }, {});
      return acc;
    },
    nonEmptyTrainers.some((trainer) =>
      pitchingPositions.some((val) => val === trainer.position)
    )
      ? { "Four-Seam": 1 }
      : {}
  );
};

const skillGradeFactors = {
  UR: [0, 100, 225, 375, 600, 1000],
  SSR: [0, 80, 180, 300, 480, 800],
  SR: [0, 60, 135, 225, 360, 600],
  R: [0, 40, 90, 150, 240, 400],
  N: [0, 20, 45, 75, 120, 200],
};

export const getSkillValue = (
  skillName: Skill,
  skillRank: number,
  targetPosition?: Position | "0" | undefined
) => {
  const skillGrade = skillDefinitions[skillName].skillGrade;
  const multiplierForPosition =
    skillDefinitions[skillName].valuesByPosition[targetPosition || "0"] || 0;

  //float precision problems yay
  return parseFloat(
    (
      skillGradeFactors[skillGrade][skillRank] * multiplierForPosition
    ).toPrecision(12)
  );
};

export const typeOrder = [
  "Changes",
  "Resolve",
  "Hand",
  "Pitching Style",
  "Pitch Type I",
  "Pitch Type II",
  "Pitch Type III",
  "Pitch Type IV",
  "Pitch Type V",
  "Pitch Type VI",
  "Batter Skills",
  "Batting Style",
  "Common",
];

export const rarityOrder = ["UR", "SSR", "SR", "R", "N"];

export const sortSkillGroupsByCategory = <
  T extends [string, [Skill, RankLevels, SkillValue][]]
>(
  a: T,
  b: T
) => typeOrder.indexOf(a[0]) - typeOrder.indexOf(b[0]);

export const sortByGradeAndLevel = <T extends [Skill, RankLevels, SkillValue]>(
  a: T,
  b: T
) => {
  const indexA = rarityOrder.indexOf(skillDefinitions[a[0]]?.skillGrade);
  const indexB = rarityOrder.indexOf(skillDefinitions[b[0]]?.skillGrade);
  if (indexA === indexB) {
    return a[1] > b[1] ? -1 : 1;
  }
  return indexA < indexB ? -1 : 1;
};

export const makeSkillData = (
  skillLevels: Partial<Record<Skill, RankLevels>>,
  targetPosition?: Position | "0"
) =>
  Object.entries(skillLevels).map<SkillData>(([skillName, skillRank]) => [
    skillName as Skill,
    skillRank,
    getSkillValue(skillName as Skill, skillRank, targetPosition),
  ]);

export const getSkillLevelDiff = (
  newSkills: SkillRanks,
  oldSkills: SkillRanks,
  position?: Position | "0"
): SkillDiff => {
  const changedSkills = Object.keys(newSkills)
    .filter((row) => newSkills[row] !== oldSkills[row])
    .reduce((acc, key) => {
      if (!oldSkills[key]) {
        acc[key] = {
          levelDiff: newSkills[key],
          from: 0,
          valueDiff: getSkillValue(key as Skill, newSkills[key], position),
        };
      } else {
        acc[key] = {
          levelDiff: newSkills[key] - oldSkills[key],
          from: oldSkills[key],
          valueDiff:
            getSkillValue(key as Skill, newSkills[key], position) -
            getSkillValue(key as Skill, oldSkills[key], position),
        };
      }
      return acc;
    }, {});

  const missingSkills = Object.keys(oldSkills)
    .filter((row) => newSkills?.[row] === undefined)
    .reduce((acc, key) => {
      acc[key] = {
        levelDiff: -oldSkills[key],
        from: oldSkills[key],
        valueDiff: 0 - getSkillValue(key as Skill, oldSkills[key], position),
      };
      return acc;
    }, {});

  return { ...changedSkills, ...missingSkills };
};

const getBetterSkillByValue = (...skills: SkillData[]) => {
  return skills.reduce<SkillData>((acc, val) => {
    const currentHighestSkillValue = acc[2];
    const newSkillValue = val[2];
    if (!currentHighestSkillValue) return val;
    return currentHighestSkillValue < newSkillValue ? val : acc;
  }, [] as unknown as SkillData);
};

export const getBestSkills = (skills: SkillData[]) => {
  const bestSkillsOfEachCategory = skills.reduce<
    Partial<Record<SkillType, SkillData>>
  >((acc, skill) => {
    const [skillName] = skill;
    const skillType = skillDefinitions[skillName].type;
    if (skillType !== "Common") {
      if (acc[skillType]) {
        acc[skillType] = getBetterSkillByValue(acc[skillType], skill);
      } else {
        acc[skillType] = skill;
      }
      return acc;
    }
    return acc;
  }, {});

  const bestNonCommonSkills = Object.values(bestSkillsOfEachCategory);

  const bestCommonSkills = skills.filter((skill) => {
    const [skillName] = skill;
    const skillType = skillDefinitions[skillName].type;
    return skillType === "Common";
  });

  const allSkillsSorted = bestNonCommonSkills
    .concat(bestCommonSkills)
    .sort((a, b) => (a[2] > b[2] ? -1 : 1));

  const bestSkillsEncyclopedia = allSkillsSorted
    .slice(0, 25)
    .reduce<Partial<Record<Skill, SkillData>>>((acc, skill) => {
      acc[skill[0]] = skill;
      return acc;
    }, {});

  const bestSkillsDefault = allSkillsSorted
    .slice(0, 20)
    .reduce<Partial<Record<Skill, SkillData>>>((acc, skill) => {
      acc[skill[0]] = skill;
      return acc;
    }, {});

  return {
    listOfBestSkillsDefault: bestSkillsDefault,
    listOfBestSkillsEncyclopedia: bestSkillsEncyclopedia,
  };
};

export const getBestSkillsInDeck = (
  deck: Deck,
  targetPosition: Position | "0"
) => {
  const skillLevelSums = getSkillLevelsSum(deck);
  const skillData = makeSkillData(skillLevelSums, targetPosition);
  return getBestSkills(skillData);
};

export const sumValuesOfBestSkills = (Skilldata: SkillData[]) =>
  Skilldata.reduce((acc, val) => acc + val[2], 0);
