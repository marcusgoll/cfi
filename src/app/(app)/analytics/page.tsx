"use client"

import { useState } from "react"
import { BarChart3, GraduationCap, AlertTriangle, PieChart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnalyticsMock } from "@/lib/hooks/use-analytics-mock"
import { Badge } from "@/components/ui/badge"
import * as RechartsPrimitive from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AnalyticsPage() {
  const analytics = useAnalyticsMock()
  const [timeRange, setTimeRange] = useState("3m")

  // Derived values for display
  const currentAverageScore = analytics.averageScores.data[analytics.averageScores.data.length - 1]
  const previousAverageScore = analytics.averageScores.data[analytics.averageScores.data.length - 2] || 0
  const scoreChange = currentAverageScore - previousAverageScore

  // Enhanced chart data with more samples
  const extendedChartData = [
    { date: "2023-07-15", score: 78 },
    { date: "2023-08-15", score: 79 },
    { date: "2023-09-15", score: 81 },
    { date: "2023-10-15", score: 80 },
    { date: "2023-11-15", score: 83 },
    { date: "2023-12-15", score: 82 },
    { date: "2024-01-15", score: 82 },
    { date: "2024-02-15", score: 85 },
    { date: "2024-03-15", score: 83 },
    { date: "2024-04-15", score: 87 },
    { date: "2024-05-15", score: 89 },
    { date: "2024-06-15", score: 91 },
  ];

  // Filter data based on selected time range
  const filteredChartData = extendedChartData.filter(item => {
    const date = new Date(item.date);
    const today = new Date();
    if (timeRange === "3m") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      return date >= threeMonthsAgo;
    } else if (timeRange === "6m") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      return date >= sixMonthsAgo;
    } else if (timeRange === "1y") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      return date >= oneYearAgo;
    }
    return true; // "all" - return all data
  });

  // Basic chart data for smaller chart
  const chartData = analytics.averageScores.labels.map((label, index) => ({
    name: label,
    score: analytics.averageScores.data[index],
  }))

  // Chart configuration
  const chartConfig = {
    score: {
      label: "Average Score",
      color: "#0069FF",
    },
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <header className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight">Training Analytics</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Live insight into pass‑rates, score trends, and student engagement across your
          organization.
        </p>
      </header>

      {/* KPI grid */}
      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {/* Pass‑rate KPI */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-4">
            <div>
              <CardTitle className="text-xs font-medium">Pass Rate</CardTitle>
              <CardDescription className="text-xs">Current month</CardDescription>
            </div>
            <div className="rounded-md bg-primary/10 p-1.5 text-primary">
              <PieChart className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="flex h-16 items-end justify-between py-2 px-4">
            <span className="text-3xl font-bold leading-none">
              {analytics.passRate.percentage}%
            </span>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardContent>
        </Card>

        {/* Avg score KPI */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-4">
            <div>
              <CardTitle className="text-xs font-medium">Average Score</CardTitle>
              <CardDescription className="text-xs">Last 30 days</CardDescription>
            </div>
            <div className="rounded-md bg-primary/10 p-1.5 text-primary">
              <BarChart3 className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="flex h-16 items-end justify-between py-2 px-4">
            <span className="text-3xl font-bold leading-none">
              {currentAverageScore}%
            </span>
            <Badge
              variant="outline"
              className="self-center text-xs"
            >
              {scoreChange >= 0 ? "+" : ""}
              {scoreChange}%
            </Badge>
          </CardContent>
        </Card>

        {/* Active students KPI */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-4">
            <div>
              <CardTitle className="text-xs font-medium">Active Students</CardTitle>
              <CardDescription className="text-xs">Logged in past 14 days</CardDescription>
            </div>
            <div className="rounded-md bg-primary/10 p-1.5 text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="flex h-16 items-end justify-between py-2 px-4">
            <span className="text-3xl font-bold leading-none">
              {analytics.studentCounts.active}
            </span>
            <Badge variant="secondary" className="self-center text-xs">
              {analytics.studentCounts.total} total
            </Badge>
          </CardContent>
        </Card>

        {/* Weak‑areas KPI */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-4">
            <div>
              <CardTitle className="text-xs font-medium">Open Deficiencies</CardTitle>
              <CardDescription className="text-xs">Areas flagged &gt; 3 times</CardDescription>
            </div>
            <div className="rounded-md bg-secondary/10 p-1.5 text-secondary">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="flex h-16 items-end justify-between py-2 px-4">
            <span className="text-3xl font-bold leading-none">
              {analytics.topDeficiencies.length}
            </span>
            <AlertTriangle className="h-5 w-5 text-secondary" />
          </CardContent>
        </Card>
      </section>

      {/* Detailed grids & charts - Top row */}
      <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {/* Pass‑rate donut */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-4 space-y-0">
            <div>
              <CardTitle className="text-xs font-medium">Pass / Fail Breakdown</CardTitle>
              <CardDescription className="text-xs">Last 12 months</CardDescription>
            </div>
            <div className="rounded-md bg-primary/10 p-1.5 text-primary">
              <PieChart className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="py-2 px-4">
            {analytics.isLoading ? (
              <div className="mx-auto h-32 w-32 animate-pulse rounded-full bg-neutral-100" />
            ) : (
              <div className="relative mx-auto h-32 w-32">
                {/* donut svg */}
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="15"
                    strokeDasharray={`${(analytics.passRate.percentage * 2.51327).toFixed(2)} 251.327`}
                    strokeDashoffset="62.8319"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold">
                    {analytics.passRate.percentage}%
                  </span>
                  <span className="text-xs text-muted-foreground">Pass</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top deficiencies list */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between py-2 px-4 space-y-0">
            <div>
              <CardTitle className="text-xs font-medium">Common Weak Areas</CardTitle>
              <CardDescription className="text-xs">Ranked by frequency</CardDescription>
            </div>
            <div className="rounded-md bg-secondary/10 p-1.5 text-secondary">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </CardHeader>
          <CardContent className="py-2 px-4">
            {analytics.isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 animate-pulse rounded-md bg-neutral-100" />
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {analytics.topDeficiencies.map((d, idx) => (
                  <li key={idx} className="flex items-center justify-between text-xs">
                    <span>{d.name}</span>
                    <span className="font-medium">{d.percentage}%</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Enhanced Average Score Trend - Full width */}
      <section>
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 py-2 px-4 sm:flex-row border-b">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle className="text-xs font-medium">Average Score Trend</CardTitle>
              <CardDescription className="text-xs">Historical performance over time</CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[120px] rounded-lg sm:ml-auto h-8 text-xs"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="3m" className="rounded-lg text-xs">
                  Last 3 months
                </SelectItem>
                <SelectItem value="6m" className="rounded-lg text-xs">
                  Last 6 months
                </SelectItem>
                <SelectItem value="1y" className="rounded-lg text-xs">
                  Last 1 year
                </SelectItem>
                <SelectItem value="all" className="rounded-lg text-xs">
                  All Time
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-4">
            {analytics.isLoading ? (
              <div className="h-[250px] animate-pulse rounded-lg bg-neutral-100" />
            ) : (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <RechartsPrimitive.AreaChart
                  data={filteredChartData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0069FF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0069FF" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <RechartsPrimitive.CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <RechartsPrimitive.XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={30}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        year: timeRange === "all" || timeRange === "1y" ? "2-digit" : undefined,
                      });
                    }}
                  />
                  <RechartsPrimitive.YAxis
                    domain={[70, 100]}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          });
                        }}
                        formatter={(value) => `${value}%`}
                        indicator="dot"
                      />
                    }
                  />
                  <RechartsPrimitive.Area
                    dataKey="score"
                    type="monotone"
                    fill="url(#scoreGradient)"
                    stroke="#0069FF"
                    strokeWidth={2}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </RechartsPrimitive.AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
