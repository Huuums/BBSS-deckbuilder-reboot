// import { useAuth } from "@hooks/useAuth";
import { updateRosterData } from "@api/rosterQueries";
import { updateUserData } from "@api/userQueries";
import { useAuth } from "@hooks/useAuth";
import useRoster from "@hooks/useRoster";

import { auth } from "@utils/firebase";
import { signOut } from "firebase/auth";
import { Component, createSignal, JSX } from "solid-js";

const Profile: Component = () => {
  const user = useAuth();

  const [error, setError] = createSignal("");
  const [rosterQuery] = useRoster();

  const onSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (
    e
  ) => {
    e.preventDefault();
    const userValues = {
      "/username": e.currentTarget.username.value,
    };
    const rosterValues = {
      "/owner": e.currentTarget.username.value,
      "/isShared": e.currentTarget.shareroster.checked,
    };

    try {
      updateUserData(user?.().uid, userValues);
      updateRosterData(user?.().roster, rosterValues);
    } catch (e) {
      setError(e);
    }
  };

  return (
    <div class="flex flex-1 min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-300">
          Profile
        </h2>
      </div>
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" action="#" onSubmit={onSubmit}>
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <div class="mt-1">
                <input
                  id="username"
                  name="username"
                  type="username"
                  value={user?.().username}
                  required
                  class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div class="relative flex items-start">
              <div class="flex h-5 items-center">
                <input
                  id="shareroster"
                  checked={rosterQuery?.data?.isShared}
                  aria-describedby="shareroster-description"
                  name="shareroster"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="shareroster" class="font-medium text-gray-300">
                  Make Roster Public
                </label>
                <div id="shareroster-description" class="text-gray-400">
                  <span class="sr-only">Make Roster Public</span>
                  After that you can share your Roster with the link
                  <br />
                  https://bbss-deckbuilder.netlify.app/deck?rosterid=
                  {user?.().roster}
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between" />
            {error() && <div class="text-red-400">{error()}</div>}
            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div>
            <button
              type="submit"
              onClick={() => signOut(auth)}
              class="flex w-full justify-center rounded-md border border-transparent bg-red-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
