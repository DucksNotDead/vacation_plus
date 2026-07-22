import {createContext, ReactNode, useState} from "react";

export const CurrentUserContext = createContext(null)

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null)
  //@ts-ignore
  return <CurrentUserContext.Provider value={{ user, setUser }}>{ children }</CurrentUserContext.Provider>
}
