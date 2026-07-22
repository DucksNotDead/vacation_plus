import {useCallback, useContext, useMemo} from "react";
import {UnitsContext} from "../context/unitsContext.tsx";
import {ServerUnit, ShortUser, Unit} from "../constants/Models.ts";
import useNotify from "./useNotify.tsx";
import useCurrentUser from "./useCurrentUser.ts";
import api from "../api.ts";

const useUnits = () => {
  const {units, setUnits} = useContext(UnitsContext)
  const { user } = useCurrentUser()
  const nt = useNotify()

  const dataUnits = useMemo<Unit[]>(() => {
    return Array.isArray(units)? units.map(unit => ({
      ...unit,
      userIds: unit.userIds.split(",").map(id => Number(id))
    })) : []
  },[units])

  const item = useCallback((unitId: number): Unit|undefined => {
    return dataUnits.find(u => u.id === unitId)
  }, [dataUnits])

  const add = async (unitEntity: {
    name: string
    color: string
    users: ShortUser[]
  }) => {
    const item = {
      departmentId: user?.department.id as number,
      name: unitEntity.name,
      color: unitEntity.color,
      userIds: unitEntity.users.map(u => u.id).join(",")
    }
    const data = await api("/create-unit", "post", item)
    if (data) {
      nt("Направление создано", "success")
      setUnits(state => [...state, data])
      return true
    }
    else {
      nt("Ошибка создания", "error")
      return false
    }
  }

  const edit = async (unitEntity: {
    id: number
    name: string
    color: string
    users: ShortUser[]
  }) => {
    const item: ServerUnit = {
      id: unitEntity.id,
      departmentId: user?.department.id as number,
      name: unitEntity.name,
      color: unitEntity.color,
      userIds: unitEntity.users.map(u => u.id).join(",")
    }
    const data = await api("/change-unit", "put", item)
    if (data) {
      nt("Изменения сохранены", "success")
      setUnits(state => {
        state[state.findIndex(s => s.id === unitEntity.id)] = {
          id: item.id,
          name: item.name,
          color: item.color,
          userIds: item.userIds,
          departmentId: user?.department.id as number
        }
        return [...state]
      })
      return true
    }
    else {
      nt("Ошибка сохранения", "error")
      return false
    }
  }

  const remove = async (id: number) => {
    const data = await api("/delete-unit/" + id, "delete", {})
    if (data) {
      nt("Направление удалено", "success")
      setUnits(state => state.filter(s => s.id !== id))
      return true
    }
    else {
      nt("Ошибка удаления", "error")
      return false
    }
  }

  return { all: dataUnits, item,  add, edit, remove }
}

export default useUnits