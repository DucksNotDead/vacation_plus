import {Flex} from "@prismane/core";
import Colors from "../constants/Colors.ts";
import {useEffect, useMemo, useRef, useState} from "react";
import {FullYear} from "../constants/Models.ts";
import useApi from "../hooks/useApi.ts";
import {useLocation} from "react-router-dom";
import GanttSidebar from "../components/gantt/gantt-sidebar.tsx";
import useUnits from "../hooks/useUnits.ts";
import GanttChart from "../components/gantt/gantt-chart.tsx";
import AppSkeleton from "../components/UI/app-skeleton.tsx";
import {AppModalContentRefType} from "../components/UI/app-modal.tsx";
import UserModal from "../components/modals/user-modal.tsx";

const rowHeight = 50
const headerHeight = 60
const ganttWidth = 1080
const sidebarWidth = 260
const dayWidth = 5

const GanttPage = () => {
  const { pathname } = useLocation()
  const api = useApi()
  const { all: units } = useUnits()
  const [year, setYear] = useState<FullYear|null>(null)
  const [pending, setPending] = useState(true)
  const [selectedUnitId, setSelectedUnitId] = useState(-1)

  const userModal = useRef<AppModalContentRefType>(null)

  const users = useMemo(() => {
    return year?.users.length
        ? year.users.map(user => ({
          ...user,
          units: units.filter(unit => unit.userIds.includes(user.id))
        }))
        : []
  }, [year?.users, units])

  const selectedUnitUsers = useMemo(() => {
    return selectedUnitId===-1
        ? users
        : users.filter(user => user.units.map(unit => unit.id).includes(selectedUnitId))
  }, [selectedUnitId, users])

  const yearNumber = useMemo(() => {
    const paths = pathname.split("/")
    return Number(paths[paths.length - 1])
  }, [pathname])

  useEffect(() => {
    if (yearNumber) api.years.getSingle(yearNumber).then(y => {
      setYear(() => y)
      setTimeout(() => setPending(() => false), 500)
    })
  }, [yearNumber]);

  return (
      <>
        <Flex
            grow
            w={ganttWidth}
            direction={"column"}
            self={"center"}
            style={{ position: "relative" }}
        >
          <div className={"shadow-sm"} style={{
            display: "flex",
            alignItems: "start",
            position: "absolute",
            overflow: "auto",
            top: 0,
            bottom: 0,
            width: ganttWidth,
            backgroundColor: Colors[pending? "lightGrey" : "white"],
            borderTopRightRadius: 14,
            borderTopLeftRadius: 14,
          }}>
            {pending
                ? <AppSkeleton/>
                : (
                    <>
                      <GanttSidebar
                          width={sidebarWidth}
                          headerHeight={headerHeight}
                          rowHeight={rowHeight}
                          users={selectedUnitUsers}
                          selectedUnitId={selectedUnitId}
                          setSelectedUnitId={setSelectedUnitId}
                          onUserClick={id => userModal.current?.show(id)}
                      />
                      <GanttChart
                          yearNumber={yearNumber}
                          headerHeight={headerHeight}
                          rowHeight={rowHeight}
                          dayWidth={dayWidth}
                          users={selectedUnitUsers}
                      />
                    </>
                )
            }
          </div>
        </Flex>
        <UserModal ref={userModal}/>
      </>
  );
};

export default GanttPage;