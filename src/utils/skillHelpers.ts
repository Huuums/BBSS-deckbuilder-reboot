import {
  Deck,
  Position,
  RankLevels,
  RosterTrainer,
  Skill,
  SkillData,
  SkillDefinition,
  SkillDiff,
  SkillRanks,
  SkillType,
  SkillValue,
  Trainer,
  TrainerNames,
} from "@localtypes/types";
import skillDefinitions from "@assets/json/skillDefinitions";
import { pitchingPositions } from "@assets/positions";

export const getSkillLevelsSum = (deck: Deck, withoutPotential = false) => {
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
              (withoutPotential
                ? 0
                : trainer.potential.filter((row) => row === skillName).length ||
                  0),
            5
          );
        } else {
          acc[skillName] = Math.min(
            skillLevel +
              (withoutPotential
                ? 0
                : trainer.potential.filter((row) => row === skillName).length ||
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
  const positionValue =
    skillDefinitions[skillName].valuesByPosition[targetPosition || "0"];
  let multiplierForPosition: number;
  if (positionValue === undefined) {
    multiplierForPosition = 0;
  } else if (positionValue && typeof positionValue === "number") {
    multiplierForPosition = positionValue;
  } else {
    multiplierForPosition = positionValue[skillRank];
  }

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

export const getDeckSkillValue = (
  deck: Deck,
  targetPosition: Position | "0"
) => {
  const { listOfBestSkillsDefault, listOfBestSkillsEncyclopedia } =
    getBestSkillsInDeck(deck, targetPosition);

  return {
    deckValue: sumValuesOfBestSkills(Object.values(listOfBestSkillsDefault)),
    deckValueEncyclopedia: sumValuesOfBestSkills(
      Object.values(listOfBestSkillsEncyclopedia)
    ),
  };
};

export const getOptimalPotentialForDeck = (
  deck: Deck,
  maxURPotential: 0 | 1 | 2 | 3 = 3,
  targetPosition: Position | "0"
) => {
  const trainers: Trainer[] = deck.filter(
    (val) => val !== "empty"
  ) as Trainer[];

  const skillLevels = getSkillLevelsSum(trainers, true);
  const possibleSkillValueIncrease = Object.entries(skillLevels)
    .map(([key, val]: [Skill, RankLevels]) => {
      const currentValue = getSkillValue(key, val, targetPosition);
      const trainersWithSkill = trainers.filter(
        (val) => val.skills[val.stars][key] !== undefined
      );
      const maxPotentialOnSkill =
        skillDefinitions[key].skillGrade === "UR"
          ? Math.min(
              5 - val,
              trainersWithSkill.length * Math.min(maxURPotential, 2)
            )
          : Math.min(5 - val, trainersWithSkill.length * 2);
      const possibleValue = getSkillValue(
        key,
        Math.min(val + maxPotentialOnSkill, 5),
        targetPosition
      );
      return {
        skill: key,
        rank: val,
        skillGrade: skillDefinitions[key].skillGrade,
        currentValue,
        possibleValue,
        averageValuePerLevel:
          (possibleValue - currentValue) / maxPotentialOnSkill,
        maxPotentialOnSkill,
        trainersWithSkill: trainersWithSkill,
      };
    })
    .filter(
      (val, _i, arr) =>
        val.averageValuePerLevel > 0 &&
        !arr.some((entry) => {
          const isSameType =
            skillDefinitions[entry.skill].type !== "Common" &&
            skillDefinitions[entry.skill].type ===
              skillDefinitions[val.skill].type;
          if (!isSameType) return false;
          const possibleValueIsEqual =
            val.possibleValue === entry.possibleValue;
          if (possibleValueIsEqual) {
            if (val.skill === entry.skill) return false;
            return val.currentValue < entry.currentValue;
          }
          const possibleValueIsLess = val.possibleValue < entry.possibleValue;
          return isSameType && possibleValueIsLess;
        })
    )
    .sort((a, b) => {
      if (b.averageValuePerLevel === a.averageValuePerLevel) {
        return a.trainersWithSkill.length - b.trainersWithSkill.length;
      }
      return b.averageValuePerLevel - a.averageValuePerLevel;
    });

  const usedPotentialSlots = trainers.reduce((acc, val) => {
    acc[val.name] = { UR: [], SSR: [], SR: [], R: [], N: [], Total: 0 };
    return acc;
  }, {});

  let totalPotentialUsed = 0;
  possibleSkillValueIncrease.forEach((skill) => {
    let remainingMaxPotentialOnSkill = skill.maxPotentialOnSkill;
    if (
      remainingMaxPotentialOnSkill <= 0 ||
      totalPotentialUsed === trainers.length * 3
    )
      return;

    skill.trainersWithSkill.forEach((trainer) => {
      for (let i = 0; i < 2; i++) {
        if (remainingMaxPotentialOnSkill <= 0) return false;
        const hasAvailableSlots =
          ((skill.skillGrade === "UR" &&
            maxURPotential > usedPotentialSlots[trainer.name]["UR"].length &&
            usedPotentialSlots[trainer.name].Total < 3) ||
            (skill.skillGrade !== "UR" &&
              usedPotentialSlots[trainer.name].Total < 3)) &&
          usedPotentialSlots[trainer.name][skill.skillGrade].filter(
            (name) => name === skill.skill
          ).length < 2;

        if (!hasAvailableSlots) {
          const tooManyURSkills = !(
            maxURPotential > usedPotentialSlots[trainer.name]["UR"].length &&
            skill.skillGrade === "UR"
          );
          let skillToMove: SkillDefinition | undefined = undefined;
          const trainerToMovePreviousSkillTo = trainers.find((val) =>
            Object.keys(usedPotentialSlots[trainer.name]).some((key) => {
              if (key === "Total" || trainer.name === val.name) return false;
              return usedPotentialSlots[trainer.name][key].some((usedSkill) => {
                const hasSkill = val.skills[val.stars][usedSkill];
                if (
                  tooManyURSkills &&
                  skillDefinitions[usedSkill].skillGrade !== "UR"
                )
                  return false;
                if (hasSkill) {
                  const hasAvailableSlots =
                    ((skillDefinitions[usedSkill].skillGrade === "UR" &&
                      maxURPotential >
                        usedPotentialSlots[val.name]["UR"].length &&
                      usedPotentialSlots[val.name].Total < 3) ||
                      (skillDefinitions[usedSkill].skillGrade !== "UR" &&
                        usedPotentialSlots[val.name].Total < 3)) &&
                    usedPotentialSlots[val.name][
                      skillDefinitions[usedSkill].skillGrade
                    ].filter((skillname) => skillname === usedSkill).length < 2;
                  if (hasAvailableSlots) {
                    console.log(trainer, hasAvailableSlots, usedSkill, val);
                    skillToMove = skillDefinitions[usedSkill];
                    return true;
                  }
                }
                return false;
              });
            })
          );
          if (trainerToMovePreviousSkillTo) {
            remainingMaxPotentialOnSkill--;
            usedPotentialSlots[trainerToMovePreviousSkillTo.name][
              skillToMove.skillGrade
            ].push(skillToMove.name);
            usedPotentialSlots[trainerToMovePreviousSkillTo.name].Total =
              usedPotentialSlots[trainerToMovePreviousSkillTo.name].Total + 1;
            const indexToRemove = usedPotentialSlots[trainer.name][
              skillToMove.skillGrade
            ].findIndex((val) => val === skillToMove.name);

            usedPotentialSlots[trainer.name][skillToMove.skillGrade] =
              usedPotentialSlots[trainer.name][skillToMove.skillGrade].filter(
                (_row, i) => i !== indexToRemove
              );
            usedPotentialSlots[trainer.name][skill.skillGrade].push(
              skill.skill
            );
            totalPotentialUsed++;
          }
        } else {
          remainingMaxPotentialOnSkill--;
          usedPotentialSlots[trainer.name][skill.skillGrade].push(skill.skill);
          usedPotentialSlots[trainer.name].Total =
            usedPotentialSlots[trainer.name].Total + 1;
          totalPotentialUsed++;
        }
      }
    });
  });

  const potential: Partial<Record<TrainerNames, RosterTrainer["potential"]>> =
    Object.entries(usedPotentialSlots).reduce((acc, [key, value]) => {
      acc[key] = []
        .concat(...Object.values(value))
        .filter((val) => typeof val !== "number");

      return acc;
    }, {});

  return {
    optimalPotentialPerTrainer: potential,
    optimalPotentialSkillOrder: possibleSkillValueIncrease,
  };
};
