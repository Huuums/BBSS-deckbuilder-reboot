import { Switch, Match, JSX, createSignal } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@utils/firebase";

const ResetPassword: Component = () => {
  const location = useLocation<{ resetCode: string }>();
  const [error, setError] = createSignal<string>("");

  const navigate = useNavigate();

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
      await confirmPasswordReset(
        auth,
        location.state.resetCode,
        e.currentTarget.password.value
      );
      navigate("/login");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div class="flex flex-1 min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-300">
          Forgot Password
        </h2>
        <div class="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Switch>
            <Match
              when={
                location.state?.resetCode !== undefined &&
                location.state?.resetCode !== null
              }
            >
              <form class="space-y-6" action="#" onSubmit={onSubmit}>
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
                    Reset Password
                  </button>
                </div>
              </form>
            </Match>
            <Match when={!location.state?.resetCode}>
              <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <div class="bg-gray-800 font-medium px-4 shadow sm:rounded-lg text-gray-200 sm:px-10">
                  Please use the Link in the email you received to reset your
                  password.
                </div>
              </div>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
