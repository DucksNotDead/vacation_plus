import {FullYear, ShortUser, VacationYearUser} from "../constants/Models.ts";
import {Button, Flex, Skeleton} from "@prismane/core";
import MonthNames from "../constants/MonthNames.ts";
import {useEffect, useMemo, useRef, useState} from "react";
import useApi from "../hooks/useApi.ts";
import Colors from "../constants/Colors.ts";
import Settings from "../constants/Settings.ts"
import YearCreateModal from "./modals/year-create-modal.tsx";
import {AppModalRefType} from "./UI/app-modal.tsx";
import ShortUserList from "./short-user-list.tsx";
import {AppDateType} from "../constants/Types.ts";
import useDateParser from "../hooks/useDateParser.ts";
import YearGeneratingPanel from "./year-generating-panel.tsx";
import {useNavigate} from "react-router-dom";
import AppSkeleton from "./UI/app-skeleton.tsx";
import useConfirm from "../hooks/useConfirm.ts";

type ReadyYearUser = {
  id: number
  name: string
  avatar: string
}

const CurrentYearPanel = (props: {
  users: ShortUser[]
  currentDate: AppDateType
  onUserClick: (id: number) => void
}) => {
  const api = useApi()
  const confirm = useConfirm()
  const [year, setYear] = useState<FullYear|null>(null)
  const [pending, setPending] = useState(true)
  const dateParser = useDateParser()
  const navigate= useNavigate()

  const usersInReadyYear = useMemo(() => {
    if (year?.isReady) {
      const working: ReadyYearUser[] = []
      const soonVacation: ReadyYearUser[] = []
      const inVacation: ReadyYearUser[] = []

      const add = (arr: ReadyYearUser[], user: VacationYearUser) => arr.push({ id: user.id, name: user.shortFio, avatar: user.avatar })

      for (const user of year.users) {
        const currentDay = dateParser.stringToYearDays(dateParser.objToString(props.currentDate))
        let exist = false
        let soon = false
        for (const userVacation of user.vacations) {
          const {start, days} = dateParser.stringIntervalToNum(userVacation.dateInterval)
          const end = start + days
          if (currentDay >= start && currentDay <= end) {
            exist = true
            break
          }
          const later = currentDay + Settings.soonDays
          if (later >= start && later <= end) soon = true
        }
        add(exist? inVacation : soon? soonVacation : working, user)
      }

      return {working, soonVacation, inVacation}
    }
    else return null
  }, [year])

  const createModal = useRef<AppModalRefType>(null)

  const getYear = () => {
    setPending(() => true)
    api.years.getSingle(props.currentDate.year).then(y => {
      setYear(() => y)
      setTimeout(() => setPending(() => false), 500)
    })
  }

  useEffect(() => {
    if (!year) void getYear()
  }, [year]);

  return (
      <>
        <Flex direction={"column"} gap={12} mt={8} h={80}>
          <Flex gap={18} align={"center"}>
            <h3>Cегодня { props.currentDate.day } { MonthNames.alt[props.currentDate.monthIndex] } { props.currentDate.year }</h3>
            {pending
                ? <Skeleton w={300} h={24}/>
                : !year
                    ? <Button variant={"primary"} onClick={() => createModal.current?.show()}>Сформировать отпускной год</Button>
                    : !year.isReady
                        ? <span style={{ color: Colors.darkGrey }}>Формирование отпуска</span>
                        : <>
                          <Button onClick={() => navigate("/gantt/" + year?.year)}>Перейти к диаграмме</Button>
                          <Button variant={"tertiary"} onClick={() => confirm({
                            title: "Вы уверены что хотите удалить год?",
                            callback: () => api.years.remove(year?.id).then(() => getYear())
                          })}>Закрыть год</Button>
                        </>
            }
          </Flex>
          {!pending
              ? year
                  ? (
                      <Flex direction={"column"} gap={12} px={8} py={4}>
                        {year.isReady
                            ? <>
                              <Flex gap={48} align={"center"}>
                                <ShortUserList
                                    items={usersInReadyYear?.inVacation as ReadyYearUser[]}
                                    label={"отдыхают"}
                                    onUserClick={props.onUserClick}
                                />
                                <ShortUserList
                                    items={usersInReadyYear?.soonVacation as ReadyYearUser[]}
                                    label={"скоро отпуск"}
                                    onUserClick={props.onUserClick}
                                />
                                <ShortUserList
                                    items={usersInReadyYear?.working as ReadyYearUser[]}
                                    label={"работают"}
                                    onUserClick={props.onUserClick}
                                />
                              </Flex>
                            </>
                            : <YearGeneratingPanel year={year} onUserClick={props.onUserClick} onGenerate={getYear}/>
                        }
                      </Flex>
                  )
                  : <span style={{color: Colors.darkGrey}}>Отпуск отсутствует</span>
              : <Flex h={35} w={320} bg={Colors.lightGrey} style={{ borderRadius: 14 }}><AppSkeleton/></Flex>
          }
        </Flex>
        <YearCreateModal
            ref={createModal}
            users={props.users}
            onCreate={getYear}
            currentYear={props.currentDate.year}
        />
      </>
  )
}

export default CurrentYearPanel