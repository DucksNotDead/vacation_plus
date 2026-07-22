import {ReactNode, useRef, useState} from "react";
import AppIcon from "./UI/app-icon.tsx";
import {AppIconType} from "../constants/Types.ts";
import AppInput from "./UI/app-input.tsx";
import useListItemClick from "../hooks/useListItemClick.ts";

const DataList = (props: {
  name: string
  icon: AppIconType
  itemIds: number[]
  onItemClick: (id: number) => void
  editing?: {
    onAdd: () => void
    onRemove: (id: number) => void
  }
  onSearch?: (query: string) => void
  itemPreview: (id: number) => ReactNode
}) => {
  const [searchQuery, setSearchQuery] = useState("")

  const list = useRef(null)

  const getId = (elem: HTMLElement) => {
    const id = elem?.classList.toString().split("ID_")[1]
    if (id) return Number(id)
    else return null
  }

  useListItemClick(list, {
    "app-data-list__item__remove": (elem) => {
      const id = getId(elem)
      if (id !== null) props.editing?.onRemove(id)
    },
    "app-data-list__item": (elem) => {
      const id = getId(elem)
      if (id !== null) props.onItemClick(id)
    }
  })

  return (
      <div ref={list} className={"app-data-list noselect"}>
        <div className={"app-data-list__header"}>
          <div className={"app-data-list__header__title"}>
            <AppIcon name={props.icon} color={"primary"} size={22}/>
            <h4>{ props.name }</h4>
          </div>
          {props.onSearch
              ? <AppInput
                  value={searchQuery}
                  onInput={str => {
                    setSearchQuery(() => str)
                    props.onSearch&& props.onSearch(str)
                  }}
                  placeholder={"Поиск"}
                  color={"white"}
              />
              : null
          }
          {props.editing
              ? <AppIcon
                  name={"plus"}
                  color={"darkGrey"}
                  onClick={props.editing.onAdd}
                  size={20}
              />
              : null
          }
        </div>
        {props.itemIds.length
            ? props.itemIds.map(id => (
                <div
                    key={id}
                    className={"app-data-list__item ID_"+id}
                >
                  <div
                      className={"app-data-list__item__box pointer"}
                      /*onClick={() => props.onItemClick(id)}*/
                  >
                    { props.itemPreview(id) }
                  </div>
                  {props.editing
                      ? <div className={"app-data-list__item__remove pointer ID_"+id}>
                        <AppIcon
                            name={"trash"}
                            color={"darkGrey"}
                            /*onClick={() => props.editing?.onRemove(id)}*/
                            size={16}
                        />
                      </div>
                      : null
                  }
                </div>
            ))
            : <div className={"app-data-list__item"}><span>пусто</span></div>
        }
      </div>
  );
};

export default DataList;