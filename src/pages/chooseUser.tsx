"use client";

import { useNavigate } from "react-router";
import { User, Users } from "lucide-react";
import { motion } from "framer-motion";

const JoinPage = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hover: { scale: 1.05, boxShadow: "0 8px 24px rgba(255,102,0,0.3)" },
    tap: { scale: 0.97 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1a0500] to-[#ff6600]">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-16 text-center">
        Choose Your Role
      </h1>

      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-4xl">
        {/* Card 1: Client */}
        <motion.div
          onClick={() => navigate("/")}
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex-1 cursor-pointer bg-black/40 border border-[#ff6600]/50 rounded-2xl p-8 flex flex-col items-center justify-center transition"
        >
          <User size={36} className="text-[#ff6600] mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2 text-center">
            Join as Client
          </h2>
          <p className="text-[#ffb266] text-center max-w-xs">
            Access 3D tools and manage your projects seamlessly.
          </p>
        </motion.div>

        {/* Card 2: Worker */}
        <motion.div
          onClick={() => navigate("/worker")}
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          className="flex-1 cursor-pointer bg-black/40 border border-[#ff6600]/50 rounded-2xl p-8 flex flex-col items-center justify-center transition"
        >
          <Users size={36} className="text-[#ff6600] mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2 text-center">
            Join as Worker
          </h2>
          <p className="text-[#ffb266] text-center max-w-xs">
            Collaborate on projects and contribute 3D assets.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinPage;
