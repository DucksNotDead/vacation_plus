import {useEffect, useState, useMemo} from "react";
import AppPopover from "./UI/app-popover.tsx";
import useUnits from "../hooks/useUnits.ts";

const colors = [
  "#f8a5c2",
  "#fed330",
  "#fa8231",
  "#FF5252",
  "#FF47CA",
  "#a55eea",
  "#536DFE",
  "#40C4FF",
  "#69F0AE",
  "#20bf6b",
]

const UnitColorSelect = (props: {
  color: string,
  onColorChange: (color: string) => void
  disabled?: boolean
}) => {
  const { all: units } = useUnits()
  const [open, setOpen] = useState(false)

  const usedColors = useMemo(() => units.map(u => u.color),[units])
  const availableColors = useMemo(() => colors.filter(c => !usedColors.includes(c)), [usedColors])
  const notSelectedColors = useMemo(() => availableColors.filter(c => c !== props.color), [props.color, availableColors])

  useEffect(() => {
    if (!props.color.length)
      props.onColorChange(colors[Math.floor(Math.random() * (colors.length +1))])
  }, [])

  return (
      <AppPopover
          open={open}
          setOpen={setOpen}
          control={(
              <div className={"app-color-select__button"} style={{backgroundColor: props.color}}>Выбрать цвет</div>
          )}
      >
        <div className={"app-color-select__panel"}>
          {notSelectedColors.map(color => (
              <div
                  key={color}
                  className={"app-color-select__item"}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    props.onColorChange(color)
                    setOpen(() => false)
                  }}
              />
          ))}
        </div>
      </AppPopover>
      /*<Popover position={"bottom-start"}>
        <Popover.Control ref={control}>
          <div className={"app-color-select__button"} style={{ backgroundColor: props.color }}>Выбрать цвет</div>
        </Popover.Control>
        <Popover.Panel className={"app-color-select__panel shadow-md"}>
          {colors.map(color => (
              <div
                  ref={panel}
                  key={color}
                  className={"app-color-select__item"}
                  style={{ backgroundColor: color }}
                  onClick={() => props.onColorChange(color)}
              />
          ))}
        </Popover.Panel>
      </Popover>*/
  )
}

export default UnitColorSelect