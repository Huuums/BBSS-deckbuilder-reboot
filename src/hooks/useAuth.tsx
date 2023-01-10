import { AuthContext } from "@components/AuthProvider/AuthProvider";
import { useContext } from "solid-js";

export const useAuth = () => {
  const user = useContext(AuthContext);
  if (!user) new Error("This can only be used within the AuthContext.Provider");
  return user();
};
