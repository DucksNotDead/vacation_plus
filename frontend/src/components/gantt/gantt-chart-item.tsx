import {Flex} from "@prismane/core";
import Colors from "../../constants/Colors.ts";

const GanttChartItem = (props: {
  width: number
  height: number|string
  isFirst: boolean
  label: string
}) => <Flex
    w={props.width}
    h={props.height}
    justify={"center"}
    align={"center"}
    style={{
      boxSizing: "content-box",
      borderColor: Colors.lightGrey,
      color: Colors.darkGrey,
      fontWeight: 500,
      borderStyle: "solid",
      borderLeftWidth: !props.isFirst? 0 : 1,
      borderBottomWidth: 1,
    }}
>{ props.label }</Flex>

export default GanttChartItem