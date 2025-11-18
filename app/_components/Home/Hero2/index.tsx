"use client";
import Image from "next/image";
import BackgroundImage from "./assets/background.png";
import PlantersImage from "./assets/planters.png";
import ApproachersImage from "./assets/approachers.png";
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";

const Hero2 = () => {
  return (
    <div className="w-full h-80 rounded-3xl overflow-hidden relative">
      <motion.img
        initial={{ filter: "brightness(0.5)" }}
        animate={{ filter: "brightness(1)" }}
        src={BackgroundImage.src}
        alt="Background"
        className="absolute inset-0 object-cover object-bottom h-full w-full"
      />
      <motion.img
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        src={ApproachersImage.src}
        alt="Approachers"
        className="absolute bottom-2 left-4 h-56 origin-bottom"
      />
      <motion.img
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        src={PlantersImage.src}
        alt="Planters"
        className="absolute bottom-4 right-4 h-56 origin-bottom"
      />
      <motion.div
        className="absolute inset-0  flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div className="absolute inset-0 bg-black/50 blur-3xl z-0"></motion.div>
        {/* <motion.button
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 2 }}
          className="absolute top-2 bg-black/20 hover:bg-black/50 border border-white/20 rounded-full p-2 text-white"
        >
          <XIcon className="size-4" />
        </motion.button> */}
        <motion.div className="z-5 flex flex-col items-center justify-center relative">
          <motion.img
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            src={"/assets/media/images/logo.svg"}
            className="h-20 w-20"
          />
          <motion.h1
            className="font-serif text-4xl font-bold text-white"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 1.8 }}
          >
            Ecocertain
          </motion.h1>
          <motion.span
            className="font-serif text-xl italic text-white/60"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 1.9 }}
          >
            Fund impactful.
          </motion.span>
          <motion.div
            initial={{
              scale: 0,
              filter: "blur(10px)",
              y: 0,
              x: 0,
            }}
            animate={{
              scale: 1,
              filter: "blur(0px)",
              y: -10,
              x: -200,
            }}
            transition={{ delay: 2.2, duration: 0.5, type: "spring" }}
            className="absolute top-0 left-0 text-nowrap text-white text-shadow-sm bg-black/20 backdrop-blur-lg border border-white/10 shadow-sm px-4 py-1 rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl rounded-br-xs origin-bottom-right"
          >
            Supporters unite.
          </motion.div>
          <motion.div
            initial={{
              scale: 0,
              filter: "blur(10px)",
              y: 0,
              x: 0,
            }}
            animate={{
              scale: 1,
              filter: "blur(0px)",
              y: 30,
              x: 200,
            }}
            transition={{ delay: 2.7, duration: 0.5, type: "spring" }}
            className="absolute top-0 right-0 text-nowrap text-white text-shadow-sm bg-black/20 backdrop-blur-lg border border-white/10 shadow-sm px-4 py-1 rounded-tl-2xl rounded-bl-xs rounded-tr-2xl rounded-br-2xl origin-bottom-left"
          >
            Communities thrive.{" "}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero2;
