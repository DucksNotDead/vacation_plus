import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Vacation} from "../../constants/Models.ts";
import {motion} from "framer-motion";
import {Button} from "@prismane/core";
import Colors from "../../constants/Colors.ts";

type TooltipCoordsType = {
  center: number
  top: number
}

export type TooltipRefType = {
  show: (coords: TooltipCoordsType, vacation: Vacation) => void
  hide: () => void
}

const defaultCoords: TooltipCoordsType = {
  center: 0,
  top: 0
}

const animation = { duration: .15 }

const variants = {
  "shown": { opacity: 1, translateY: 0 },
  "hidden": { opacity: 0, translateY: 10 }
}

const cardWidth = 160

const GanttVacationTooltip = forwardRef<TooltipRefType, {
  onClick: (userId: number) => void
}>((props, ref) => {
  const [isShown, setIsShown]
      = useState(false)
  const [vacation, setVacation]
      = useState<Vacation | null>(null)
  const [coords, setCoords]
      = useState<TooltipCoordsType>(defaultCoords)

  const animationTimeout = useRef(0)

  const show = (coordsEntity: TooltipCoordsType, vacationEntity: Vacation) => {
    setVacation(() => vacationEntity)
    setCoords(() => coordsEntity)
    setIsShown(() => true)
  }

  const hide = () => setIsShown(() => false)

  useEffect(() => {
    if (!isShown) {
      animationTimeout.current = setTimeout(() => {
        setVacation(() => null)
        setCoords(() => defaultCoords)
      }, animation.duration * 1000)
    }
    else clearTimeout(animationTimeout.current)
  }, [isShown]);

  useImperativeHandle(ref, () => {
    return {show, hide}
  }, [])

  return vacation
      ? (
          <motion.div
              onMouseEnter={() => setIsShown(() => true)}
              className={"shadow-sm"}
              style={{
                width: cardWidth,
                padding: 8,
                backgroundColor: Colors.white,
                borderRadius: 7,

                position: "absolute",
                zIndex: 5,
                top: coords.top,
                left: coords.center - cardWidth / 2,

                fontSize: 12,
                textAlign: "center",
                color: Colors.darkGrey
              }}
              initial={variants.hidden}
              animate={variants[isShown ? "shown" : "hidden"]}
              transition={animation}
          >
            { vacation.dateInterval }
            <Button mt={8} w={"100%"} onClick={() => props.onClick(vacation?.userId)}>подробнее</Button>
          </motion.div>
      ) : null
})

export default GanttVacationTooltip