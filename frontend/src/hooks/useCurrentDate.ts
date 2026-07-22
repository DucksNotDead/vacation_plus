import {AppDateType} from "../constants/Types.ts";

const useCurrentDate = (): AppDateType => {
  const date = new Date()
  return {
    day: date.getDate(),
    monthIndex: date.getMonth(),
    year: date.getFullYear()
  }
}

export default useCurrentDate