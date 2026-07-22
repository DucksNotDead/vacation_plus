import {useEffect} from "react";

const useListItemClick = (ref: any, listeners: Record<string, (elem: HTMLElement) => void>) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.onclick = (e: any) => {
        for (const className in  listeners) {
          const elem = e.target.classList.contains(className)
              ? e.target
              : e.target.closest("." + className)
          if (elem) {
            listeners[className](elem)
            break;
          }
        }
      }
    }
  }, [ref, listeners])
}

export default useListItemClick