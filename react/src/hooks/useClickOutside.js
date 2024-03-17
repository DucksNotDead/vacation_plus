import {useEffect} from "react";

const useClickOutside = (ref, callback, active) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        removeListener()
        callback()
      }
    }
    active&& document.addEventListener('click', handleClick)
    const removeListener = () => active&& document.removeEventListener('click', handleClick)

    return () => removeListener()
  }, [ref, active]);
}

export default useClickOutside