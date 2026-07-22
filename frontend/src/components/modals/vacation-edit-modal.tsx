import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import AppModal, {AppModalRefType} from "../UI/app-modal.tsx";
import {CalendarUser} from "../../constants/Types.ts";
import CalendarPanel from "../calendar/calendar-panel.tsx";

export type VacationEditModalRefType = {
  show: (user: CalendarUser) => void
  hide: () => void
}

const VacationEditModal = forwardRef<VacationEditModalRefType, {
  year: number
}>((props, ref) => {
  const modal = useRef<AppModalRefType>(null);

  const [user, setUser] = useState<CalendarUser|null>(null)

  const show = (user: CalendarUser) => {
    setUser(() => user)
    modal.current?.show()
  }

  useImperativeHandle(ref, () => ({
    show,
    hide: () => modal.current?.hide()
  }))

  return (
      <AppModal
        ref={modal}
        title={"Выбрать даты"}
        onClose={() => setUser(() => null)}
      >
        {user
            ? (
                <CalendarPanel
                    user={user}
                    yearNumber={props.year}
                    onSave={() => modal.current?.hide()}
                />
            )
            : <></>
        }
      </AppModal>
  )
})

export default VacationEditModal