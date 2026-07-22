import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import api from "../api.ts";
import useCurrentUser from "../hooks/useCurrentUser.ts";
import {ServerUnit} from "../constants/Models.ts";

export const UnitsContext = createContext<{
  units: ServerUnit[]
  setUnits: Dispatch<SetStateAction<ServerUnit[]>>
}>({
  units: [],
  //@ts-ignore
  setUnits: () => {}
})

export const UnitsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useCurrentUser()
  const [units, setUnits] = useState([])

  useEffect(() => {
    if (user) api("/units/"+user.department.id).then(u => setUnits(() => u))
  }, [user])

  //@ts-ignore
  return <UnitsContext.Provider value={{ units, setUnits }}>{ children }</UnitsContext.Provider>
}
