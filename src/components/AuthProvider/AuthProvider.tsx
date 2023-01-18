import { getOrCreateUser } from "@api/userQueries";
import { User } from "@localtypes/types";
import { auth } from "@utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  ParentComponent,
  createContext,
  createSignal,
  onCleanup,
  Accessor,
  Show,
  batch,
} from "solid-js";

export const AuthContext = createContext<Accessor<User | null>>();

const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<User | null>(null);
  const [isLoading, setIsLoading] = createSignal<boolean>(true);

  const listener = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const { uid, displayName, email } = user;
      const userData = await getOrCreateUser(uid);
      batch(() => {
        setIsLoading(false);
        setUser({ uid, displayName, email, ...userData });
      });
    } else {
      setIsLoading(false);
      setUser(null);
    }
  });

  onCleanup(() => listener());

  return (
    <AuthContext.Provider value={user}>
      <Show when={!isLoading()} fallback={null}>
        {props.children}
      </Show>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
