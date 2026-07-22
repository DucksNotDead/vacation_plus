import AppPopover from "./app-popover.tsx";
import {useMemo, useRef, useState, KeyboardEvent} from "react";
import AppIcon from "./app-icon.tsx";
import {motion} from "framer-motion"

const itemClassName = "app-multiple-select__list-item"

const AppMultiplySelect = (props: {
  items: {
    id: number
    name: string
  }[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}) => {
  const [open, setOpen] = useState(false)
  const [searchString, setSearchString] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const items = useMemo(() => {
    const selected = []
    const notSelected = []
    for (const item of props.items) {
      if (props.selectedIds.includes(item.id)) selected.push(item)
      else notSelected.push(item)
    }
    return { selected, notSelected }
  }, [props.items, props.selectedIds])
  
  const searchedItems = useMemo(() => {
    if (!open) setOpen(() => true)
    return searchString.trim().length
        ? items.notSelected.filter(i => i.name.toUpperCase().includes(searchString.toUpperCase()))
        : []
  }, [searchString, items.notSelected])

  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)

  const scrollToElem = (elem: any) => {
    elem.scrollIntoView({
      block: "end",
      behavior: "smooth"
    })
  }

  const changeSelected = (up: boolean = false) => {
    const newIndex = selectedIndex + (up? -1 : 1)
    scrollToElem(list.current?.childNodes[newIndex])
    setSelectedIndex(() => newIndex)
  }

  const handleKeyboard = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        if (selectedIndex < searchedItems.length-1)
          changeSelected()
        break
      case "ArrowUp":
        if (selectedIndex > 0)
          changeSelected(true)
        break
      case "Enter":
        add(searchedItems[selectedIndex].id)
        setSelectedIndex(0)
        break
      case "Backspace":
        //@ts-ignore
        if (!e.target.selectionStart && items.selected.length)
          remove(items.selected[items.selected.length-1].id)
        break
    }
  }

  const add = (id: number) => {
    setSearchString(() => "")
    input.current?.click()
    props.onChange([...props.selectedIds, id])
  }

  const remove = (id: number) => props.onChange(props.selectedIds.filter(i => i !== id))
  
  return (
      <AppPopover
          open={open} 
          setOpen={setOpen}
          openOnClick={false}
          control={(
              <div className={"app-multiple-select__field"}>
                {items.selected.map(item => (
                    <div key={item.id} className={"app-multiple-select__field-item"}>
                      { item.name }
                      <AppIcon
                          onClick={() => remove(item.id)}
                          name={"circle-x"}
                          size={16}
                          color={"primary"}
                      />
                    </div>
                ))}
                <input
                    ref={input}
                    value={searchString}
                    //@ts-ignore
                    onInput={e => setSearchString(() => e.target.value)}
                    onKeyDown={handleKeyboard}
                    type="text"
                    placeholder={"Добавить сотрудников"}
                />
              </div>
          )}
      >
        <div ref={list}>
          {searchedItems.map((item, index) => (
              <div
                  key={item.id}
                  className={itemClassName + " pointer"}
                  onClick={() => add(item.id)}
              >
                { item.name }
                <motion.div
                    style={{
                      position: "absolute",
                      height: 3,
                      borderRadius: 3,
                      backgroundColor: "#F07167",
                      marginTop: 2,
                    }}
                    animate={{ width: index===selectedIndex? 30 : 0 }}
                />
              </div>
          ))}
        </div>
      </AppPopover>
  )
}


export default AppMultiplySelect