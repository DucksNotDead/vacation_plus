import {Alert, useToast} from "@prismane/core";

const useNotify = () => {
  const toast = useToast()
  return (text:string, type: "info"|"success"|"warning"|"error" = "info") => toast({
    element: <Alert variant={type}>{ text }</Alert>
  })
}

export default useNotify;