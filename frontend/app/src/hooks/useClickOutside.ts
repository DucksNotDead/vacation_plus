import {useEffect} from "react";

const useClickOutside = (refs: any[], callback: () => void, active:boolean) => {
  useEffect(() => {
    const handleClick = (e: Event) => {
      const condition = refs.reduce((state, ref) => {
        return state || (ref.current && (ref.current === e.target || ref.current.contains(e.target)))
      }, false)
      if (!condition) {
        callback()
        removeListener()
      }
    }
    const removeListener = () => active&& document.removeEventListener('click', handleClick, { capture: true })
    if (active) {
      document.addEventListener('click', handleClick, { capture: true })
    }

    return () => {
      removeListener()
    }
  }, [refs, active]);
}

export default useClickOutside