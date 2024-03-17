import React, {useEffect} from 'react';
import useCurrentUser from "../../hooks/useCurrentUser";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {

  const {user, login} = useCurrentUser()

  const navigate= useNavigate()

  useEffect(() => {
    if (user) navigate('/')
  }, [user]);

  return (
      <div onClick={login}>
        LoginPage
      </div>
  );
};

export default LoginPage;