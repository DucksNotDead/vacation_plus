import {ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {motion} from "framer-motion";
import Colors from "../../constants/Colors.ts";
import useClickOutside from "../../hooks/useClickOutside.ts";
import {useResizeDetector} from "react-resize-detector";

const variants = {
  open: {
    opacity: 1,
    translateY: 0
  },
  closed: {
    opacity: 0,
    translateY: 4
  }
}

const duration = .3

const animation = { duration }

const AppPopover = (props: {
  children: ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  control: ReactNode
  openOnClick?:boolean
}) => {

  const [visible, setVisible] = useState(props.open)

  const wrapper = useRef(null)

  const { height: controlHeight, ref: control } = useResizeDetector()

  useClickOutside([wrapper, control], () => {
    props.setOpen(false)
  }, props.open);

  useEffect(() => {
    if (props.open) setVisible(() => true)
    else setTimeout(() => setVisible(() => false), animation.duration*1000)
  }, [props.open]);

  const openOnClick = useMemo(() => props.openOnClick===undefined? true : props.openOnClick,[props.openOnClick])

  return(
      <div style={{ position: "relative", width: "100%" }}>
        <div ref={control} className={"noselect pointer"} onClick={() => openOnClick&& props.setOpen(!props.open)}>
          { props.control }
        </div>
        <motion.div
            ref={wrapper}
            className={"shadow-sm"}
            initial={variants.closed}
            animate={variants[props.open? "open" : "closed"]}
            transition={animation}
            style={{
              position: "absolute",
              top: (controlHeight? controlHeight : 0) + 8,
              backgroundColor: Colors.white,
              borderRadius: 7,
              display: visible? "initial" : "none",
              zIndex: 999,
              maxHeight: 160,
              overflow: "auto"
            }}
        >
          {props.children}
        </motion.div>
      </div>
  )
}

export default AppPopover