import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import AppModal, {AppModalRefType} from "../UI/app-modal.tsx";
import AppInput from "../UI/app-input.tsx";
import {Flex} from "@prismane/core";
import {ShortUser} from "../../constants/Models.ts";
import UnitColorSelect from "../unit-color-select.tsx";
import useUnits from "../../hooks/useUnits.ts";
import AppMultiplySelect from "../UI/app-multiply-select.tsx";
import useNotify from "../../hooks/useNotify.tsx";

export type AppModalEditRefType = {
  show: (entityId?: number) => void
  hide: () => void
}

const UnitEditModal = forwardRef<AppModalEditRefType, {
  users: ShortUser[]
}>(({ users }, ref) => {
  const modal = useRef<AppModalRefType>(null)
  const units = useUnits()
  const nt = useNotify()

  const [editedUnitId, setEditedUnitId] = useState<number|null>(null)
  const [name, setName] = useState("")
  const [color, setColor] = useState("")
  const [userIds, setUserIds] = useState<number[]>([])
  const [pending, setPending] = useState(false)

  const show = (id?: number) => {
    if (id) {
      const unit = units.item(id)
      if (unit) {
        setEditedUnitId(() => id)
        setName(() => unit.name)
        setColor(() => unit.color)
        setUserIds(() => unit.userIds)
      }
      else {
        modal.current?.hide()
        nt("Направления не существует", "error")
      }
    }
    modal.current?.show()
  }

  const onHide = () => {
    setEditedUnitId(() => null)
    setName(() => "")
    setColor(() => "")
    setUserIds(() => [])
  }

  const save = async () => {
    if (!userIds.length || !name.length) nt("Заполните все поля", "error")
    else {
      setPending(() => true)
      let res = false
      if (editedUnitId) res = await units.edit({
        id: editedUnitId,
        users: users.filter(u => userIds.includes(u.id)),
        name, color
      })
      else {
        if (units.all.find(u => u.name.toUpperCase() === name)) {
          nt("Направление с таким названием существует", "error")
        }
        else res = await units.add({
          users: users.filter(u => userIds.includes(u.id)),
          name, color
        })
      }
      setPending(() => false)
      if (res) modal.current?.hide()
    }
  }

  useImperativeHandle(ref, () => ({
    show,
    hide: () => modal.current?.hide(),
  }))

  return (
      <AppModal
          ref={modal}
          title={(editedUnitId? "Изменить" : "Добавить") + " направление"}
          onClose={onHide}
          saving={{
            onSave: () => save(),
            pending
          }}
      >
        <>
          <Flex gap={12}>
            <UnitColorSelect onColorChange={setColor} color={color}/>
            <AppInput
                value={name}
                onInput={setName}
                placeholder={"Название"}
            />
          </Flex>
          <AppMultiplySelect
              items={users.map(u => ({ id: u.id, name: u.shortFio }))}
              selectedIds={userIds}
              onChange={setUserIds}
          />
        </>
      </AppModal>
  )
})

export default UnitEditModal