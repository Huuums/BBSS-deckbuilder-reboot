import { auth } from "@utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Component, createSignal, JSX } from "solid-js";

const SignUp: Component = () => {
  const [error, setError] = createSignal<string>("");

  const onSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (
    e
  ) => {
    e.preventDefault();
    if (
      e.currentTarget.password.value !== e.currentTarget.confirmpassword.value
    ) {
      setError("Password and Confirm Password must match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(
        auth,
        e.currentTarget.email.value,
        e.currentTarget.password.value
      );
    } catch (e) {
      if (e.message.includes("email-already-in-use")) {
        setError("User already exists");
        return;
      }
      setError(e.message);
    }
  };

  return (
    <div class="flex flex-1 min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-300">
          Create an Account
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
                New Password
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="password"
                  required
                  class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                for="confirmpassword"
                class="block text-sm font-medium text-gray-300"
              >
                Confirm New Password
              </label>
              <div class="mt-1">
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  autocomplete="confirmpassword"
                  required
                  class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              {error() && <span class="text-red-400">{error()}</span>}
            </div>
            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
