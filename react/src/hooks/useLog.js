import {useEffect} from "react";

const useLog = (state) => {
  useEffect(() => {
    console.log(state)
  }, [state]);
}

export default useLog