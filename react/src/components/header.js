import React from 'react';
import Logo from "./logo";
import useCurrentUser from "../hooks/useCurrentUser";
import Icon from "./UI/icon";
import Button from "./UI/button";

const Header = () => {

  const {user, logout} = useCurrentUser()

  return (
      <div className={"app-header"}>
        <Logo />
        <h1>Отпуск+</h1>
        {user&& (
            <>
              <div>
                <Icon name={'slash'} size={10}/>
              </div>
              <h2>{user?.access === 0
                  ? 'Мой отпуск'
                  : user?.department.name
              }</h2>
              <div className={"flex-1 flex items-center gap-lg justify-end"}>
                <Icon onClick={logout} name={"logout"} />
              </div>
            </>
        )}
      </div>
  );
};

export default Header;