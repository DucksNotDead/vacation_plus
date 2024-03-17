import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {createPortal} from "react-dom";
import {motion} from "framer-motion"
import Icon from "./icon";
import Skeleton from "./skeleton";

const ANIMATION = { duration: .2 }

const Modal = forwardRef(({ title, children, onClose }, ref) => {

  const [isVisible, setIsVisible] = useState(false)
  const [isHidden, setIsHidden] = useState(!isVisible)

  const cardRef = useRef(null)

  const closeModal = () => {
    setIsVisible(false)
    onClose&& onClose()
  }

  const onBackdropClick = ({ target }) => {
    if (!(cardRef.current.contains(target) || cardRef.current === target)) {
      closeModal()
    }
  }

  useEffect(() => {
    isVisible
        ? setIsHidden(() => false)
        : setTimeout(() => setIsHidden(() => true), ANIMATION.duration*1000)
  }, [isVisible])

  useEffect(() => {
    const onKeyPress = ({ key }) => key==="Escape"&& closeModal()
    window.addEventListener("keypress", onKeyPress)
    return () => window.removeEventListener("keypress", onKeyPress)
  }, [])

  useImperativeHandle(ref, () => ({
    show: () => setIsVisible(() => true),
    hide: () => closeModal(),
  }))

  return createPortal(
      <motion.div
          onClick={onBackdropClick}
          className={"app-modal-wrapper"}
          style={{ zIndex: isHidden? -1 : 999 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible? 1 : 0 }}
          transition={ANIMATION}
      >
        <motion.div
            ref={cardRef}
            className="app-modal"
            animate={{ translateY: isVisible? 0 : 10 }}
            transition={ANIMATION}
        >
          <div className={"w-full flex justify-between items-center"}>
            {title
                ? <h3 className={"text-black"}>{ title }</h3>
                : <Skeleton><div className="__title"></div></Skeleton>
            }
            <Icon name={"close"} onClick={closeModal}/>
          </div>
          <div className="p-sm flex-1 flex flex-col justify-center">
            { children }
          </div>
        </motion.div>
      </motion.div>,
      document.querySelector("#root")
  )
})

export default Modal;