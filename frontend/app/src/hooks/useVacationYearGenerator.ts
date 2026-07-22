import useApi from "./useApi.ts";
import useYear from "./useYear.ts";
import {useState} from "react";
import useNotify from "./useNotify.tsx";
import useUnits from "./useUnits.ts";
import {VacationUser} from "../constants/Models.ts";
import useDateParser from "./useDateParser.ts";
import Settings from "../constants/Settings.ts";

type VacationUserWithUnitIds = VacationUser& { unitIds: number[] }

type ReadyVacationType = {
  userId: number
  unitIds: number[]
  startDay: number
  daysCount: number
  daysTaken: number
  isReady: boolean
}

//минимальный и максимальный срок отпуска
const { minDays, maxDays } = Settings


const useVacationYearGenerator = (yearId: number, yearNumber: number, callback: () => void) => {
  const api = useApi()
  const nt = useNotify()
  const dateParser = useDateParser()
  const { all: units } = useUnits()

  const [pending, setPending] = useState(false)

  const generate = async () => {
    setPending(() => true)
    try {
      const year = useYear(yearNumber)

      //cформированные отпуска
      const readyVacations: ReadyVacationType[] = []

      //получаем сотрудников с последним отпуском и колл-вом свободных дней
      const users = (await api.users.getVacationData()).filter(u => u.days)
      if (!users.length) {
        nt("Пользователи не найдены", "error")
        return
      }

      //если есть готовые убираем их из массива и добавляем их в сформированные
      users.filter(u => u.currentVacations.length).forEach(user => {
        users.splice(users.findIndex(u => u.id === user.id), 1)
        user.currentVacations.forEach(vacation => {
          const {start, days} = dateParser.stringIntervalToNum(vacation.dateInterval)
          readyVacations.push({
            userId: user.id,
            unitIds: units.filter(u => u.userIds.includes(user.id)).map(u => u.id),
            startDay: start,
            daysCount: days,
            daysTaken: 0,
            isReady: true
          })
        })
      })

      //сортируем по давности последнего отпуска
      users.sort((a, b) => {
        if (!a.lastVacationDate && b.lastVacationDate)
          return -1
        if (a.lastVacationDate && !b.lastVacationDate)
          return 1
        if (a.lastVacationDate && b.lastVacationDate)
          return a.lastVacationDate.localeCompare(b.lastVacationDate)
        else return 0
      })

      //формируем списки сотрудников по направлениям
      const usersWithUnitIds: VacationUserWithUnitIds[] = users.map(user => ({
        ...user,
        unitIds: units.filter(u => u.userIds.includes(user.id)).map(u => u.id)
      }))

      //начало первой отпускной недели после праздников
      const startWeekDayIndex = new Date(year.year, 0, 1).getDay()
      const startWeekDay = startWeekDayIndex? startWeekDayIndex : 7
      const startDay = 16 - startWeekDay

      //динамические данные для цикла
      let userIndex = 0
      let vacationDaysOff = users.reduce((state, user) => {
        return state + user.days
      }, 0)
      let loopCount = 0


      //находит незанятые промежутки нужной длинны в контексте направления
      const getOtherVacationsOffset = (unitIds: number[], daysCount: number): number => {
        const filteredVacations = readyVacations
            .filter(rv => rv.unitIds.find(rvUnitIds => unitIds.includes(rvUnitIds)))

        filteredVacations.sort((a, b) => a.startDay - b.startDay)

        if (filteredVacations.length) {
          let result = -1
          for (let i = 0; i < filteredVacations.length; i++) {
            const current = filteredVacations[i]
            if (current.startDay >= (startDay + daysCount)) {
              if (i === 0) {
                result = startDay
                break
              }
              else {
                const prev = filteredVacations[i-1]
                const prevEnd = prev.startDay + prev.daysCount
                if ((current.startDay - prevEnd) >= daysCount) {
                  result = prevEnd
                  break
                }
              }
            }
            const currentEnd = current.startDay + current.daysCount
            const next = filteredVacations[i+1]
            if (((year.daysCount - currentEnd) >= daysCount) && ((i === (filteredVacations.length - 1)) || ((next.startDay - currentEnd) >= daysCount))) {
              result = currentEnd
              break
            }
          }
          return result
        }
        else return startDay
      }

      //обновляет данные
      const setVacation = (startDay: number, daysCount: number, holidaysCount=0) => {
        const vacationsDays = daysCount - holidaysCount
        const user = usersWithUnitIds[userIndex] as VacationUserWithUnitIds
        user.days -= vacationsDays
        vacationDaysOff -= vacationsDays
        readyVacations.push({
          userId: user.id,
          unitIds: user.unitIds,
          daysTaken: vacationsDays,
          isReady: false,
          startDay, daysCount
        })
        if (user.days < minDays) usersWithUnitIds.splice(userIndex, 1)
        else userIndex++
        loopCount++
      }


      //формируем модель данных отпусков с учётом напрвлений
      while (vacationDaysOff&&usersWithUnitIds.length) {
        if (loopCount === 300) {
          nt("Генерация замкнулась", "warning")
          break
        }
        if (userIndex >= usersWithUnitIds.length) userIndex = 0
        const user = usersWithUnitIds[userIndex] as VacationUserWithUnitIds
        const userVacationDays = user.days <= maxDays ? user.days : maxDays
        const daysOffset = getOtherVacationsOffset(user.unitIds, userVacationDays)

        setVacation(daysOffset, userVacationDays)
      }

      let vacationsError = false
      for (const vacation of readyVacations.filter(rv => !rv.isReady)) {
        const data = await api.vacations.create({
          userId: vacation.userId,
          yearId,
          dateInterval: dateParser.numIntervalToString({
            start: vacation.startDay,
            days: vacation.daysCount,
            year: yearNumber
          })
        })
        if (!data) {
          vacationsError = true
          break
        }
      }

      if (!vacationsError) {
        for (const user of users) {
          const daysTaken = readyVacations
              .filter(rv => !rv.isReady)
              .filter(rv => rv.userId === user.id)
              .reduce((state, rv) => {
                return state + rv.daysTaken
              }, 0)
          if (daysTaken) await api.users.setDays(user.id, user.days - daysTaken)
        }
        const res = await api.years.setReady(yearId)
        if (res) nt("Отпускной " + yearNumber + " успешно сформирован", "success")
      }
    }
    catch (e) {
      console.error(e)
      nt("Ошибка генерации", "error")
    }
    finally {
      setPending(() => false)
      callback()
    }
  }

  return { pending, generate }
}

export default useVacationYearGenerator