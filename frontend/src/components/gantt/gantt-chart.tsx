import Colors from "../../constants/Colors.ts";
import {Unit, VacationYearUser} from "../../constants/Models.ts";
import GanttChartHeader from "./gantt-chart-header.tsx";
import GanttChartCells from "./gantt-chart-cells.tsx";
import GanttVacation from "./gantt-vacation.tsx";
import GanttVacationTooltip, {TooltipRefType} from "./gantt-vacation-tooltip.tsx";
import {useRef} from "react";
import VacationEditModal, {VacationEditModalRefType} from "../modals/vacation-edit-modal.tsx";

const rowPadding = 12

const GanttChart = (props: {
  headerHeight: number
  rowHeight: number
  dayWidth: number
  users: (VacationYearUser& { units: Unit[] })[]
  yearNumber: number
}) => {
  const toPixels = (days: number) => days * props.dayWidth

  const tooltip = useRef<TooltipRefType>(null)
  const vacationModal = useRef<VacationEditModalRefType>(null)

  return (
    <div style={{ position: "relative" }}>
      <GanttChartHeader height={props.headerHeight} toPixels={toPixels} yearNumber={props.yearNumber}/>
      {props.users.map((user, index) => (
          <div key={user.id} style={{
            position: "relative",
            boxSizing: "content-box",
            height: props.rowHeight,
            width: "100%",
            borderTopColor: Colors.lightGrey,
            borderTopStyle: "solid",
            borderTopWidth: index? 1 : 0,
            zIndex: 2,
          }}>
            {user.vacations.map(vacation => {

              return (
                  <GanttVacation
                      key={vacation.id}
                      dateInterval={vacation.dateInterval}
                      toPixels={toPixels}
                      rowPadding={rowPadding}
                      colors={user.units.map(u => u.color)}
                      onMouseEnter={center => tooltip.current?.show({
                        top: (index - 1)*props.rowHeight + props.headerHeight - rowPadding,
                        center
                      }, vacation)}
                      onMouseLeave={() => tooltip.current?.hide()}
                  />
              )
            })}
          </div>
      ))}
      <GanttChartCells yearNumber={props.yearNumber} toPixels={toPixels}/>
      <GanttVacationTooltip ref={tooltip} onClick={userId => {
        const user = props.users.find(u => u.id === userId)
        user&& vacationModal.current?.show(user)
      }}/>
      <VacationEditModal ref={vacationModal} year={props.yearNumber}/>
    </div>
  )
}

export default GanttChart