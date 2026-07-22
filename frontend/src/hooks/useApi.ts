import {FullUser, FullYear, ShortUser, Vacation, VacationEntity, VacationUser, Year} from "../constants/Models.ts";
import api from "../api.ts";
import useCurrentUser from "./useCurrentUser.ts";
import {useMemo} from "react";

const useApi = () => {
  const { user } = useCurrentUser()

  const departmentId = useMemo(() => user?.department.id as number, [user])

  return  {
    users: {
      getAll: async (): Promise<ShortUser[]> => {
        const users = await api("/users/"+departmentId)
        return users? users : []
      },
      getSingle: async (userId: number): Promise<FullUser|null> => {
        const user = await api("/users/"+departmentId+"/"+userId)
        return user? user : null
      },
      getVacationData: async (): Promise<VacationUser[]> => {
        const users = await api("/users-vacations/"+departmentId)
        return users? users : []
      },
      setDays: async (userId: number, days: number): Promise<boolean> => {
        const res = await api("/set-days", "put",{ userId, departmentId, days })
        return !!res
      }
    },
    years: {
      getAll: async (): Promise<Year[]> => {
        const year = await api("/vacation-years/"+departmentId)
        return year? year : []
      },
      getSingle: async (year: number): Promise<FullYear|null> => {
        const entity = await api("/vacation-years/"+departmentId+"/"+year)
        return entity? entity : null
      },
      create: async (entity: { userIds: string, year: number }): Promise<FullYear|null> => {
        const res = await api("/create-vacation-year", "post", {
          ...entity,
          departmentId,
          isCurrent: true
        })
        return res? res : null
      },
      remove: async (yearId: number): Promise<boolean> => {
        const res = await api("/delete-vacation-year/" + yearId, "delete")
        return !!res
      },
      setReady: async (yearId: number): Promise<boolean> => {
        const res = await api("/set-vacation-year-ready/" + yearId, "put")
        return !!res
      },
      close: async (yearId: number): Promise<boolean> => {
        const res = await api("/close-vacation-year/" + yearId, "put")
        return !!res
      },
    },
    vacations: {
      create: async (entity: VacationEntity): Promise<Vacation|null> => {
        const data = await api("/create-vacation", "post", entity)
        return data? data : null
      },
      remove: async (vacationId: number): Promise<boolean> => {
        const res = await api("/delete-vacation/" + vacationId, "delete")
        return !!res
      },
    }
  }
}

export default useApi;