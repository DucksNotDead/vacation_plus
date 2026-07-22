import {Field} from "@prismane/core";
import {AppColorType} from "../../constants/Types.ts";
import Colors from "../../constants/Colors.ts";

const AppInput = (props: {
  value: string
  color?: AppColorType
  onInput: (value:string) => void
  placeholder: string
  disabled?: boolean
  number?: boolean
}) => {
  return <Field
      value={props.value}
      //@ts-ignore
      onInput={e => props.onInput(e.target.value)}
      onChange={(e:any) => e}
      placeholder={props.placeholder}
      variant={"filled"}
      style={{ backgroundColor: Colors[props.color? props.color : "lightGrey"] }}
      disabled={props.disabled}
      type={props.number? "number" : "text"}
  />;
};

export default AppInput;