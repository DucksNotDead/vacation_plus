import {Flex} from "@prismane/core";
import useYear from "../../hooks/useYear.ts";
import GanttChartItem from "./gantt-chart-item.tsx";

const GanttChartCells = (props: {
  yearNumber: number,
  toPixels: (days: number) => number
}) => {
  const { weeksCount } = useYear(props.yearNumber)
  return (
      <div style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1
      }}>
        <Flex w={"100%"} h={"100%"}>
          {Array.from(Array(weeksCount)).map((_, week) => (
              <GanttChartItem key={week} width={props.toPixels(7)} height={"100%"} isFirst={!!week} label={""}/>
          ))}
        </Flex>
      </div>
  )
}

export default GanttChartCells