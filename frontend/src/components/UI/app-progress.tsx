import Colors from "../../constants/Colors"
import {motion} from "framer-motion";

const height = 12

const AppProgress = ({ value }: { value: number }) => {
  return (
      <div style={{
        backgroundColor: Colors.lightGrey,
        borderRadius: 999,
        height,
        width: "100%",
      }}>
        <motion.div
            initial={{width: height}}
            animate={{width: value ? (value * 100 + "%") : height}}
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 999,
              height,
            }}
        />
      </div>
  )
}

export default AppProgress