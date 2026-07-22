import {AppRouteType} from "../constants/Types.ts";
import RootPage from "../pages/root-page.tsx";
import AdminPage from "../pages/admin-page.tsx";
import EmployeePage from "../pages/employee-page.tsx";
import GanttPage from "../pages/gantt-page.tsx";
import LoginPage from "../pages/login-page.tsx";
import ErrorPage from "../pages/error-page.tsx";

const routes: AppRouteType[] = [
  {
    path: "/",
    element: <RootPage/>,
    access: 0
  },
  {
    path: "/admin",
    element: <AdminPage/>,
    access: 1
  },
  {
    path: "/home",
    element: <EmployeePage/>,
    access: 0
  },
  {
    path: "/gantt/:year",
    element: <GanttPage/>,
    access: 1
  },
  {
    path: "/login",
    element: <LoginPage/>,
    access: 0
  },
  {
    path: "/error",
    element: <ErrorPage/>,
    access: 0
  },
]

export default routes;