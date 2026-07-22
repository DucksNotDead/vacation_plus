import {Flex} from "@prismane/core";
import AppIcon from "./UI/app-icon.tsx";
import useCurrentUser from "../hooks/useCurrentUser.ts";
import AppAvatar from "./UI/app-avatar.tsx";
import {useMemo, useState} from "react";
import AvatarSetter from "./avatar-setter.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import useConfirm from "../hooks/useConfirm.ts";

const Header = () => {
  const { user, logout } = useCurrentUser()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const confirm = useConfirm()

  const breadcrumbs = useMemo(() => {
    if (user) {
      const names = pathname.split("/").filter(s => s.length)
      if (names.includes("login")) return " / Вход"
      if (names.includes("admin")) return " / " + user.department.name
      if (names.includes("home")) return " / Мой отпуск"
      if (names.includes("gantt")) return " / " + user.department.name + " / " + names[1]
    }
    else return " /"
  }, [pathname, user])

  return (
      <>
        <Flex h={36} px={12} my={8} gap={12} align={"center"}>
          <Flex grow gap={8} align={"center"}>
            <img
                alt={"app logo"}
                src={"/logo.svg"}
                height={32}
                className={"pointer"}
                onClick={() => navigate("/")}
            />
            <h1>Отпуск+</h1>
            <h2>{breadcrumbs}</h2>
          </Flex>
          {user
              ? <>
                <AppAvatar src={user?.avatar} onClick={() => setOpen(() => true)}/>
                <AppIcon name={"log-out"} onClick={() => confirm({
                  title: "Вы уверены что хотите выйти?",
                  callback: logout
                })}/>
              </>
              : null
          }
        </Flex>
        <AvatarSetter open={open} setOpen={setOpen} avatar={user?.avatar}/>
      </>
  );
};

export default Header;
