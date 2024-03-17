import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {motion} from 'framer-motion'
import Icon from "./UI/icon";
import useClickOutside from "../hooks/useClickOutside";
import Skeleton from "./UI/skeleton";
import Preloader from "./UI/preloader";

const ITEM_HEIGHT = 50 //не менять
const CARD_HEIGHT = 100
const MAX_CARD_HEIGHT = 380
const ARROW_SIZE = 28
const ANIMATION = { duration: .45, type: "spring" }

const AdvancedList = (props = {
  title: '',
  searchFor: '',
  icon: '',
  previewItems: <></>,
  items: [{
    id: 0,
    name: '',
    avatar: <></>
  }],
  editable: false,
  onItemClick: (itemId=0) => {},
  onChose: (itemId=0) => {},
  onDelete: (itemIds=[]) => {},
  closeOnItemClick: false,
  all: true,
  serverSearch: false,
}) => {

  const togglingActive = useRef(true)
  const [isOpen, setIsOpen] = useState(false)
  const [opened, setOpened] = useState(false)

  const getMaxCardHeight = (itemsLength) => {
    const itemsHeight = (itemsLength+1) * ITEM_HEIGHT + 36
    return itemsHeight? Math.min(itemsHeight, MAX_CARD_HEIGHT) : 0
  }

  const getInputWidth = (cardWidth) => {
    return cardWidth
        ? cardWidth - 80
        : 0
  }

  const wrapper = useRef(null)
  const input = useRef(null)

  const toggle = () => togglingActive.current && setIsOpen(() => !isOpen)

  const clickOnItemsList = (e) => {
    let item = null
    if (e.target.classList.contains('app-advanced-list__item')) item = e.target
    else if (e.target.parentNode.classList.contains('app-advanced-list__item')) item = e.target.parentNode
    if (item) {
      props.closeOnItemClick&& setIsOpen(() => false)
      props.onItemClick&& props.onItemClick(Number(item.dataset.id))
    }
  }

  const onListScroll = ({ target }) => {
    const offset = 25
    const { offsetHeight, scrollTop, scrollHeight } = target
    if (offsetHeight + scrollTop > scrollHeight - offset) console.log("end")
  }

  useClickOutside(wrapper, () => {
    toggle()
  }, isOpen)

  useEffect(() => {
    if (isOpen) {
      togglingActive.current = false
      setTimeout(() => {
        setOpened(() => {
          togglingActive.current = true
          input.current.focus()
          return true
        })
      }, ANIMATION.duration * 1000)
    }
    else setOpened(false)
  }, [isOpen]);

  return (
      <motion.div
          ref={wrapper}
          className={"app-advanced-list"}
          initial={{ height: CARD_HEIGHT }}
          animate={{ height: isOpen? getMaxCardHeight(props.items?.length) : CARD_HEIGHT }}
          transition={ANIMATION}
      >
        {Array.isArray(props.items) ? (<>
          <motion.div
              className={"app-input mt-sm"}
              animate={{ width: isOpen? getInputWidth(wrapper.current?.clientWidth) : 0}}
              transition={ANIMATION}
          >
            <input
                ref={input}
                className={"w-full h-full bg-transparent outline-none"}
                placeholder={"Поиск " + props.searchFor}
            />
          </motion.div>
          <div
              onScroll={onListScroll}
              onClick={clickOnItemsList}
              className={"relative w-full flex-1 mt-md overflow-y-scroll"}
          >
            {props.items?.map(item => (
                <div
                    key={item.id}
                    className={`app-advanced-list__item flex items-center gap-sm pl-sm`}
                    style={{ height: ITEM_HEIGHT }}
                    data-id={item.id}
                >
                  <div className={"cursor-pointer"}>
                    { item.avatar }
                  </div>
                  <span className={"cursor-pointer"}>{ item.name }</span>
                  {props.editable&& (
                      <div className={"flex-1 flex items-center justify-end gap-xs pr-md"}>
                        <Icon name={"trash"} />
                      </div>
                  )}
                </div>
            ))}
            {!props.all? <Preloader/> : null}
          </div>
          <motion.div
              animate={{ opacity: isOpen? 0 : 1 }}
              style={{ zIndex: opened? -1 : 0 }}
              onClick={toggle}
              className={"absolute top-[0px] bottom-[0px] right-[0px] left-[0px] flex flex-col justify-center gap-sm p-md cursor-pointer bg-white"}
          >
            <div className={"w-full flex gap-sm items-center"}>
              <Icon name={props.icon} size={34}/>
              <h3>{ props.title }</h3>
            </div>
            <motion.div
                className={"origin-top-left"}
                animate={{ scale: isOpen? 2 : 1 }}
                transition={ANIMATION}
            >
              { props.previewItems }
            </motion.div>
          </motion.div>
          <motion.div
              className={"absolute top-lg right-md"}
              animate={{ rotate: isOpen? -90 : 0 }}
              transition={ANIMATION}
          >
            <Icon name={"arrow"} onClick={toggle} size={ARROW_SIZE}/>
          </motion.div>
        </>) : (
            <Skeleton>
              <div className={"flex-1 flex flex-col justify-center gap-md"} style={{ height: 76 }}>
                <div className={"flex gap-sm items-center"}>
                  <div className="__avatar"></div>
                  <div className="__title"></div>
                </div>
                <div className={"flex gap-sm w-1/2"}>
                  {[0,0,0].map((_, i)  => (
                      <div key={i} className={"__item"}></div>
                  ))}
                </div>
              </div>
            </Skeleton>
        )}
      </motion.div>
  );
};

const ListItem = ({ name, avatar }) => {

}

export default AdvancedList;