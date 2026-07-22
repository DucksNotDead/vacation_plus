import {useContext, useMemo} from "react";
import {CurrentUserContext} from "../context/currentUserContext";
import {User} from "../constants/Models.ts";
import api from "../api.ts"

const tokenKey = "accessToken"
const useCurrentUser = () => {
  //@ts-ignore
  const { user, setUser } = useContext(CurrentUserContext)

  const currentUser = useMemo<User|null>(() => {
    return user? user : null
  }, [user])

  const isLogin = useMemo(() => !!window.localStorage.getItem(tokenKey), [window.localStorage.getItem(tokenKey)])

  const login = async (credits: {
    mail: string
    password: string
  }) => {
    const data = await api("/login", "post", credits)
    if (data) {
      window.localStorage.setItem(tokenKey, data.access_token)
      setUser(() => data.userdata)
      return true
    }
    else return false
  }

  const auth = async () => {
    if (window.localStorage.getItem(tokenKey)) {
      const data = await api("/auth", "post")
      if (data) {
        setUser(() => data.userdata)
        return true
      }
      else {
        window.localStorage.removeItem(tokenKey)
        return false
      }
    }
    else return false
  }
  
  const logout = () => {
    window.localStorage.removeItem(tokenKey)
    setUser(() => null)
  }

  const changeAvatar = async (src: string) => {
    const res = await api("/change-avatar", "put", { data: src })
    if (res) {
      setUser((state: User) => ({...state, avatar: src}))
      return true
    }
    else return false
  }

  return { user: currentUser, isLogin, login, auth, logout, changeAvatar }
}

export default useCurrentUser;