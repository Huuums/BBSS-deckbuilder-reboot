import { database as db } from "@utils/firebase";
import { child, get, ref, update } from "firebase/database";
import uniqid from "uniqid";
import trainers from "@assets/json/trainers";
import { Roster } from "@localtypes/types";
import { createRosterObject } from "@utils/rosterHelpers";

export const getOrCreateUser = async (uid: string) => {
  let userData = await getUserData(uid);
  if (!userData) {
    await createInitialUser(uid, JSON.parse(localStorage.getItem("roster")));
    try {
      userData = await getUserData(uid);
      localStorage.removeItem("roster");
    } catch (e) {
      new Error(e);
    }
  }

  return userData;
};

export const createInitialUser = async (id: string, trainerlist: Roster) => {
  const rosterId = uniqid();
  let allTrainers: Roster;
  if (!trainerlist) {
    allTrainers = createRosterObject(trainers);
  }
  const updates = {
    [`/users/${id}/username`]: "Anonymous",
    [`/users/${id}/roster`]: rosterId,
  };
  await update(ref(db), updates);
  const rosterUpdate = {
    [`/rosters/${rosterId}/trainers`]: trainerlist || allTrainers,
    [`/rosters/${rosterId}/isShared`]: false,
    [`/rosters/${rosterId}/owner`]: "Anonymous",
  };
  await update(ref(db), rosterUpdate);
};

export const getUserData = async (id: string) => {
  if (id) {
    const dbRef = ref(db);
    const data = await get(child(dbRef, `/users/${id}`));
    if (data.exists()) {
      return data.val();
    }
  }

  return null;
};

export const updateUserData = async (id: string, values: object) => {
  if (id) {
    try {
      await update(ref(db, `/users/${id}`), values);
    } catch (e) {
      console.log(e);
    }
  }

  return null;
};
