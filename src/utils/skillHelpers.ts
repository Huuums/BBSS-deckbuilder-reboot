import {
  Deck,
  RankLevels,
  Skill,
  SkillDiff,
  SkillRanks,
  Trainer,
} from "@localtypes/types";
import skillDefinitions from "@assets/json/skillDefinitions";

export const getSkillLevelsSum = (deck: Deck) => {
  const nonEmptyTrainers = deck.filter(
    (el): el is Required<Trainer> => el !== "empty"
  );

  return nonEmptyTrainers.reduce<SkillRanks>((acc, trainer) => {
    const curTrainerSkills = Object.entries<RankLevels>(
      trainer.skills[trainer.stars]
    );

    curTrainerSkills.forEach(([skillName, skillLevel]) => {
      if (acc[skillName]) {
        acc[skillName] = Math.min(acc[skillName] + skillLevel, 5);
      } else {
        acc[skillName] = Math.min(skillLevel, 5);
      }
    }, {});
    return acc;
  }, {});
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
  T extends [string, [Skill, RankLevels][]]
>(
  a: T,
  b: T
) => typeOrder.indexOf(a[0]) - typeOrder.indexOf(b[0]);

export const sortByGradeAndLevel = <T extends [Skill, RankLevels]>(
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

export const getSkillLevelDiff = (
  newSkills: SkillRanks,
  oldSkills: SkillRanks
): SkillDiff => {
  const changedSkills = Object.keys(newSkills)
    .filter((row) => newSkills[row] !== oldSkills[row])
    .reduce((acc, key) => {
      if (!oldSkills[key]) {
        acc[key] = { value: newSkills[key], from: 0 };
      } else {
        acc[key] = {
          value: newSkills[key] - oldSkills[key],
          from: oldSkills[key],
        };
      }
      return acc;
    }, {});

  const missingSkills = Object.keys(oldSkills)
    .filter((row) => newSkills?.[row] === undefined)
    .reduce((acc, key) => {
      acc[key] = { value: -oldSkills[key], from: oldSkills[key] };
      return acc;
    }, {});

  return { ...changedSkills, ...missingSkills };
};
