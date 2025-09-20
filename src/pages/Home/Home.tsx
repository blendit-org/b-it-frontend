import * as React from "react";
import { ChartAreaInteractive } from "@/components/layouts/chart-area-interactive";
import { SectionCards } from "@/components/ui/section-cards";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import "./home.css";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { motion } from "framer-motion";

const tags = [
  "Render Your Photo",
  "Render Your Video",
  "Generate 3D Image",
  "Generate Text to Image",
  "Join Community",
  "All your Projects in a Nutshell",
];

const Home = () => {
  const [currentTagIndex, setCurrentTagIndex] = React.useState(0);
  const [displayedText, setDisplayedText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { data } = useUserInfoQuery(undefined);

  React.useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const currentTag = tags[currentTagIndex];
    let timeout: any;

    if (!isDeleting) {
      if (displayedText.length < currentTag.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentTag.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 1500);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentTag.slice(0, displayedText.length - 1));
        }, typingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentTagIndex((prevIndex) => (prevIndex + 1) % tags.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentTagIndex]);

  return (
    <>
      <div className="relative min-h-screen w-full py-20 px-4 transition-colors duration-500 md:px-6 lg:px-8">
        <div className="container flex flex-col mx-auto">
          <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-200 h-15">
              <span className="text-gradient-orange">
                <span
                  className="typewriter"
                  style={{
                    animation: `typing ${displayedText.length * 0.1}s steps(${displayedText.length}) forwards, blink 1s step-end infinite`,
                  }}
                >
                  {displayedText}
                </span>
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Render your vision at warp speed with our powerful, distributed
              rendering network
            </p>

            {data?.email && localStorage.getItem("token") ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Button
                  size="lg"
                  className="mt-8 px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 
                            hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg 
                            hover:shadow-orange-400/50 transition-all duration-300 transform 
                            hover:-translate-y-1 hover:scale-105 group"
                >
                  <Link to="/render" className="flex items-center gap-2">
                    blend:it Now
                    <span className="text-3xl transition-transform duration-300 group-hover:translate-x-1">
                      
                    </span>
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Button
                  size="lg"
                  className="mt-8 px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 
                            hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg 
                            hover:shadow-orange-400/50 transition-all duration-300 transform 
                            hover:-translate-y-1 hover:scale-105 group"
                >
                  <Link to="/register" className="flex items-center gap-2">
                    Get Started
                    <span className="text-3xl transition-transform duration-300 group-hover:translate-x-1">
                      
                    </span>
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
          <div className="mb-15">
            <ChartAreaInteractive />
          </div>
          <div className="mb-15">
            <SectionCards />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
