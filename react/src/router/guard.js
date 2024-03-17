import React from 'react';
import {Navigate} from "react-router-dom";

const Guard = ({ route, user }) => {
  return !user
      ? <Navigate to={'/login'} replace />
      : user.access !== route.access
          ? <Navigate to={'/error'} replace />
          : route.element
};

export default Guard;