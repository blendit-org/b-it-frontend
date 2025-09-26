import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface UsersResponse {
  totalUsers: number;
}

interface FramesResponse {
  totalFrames: number;
}

// Animated number component
const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // 1 second
    const increment = value / (duration / 16);

    const animate = () => {
      start += increment;
      if (start < value) {
        setDisplay(Math.round(start));
        requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };
    animate();
  }, [value]);

  return <>{display.toLocaleString()}</>;
};

export function SectionCards() {
  const [totalFrames, setTotalFrames] = useState<number>(0);
  const [users, setUsers] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userResult = await axios.get<UsersResponse>("https://34.171.206.206:80/public/");
        setUsers(userResult.data.totalUsers ?? 0);

        const frameResult = await axios.get<FramesResponse>("https://10.201.48.47:4009/stats/general");
        setTotalFrames(frameResult.data.totalFrames ?? 0);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-6">
      {[
        { title: "Total Rendered", value: totalFrames, trend: "up" },
        { title: "Total Users", value: users, trend: "down" },
        { title: "Active Workers", value: 3, trend: "up" },
      ].map((item, idx) => (
        <motion.div key={idx} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
          <Card className="p-6 border border-orange-500 rounded-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="flex flex-col gap-2">
              <CardDescription className="text-gray-400 uppercase tracking-wider">{item.title}</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-bold tabular-nums text-white">
                <AnimatedNumber value={item.value} />
              </CardTitle>
              <CardAction>
                {/* <Badge variant="outline" className="flex items-center gap-1 text-orange-400">
                  {item.trend === "up" ? <IconTrendingUp size={16} /> : <IconTrendingDown size={16} />}
                  {item.trend === "up" ? "Increasing" : "Decreasing"}
                </Badge> */}
              </CardAction>
            </CardHeader>
            <CardFooter className="flex flex-col gap-1.5 text-sm text-gray-400">
              {/* Additional content inside footer */}
              <p>
                {item.title === "Total Users"
                  ? "Number of active users in the platform."
                  : item.title === "Total Rendered"
                  ? "Total frames rendered across all projects."
                  : "Current active workers processing tasks."}
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
