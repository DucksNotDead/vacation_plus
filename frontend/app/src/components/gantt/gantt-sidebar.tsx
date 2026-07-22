import Colors from "../../constants/Colors.ts";
import {Flex} from "@prismane/core";
import AppAvatar from "../UI/app-avatar.tsx";
import {Unit} from "../../constants/Models.ts";
import UnitSelect from "../unit-select.tsx";
import useListItemClick from "../../hooks/useListItemClick.ts";
import {useRef} from "react";

const GanttSidebar = (props: {
  width: number
  headerHeight: number
  rowHeight: number
  users: {
    id: number
    shortFio: string
    avatar: string,
    units: Unit[]
  }[]
  selectedUnitId: number
  setSelectedUnitId: (id: number) => void
  onUserClick: (id: number) => void
}) => {

  const userList = useRef<HTMLDivElement>(null)
  useListItemClick(userList, {
    "gantt_user": elem => {
      const id = Number(elem.dataset.id)
      if (id) props.onUserClick(id)
    }
  })

  return (
      <Flex
          direction={"column"}
          bg={Colors.lightGrey}
          style={{ position: "sticky", left: 0, top: 0, bottom: 0, flexShrink: 0, zIndex: 5, minHeight: "100%" }}
          w={props.width}
      >
        <Flex
            h={props.headerHeight}
            align={"center"}
            px={20}
            bg={Colors.lightGrey}
            style={{ position: "sticky", top: 0 }}
        >
          <UnitSelect
              selectedId={props.selectedUnitId}
              onChange={props.setSelectedUnitId}
              placeholder={"Фильтр по направлениям"}
          />
        </Flex>
        <div ref={userList}>
          {props.users.map(user => (
              <Flex
                  className={"gantt_user pointer"}
                  data-id={user.id}
                  key={user.id}
                  h={props.rowHeight}
                  align={"center"}
                  px={16}
                  gap={12}
              >
                <AppAvatar src={user.avatar} units={user.units}/>
                { user.shortFio }
              </Flex>
          ))}
        </div>
      </Flex>
  )
}

export default GanttSidebar