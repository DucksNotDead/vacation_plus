import React from 'react';
import {Navigate} from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";

const RootPage = () => {

  const { user } = useCurrentUser()

  const homeRoutes = {
    0: 'home',
    1: 'admin'
  }

  return <Navigate to={'/' + (user? homeRoutes[user.access] : 'login')}/>
};

export default RootPage;