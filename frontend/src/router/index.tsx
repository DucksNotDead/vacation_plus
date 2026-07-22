import {BrowserRouter, Routes, Route} from "react-router-dom";
import routes from "./routes.tsx";
import Guard from "./guard.tsx";
import Header from "../components/header.tsx";

const Router = () => (
    <BrowserRouter>
      <Header/>
      <Routes>
        {routes.map(r => (
            <Route key={r.path} path={r.path} element={<Guard element={r.element} access={r.access}/>}/>
        ))}
      </Routes>
    </BrowserRouter>
)

export default Router;