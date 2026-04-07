import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Yangiliklar from "./pages/Yangiliklar";
import Elonlar from "./pages/Elonlar";
import Oqituvchilar from "./pages/Oqituvchilar";
import Rahbariyat from "./pages/Rahbariyat";
import Qabul from "./pages/Qabul";
import Sozlamalar from "./pages/Sozlamalar";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "yangiliklar", Component: Yangiliklar },
      { path: "elonlar", Component: Elonlar },
      { path: "oqituvchilar", Component: Oqituvchilar },
      { path: "rahbariyat", Component: Rahbariyat },
      { path: "qabul", Component: Qabul },
      { path: "sozlamalar", Component: Sozlamalar },
    ],
  },
]);
