"use client"

import * as React from "react"
import axios from "axios"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartConfig = {
  render: {
    label: "Frames Rendered",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState<"3d" | "7d" | "15d" | "30d">("30d")
  const [chartData, setChartData] = React.useState<{ date: string; render: number }[]>([])
  const [totalFrames, setTotalFrames] = React.useState<number>(0)

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await axios.get("https://10.201.48.47:4009/stats/general")
        const data = result.data
        console.log("API response:", data)

        setTotalFrames(data.totalFrames || 0)

        const breakdown = data.last30DaysBreakdown || []

        // Deduplicate and keep latest value
        const dedupedMap = new Map<string, number>()
        breakdown.forEach((item: { day: string; frameCount: number }) => {
          dedupedMap.set(item.day, item.frameCount)
        })

        // Format & sort chronologically
        const formatted = Array.from(dedupedMap.entries())
          .map(([day, frameCount]) => ({ date: day, render: frameCount }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setChartData(formatted)
      } catch (err) {
        console.error("Error fetching stats:", err)
      }
    }

    fetchStats()
  }, [])

  const filteredData = React.useMemo(() => {
    if (!chartData.length) return []
    let daysToSubtract = 30
    if (timeRange === "3d") daysToSubtract = 3
    else if (timeRange === "7d") daysToSubtract = 7
    else if (timeRange === "15d") daysToSubtract = 15

    return chartData.slice(-daysToSubtract)
  }, [chartData, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Rendered - {totalFrames}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Rendering stats over time</span>
          <span className="@[540px]/card:hidden">Last 30 days</span>
        </CardDescription>
        <CardAction>
          {/* Desktop toggle buttons */}
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as "3d" | "7d" | "15d" | "30d")}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >

            <ToggleGroupItem value="3d">Last 3 Days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 Days</ToggleGroupItem>
            <ToggleGroupItem value="15d">Last 15 Days</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 Days</ToggleGroupItem>
          </ToggleGroup>

          {/* Mobile dropdown */}
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as "3d" | "7d" | "15d" | "30d")}>

            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="3d" className="rounded-lg">Last 3 Days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 Days</SelectItem>
              <SelectItem value="15d" className="rounded-lg">Last 15 Days</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillrender" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-render)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-render)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              type="category"
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              ticks={filteredData.map((d) => d.date)} // ensure first date appears
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="render"
              type="natural"
              fill="url(#fillrender)"
              stroke="var(--color-render)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
