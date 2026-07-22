import {Button, Spinner} from "@prismane/core";

const AppLoadingButton = (props: {
  onClick: () => void
  text: string
  pending: boolean
}) => {
  return <Button variant={"primary"} onClick={props.onClick}>
    { props.pending? <Spinner className={"xxs"}/> : props.text }
  </Button>
};

export default AppLoadingButton;