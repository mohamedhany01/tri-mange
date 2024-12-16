import Loader from "@/components/Loader";
import { useAuthenticator } from "@/hooks/useAuthenticator";

import LoginScreen from "./auth/login";
import HomeLayout from "./home/_layout";

export default function App() {
  const { isAuthenticated } = useAuthenticator();

  if (isAuthenticated === undefined) {
    return <Loader />;
  }

  return isAuthenticated ? <HomeLayout /> : <LoginScreen />;
}
