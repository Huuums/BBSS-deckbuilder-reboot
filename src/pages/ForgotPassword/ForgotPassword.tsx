import { sendPasswordResetEmail } from "firebase/auth";
import { Component, createSignal, JSX, Match, Switch } from "solid-js";
import { auth } from "@utils/firebase";

const ForgotPassword: Component = () => {
  const [mailIsSent, setMailIsSent] = createSignal(false);
  const [error, setError] = createSignal<string>("");

  const onSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (
    e
  ) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, e.currentTarget.email.value);
      setMailIsSent(true);
    } catch (e) {
      if (e.message.includes("user-not-found")) {
        setError("User not Found");
        return;
      } else {
        setError("Something went wrong. Please try again later");
        return;
      }
      setError(e.message);
    }
  };

  return (
    <div class="flex flex-1 min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-300">
          Forgot Password
        </h2>

        <Switch>
          <Match when={!mailIsSent()}>
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
              </div>
            </div>
          </Match>
          <Match when={mailIsSent()}>
            <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div class="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-300"
                >
                  Your Password reset Mail has successfully been sent out.{" "}
                  <p class="mt-2">
                    Please click on the link inside that mail to continue.
                  </p>
                </label>
              </div>
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default ForgotPassword;
