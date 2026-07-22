import {Flex} from "@prismane/core";
import Colors from "../../constants/Colors.ts";
import useYear from "../../hooks/useYear.ts";
import GanttChartItem from "./gantt-chart-item.tsx";

const GanttChartHeader = (props: {
  height: number
  toPixels: (days: number) => number
  yearNumber: number
}) => {
  const year = useYear(props.yearNumber)
  return (
      <div style={{
        backgroundColor: Colors.white,
        boxSizing: "content-box",
        position: "sticky",
        top: 0,
        zIndex: 3,
      }}>
        <Flex>
          {year.months.map((month, index) => (
              <GanttChartItem
                  key={month.name}
                  width={props.toPixels(month.daysCount)}
                  height={props.height / 2}
                  isFirst={!!index}
                  label={month.name}
              />
          ))}
        </Flex>
        <Flex>
          {Array.from(Array(year.weeksCount)).map((_, week) => (
              <GanttChartItem
                  key={week}
                  width={props.toPixels(7)}
                  height={props.height / 2}
                  isFirst={!!week}
                  label={(week + 1).toString()}
              />
          ))}
        </Flex>
      </div>
  )
}

export default GanttChartHeader