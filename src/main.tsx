import { createRoot } from "react-dom/client";
import App from "./app/App";
import { AuthProvider } from "./app/context/AuthContext";
import { ThemeProvider } from "next-themes";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);