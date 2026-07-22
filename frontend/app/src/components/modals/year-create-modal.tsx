import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import AppModal, {AppModalRefType} from "../UI/app-modal.tsx";
import {FullYear, ShortUser} from "../../constants/Models.ts";
import useApi from "../../hooks/useApi.ts";
import useNotify from "../../hooks/useNotify.tsx";
import AppInput from "../UI/app-input.tsx";

const YearCreateModal = forwardRef<AppModalRefType, {
  users: ShortUser[]
  onCreate: (year: FullYear) => void
  currentYear: number
}>(({ users, onCreate, currentYear }, ref) => {

  const api = useApi()
  const nt = useNotify()
  const modal = useRef<AppModalRefType>(null)
  const [year, setYear] = useState(currentYear.toString())
  const [pending, setPending] = useState(false)

  const onHide = () => {
    setYear(() => "")
  }

  const save = async () => {
    setPending(() => true)
    const data = await api.years.create({
      year: Number(year),
      userIds: users.map(u => u.id).join(",")
    })
    setPending(() => false)
    if (data) onCreate(data)
    else nt("Ошибка", "error")
    modal.current?.hide()
  }

  useImperativeHandle(ref, () => ({
    show: () => modal.current?.show(),
    hide: () => modal.current?.hide()
  }), [])

  return (
      <AppModal
          title={"Сформировать отпускной год"}
          ref={modal}
          onClose={onHide}
          saving={{
            onSave: save,
            pending
          }}
      >
        <AppInput
            value={year}
            onInput={setYear}
            placeholder={"Введите год"}
            number
        />
      </AppModal>
  )
})

export default YearCreateModal;