import React from 'react';
import {motion} from 'framer-motion'

const Button = (props = {
  className: '',
  text: '',
  onClick: (e) => {}
}) => {
  return props.text&& (
      <motion.div
          className={"app-button " + props.className}
          whileHover={{ opacity: .85 }}
          whileTap={{ scale: .95 }}
      >
        { props.text }
      </motion.div>
  );
};

export default Button;