import {FullUser} from "../constants/Models.ts";
import {useMemo} from "react";
import useUnits from "../hooks/useUnits.ts";
import {Flex} from "@prismane/core";
import Colors from "../constants/Colors.ts";

const fieldNames = {
  fio: "Полное ФИО",
  organization: "Организация",
  control: "Контроль",
  days: "Дней накоплено",
  phone: "Телефон",
  mail: "Почта",
} as const

type FieldNameType = typeof fieldNames[keyof typeof fieldNames]

const UserInfo = (props: {
  user: FullUser
  block?: boolean
}) => {
  const { all: allUnits } = useUnits()

  const units = useMemo(() => {
    return allUnits.filter(u => u.userIds.includes(props.user.id))
  }, [props.user, allUnits])

  const fields = useMemo(() => {
    const result: {
      name: FieldNameType,
      value: string|number
    }[] = []
    for (const fieldKey in fieldNames) {
      result.push({
        name: fieldNames[fieldKey],
        value: props.user[fieldKey]
      })
    }
    return result
  }, [props.user])

  return (
      <Flex
          direction={"column"}
          p={12}
          className={props.block ? "shadow-sm" : ""}
          style={props.block ? {
            borderRadius: 14
          } : null}
          gap={12}
      >
        {fields.map(({name, value}) => (
            <div key={name} style={{color: Colors.darkGrey}}><span
                style={{fontWeight: 500, color: Colors.black}}>{name}:</span> {value}</div>
        ))}
        <Flex gap={8}>
          {units.map(unit => (
              <div key={unit.id} style={{
                padding: "4px 12px",
                borderRadius: 999,
                backgroundColor: unit.color,
                color: Colors.white
              }}>{ unit.name }</div>
          ))}
        </Flex>
      </Flex>
  )
}

export default UserInfo