import Colors from "../../constants/Colors.ts";
import {useMemo} from "react";
import useDateParser from "../../hooks/useDateParser.ts";

const GanttVacation = (props: {
  dateInterval: string
  toPixels: (days: number) => number
  rowPadding: number
  colors: string[]
  onMouseEnter: (center: number) => void
  onMouseLeave: () => void
}) => {
  const dateParser = useDateParser()

  const { left, width, center } = useMemo(() => {
    const {start, days} = dateParser.stringIntervalToNum(props.dateInterval)
    const left = props.toPixels(start)
    const width = props.toPixels(days)
    const center = left + width / 2
    return { left, width, center }
  }, [props.dateInterval])

  return (
      <div
          onMouseEnter={() => props.onMouseEnter(center)}
          onMouseLeave={props.onMouseLeave}
          style={{
            position: "absolute",
            top: props.rowPadding,
            bottom: props.rowPadding,
            left, width,
            borderRadius: 7,
            background: props.colors.length
                ? props.colors.length > 1
                    ? `linear-gradient(90deg, ${props.colors.join()})`
                    : props.colors[0]
                : Colors.darkGrey
          }}
      />
  )
}

export default GanttVacation