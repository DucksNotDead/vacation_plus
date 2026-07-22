import {motion} from "framer-motion"
import AppIcon from "./UI/app-icon.tsx";
import Colors from "../constants/Colors.ts";
import {useEffect, useMemo, useRef, useState} from "react";
import AppAvatar from "./UI/app-avatar.tsx";
import {Flex} from "@prismane/core";
import useClickOutside from "../hooks/useClickOutside.ts";
import useListItemClick from "../hooks/useListItemClick.ts";
import {useResizeDetector} from "react-resize-detector";
import AppInput from "./UI/app-input.tsx";

const animation = { duration: .2 }

const ShortUserList = (props: {
  items: {
    id: number
    name: string
    avatar: string
  }[]
  label: string
  onUserClick: (id: number) => void
}) => {
  const [isHover, setIsHover] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const empty = useMemo(() => !props.items.length, [props.items.length])

  const searchedUsers = useMemo(() => {
    return searchQuery.length
        ? props.items.filter(u => u.name.toUpperCase().includes(searchQuery.toUpperCase()))
        : props.items
  }, [props.items, searchQuery])

  const { ref: avatars, width: avatarsWidth } = useResizeDetector()

  const component = useRef<HTMLDivElement>(null)

  const toggle = () => !empty&& setIsOpen(state => !state)

  useClickOutside([component], () => {
    setIsOpen(() => false)
  }, isOpen)

  useListItemClick(component, {
    "user-item": elem => {
      const userId = Number(elem.dataset.userId)
      if (userId) {
        setIsOpen(() => false)
        props.onUserClick(userId)
      }
    }
  })

  useEffect(() => {
    isOpen
        ? setIsVisible(() => true)
        : setTimeout(() => setIsVisible(() => false), animation.duration*1000)
  }, [isOpen]);

  return (
      <div
          ref={component}
          className={"noselect"}
          onMouseEnter={() => setIsHover(() => true)}
          onMouseLeave={() => setIsHover(() => false)}
          style={{ position: "relative" }}
      >
        <motion.div
            onClick={toggle}
            className={empty? "" : "pointer"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            animate={{ translateX: isOpen&&avatarsWidth? avatarsWidth : 0 }}
            transition={animation}
        >
          <span style={{
            fontSize: 18,
            fontWeight: 500,
            color: Colors.primary
          }}>{ props.items.length }</span>
          <span style={{
            fontSize: 14,
            fontWeight: 500,
            color: Colors.black
          }}>{ props.label }</span>
          <motion.div
              ref={avatars}
              style={{
                display: "flex",
                marginLeft: 6,
              }}
              animate={{
                scale: isOpen? .5 : 1,
                opacity: isOpen? 0 : 1,
              }}
              transition={animation}
          >
            {props.items.sort((a,b) => b.avatar.length - a.avatar.length).slice(0, 3).map((u, index) => (
                <div key={u.id} style={{
                  marginLeft: index? -10 : 0,
                  borderRadius: "50%",
                  borderWidth: 2,
                  borderColor: Colors.white
                }}>
                  <AppAvatar src={u.avatar} size={"xs"}/>
                </div>
            ))}
          </motion.div>
          {props.items.length
              ? (
                  <motion.div
                      animate={{
                        translateX: isOpen && avatarsWidth ? -avatarsWidth : (isHover ? 6 : 0),
                        rotate: isOpen ? -90 : 0
                      }}
                      transition={{duration: .2}}
                  >
                    <AppIcon
                        name={"chevron-right"}
                        color={"darkGrey"}
                    />
                  </motion.div>
              )
              : null
          }
        </motion.div>
        <motion.div
            style={{
              position: "absolute",
              backgroundColor: Colors.white,
              borderRadius: 7,
              width: 200,
              maxHeight: 220,
              overflow: "auto",
              zIndex: 999,
              marginTop: 8,
              padding: 8,
              display: isVisible? "initial" : "none"
            }}
            animate={{
              translateY: isOpen? 0 : -8,
              opacity: isOpen? 1 : 0,
              boxShadow: `0 0 4px 1px rgba(0,0,0,${isOpen? .15 : 0})`,
            }}
            transition={animation}
        >
          <AppInput
              value={searchQuery}
              onInput={setSearchQuery}
              placeholder={"Фамилия"}
          />
          {searchedUsers.map((u, index) => (
              <Flex key={u.id} p={8} mt={index? 0 : 8} gap={6} align={"center"} data-user-id={u.id} className={"user-item pointer"}>
                <AppAvatar src={u.avatar} size={"xs"}/>
                { u.name }
              </Flex>
          ))}
        </motion.div>
      </div>
  )
}

export default ShortUserList