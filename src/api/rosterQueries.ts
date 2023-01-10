import { Roster } from "@localtypes/types";
import { child, get, ref, set, update } from "firebase/database";
import { database as db } from "../utils/firebase";

const getRosterFromLocalStorage = () => {
  if (localStorage.getItem("roster")) {
    return {
      trainers: JSON.parse(localStorage.getItem("roster") || "{}"),
    };
  }
  return null;
};

export const getRosterById = async (
  _: unknown,
  id: string
): Promise<Roster> => {
  if (id) {
    try {
      const dbRef = ref(db);
      const data = await get(child(dbRef, `/rosters/${id}`));
      if (data.exists()) {
        return data.val();
      } else {
        return getRosterFromLocalStorage();
      }
    } catch (e) {
      return e;
    }
  }
  return getRosterFromLocalStorage();
};

export const setRosterById = async ({ id, value }) => {
  if (id) {
    try {
      await set(ref(db, `/rosters/${id}/trainers`), { value });
    } catch (e) {
      console.log(e);
    }
  } else {
    localStorage.setItem("roster", JSON.stringify(value));
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
