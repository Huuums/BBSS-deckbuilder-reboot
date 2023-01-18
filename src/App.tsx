import { Component, Match, Switch, Show } from "solid-js";
import { Navigate, Route, Routes } from "@solidjs/router";
import Layout from "@components/Layout";
import Deckbuilder from "@pages/Deckbuilder";
import Roster from "@pages/Roster";
import { useAuth } from "@hooks/useAuth";
import Login from "@pages/Login";
import Profile from "@pages/Profile";
import ForgotPassword from "@pages/ForgotPassword";
import HandleAuthActions from "@pages/HandleAuthActions";
import ResetPassword from "@pages/ResetPassword";
import SignUp from "@pages/SignUp";

const App: Component = () => {
  const user = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate href="/deck" />} />
        <Route
          path="/login"
          element={
            <Show when={!user()?.username} fallback={<Navigate href="/deck" />}>
              <Login />
            </Show>
          }
        />
        <Route path="__/auth/action" element={<HandleAuthActions />} />
        <Route
          path="/reset-password"
          element={
            <Show when={!user()?.username} fallback={<Navigate href="/deck" />}>
              <ResetPassword />
            </Show>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Show when={!user()?.username} fallback={<Navigate href="/deck" />}>
              <SignUp />
            </Show>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Show when={!user()?.username} fallback={<Navigate href="/deck" />}>
              <ForgotPassword />
            </Show>
          }
        />
        <Route
          path="/profile"
          element={
            <Switch>
              <Match when={!user()?.username}>
                <Navigate href="/login" />
              </Match>
              <Match when={user()?.username}>
                <Profile />
              </Match>
            </Switch>
          }
        />
        <Route path="/roster" element={<Roster />} />
        <Route path="/deck" element={<Deckbuilder />} />
        {/* <Route path="/:my-decks" element={<DeckList />} /> */}
      </Routes>
    </Layout>
  );
};

export default App;
