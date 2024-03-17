import EmployeePage from "../pages/employee-page";
import AdminPage from "../pages/admin-page";
import GanttPage from "../pages/gantt-page";
import EmployeeVacationFormPage from "../pages/employee-vacation-form-page";

/*const route = {
  path: '',
  element: <></>,
  access: 0
}*/

const routes = [
  {
    path: '/home',
    element: <EmployeePage/>,
    access: 0
  },
  {
    path: '/employee-vacation-form/:id',
    element: <EmployeeVacationFormPage/>,
    access: 0
  },
  {
    path: '/admin',
    element: <AdminPage/>,
    access: 1,
  },
  {
    path: '/gantt/:year',
    element: <GanttPage/>,
    access: 1
  },
]

export default routes