import { Component } from "solid-js";
import { Route, Routes } from "@solidjs/router";
import Layout from "@components/Layout";
import Deckbuilder from "@pages/Deckbuilder";

const App: Component = () => {
  return (
    <Layout>
      <Routes>
        {/* <Route path="/login" element={<SignUp />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/my-roster" element={<RosterManager />} /> */}
        <Route path="/deck" element={<Deckbuilder />} />
        {/* <Route path="/:my-decks" element={<DeckList />} /> */}
      </Routes>
    </Layout>
  );
};

export default App;
