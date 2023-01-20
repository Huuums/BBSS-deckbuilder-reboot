import trainers from "@assets/json/trainers";
import {
  Roster,
  RosterTrainer,
  Trainer,
  TrainerNames,
} from "@localtypes/types";
import { child, get, ref, set, update } from "firebase/database";
import { database as db } from "../utils/firebase";

const makeLocalTrainerData = (roster: Roster | null) => {
  return trainers.map<Trainer>((trainer) => {
    const rosterTrainer = roster?.[trainer.name];
    if (rosterTrainer) {
      return {
        ...trainer,
        stars: rosterTrainer?.stars || 0,
        potential: rosterTrainer?.potential || [],
      };
    }
    return {
      ...trainer,
      stars: 0,
      potential: [],
    };
  });
};

const getRosterFromLocalStorage = () => {
  if (localStorage.getItem("roster")) {
    return JSON.parse(localStorage.getItem("roster") || "{}");
  }
  return null;
};

export const getRosterById = async (
  _: unknown,
  id: string
): Promise<{ isShared: boolean; owner: string; trainers: Trainer[] }> => {
  console.log;
  if (id) {
    const dbRef = ref(db);
    const data = await get(child(dbRef, `/rosters/${id}`));
    if (data.exists()) {
      return {
        ...data.val(),
        trainers: makeLocalTrainerData(data.val().trainers),
      };
    } else {
      return {
        isShared: false,
        owner: "mine",
        trainers: makeLocalTrainerData(await getRosterFromLocalStorage()),
      };
    }
  }
  return {
    isShared: false,
    owner: "mine",
    trainers: makeLocalTrainerData(await getRosterFromLocalStorage()),
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
        [trainer]: { ...currentRoster[trainer], ...value },
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
