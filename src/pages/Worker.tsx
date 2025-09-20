"use client";

import { useNavigate } from "react-router";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import BlendItLogo from "@/assets/icons/logo";
import { useEffect } from "react";
import { toast } from "sonner";

const WorkerPage = () => {
  const navigate = useNavigate();
    
  const email = localStorage.getItem("email");
  useEffect(() => {
    if (!email) {
      navigate("/login");
      toast.error("You need to Login First");
    }
  }, [email]);
  const downloadUrl = "https://github.com/blendit-org/b-it-frontend/releases/download/beta/blendit-0.0.1-setup.exe"; 
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-br from-[#1a0500] to-orange-900 relative">
      {/* Logo top-left */}
      <div
        className="absolute top-6 left-6 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <BlendItLogo />
      </div>

      {/* Page Title */}
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl sm:text-5xl font-bold text-white mt-20 mb-12 text-center"
      >
        Workers Tool
      </motion.h1>

      {/* Download Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col items-center border border-[#ff6600]/40 rounded-2xl p-10 w-full max-w-md text-center shadow-lg backdrop-blur-md hover:shadow-[0_0_30px_rgba(255,102,0,0.5)] transition"
      >
        <motion.div
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mb-6"
        >
          <Download size={40} className="text-[#ff6600]" />
        </motion.div>

        <h2 className="text-2xl font-semibold text-white mb-3">
          Download Worker Tool
        </h2>

        <p className="text-[#ffb266] mb-8 leading-relaxed text-sm">
          Get the executable file and start contributing seamlessly.
        </p>

        <motion.a
          href={downloadUrl}
          download
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #ff6600" }}
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
