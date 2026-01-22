import { motion } from "motion/react";
import arrowImg from "../assets/arrow.png";
import { useAnimate } from "motion/react-mini";
import { useEffect, useState } from "react";

export default function Instruction() {
  const [rightVisible, setRightVisible] = useState(true);
  const [leftVisible, setLeftVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRightVisible(false);
      setLeftVisible(true);
    }, 3000);
    setTimeout(() => {
      setLeftVisible(false);
    }, 6000);
  }, []);

  return (
    <>
      {leftVisible && (
        <motion.div
          className="flex items-center"
          initial={{ x: 100, opacity: 0, scale: 0.5 }}
          animate={{ x: -20, opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            x: { type: "spring", visualDuration: 0.4, bounce: 0.6 },
          }}
        >
          <motion.img src={arrowImg} className="h-10 scale-x-[-1]" />
          <p className="text-lg px-2 font-sour-gummy">swipe left to dislike</p>
        </motion.div>
      )}
      {rightVisible && (
        <motion.div
          className="flex items-center"
          initial={{ x: -100, opacity: 0, scale: 0.5 }}
          animate={{ x: 20, opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            x: { type: "spring", visualDuration: 0.4, bounce: 0.6 },
          }}
        >
          <p className="text-lg px-2 font-sour-gummy">swipe right to like</p>
          <motion.img src={arrowImg} className="h-10" />
        </motion.div>
      )}
    </>
  );
}
