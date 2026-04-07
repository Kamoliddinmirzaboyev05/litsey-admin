import { RouterProvider } from "react-router";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import { router } from "./routes";

export default function App() {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return <RouterProvider router={router} />;
}
