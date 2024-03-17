import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import routes from "./routes";
import useCurrentUser from "../hooks/useCurrentUser";
import Guard from "./guard";
import serviceRoutes from "./service-routes";

const AppRouter = () => {
  const { user } = useCurrentUser()
  // noinspection JSValidateTypes
  return (
      <BrowserRouter>
        <Routes>
          {serviceRoutes.map(sr => <Route
              key={sr.path}
              path={sr.path}
              element={sr.element}
          />)}
          {routes.map(r => <Route
              key={r.path}
              path={r.path}
              element={<Guard user={user} route={r}/>}
          />)}
        </Routes>
      </BrowserRouter>
  )
}

export default AppRouter;
