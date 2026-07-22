import MonthNames from "../constants/MonthNames.ts";

const useYear = (year: number) => {
  const currentDate = new Date()
  const isCurrent = year === currentDate.getFullYear()
  let daysCount = 0

  const months = Array.from(Array(12), (_, i) => {
    const firstDate = new Date(year, i, 1)
    const lastDate = new Date(year, i+1, 0)
    const startWeekDayIndex = firstDate.getDay()
    const startWeekDay = (startWeekDayIndex!==0)? startWeekDayIndex : 7
    const daysInMonth = lastDate.getDate()
    daysCount += daysInMonth
    return {
      start: daysCount-daysInMonth+1,
      end: daysCount,
      startWeekDay,
      isCurrent: isCurrent && currentDate.getMonth() === lastDate.getMonth(),
      daysCount: daysInMonth,
      name: MonthNames.short[lastDate.getMonth()]
    }
  })

  const startWeekDay = months[0].startWeekDay

  return {
    year, months, daysCount, isCurrent, startWeekDay,
    weeksCount: Math.floor(daysCount / 7),
    lastWeekDays: daysCount % 7
  }
}

export default useYear