// import { useAuth } from "@hooks/useAuth";
import { auth } from "@utils/firebase";
import { signOut } from "firebase/auth";
import type { Component } from "solid-js";

const Profile: Component = () => {
  // const user = useAuth();
  return (
    <div class="flex flex-1 min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-300">
          Profile
        </h2>
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
