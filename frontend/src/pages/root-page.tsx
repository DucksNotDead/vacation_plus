import useCurrentUser from "../hooks/useCurrentUser.ts";
import {Navigate} from "react-router-dom";

const RootPage = () => {
  const { user } = useCurrentUser()

  const homeRoutes = {
    0: '/home',
    1: '/admin'
  }

  return <Navigate to={homeRoutes[(user?.access as 0|1)]}/>
};

export default RootPage;