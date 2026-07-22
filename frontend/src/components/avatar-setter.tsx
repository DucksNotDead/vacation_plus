import {Button, Drawer, Flex} from "@prismane/core";
import AppIcon from "./UI/app-icon.tsx";
import Colors from "../constants/Colors.ts";
import Settings from "../constants/Settings.ts";
import {motion} from "framer-motion"
import {useState, useRef, useEffect, LegacyRef, ChangeEvent} from "react";
import {CircleStencil, Cropper, CropperRef} from "react-advanced-cropper";
import 'react-advanced-cropper/dist/style.css';
import useNotify from "../hooks/useNotify.tsx";
import useCurrentUser from "../hooks/useCurrentUser.ts";
import AppLoadingButton from "./UI/app-loading-button.tsx";

const AvatarSetter = (props: {
  avatar?: string,
  open: boolean,
  setOpen: (open: boolean) => void
}) => {
  const [editing, setEditing] = useState(false)
  const [imageURL, setImageURL] = useState<string|null>(null)
  const [pending, setPending] = useState(false)
  const nt = useNotify()
  const { changeAvatar } = useCurrentUser()

  const inputRef = useRef<HTMLInputElement>(null)
  const cropperRef: LegacyRef<CropperRef> = useRef(null)

  const openCropper = () => inputRef.current?.click()

  const onFileLoaded = (e:  ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setEditing(() => true)
      try {
        const reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = e => {
          /*const image  = new Image()
          image.src = e.target?.result as string
          image.onload = (imageEvent) => {
            //@ts-ignore
            const { width, height } = imageEvent.target
            const current = Math.max(width, height)
            const max = Settings.avatarSize
            const ratio = current <= max? 1 : max / current
            const canvas = document.createElement("canvas")
            canvas.width = width * ratio
            canvas.height = height * ratio
            const context = canvas.getContext("2d")
            context?.drawImage(image, 0, 0, canvas.width, canvas.width)
            setImageURL(() => canvas.toDataURL("image/jpeg"))
          }*/
          setImageURL(() => e.target?.result as string)
        }
      }
      catch {
        nt("Не удалось открыть изображение", "error")
        setEditing(() => false)
      }
    }
    e.target.value = ""
  }

  const cancel = () => {
    setImageURL(() => null)
    setEditing(() => false)
  }

  const save = () => {
    setPending(() => true)
    const url = cropperRef.current?.getCanvas()?.toDataURL()
    if (url) {
      const image  = new Image()
      image.src = url
      image.onload = async (imageEvent) => {
        //@ts-ignore
        const { width, height } = imageEvent.target
        const current = Math.max(width, height)
        const max = Settings.avatarSize
        const ratio = current <= max? 1 : max / current
        const canvas = document.createElement("canvas")
        canvas.width = width * ratio
        canvas.height = height * ratio
        const context = canvas.getContext("2d")
        context?.drawImage(image, 0, 0, canvas.width, canvas.width)
        const res = await changeAvatar(canvas.toDataURL("image/jpeg"))
        if (!res) nt("Ошибка сохранения", "error")
        setEditing(() => false)
        setPending(() => false)
      }
      /*const res = await changeAvatar(image.toDataURL())
      if (!res) nt("Ошибка сохранения", "error")
      setEditing(() => false)*/
    }
  }

  const removeAvatar = async () => {
    setPending(() => true)
    const res = await changeAvatar("")
    if (!res) nt("Ошибка сохранения", "error")
    setPending(() => false)
  }

  useEffect(() => {
    if (props.avatar) setImageURL(props.avatar)
  }, [props.avatar]);

  return <Drawer
      open={props.open}
      closable
      position={"right"}
      onClose={() => props.setOpen(false)}
  >
    <input
        ref={inputRef}
        type={"file"}
        style={{ display: "none" }}
        onChange={onFileLoaded}
    />
    <Drawer.Header>
      <h1>Изменить аватар</h1>
    </Drawer.Header>
    {editing
        ? (
            <>
              <Cropper
                  src={imageURL}
                  ref={cropperRef}
                  stencilComponent={CircleStencil}
                  stencilProps={{
                    aspectRatio: 1
                  }}
                  style={{
                    borderRadius: 7,
                    overflow: "hidden"
                  }}
              />
              <Flex mt={12} gap={12}>
                <Button variant={"tertiary"} onClick={cancel}>Отмена</Button>
                <AppLoadingButton onClick={save} text={"Сохранить"} pending={pending}/>
              </Flex>
            </>
        )
        : (
            <div style={{
            width: "100%",
            padding: 12
          }}>
            <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: 1,
                  borderRadius: "50%",
                  overflow: "hidden"
                }}
            >
              {props.avatar&&props.avatar.length
                  ? (
                      <img
                          src={props.avatar}
                          alt="avatar image"
                          style={{
                            width: "100%",
                            aspectRatio: 1,
                          }}
                      />
                  )
                  : (
                      <div
                          style={{
                            width: "100%",
                            aspectRatio: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: Colors.lightGrey,
                          }}
                      >
                        <AppIcon name={"user"} size={100} color={"darkGrey"}/>
                      </div>
                  )
              }
              <motion.div
                  style={{
                    cursor: "pointer",
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0,0,0,.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 24
                  }}
                  whileHover={{ opacity: 1 }}
              >
                <AppIcon name={"pencil"} size={32} onClick={openCropper}/>
                <AppIcon name={"trash"} size={32} onClick={removeAvatar}/>
              </motion.div>
            </div>
          </div>
        )
    }
  </Drawer>
};

export default AvatarSetter;