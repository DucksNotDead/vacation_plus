import {ReactNode} from "react";
import Colors from "./Colors.ts";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import MonthNames from "./MonthNames.ts";
import WeekDayNames from "./WeekDayNames.ts";

export type AppRouteType = {
  element: ReactNode
  path: string
  access: 0|1
}

export type AppColorType = keyof typeof Colors

export type AppIconType = keyof typeof dynamicIconImports

export type AppFullMonthNameType = typeof MonthNames.full[number]
export type AppShortMonthNameType = typeof MonthNames.short[number]
export type AppAltMonthNameType = typeof MonthNames.alt[number]

export type AppFullWeekDayName = typeof WeekDayNames.full[number]
export type AppShortWeekDayName = typeof WeekDayNames.short[number]

export type AppDateType = {
  day: number
  monthIndex: number
  year: number
}

export type AppDateIntervalType = {
  start: number
  days: number
  year: number
}

export type AppDateFullYear = {
  year: number
  daysCount: number
  isCurrent: boolean
  startWeekDay: number
  weeksCount: number
  lastWeekDays: number
  months: {
    start: number
    end: number
    startWeekDay: number
    isCurrent: boolean
    daysCount: number
    name: AppShortMonthNameType
  }[]
}

export type AppYearDaysType = [number, number]

export type AppCalendarDaysType = {
  occupied: number[][]
  endAvailable: number[]
  active: number[][]
}

export type CalendarDataType = {
  start: number
  days: number
}

export type CalendarUser = {
  id: number
  shortFio: string
  days: number
}