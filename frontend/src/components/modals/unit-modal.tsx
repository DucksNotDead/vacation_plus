import {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import AppModal, {AppModalContentRefType, AppModalRefType} from "../UI/app-modal.tsx";
import useUnits from "../../hooks/useUnits.ts";
import {ShortUser, Unit} from "../../constants/Models.ts";
import {Button, Flex} from "@prismane/core";
import AppAvatar from "../UI/app-avatar.tsx";
import Colors from "../../constants/Colors.ts";

const UnitModal = forwardRef<AppModalContentRefType, {
  users: ShortUser[]
  onEdit: (id: number) => void
  onUserClick: (id: number) => void
}>(({ onEdit, onUserClick, users }, ref) => {
  const units = useUnits()
  const modal = useRef<AppModalRefType>(null)

  const [unitId, setUnitId] = useState<number|null>(null)
  const [unit, setUnit] = useState<Unit|null>(null)

  const unitUsers = useMemo(() => {
    return users.filter(user => unit?.userIds.includes(user.id))
  }, [unit, users])

  const updateUnit = () => {
    if (unitId !== null) {
      const unit = units.item(unitId)
      setUnit(() => unit? unit : null)
    }
  }

  const show = (unitId: number) => {
    setUnitId(() => unitId)
    modal.current?.show()
  }

  const hide = () => {
    setUnit(() => null)
    modal.current?.hide()
  }

  useEffect(() => updateUnit(), [unitId, units]);

  useImperativeHandle(ref, () => ({ show, hide }), [])

  return (
      <>
        <AppModal
            ref={modal}
            title={unit?.name}
            headerItem={<div style={{
              backgroundColor: unit?.color,
              width: 24,
              aspectRatio: 1,
              borderRadius: "50%"
            }}/>}
            onClose={() => setUnit(() => null)}
        >
          <Flex gap={12} direction={"column"} mb={8}>
            {unitUsers.map(user => (
                <Flex
                    key={user.id}
                    align={"center"}
                    className={"pointer"}
                    gap={8}
                    bg={Colors.lightGrey}
                    py={6}
                    px={12}
                    br={7}
                    onClick={() => onUserClick(user.id)}
                >
                  <AppAvatar src={user.avatar}/>
                  <span style={{ color: Colors.darkGrey, fontWeight: 400 }}>{ user.fio }</span>
                </Flex>
            ))}
            <Button
                style={{ alignSelf: "end" }}
                variant={"tertiary"}
                onClick={() => unit&& onEdit(unit.id)}
            >Изменить</Button>
          </Flex>
        </AppModal>
      </>
  )
})

export default UnitModal