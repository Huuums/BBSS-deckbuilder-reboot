/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import App from "./App";
import { QueryClientProvider, QueryClient } from "@tanstack/solid-query";
import AuthProvider from "@components/AuthProvider";

const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  ),
  document.getElementById("root") as HTMLElement
);
