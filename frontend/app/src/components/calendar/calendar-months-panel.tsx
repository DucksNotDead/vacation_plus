import {motion} from "framer-motion";
import {AppCalendarDaysType, AppDateFullYear} from "../../constants/Types.ts";
import {useRef, useState} from "react";
import {Flex} from "@prismane/core";
import CalendarMonth from "./calendar-month.tsx";
import monthNames from "../../constants/MonthNames.ts";
import useListItemClick from "../../hooks/useListItemClick.ts";
import AppIcon from "../UI/app-icon.tsx";
import Colors from "../../constants/Colors.ts";
import weekDayNames from "../../constants/WeekDayNames.ts";


const itemSize = 260
const itemPadding = 12
const monthNameHeight = 18
const animation = { duration: .45 }
const dayClassName = "__calendar-day-item"

const Header = (props: {
  yearNumber: number
  currentIndex: number
  onChange: (monthIndex: number) => void
}) => {

  const [pending, setPending] = useState(false)

  const change = (diff: 1|-1) => {
    if (!pending) {
      setPending(() => true)
      const res = props.currentIndex + diff
      if (res <= 11 && res >= 0) props.onChange(res)
      setTimeout(() => setPending(() => false), animation.duration*1000)
    }
  }

  return (
      <Flex w={"100%"} pt={10} direction={"column"} gap={8}>
        <Flex
            w={"100%"}
            className={"noselect"}
            justify={"between"}
            align={"center"}
            px={6}
        >
          <AppIcon
              name={"chevron-left"}
              size={32}
              onClick={() => change(-1)}
              color={
                props.currentIndex >= 1
                    ? "primary"
                    : "darkGrey"
              }
          />
          <Flex gap={8}>
            <div style={{ fontSize: 16 }}>{ props.yearNumber }</div>
            <div style={{
              height: monthNameHeight,
              overflow: "hidden"
            }}>
              <motion.div
                  animate={{
                    translateY: -(props.currentIndex * monthNameHeight)
                  }}
                  transition={animation}
              >
                {monthNames.full.map(monthName => (
                    <Flex
                        h={monthNameHeight}
                        align={"center"}
                        key={monthName}
                        style={{
                          color: Colors.darkGrey,
                          fontSize: monthNameHeight
                        }}
                    >{monthName}</Flex>
                ))}
              </motion.div>
            </div>
          </Flex>
          <AppIcon
              name={"chevron-right"}
              size={32}
              onClick={() => change(1)}
              color={
                props.currentIndex <= 10
                    ? "primary"
                    : "darkGrey"
              }
          />
        </Flex>
        <Flex px={itemPadding}>
          {Array.from(Array(7)).map((_, weekIndex) => (
              <div key={weekIndex} style={{
                width: itemSize / 7,
                textAlign: "center",
                color: Colors.darkGrey,
                fontWeight: 500
              }}>{ weekDayNames.short[weekIndex] }</div>
          ))}
        </Flex>
      </Flex>
  )
}

const CalendarMonthsPanel = (props: {
  days: AppCalendarDaysType
  daysAvailable: boolean
  year: AppDateFullYear
  onDayCheck: (dayId: number) => void
}) => {

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)

  const list = useRef<HTMLDivElement>(null)

  useListItemClick(list, {
    [dayClassName]: elem => {
      const dayId = Number(elem.dataset.id)
      props.onDayCheck(dayId)
    }
  })

  return (
      <Flex direction={"column"} gap={12} className={"shadow-sm"} style={{ borderRadius: 14 }}>
        <Header
            yearNumber={props.year.year}
            currentIndex={currentMonthIndex}
            onChange={setCurrentMonthIndex}
        />
        <div style={{
          width: itemSize + itemPadding * 2,
          overflow: "hidden",
          padding: `0 ${ itemPadding }px 6px`
        }}>
          <motion.div
              style={{ display: "flex", width: itemSize*12+itemPadding*11, gap: itemPadding }}
              ref={list}
              animate={{ translateX: -currentMonthIndex*(itemSize+itemPadding) }}
              transition={animation}
          >
            {props.year.months.map(({ name, daysCount, startWeekDay, start }, index) => (
                <CalendarMonth
                    key={name}
                    days={props.days}
                    width={itemSize}
                    daysCount={daysCount}
                    start={start}
                    startWeekDay={startWeekDay}
                    index={index}
                    dayClassName={dayClassName}
                    daysAvailable={props.daysAvailable}
                />
            ))}
          </motion.div>
        </div>
      </Flex>
  );
}

export default CalendarMonthsPanel