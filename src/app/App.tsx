import { RouterProvider } from "react-router";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import { router } from "./routes";
import { Toaster } from "sonner";

export default function App() {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={login} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}
