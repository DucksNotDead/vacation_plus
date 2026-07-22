import {useEffect} from "react";

const useLog = (state: any) => {
  useEffect(() => {
    console.log(state)
  }, [state]);
}

export default useLog