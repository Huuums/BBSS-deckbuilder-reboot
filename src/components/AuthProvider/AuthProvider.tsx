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
} from "solid-js";

export const AuthContext = createContext<Accessor<User>>();

const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal<User>(null);
  const [isLoading, setIsLoading] = createSignal(true);

  const listener = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const { uid, displayName, email } = user;
      const userData = await getOrCreateUser(uid);
      setIsLoading(false);
      setUser({ uid, displayName, email, ...userData });
    } else {
      setIsLoading(false);
      setUser(null);
    }
  });

  onCleanup(() => listener());

  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
