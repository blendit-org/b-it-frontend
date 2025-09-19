import * as React from "react";
import { Button } from "@/components/ui/button";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

interface ProfileMenuProps {
  onLogout: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: userInfo } = useUserInfoQuery(undefined);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const userName = userInfo?.fullName || "B";

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#profile-menu")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div id="profile-menu" className="relative inline-block text-left">
      {/* Profile Icon */}
      <motion.div whileHover={{ scale: 1.15, rotate: 6 }} whileTap={{ scale: 0.9 }}>
        <Button
          onClick={toggleDropdown}
          variant="ghost"
          size="sm"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-400 via-orange-600 to-orange-600
                     text-white text-lg font-bold flex items-center justify-center shadow-xl 
                     backdrop-blur-md transition-transform duration-300"
        >
          {userName.charAt(0).toUpperCase()}
        </Button>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-72 rounded-2xl overflow-hidden shadow-2xl 
                       bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl
                       border border-white/20 dark:border-gray-700 z-50"
          >
            <motion.div
              className="p-6 space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* User Info */}
              {userInfo && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 text-gray-800 dark:text-gray-200"
                >
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">Name</span>
                    <p className="font-semibold">{userInfo.fullName}</p>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">Username</span>
                    <p className="font-semibold">{userInfo.userId}</p>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">Email</span>
                    <p className="font-semibold break-words">{userInfo.email}</p>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">Score</span>
                    <p className="font-semibold">{userInfo.score}</p>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">Work Mode</span>
                    <motion.p
                      whileHover={{ scale: 1.1, color: "#ff6600", textShadow: "0 0 8px #ff6600" }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="cursor-pointer font-semibold text-orange-500"
                      onClick={() => navigate("/worker")}
                    >
                      Join as Worker →
                    </motion.p>
                  </div>
                </motion.div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Logout Button */}
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 99, 71, 0.15)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="w-full px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 
                           border border-red-300/50 dark:border-red-600 rounded-xl 
                           bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm
                           shadow-sm hover:shadow-md transition-colors"
              >
                Logout
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
