import {ReactNode, useEffect, useMemo, useState} from "react";
import {Navigate, useLocation} from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser.ts";
import AppPreloader from "../components/UI/app-preloader.tsx";
import Page from "../components/page.tsx";

const Guard = (props: {
  element: ReactNode
  access: number
}) => {
  const { pathname } = useLocation()
  const { user, isLogin, auth } = useCurrentUser()
  const isLoginPage = useMemo(() => pathname==="/login", [pathname])
  const [pending, setPending] = useState(true)

  useEffect(() => {
    if (isLogin&&!user) void auth()
    else setTimeout(() => setPending(() => false), 500)
  }, [user, isLogin]);

  return isLoginPage
      ? props.element
      : isLogin
          ? pending
              ? <AppPreloader/>
              : (user?.access as number) >= props.access
                  ? <Page>{ props.element }</Page>
                  : <Navigate to={"/error"}/>
          : <Navigate to={"/login"}/>
};

export default Guard;