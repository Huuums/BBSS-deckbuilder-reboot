import { Component, createSignal, JSX } from "solid-js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@utils/firebase";
import { IoLogoGoogle } from "solid-icons/io";

import { A } from "@solidjs/router";

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  signInWithPopup(auth, googleProvider);
};

const Login: Component = () => {
  const [error, setError] = createSignal<string>("");

  const onSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (
    e
  ) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        e.currentTarget.email.value,
        e.currentTarget.password.value
      );
    } catch (e) {
      if (e.message.includes("user-not-found")) {
        setError("User does not exist");
        return;
      } else if (e.message.includes("wrong-password")) {
        setError(
          'Wrong password. Please try again or use "Forgot your password?"'
        );
        return;
      }
      setError(e.message);
    }
  };

  return (
    <div class="flex flex-1 min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-300">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" action="#" onSubmit={onSubmit}>
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm">
                <A
                  href="/sign-up"
                  class="font-medium text-gray-400 hover:text-gray-100"
                >
                  Create an account
                </A>
              </div>
              <div class="text-sm">
                <A
                  href="/forgot-password"
                  class="font-medium text-gray-400 hover:text-gray-100"
                >
                  Forgot your password?
                </A>
              </div>
            </div>
            {error() && <div class="text-red-400">{error()}</div>}
            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="bg-gray-800 px-2 text-gray-300">
                  Or continue with
                </span>
              </div>
            </div>

            <div class="mt-6 flex justify-center gap-3">
              <div>
                <button
                  onClick={() => signInWithGoogle()}
                  class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                  <span class="sr-only">Sign in with Google</span>
                  <IoLogoGoogle class="h-5 w-5 m" /> Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
