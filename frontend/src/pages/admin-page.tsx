import {Flex} from "@prismane/core";
import DataList from "../components/data-list.tsx";
import {useEffect, useMemo, useRef, useState} from "react";
import useApi from "../hooks/useApi.ts";
import AppAvatar from "../components/UI/app-avatar.tsx";
import {ShortUser, Year} from "../constants/Models.ts";
import useCurrentUser from "../hooks/useCurrentUser.ts";
import UserModal from "../components/modals/user-modal.tsx";
import UnitEditModal, {AppModalEditRefType} from "../components/modals/unit-edit-modal.tsx";
import {AppModalContentRefType} from "../components/UI/app-modal.tsx";
import useUnits from "../hooks/useUnits.ts";
import useConfirm from "../hooks/useConfirm.ts";
import UnitModal from "../components/modals/unit-modal.tsx";
import CurrentYearPanel from "../components/current-year-panel.tsx";
import useCurrentDate from "../hooks/useCurrentDate.ts";
import UnitColorCircle from "../components/UI/unit-color-circle.tsx";

const AdminPage = () => {
  const api = useApi()
  const { user } = useCurrentUser()
  const units = useUnits()
  const confirm = useConfirm()
  const currentDate = useCurrentDate()

  const [users, setUsers] = useState<ShortUser[]>([])
  const [years, setYears] = useState<Year[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const searchedUsers = useMemo(() => {
    return searchQuery.length
        ? users.filter(u => u.fio.toUpperCase().includes(searchQuery.toUpperCase()))
        : users
  }, [users, searchQuery])

  const userModal = useRef<AppModalContentRefType>(null)
  const unitModal = useRef<AppModalContentRefType>(null)
  const unitEditModal = useRef<AppModalEditRefType>(null)

  useEffect(() => {
    api.users.getAll()
        .then(users => setUsers(() => users.filter(u => u.id !== user?.id)))
    api.years.getAll()
        .then(years => setYears(() => years.filter(y => y.year !== currentDate.year)))
  }, [])

  return (
      <>
        <Flex gap={56} align={"start"}>
          <Flex grow direction={"column"} gap={48}>
            <CurrentYearPanel
                users={users}
                currentDate={currentDate}
                onUserClick={id => userModal.current?.show(id)}
            />
            <Flex gap={24} align={"start"}>
              <DataList
                  name={"Сотрудники"}
                  icon={"users"}
                  itemIds={searchedUsers.map(u => u.id)}
                  onItemClick={id => userModal.current?.show(id)}
                  onSearch={setSearchQuery}
                  itemPreview={id => {
                    const user = users.find(u => u.id === id)
                    if (user) {
                      return (
                          <>
                            <AppAvatar src={user.avatar}/>
                            <span>{user.fio}</span>
                          </>
                      )
                    } else return null
                  }}
              />
              <DataList
                  name={"Направления"}
                  icon={"boxes"}
                  itemIds={units.all.map(u => u.id)}
                  onItemClick={id => unitModal.current?.show(id)}
                  itemPreview={id => {
                    const unit = units.all.find(u => u.id === id)
                    if (unit) {
                      return (
                          <>
                            <UnitColorCircle value={unit.color}/>
                            <span style={{ marginLeft: 2 }}>{unit.name}</span>
                          </>
                      )
                    } else return null
                  }}
                  editing={{
                    onAdd: () => unitEditModal.current?.show(),
                    onRemove: id => confirm({
                      title: "Удалить направление?",
                      callback: () => units.remove(id)
                    })
                  }}
              />
            </Flex>
          </Flex>
          <DataList
              name={"Предыдущие года"}
              icon={"calendar-check-2"}
              itemIds={years.map(y => y.id)}
              onItemClick={console.log}
              itemPreview={id => {
                const year = years.find(y => y.id === id)
                if (year) {
                  return <span>{year.year}</span>
                } else return null
              }}
          />
        </Flex>
        <UnitModal
            ref={unitModal}
            users={users}
            onEdit={id => unitEditModal.current?.show(id)}
            onUserClick={id => userModal.current?.show(id)}
        />
        <UnitEditModal ref={unitEditModal} users={users}/>
        <UserModal ref={userModal}/>
      </>
  );
};

export default AdminPage;