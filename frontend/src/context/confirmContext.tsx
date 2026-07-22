import {createContext, ReactNode, useState} from "react";
import {Button, Dialog, Flex} from "@prismane/core";
import Colors from "../constants/Colors.ts";

const defaultInstance = {
  title: "",
  callback: () => {}
}

export type ConfirmInstanceType = typeof defaultInstance

export const ConfirmContext = createContext<{
  init: (instance: ConfirmInstanceType) => void
  // @ts-ignore
}>({ init: instance => {} })

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [instance, setInstance] = useState(defaultInstance)

  const init = (instance: ConfirmInstanceType) => {
    setInstance(() => instance)
    setOpen(() => true)
  }

  const close = () => {
    setOpen(() => false)
    setTimeout(() => setInstance(() => defaultInstance), 350)
  }

  const confirm = () => {
    close()
    instance.callback()
  }

  return (
      <>
        <Dialog
            open={open}
            onClose={close}
        >
          <Dialog.Header>
            <h3>{ instance.title }</h3>
          </Dialog.Header>
          <span style={{ color: Colors.darkGrey }}>Это действие нельзя будет отменить</span>
          <Dialog.Footer>
            <Flex gap={12}>
              <Button variant={"tertiary"} onClick={close}>Отмена</Button>
              <Button variant={"primary"} onClick={confirm}>Потвердить</Button>
            </Flex>
          </Dialog.Footer>
        </Dialog>
        <ConfirmContext.Provider value={{ init }}>{ children }</ConfirmContext.Provider>
      </>
  )
}
