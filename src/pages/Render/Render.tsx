import { RenderFile } from "@/pages/Render/fileInput";
import { RenderingProgressDashboard } from "../projects/RenderingProgressDashborad";
import { motion } from "framer-motion";

const Render = () => {
  return (
    <motion.div
      className="container mx-auto flex flex-col px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Section for file input/upload */}
      <motion.div
        className="mt-10 mb-10 p-6 rounded-2xl shadow-xl border"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        {/* <h2 className="text-2xl font-bold text-orange-500 mb-4">
          Upload Your File
        </h2> */}
        <RenderFile />
      </motion.div>

      {/* Optional: Output file section */}
      {/* <motion.div
        className="mb-15 p-6 bg-gray-900 rounded-2xl shadow-xl border border-orange-500"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <OutputFile fileUrl={fileUrl} fileName={fileName} />
      </motion.div> */}

      {/* Section to show the progress of multiple rendering files */}
      <motion.div
        className="mb-15 p-6 rounded-2xl shadow-xl border"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <RenderingProgressDashboard />
      </motion.div>
    </motion.div>
  );
};

export default Render;
