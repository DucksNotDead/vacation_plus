import {AppCalendarDaysType} from "../../constants/Types.ts";
import CalendarMonthsPanel from "./calendar-months-panel.tsx";
import {useEffect, useMemo, useState} from "react";
import useYear from "../../hooks/useYear.ts";
import useApi from "../../hooks/useApi.ts";
import Settings from "../../constants/Settings.ts";
import useDateParser from "../../hooks/useDateParser.ts";
import useUnits from "../../hooks/useUnits.ts";
import AppSkeleton from "../UI/app-skeleton.tsx";
import Colors from "../../constants/Colors.ts";
import UnitColorCircle from "../UI/unit-color-circle.tsx";
import {Flex} from "@prismane/core";
import AppIcon from "../UI/app-icon.tsx";
import AppLoadingButton from "../UI/app-loading-button.tsx";
import useNotify from "../../hooks/useNotify.tsx";

type CalendarDataType = {
  start: number
  days: number
}

const { minDays, maxDays } = Settings

const CalendarPanel = (props: {
  user: {
    id: number
    shortFio: string
    days: number
  }
  yearNumber: number
  onSave: () => void
}) => {
  const api = useApi()
  const { stringIntervalToNum, daysToArr, numIntervalToString } = useDateParser()
  const year = useYear(props.yearNumber)
  const { all: units } = useUnits()
  const nt = useNotify()

  const [yearId, setYearId] = useState(-1)
  const [currentStart, setCurrentStart] = useState(-1)
  const [pending, setPending] = useState(true)
  const [updatePending, setUpdatePending] = useState(false)
  const [calendarDays, setCalendarDays]
      = useState<AppCalendarDaysType>({
    active: [],
    occupied: [],
    endAvailable: []
  })
  const [userReadyVacations, setUserReadyVacations]
      = useState<{ id: number, start: number }[]>([])

  const [activeVacations, setActiveVacations] = useState<CalendarDataType[]>([])
  const [daysLeft, setDaysLeft] = useState(props.user.days)

  const daysAvailable = useMemo(() => {
    return daysLeft >= minDays
  }, [daysLeft])

  const userUnits = useMemo(() =>
      units.filter(u => u.userIds.includes(props.user.id)), [props.user.id]
  )

  const onDayCheck = (dayId: number) => {
    if (currentStart === -1) {
      setCurrentStart(() => dayId)
      setCalendarDays(state => ({
        ...state,
        endAvailable: daysToArr((daysLeft > maxDays? maxDays : daysLeft) - minDays + 1, dayId + minDays -1),
        active: [...state.active, [dayId]]
      }))
    }
    else {
      if (dayId === currentStart) {
        setCalendarDays(state => {
          state.active = state.active.filter((_, i) => i !== state.active.length-1)
          state.endAvailable = []
          return {...state}
        })
      }
      else {
        const count = dayId - currentStart + 1
        setCalendarDays(state => {
          state.active[state.active.length-1] = daysToArr(count, currentStart)
          return {
            ...state,
            endAvailable: [],
            active: [...state.active]
          }
        })
        setDaysLeft(state => state - count)
      }
      setCurrentStart(() => -1)
    }
  }

  const removeVacation = (start: number) => {
    setCalendarDays(state => {
      const daysCount = state.active.find(interval => interval[0] === start)?.length
      setDaysLeft(state => state + (daysCount? daysCount : 0))
      return {
        ...state,
        active: state.active.filter(interval => interval[0] !== start)
      }
    })
  }

  const save = async () => {
    setUpdatePending(() => true)
    const removed: number[] = []
    const added: CalendarDataType[] = []
    const readyVacations = userReadyVacations.filter((vacation, index) => {
      return userReadyVacations.findIndex(v => v.id === vacation.id) === index
    })
    for (const vacation of activeVacations) {
      const ready = userReadyVacations.find(v => v.start === vacation.start)
      if (!ready) added.push(vacation)
    }
    for (const readyVacation of readyVacations) {
      const vacation = activeVacations.find(v => v.start === readyVacation.start)
      if (!vacation) removed.push(readyVacation.id)
    }

    let err = false
    try {
      for (const id of removed) {
        api.vacations.remove(id).then()
      }
      for (const newVacation of added) {
        api.vacations.create({
          yearId,
          dateInterval: numIntervalToString({ ...newVacation, year: year.year }),
          userId: props.user.id
        }).then()
      }
      if (props.user.days !== daysLeft) await api.users.setDays(props.user.id, daysLeft)
    }
    catch {
      err = true
    }
    finally {
      if (err) nt("Произошла ошибка", "error")
      else nt("Отпуск сохранён", "success")
      setUpdatePending(() => false)
    }
  }

  useEffect(() => {
    //@ts-ignore
    const arr: CalendarDataType[] = calendarDays.active.filter(interval => interval.length > 1).reduce((state, interval) => {
      return [...state, {
        start: interval[0],
        days: interval.length
      }]
    }, [])
    arr.sort((a,b) => a.start - b.start)
    setActiveVacations(() => arr)
  }, [calendarDays.active]);

  useEffect(() => {
    if (year) {
      api.years.getSingle(year.year).then(vacationYear => {
        if (vacationYear) {
          const occupied: number[][] = []
          const active: number[][] = []

          const sameUnitsUsers = vacationYear.users.filter(user => {
            return userUnits.find(userUnit => userUnit.userIds.includes(user.id))
          })

          //проходимся по готовым отпускам
          for (const user of sameUnitsUsers) {
            const isCurrentUser = user.id === props.user.id
            for (const vacation of user.vacations) {
              const { start, days } = stringIntervalToNum(vacation.dateInterval)
              const vacationDays = daysToArr(days, start)
              if (!isCurrentUser) occupied.push(vacationDays)
              else {
                active.push(vacationDays)
                setUserReadyVacations(state => [...state, {
                  id: vacation.id, start
                }])
              }
            }
          }

          setYearId(() => vacationYear.id)
          setCalendarDays(() => ({
            active, occupied, endAvailable: []
          }))
          setTimeout(() => setPending(() => false), 500)
        }
      })
    }
  }, [userUnits]);

  return (
      <Flex
          w={600}
          h={308}
          gap={24}
      >
        {pending
            ? (
                <>
                  <div style={{width: 284, height: 308}}>
                    <AppSkeleton/>
                  </div>
                  <Flex
                      grow
                      gap={32}
                      direction={"column"}
                  >
                    <div style={{ height: 32 }}>
                      <AppSkeleton/>
                    </div>
                    <Flex gap={12} h={26} wrap={"wrap"}>
                      {Array.from(Array(4)).map((_, i) => (
                          <Flex key={i} w={"40%"} h={"100%"}>
                            <AppSkeleton/>
                          </Flex>
                      ))}
                    </Flex>
                  </Flex>
                </>
            )
            : (
                <>
                  <div style={{position: "relative"}}>
                    <CalendarMonthsPanel
                        days={calendarDays}
                        daysAvailable={daysAvailable}
                        year={year}
                        onDayCheck={onDayCheck}
                    />
                    <Flex gap={4} className={"shadow-sm"} p={4} bg={Colors.white} style={{
                      position: "absolute",
                      bottom: -5,
                      right: -5,
                      borderRadius: 99
                    }}>
                      {userUnits.map(unit => (
                          <UnitColorCircle key={unit.id} value={unit.color} size={12}/>
                      ))}
                    </Flex>
                  </div>
                  <Flex grow direction={"column"} gap={32} p={16} h={308} style={{ overflow: "auto" }}>
                    <Flex direction={"column"} gap={4}>
                      <h3>{ props.user.shortFio }</h3>
                      <span style={{ color: Colors.darkGrey }}>Дней свободно: <span style={{ color: Colors.primary }}>{ daysLeft }</span></span>
                    </Flex>
                    <Flex direction={"column"} gap={8}>
                      <Flex gap={12} wrap={"wrap"}>
                        {activeVacations.length
                            ? activeVacations.map((vacation, index) => (
                                <Flex key={vacation.start} align={"center"} gap={6}>
                                  <Flex
                                      w={28}
                                      br={"full"}
                                      justify={"center"}
                                      align={"center"}
                                      style={{
                                        aspectRatio: 1,
                                        border: "1px solid " + Colors.primary,
                                        color: Colors.primary,
                                      }}>{ index + 1 }</Flex>
                                  <Flex
                                      align={"center"}
                                      gap={6}
                                      px={12}
                                      py={4}
                                      br={99}
                                      bg={Colors.primary}
                                  >
                                  <span style={{ color: Colors.white, fontWeight: 500 }}>
                                    { numIntervalToString({...vacation, year: props.yearNumber}) }
                                  </span>
                                    <AppIcon
                                        name={"circle-x"}
                                        size={20}
                                        color={"white"}
                                        onClick={() => removeVacation(vacation.start)}
                                    />
                                  </Flex>
                                </Flex>
                            ))
                            : <span style={{ color: Colors.darkGrey }}>дат нет</span>
                        }
                      </Flex>
                    </Flex>
                    <Flex grow justify={"end"} align={"end"}>
                      <AppLoadingButton onClick={save} text={"Сохранить"} pending={updatePending}/>
                    </Flex>
                  </Flex>
                </>
            )}
      </Flex>
  )
}

export default CalendarPanel;