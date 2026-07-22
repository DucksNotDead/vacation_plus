import {useContext} from "react";
import {ConfirmContext, ConfirmInstanceType} from "../context/confirmContext.tsx";

const useConfirm = () => {
  const context = useContext(ConfirmContext)
  return (instance: ConfirmInstanceType) => context.init(instance)
}

export default useConfirm;