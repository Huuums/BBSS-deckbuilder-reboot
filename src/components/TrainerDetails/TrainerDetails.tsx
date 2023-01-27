import SimpleSkillList from "@components/SimpleSkillList";
import Trainer from "@components/Trainer/Trainer";
import TrainerPosition from "@components/TrainerPosition";
import TrainerStatsType from "@components/TrainerStatsType";
import { SkillRanks, Trainer as TrainerType } from "@localtypes/types";
import { isMobile } from "@utils/commonHelpers";
import { getSkillLevelDiff } from "@utils/skillHelpers";
import { Component, createSignal } from "solid-js";

type TrainerDetailsProps = {
  trainer: TrainerType;
  src: string;
};

const skillsIncludingPotential = (
  skills: SkillRanks,
  potential: TrainerType["potential"]
) => {
  return Object.fromEntries(
    Object.entries(skills).map(([key, level]) => {
      const potentialValue =
        potential?.filter?.((name) => name === key)?.length || 0;
      return [key, Math.min(level + potentialValue)];
    })
  );
};

const TrainerDetails: Component<TrainerDetailsProps> = (props) => {
  const [stars, setStars] = createSignal(props.trainer.stars || 1);
  const [tempStars, setTempStars] = createSignal(null);

  const skillDiff = () =>
    tempStars()
      ? getSkillLevelDiff(
          skillsIncludingPotential(
            props.trainer.skills[tempStars()],
            props.trainer.potential
          ),
          skillsIncludingPotential(
            props.trainer.skills[stars()],
            props.trainer.potential
          )
        )
      : null;

  const skillsToShow = () => {
    if (!tempStars()) return props.trainer.skills[stars()];
    const removedSkills = Object.fromEntries(
      Object.entries(skillDiff())
        .filter(([_key, diff]) => diff.from + diff.levelDiff === 0)
        .map(([key]) => [
          //another wtf typescript
          key,
          0,
        ])
    );
    return { ...props.trainer.skills[tempStars()], ...removedSkills };
  };

  return (
    <div class="flex flex-col items-center space-y-3 p-3">
      <div>
        <Trainer
          class="max-w-[128px]"
          onlyAvatarAndStars
          trainer={{ ...props.trainer, stars: stars() }}
          src={props.src}
          onChange={(changes) =>
            !changes.stars ? null : setStars(changes.stars)
          }
          onMouseEnterUpgradeSelector={(stars) =>
            isMobile() ? null : setTempStars(stars)
          }
          onMouseLeaveUpgradeSelector={() =>
            isMobile() ? null : setTempStars(null)
          }
        />
        <h2 class="text-xl text-gray-200 text-center">{props.trainer.name}</h2>
      </div>
      <div class="flex justify-center items-center relative space-x-2 !-mt-1">
        <TrainerStatsType type={props.trainer.type} large />
        <TrainerPosition large position={props.trainer.position} />
      </div>
      <SimpleSkillList
        diff={skillDiff()}
        skills={skillsToShow()}
        potential={props.trainer.potential}
      />
    </div>
  );
};

export default TrainerDetails;
