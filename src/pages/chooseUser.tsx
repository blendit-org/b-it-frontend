"use client";

import { useNavigate } from "react-router";
import { User, Users } from "lucide-react";
import { motion } from "framer-motion";
import BlendItLogo from "@/assets/icons/logo";
import { useEffect } from "react";
import { toast } from "sonner";

const JoinPage = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hover: { scale: 1.03, boxShadow: "0 6px 20px rgba(255,102,0,0.25)" },
    tap: { scale: 0.97 },
  };
    
      const email = localStorage.getItem("email");
            useEffect(() => {
              if (!email) {
                navigate("/login");
                toast.error("You need to Login First");
              }
            }, [email]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1a0500] to-orange-900 relative">
      {/* Logo top-right */}
      <div
        className="absolute top-6 left-6 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <BlendItLogo/>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-16 text-center">
        Choose Your Role
      </h1>

      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-3xl">
        {/* Client Card */}
        <motion.div
          onClick={() => navigate("/login")}
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex-1 cursor-pointer border border-[#ff6600]/40 rounded-2xl p-10 flex flex-col items-center justify-center transition"
        >
          <User size={36} className="text-[#ff6600] mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2 text-center">
            Join as Client
          </h2>
          <p className="text-[#ffb266] text-center max-w-xs text-sm">
            Access 3D tools and manage your projects seamlessly.
          </p>
        </motion.div>

        {/* Worker Card */}
        <motion.div
          onClick={() => navigate("/worker")}
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex-1 cursor-pointer border border-[#ff6600]/40 rounded-2xl p-10 flex flex-col items-center justify-center transition"
        >
          <Users size={36} className="text-[#ff6600] mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2 text-center">
            Join as Worker
          </h2>
          <p className="text-[#ffb266] text-center max-w-xs text-sm">
            Collaborate on projects and contribute 3D assets.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinPage;
