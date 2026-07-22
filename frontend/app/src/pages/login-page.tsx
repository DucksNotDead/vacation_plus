import {Box, Button, Center, PasswordField, Spinner} from "@prismane/core";
import {useEffect, useState} from "react";
import AppInput from "../components/UI/app-input.tsx";
import useCurrentUser from "../hooks/useCurrentUser.ts";
import useNotify from "../hooks/useNotify.tsx";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
  const {isLogin, login} = useCurrentUser()
  const nt = useNotify()
  const navigate = useNavigate()
  const [mail, setMail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)

  const tryToLogin = async () => {
    setPending(() => true)
    const isUser = await login({ mail, password })
    setPending(() => false)
    if (!isUser) {
      setPassword(() => "")
      setMail(() => "")
      nt("Ошибка входа. Проверьте введённые данные", "error")
    }
  }

  useEffect(() => {
    isLogin&& navigate("/")
  }, [isLogin])

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "url(/background.jpeg)"
    }}>
      <Center style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255,255,255,.7)"
      }}>
        <Box
            className={"shadow-sm"}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
            p={12}
            w={460}
            bg={"white"}
            br={14}
            onKeyDown={({ key }: { key: string }) => key==="Enter"&& tryToLogin()}
        >
          <h3 style={{ marginBottom: 12 }}>Введите ваши данные</h3>

          <AppInput value={mail} onInput={setMail} placeholder={"почта@mail.ru"}/>
          <PasswordField
              value={password}
              //@ts-ignore
              onInput={e => setPassword(e.target.value)}
              onChange={(e:any) => e}
              placeholder={"пароль****"}
              h={32}
              variant={"filled"}
          />
          <Button onClick={tryToLogin} disabled={pending}>{pending? <Spinner/> : "Войти"}</Button>
        </Box>
      </Center>
    </div>
  );
};

export default LoginPage;