import {ReactNode} from "react";
import {Flex} from "@prismane/core";

const Page = (props: {
  children: ReactNode
}) => {
  return (
      <Flex h={"100%"} w={"100%"} px={24} pt={12} direction={"column"}>
        { props.children }
      </Flex>
  );
};

export default Page;