import {useContext} from "react";
import {UserContext} from "../context/userContext";
import useFetch from "./useFetch";

const testAdmin = {
  department: { name: '2 отдел', id: 1 },
  access: 1
}

const testUser = {
  access: 0
}

const useCurrentUser = () => {
  const { user, setUser } = useContext(UserContext)

  const fetcher = useFetch()

  const login = () => setUser(testAdmin) /*(credits = {
    email: '',
    password: ''
  }) => {
    return fetcher('/login', {
      method: 'post',
      body: credits,
    })
  }*/

  const auth = () => {
    const {status} = fetcher('/auth', {
      method: 'post',
      header: `Authorization: Bearer ${ localStorage.getItem('accessToken') }`,
      onSuccess: user => setUser(() => user),
    })
    return status
  }

  const logout = () => setUser(null) /*() => {
    fetcher('/logout', { method: 'post' })
    localStorage.removeItem('accessToken')
    setUser(() => null)
  }*/

  return { user, login, logout, auth }
}

export default useCurrentUser