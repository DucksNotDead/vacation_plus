import {Unit} from "../../constants/Models.ts";
import Colors from "../../constants/Colors.ts";
import AppIcon from "./app-icon.tsx";
import {useMemo} from "react";
import {Flex} from "@prismane/core";

const sizes = {
  xs: [22, 14],
  sm: [28, 18],
  xl: [180, 100]
}

const AppAvatar = (props: {
  size?: keyof typeof sizes
  units?: Unit[]
  src?: string
  onClick?: () => void
}) => {

  const size = useMemo(() => props.size? props.size : "sm",[props.size])

  return (
      <div onClick={() => props.onClick&& props.onClick()} style={{
        width: sizes[size][0],
        height: sizes[size][0],
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
        justifyContent: "end",
        cursor: props.onClick? "pointer" : "default",
      }}>
        {
          props.src
              ? (
                  <img
                      style={{
                        borderRadius: "50%",
                        cursor: props.onClick ? "pointer" : "default",
                        width: sizes[size][0],
                        height: sizes[size][0],
                      }}
                      src={props.src}
                      alt={"Аватар пользователя"}
                  />
              )
              : <Flex w={sizes[size][0]} h={sizes[size][0]} justify={"center"} align={"center"} style={{
                overflow: "hidden",
                borderRadius: "50%",
                backgroundColor: Colors.lightGrey,
              }}>
                <AppIcon
                    name={"user"}
                    color={"darkGrey"}
                    size={sizes[size][1]}
                    onClick={() => props.onClick && props.onClick()}
                />
              </Flex>
        }
        {props.units?.length
            ? (
                <Flex gap={3} p={2} style={{
                  borderRadius: sizes[size][0],
                  backgroundColor: Colors.white,
                  marginTop: -sizes[size][0] *.29,
                  height: sizes[size][0] *.29
                }}>
                  {props.units.map(unit => (
                      <div key={unit.id} style={{
                        aspectRatio: 1,
                        height: "100%",
                        borderRadius: "50%",
                        backgroundColor: unit.color
                      }}/>
                  ))}
                </Flex>
            )
            : null
        }
      </div>
  );
};

export default AppAvatar;