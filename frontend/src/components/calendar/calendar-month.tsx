import {Flex} from "@prismane/core";
import Colors from "../../constants/Colors.ts";
import {AppCalendarDaysType} from "../../constants/Types.ts";
import {motion} from "framer-motion"
import Settings from "../../constants/Settings.ts";
import {useMemo} from "react";

const animation = { duration: .25 }

const { minDays } = Settings

const CalendarMonth = (props: {
  days: AppCalendarDaysType
  start: number
  width: number
  index: number
  daysCount: number
  startWeekDay: number
  dayClassName: string
  daysAvailable: boolean
}) => {
  return (
      <Flex
          wrap={"wrap"}
          align={"start"}
          style={{
            width: props.width,
          }}
      >
        {Array.from(Array(props.daysCount)).map((_, index) => {
          const width = props.width / 7
          const dayId = props.start+index

          const hasInCalendar = (key: "active"|"occupied", dayValue: number) => {
            return props.days[key].reduce((state, interval) => [...state, ...interval], []).includes(dayValue)
          }

          const isOccupied = hasInCalendar("occupied", dayId)
          const isActive = hasInCalendar("active", dayId)
          const activeInterval = props.days.active.find(days => days.includes(dayId))
          const activeIndex = activeInterval?.indexOf(dayId)
          const isActiveEdge =
              isActive
                  ? activeIndex === 0 || activeInterval && activeIndex === activeInterval.length - 1
                  : false
          const isAvailableActive = isActiveEdge&&activeInterval?.length===1
          const isAvailable = useMemo(() => {
            return props.daysAvailable
                ? (
                    !isActive && !isOccupied && (
                        props.days.endAvailable.length
                            ? props.days.endAvailable.includes(dayId)
                            : (
                                props.index === 11
                                    ? (index + minDays - 1) < props.daysCount
                                    : (
                                        !hasInCalendar("occupied", dayId + minDays - 1)
                                        && !hasInCalendar("active", dayId + minDays - 1)
                                    )
                            )
                    )
                )
                : false
          }, [props.daysAvailable, props.days.endAvailable])
          return (
              <Flex
                  key={index}
                  className={isAvailable||isAvailableActive? props.dayClassName : ""}
                  justify={"center"}
                  align={"center"}
                  style={{
                    width,
                    marginLeft: index
                        ? 0
                        : (props.startWeekDay-1) * width,
                    position: "relative",
                    aspectRatio: 1,
                    color: Colors.darkGrey,
                    cursor: isAvailable||isAvailableActive? "pointer" : "default"
                  }}
                  data-id={dayId}
              >
                <motion.div
                    className={"app-calendar-month__backdrop"}
                    style={{
                      position: "absolute",
                      inset: props.width/100,
                      zIndex: 0,
                      borderRadius: "50%",
                      boxSizing: "border-box"
                    }}
                    animate={{
                      backgroundColor: Colors[
                          isOccupied
                              ? "darkGrey"
                              : isActive
                                  ? "primary"
                                  : "transparent"
                          ],
                      border: "1px solid " + Colors[isAvailable? "primary" : "transparent"],
                    }}
                    transition={animation}
                />
                <motion.div
                    style={{ position: "relative", zIndex: 1 }}
                    animate={{
                      color: Colors[
                          isOccupied
                              ? "lightGrey"
                              : isActive
                                  ? "white"
                                  : isAvailable
                                      ? "primary"
                                      : "darkGrey"
                          ],
                    }}
                    transition={animation}
                >{ index + 1 }</motion.div>
              </Flex>
          )
        })}
      </Flex>
  )
}

export default CalendarMonth