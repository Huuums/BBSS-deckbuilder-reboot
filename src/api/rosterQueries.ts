import trainers, { trainersObject } from "@assets/json/trainers";
import {
  CustomTrainer,
  Roster,
  RosterCustomTrainers,
  RosterTrainer,
  Trainer,
  TrainerNames,
} from "@localtypes/types";
import { child, get, ref, set, update } from "firebase/database";
import { database as db } from "../utils/firebase";

const makeLocalTrainerData = (
  roster: Roster | null,
  customTrainers: RosterCustomTrainers | undefined
) => {
  const defaultTrainers = trainers.map<Trainer>((trainer) => {
    const rosterTrainer = roster?.[trainer.name];
    if (rosterTrainer) {
      return {
        ...trainer,
        stars: rosterTrainer?.stars || 0,
        potential: rosterTrainer?.potential || [],
        useSkin: rosterTrainer?.useSkin || false,
        customName: rosterTrainer?.customName || "",
        trainerId: trainer.name,
      };
    }
    return {
      ...trainer,
      stars: 0,
      potential: [],
      useSkin: false,
      customName: "",
    };
  });

  let customTrainersData: Trainer[] = [];
  if (customTrainers) {
    customTrainersData = Object.values(customTrainers).map<Trainer>((val) => ({
      ...trainersObject[val.trainer],
      stars: val?.stars || 0,
      potential: val?.potential || [],
      useSkin: val?.useSkin || false,
      customName: val?.customName || "",
      trainerId: val?.trainerId || "",
      isCustomTrainer: val?.isCustomTrainer || true,
    }));
  }
  return defaultTrainers.concat(customTrainersData);
};

const getRosterFromLocalStorage = () => {
  if (localStorage.getItem("roster")) {
    return JSON.parse(localStorage.getItem("roster") || "{}");
  }
  return null;
};

const getCustomTrainersFromLocalStorage = () => {
  if (localStorage.getItem("customTrainers")) {
    return JSON.parse(localStorage.getItem("customTrainers") || "{}");
  }
  return null;
};

export const getRosterById = async (
  _: unknown,
  id: string
): Promise<{ isShared: boolean; owner: string; trainers: Trainer[] }> => {
  if (id) {
    const dbRef = ref(db);
    const data = await get(child(dbRef, `/rosters/${id}`));
    if (data.exists()) {
      return {
        ...data.val(),
        trainers: makeLocalTrainerData(
          data.val().trainers,
          data.val().customTrainers
        ),
      };
    } else {
      return {
        isShared: false,
        owner: "mine",
        trainers: makeLocalTrainerData(
          await getRosterFromLocalStorage(),
          await getCustomTrainersFromLocalStorage()
        ),
      };
    }
  }
  return {
    isShared: false,
    owner: "mine",
    trainers: makeLocalTrainerData(
      await getRosterFromLocalStorage(),
      await getCustomTrainersFromLocalStorage()
    ),
  };
};

export const setRosterById = async ({ id, value }) => {
  if (id) {
    await set(ref(db, `/rosters/${id}/trainers`), value);
  } else {
    localStorage.setItem("roster", JSON.stringify(value));
  }
};

export const updateRosterTrainer = async ({
  id,
  value,
  trainer,
}: {
  id: string;
  value: Partial<RosterTrainer>;
  trainer: TrainerNames;
}) => {
  if (id) {
    const updates = Object.keys(value).reduce((acc, val) => {
      acc[`/${val}`] = value[val];
      return acc;
    }, {});
    await update(ref(db, `/rosters/${id}/trainers/${trainer}`), updates);
  } else {
    const currentRoster: Roster = JSON.parse(localStorage.getItem("roster"));
    localStorage.setItem(
      "roster",
      JSON.stringify({
        ...currentRoster,
        [trainer]: { ...currentRoster?.[trainer], ...value },
      })
    );
  }
};

export const addCustomTrainer = async ({
  rosterId,
  value,
}: {
  rosterId: string | undefined;
  value: CustomTrainer;
}) => {
  if (rosterId) {
    const updates = Object.keys(value).reduce((acc, val) => {
      acc[`/${val}`] = value[val];
      return acc;
    }, {});
    await update(
      ref(db, `/rosters/${rosterId}/customTrainers/${value.trainerId}`),
      updates
    );
  } else {
    const currentCustomTrainers: RosterCustomTrainers = JSON.parse(
      localStorage.getItem("customTrainers")
    );
    localStorage.setItem(
      "customTrainers",
      JSON.stringify({
        ...currentCustomTrainers,
        [value.trainerId]: value,
      })
    );
  }
};

export const removeCustomTrainer = async ({
  rosterId,
  trainerId,
}: {
  rosterId: string | undefined;
  trainerId: string;
}) => {
  if (rosterId) {
    await update(ref(db, `/rosters/${rosterId}/customTrainers`), {
      [`/${trainerId}`]: null,
    });
  } else {
    const currentCustomTrainers: RosterCustomTrainers = JSON.parse(
      localStorage.getItem("customTrainers")
    );
    localStorage.setItem(
      "customTrainers",
      JSON.stringify(
        Object.fromEntries(
          Object.entries(currentCustomTrainers).filter(
            (val) => val[0] !== trainerId
          )
        )
      )
    );
  }
};

export const updateCustomTrainer = async ({
  rosterId,
  value,
  trainerId,
}: {
  rosterId: string | undefined;
  trainerId: string;
  value: Partial<CustomTrainer>;
}) => {
  if (rosterId) {
    const updates = Object.keys(value).reduce((acc, val) => {
      acc[`/${val}`] = value[val];
      return acc;
    }, {});
    await update(
      ref(db, `/rosters/${rosterId}/customTrainers/${trainerId}`),
      updates
    );
  } else {
    const currentCustomTrainers: RosterCustomTrainers = JSON.parse(
      localStorage.getItem("customTrainers")
    );
    localStorage.setItem(
      "customTrainers",
      JSON.stringify({
        ...currentCustomTrainers,
        [trainerId]: {
          ...currentCustomTrainers[trainerId],
          ...value,
        },
      })
    );
  }
};

export const updateRosterData = async (id: string, updates) => {
  if (id) {
    try {
      return update(ref(db, `/rosters/${id}`), updates);
    } catch (e) {
      return e;
    }
  }
};
