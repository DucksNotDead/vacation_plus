import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import AppModal, {AppModalContentRefType, AppModalRefType} from "../UI/app-modal.tsx";
import useApi from "../../hooks/useApi.ts";
import {FullUser} from "../../constants/Models.ts";
import AppAvatar from "../UI/app-avatar.tsx";
import {Flex} from "@prismane/core";
import UserInfo from "../user-info.tsx";

const UserModal = forwardRef<AppModalContentRefType, {}>(({}, ref) => {
  const api = useApi()
  const [fullUser, setFullUser] = useState<FullUser|null>(null)
  const modal = useRef<AppModalRefType>(null)

  const show = (userId: number) => {
    modal.current?.show()
    api.users.getSingle(userId).then(fetchedUser => {
      setFullUser(() => fetchedUser)
    })
  }

  const hide = () => modal.current?.hide()

  useImperativeHandle(ref, () => ({ show, hide }), [])

  return (
      <AppModal
          ref={modal}
          title={fullUser?.fio}
          onClose={() => setFullUser(() => null)}
      >
        <Flex direction={"column"} gap={12}>
          <Flex gap={24}>
            <AppAvatar
                src={fullUser?.avatar}
                size={"xl"}
            />
            {fullUser
                ? <UserInfo user={fullUser}/>
                : null
            }
          </Flex>
        </Flex>
      </AppModal>
  )
})

export default UserModal;