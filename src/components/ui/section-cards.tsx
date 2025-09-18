import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
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
        const userResult = await axios.get<UsersResponse>("http://10.201.48.47:8005/public/");
        setUsers(userResult.data.totalUsers || 0);

        const frameResult = await axios.get<FramesResponse>("http://10.201.48.47:4009/stats/general");
        setTotalFrames(frameResult.data.totalFrames || 0);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
      <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardDescription>Total Rendered</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              <AnimatedNumber value={totalFrames} />
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="flex items-center gap-1">
                <IconTrendingUp size={16} />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex flex-col gap-1.5 text-sm"></CardFooter>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              <AnimatedNumber value={users} />
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="flex items-center gap-1">
                <IconTrendingDown size={16} />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex flex-col gap-1.5 text-sm"></CardFooter>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardDescription>Active Workers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              <AnimatedNumber value={4678} />
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="flex items-center gap-1">
                <IconTrendingUp size={16} />
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex flex-col gap-1.5 text-sm"></CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
