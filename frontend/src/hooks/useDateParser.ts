import {AppDateIntervalType, AppDateType, AppYearDaysType} from "../constants/Types.ts";

const innerSeparator = "."
const outerSeparator = "-"
const msInDay = 24 * 3600 * 1000

const useDateParser = () => {
  const dateToString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear().toString()
    return day + innerSeparator + month + innerSeparator + year
  }

  const stringToDate = (dateString: string): Date => {
    const dates = dateString.split(innerSeparator).map(s => Number(s))
    return new Date(dates[2], dates[1]-1, dates[0])
  }

  const yearFromString = (dateString: string): number => Number(dateString.split(innerSeparator)[2])

  const stringToYearDays = (dateString: string): number => {
    const date = stringToDate(dateString)
    const year = yearFromString(dateString)
    const start = new Date(year, 0,0)
    const diff = date.getTime() - start.getTime();
    return diff/msInDay
  }

  const yearDaysToString = ([days, year]: AppYearDaysType): string => {
    return dateToString(new Date(year, 0, days))
  }

  const daysInMonth = (monthIndex: number, year: number): number => new Date(year, monthIndex, 0).getDate()

  const stringIntervalToNum = (intervalString: string): AppDateIntervalType => {
    const strings = intervalString.split(outerSeparator)
    const year = yearFromString(strings[0])
    const start = stringToYearDays(strings[0])
    const days = stringToYearDays(strings[1]) - start
    return {
      start, days, year
    }
  }

  const numIntervalToString = ({ start, days, year }: AppDateIntervalType): string => {
    return yearDaysToString([start, year]) + outerSeparator + yearDaysToString([days + start, year])
  }

  const stringToObject = (dateString: string): AppDateType => {
    const arr = dateString.split(innerSeparator)
    return {
      day: Number(arr[0]),
      monthIndex: Number(arr[1]) - 1,
      year: Number(arr[2])
    }
  }

  const objToString = ({ day, monthIndex, year }: AppDateType): string => {
    return day + innerSeparator + (monthIndex + 1) + innerSeparator + year
  }

  const stringToTimestamp = (dateString: string): number => {
    const { day, monthIndex, year } = stringToObject(dateString)
    return new Date(year, monthIndex, day).getTime()
  }

  const daysToTimestamp = (days: number): number => days * msInDay

  const hasStringInStrings = (interval: string, dateString: string) => {
    const intervalStrings = interval.split(outerSeparator)
    const start = stringToTimestamp(intervalStrings[0])
    const end = stringToTimestamp(intervalStrings[1])
    const value = stringToTimestamp(dateString)
    return value >= start && value <= end
  }

  const daysToArr = (count: number, increment: number = 1) =>
      Array.from(Array(count), (_, i) => i+increment)

  return {
    dateToString,
    yearFromString,
    stringToYearDays,
    yearDaysToString,
    daysInMonth,
    stringIntervalToNum,
    numIntervalToString,
    objToString,
    stringToTimestamp,
    hasStringInStrings,
    daysToTimestamp,
    daysToArr,
    outerSeparator,
    innerSeparator
  }
}

export default useDateParser