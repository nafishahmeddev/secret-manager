import { useQuery } from "@tanstack/react-query";
import { AppRouter } from "./router";
import { type AuthState, useAuthStore } from "./store/auth";
import LoginPage from "./pages/login.page";
import AuthApi from "./services/auth";



function App() {
  useQuery({
    queryKey: ["auth"],
    queryFn: async () => AuthApi.verify(),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const [auth] = useAuthStore<AuthState>();

  if (auth.loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">Loading...</div>;
  }
  return (
    <>
      {auth.loggedIn ? (
        <AppRouter />
      ) : (
        <LoginPage />
      )}
    </>
  )
}

export default App
