import {forwardRef, ReactNode, useImperativeHandle, useMemo, useState} from "react";
import {Button, Modal, Skeleton, Flex} from "@prismane/core";
import AppLoadingButton from "./app-loading-button.tsx";

export type AppModalRefType = {
  show: () => void
  hide: () => void
}

export type AppModalContentRefType = {
  show: (entityId: number) => void
  hide: () => void
}

const AppModal = forwardRef<AppModalRefType, {
  children: ReactNode
  headerItem?: ReactNode
  title?: string
  onClose?: () => void
  saving?: {
    disable?: boolean
    buttonText?: string
    onSave: () => void
    pending: boolean
  }
}>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)

  const defaultButtonText = useMemo(() => props.saving?.buttonText? props.saving.buttonText : "Сохранить", [props.saving?.buttonText])

  const show = () => setIsOpen(() => true)

  const hide = () => {
    setIsOpen(() => {
      props.onClose&& props.onClose()
      return false
    })
  }

  useImperativeHandle(ref, () => ({ show, hide }), [])

  return (
      <Modal
          open={isOpen}
          onClose={hide}
          className={"app-modal"}
          closable
      >
        <Modal.Header style={{ gap: 12 }}>
          {props.headerItem
              ? props.headerItem
              : null
          }
          {props.title
              ? <h1>{props.title}</h1>
              : <Skeleton w={120} h={28} variant={"rounded"}/>
          }
        </Modal.Header>
        <Flex direction={"column"} gap={12}>
          { props.children }
        </Flex>
        {props.saving&&!props.saving?.disable
            ? (
                <Modal.Footer gap={8}>
                  <Button variant={"tertiary"} onClick={hide}>Отмена</Button>
                  <AppLoadingButton
                      onClick={props.saving.onSave}
                      text={defaultButtonText}
                      pending={props.saving.pending}
                  />
                </Modal.Footer>
            )
            : null
        }
      </Modal>
  )
})

export default AppModal;