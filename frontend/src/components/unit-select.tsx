import AppPopover from "./UI/app-popover.tsx";
import {useMemo, useState} from "react";
import useUnits from "../hooks/useUnits.ts";
import {Flex} from "@prismane/core";
import {Unit} from "../constants/Models.ts";
import Colors from "../constants/Colors.ts";
import UnitColorCircle from "./UI/unit-color-circle.tsx";

type ItemType = {
  id: number,
  name: string,
  color: string
}

const Item = (props: {
  value: ItemType
  onClick: (id: number) => void
}) => (
    <Flex
        className={"pointer"}
        onClick={() => props.onClick(props.value.id)}
        style={{ whiteSpace: "nowrap" }}
        w={140}
        px={12}
        py={6}
        gap={6}
    >
      <UnitColorCircle value={props.value.color}/>
      { props.value.name }
    </Flex>
)

const UnitSelect = (props: {
  selectedId: number
  onChange: (id: number) => void
  placeholder: string
}) => {
  const { all } = useUnits()
  const [open, setOpen] = useState(false)

  const units = useMemo(() => {
    let selected: Unit|null = null
    const notSelected: Unit[] = []

    for (const unit of all) {
      if (unit.id !== props.selectedId) notSelected.push(unit)
      else selected = unit
    }

    return {selected, notSelected}
  }, [all, props.selectedId]);

  const select = (id: number) => {
    props.onChange(id)
    setOpen(() => false)
  }

  return (
      <AppPopover
          open={open}
          setOpen={setOpen}
          control={(
              <div className={"PrismaneField-root"} style={{backgroundColor: Colors.white}}>
                {units.selected
                    ? units.selected.name
                    : props.placeholder
                }
              </div>
          )}
      >
        <Flex
            py={4}
            direction={"column"}
        >
          {units.selected
              ? (
                  <Item
                      value={{
                        id: -1,
                        name: "Отчистить",
                        color: "#FFF"
                      }}
                      onClick={select}
                  />
              )
              : null
          }
          {units.notSelected.map(unit => (
              <Item key={unit.id} value={unit} onClick={select}/>
          ))}
        </Flex>
      </AppPopover>
  )
}

export default UnitSelect