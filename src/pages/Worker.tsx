"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";

const WorkerPage = () => {
  const downloadUrl = "/path/to/your/file.exe"; // replace with your actual file URL

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1a0033] to-[#0d0d1a]">
      
      <motion.h1
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl sm:text-5xl font-extrabold text-white mb-16 text-center tracking-wide"
      >
        Worker Tools
      </motion.h1>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col items-center bg-[#12002b]/70 border border-[#ff6600]/60 rounded-3xl p-10 w-80 text-center shadow-lg backdrop-blur-md hover:shadow-[0_0_30px_rgba(255,102,0,0.7)] transition"
      >
        <motion.div
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mb-6"
        >
          <Download size={40} className="text-[#ff6600]" />
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-2xl font-semibold text-white mb-3"
        >
          Download Worker Tool
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[#ffb266] mb-8 leading-relaxed"
        >
          Get the executable file and start contributing seamlessly.
        </motion.p>

        <motion.a
          href={downloadUrl}
          download
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px #ff6600" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-[#ff6600] to-[#ff8533] text-black font-bold rounded-xl tracking-wide shadow-md hover:shadow-[0_0_20px_#ff6600] transition"
        >
          Download EXE
        </motion.a>
      </motion.div>
    </div>
  );
};

export default WorkerPage;
