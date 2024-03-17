import RootPage from "../pages/service/root-page";
import ErrorPage from "../pages/service/error-page";
import LoginPage from "../pages/service/login-page";

const serviceRoutes = [
  {
    path: '/*',
    element: <RootPage/>
  },
  {
    path: '/error',
    element: <ErrorPage/>
  },
  {
    path: '/login',
    element: <LoginPage/>
  }
]

export default serviceRoutes