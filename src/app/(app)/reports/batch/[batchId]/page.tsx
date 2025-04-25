"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ArrowUpDown, ChevronRight, BarChart3, Award, Percent, AlertTriangle, Calculator, Download } from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useBatchMock } from "@/lib/hooks/use-batch-mock"
import { cn } from "@/lib/utils"

export default function BatchReportPage() {
  const params = useParams()
  const batchId = params.batchId as string
  const { reports, metrics, title, date, reportCount, isLoading } = useBatchMock(batchId)
  const [filteredReports, setFilteredReports] = useState(reports)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update filtered reports when reports change or filter changes
  useEffect(() => {
    if (activeFilter === "<70%") {
      setFilteredReports(reports.filter((report) => report.score < 70))
    } else if (activeFilter === "70-79%") {
      setFilteredReports(reports.filter((report) => report.score >= 70 && report.score < 80))
    } else if (activeFilter === "80-89%") {
      setFilteredReports(reports.filter((report) => report.score >= 80 && report.score < 90))
    } else if (activeFilter === "90%+") {
      setFilteredReports(reports.filter((report) => report.score >= 90))
    } else {
      setFilteredReports(reports)
    }
  }, [reports, activeFilter])

  const toggleFilter = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null)
    } else {
      setActiveFilter(filter)
    }
  }

  // Calculate derived data
  const calculateStandardDeviation = (scores: number[]): number => {
    const n = scores.length
    if (n === 0) return 0
    const mean = scores.reduce((a, b) => a + b, 0) / n
    const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / n
    return Math.sqrt(variance)
  }

  const scoreDistribution = (
    scores: number[]
  ): { name: string; count: number }[] => {
    const bins: { [key: string]: number } = {
      "<70": 0,
      "70-79": 0,
      "80-89": 0,
      "90+": 0,
    }
    scores.forEach((score) => {
      if (score < 70) bins["<70"]++
      else if (score < 80) bins["70-79"]++
      else if (score < 90) bins["80-89"]++
      else bins["90+"]++
    })
    return [
      { name: "<70%", count: bins["<70"] },
      { name: "70-79%", count: bins["70-79"] },
      { name: "80-89%", count: bins["80-89"] },
      { name: "90%+ 🎖", count: bins["90+"] }, // Trophy emoji for 90+!
    ]
  }

  // --- Mock Data for new sections (replace with actual data processing) ---
  const mostMissedAcsCodes = [
    { code: "PA.I.A.K1", description: "Aerodynamics forces and vectors", missed: 15 },
    { code: "PA.I.B.K2", description: "Weight and balance calculations", missed: 12 },
    { code: "PA.III.C.K3", description: "Airspace classifications", missed: 10 },
  ]

  const toughestAreas = [
    { area: "Regulations", avgScore: 72 },
    { area: "Aerodynamics", avgScore: 75 },
    { area: "Weather", avgScore: 78 },
  ]
  // --- End Mock Data ---

  const scores = reports.map((r) => r.score)
  const stdDev = calculateStandardDeviation(scores).toFixed(2)
  const distributionData = scoreDistribution(scores)

  // Mock handler for download button
  const handleDownloadBatchReport = () => {
    console.log("Download Batch Report clicked for batch:", batchId)
    // TODO: Implement actual batch download logic (e.g., generate CSV/PDF)
  }

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-64 animate-pulse rounded-md bg-neutral-100" />
        < div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" >
          <div className="h-32 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-32 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-32 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-32 animate-pulse rounded-md bg-neutral-100" />
        </div >
        <div className="mt-8 h-56 animate-pulse rounded-md bg-neutral-100" />
        <div className="mt-8 h-96 animate-pulse rounded-md bg-neutral-100" />
      </div >
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2 mb-2" asChild>
            <Link href="/reports">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {title} – {reportCount} Reports ({date})
          </h1>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 pt-1">
          <Button variant="outline" onClick={handleDownloadBatchReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          {/* Add other batch actions here if needed */}
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Percent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Average Score</h3>
              <p className="text-lg font-semibold">{metrics.averageScore}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Highest Score</h3>
              <p className="text-lg font-semibold">{metrics.highestScore}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Lowest Score</h3>
              <p className="text-lg font-semibold">{metrics.lowestScore}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Score Std. Dev.</h3>
              <p className="text-lg font-semibold">{stdDev}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart & New Sections */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Score Distribution Chart */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Score Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px", borderRadius: "0.5rem", padding: "8px" }}
                  cursor={{ fill: "hsl(var(--muted))" }}
                />
                <Bar dataKey="count" name="Students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Toughest Areas */}
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Toughest Areas</h2>
            <ul className="space-y-2">
              {toughestAreas.map((area) => (
                <li key={area.area} className="flex justify-between text-sm">
                  <span>{area.area}</span>
                  <span className="font-medium">{area.avgScore}% Avg</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Most Missed ACS Codes */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Most Missed ACS Codes</h2>
          <ul className="space-y-3">
            {mostMissedAcsCodes.map((item) => (
              <li key={item.code} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">{item.code}</span>
                  <Badge variant="outline">Missed by {item.missed}</Badge>
                </div>
                <p className="mt-1 text-neutral-500">{item.description}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reports</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8",
                activeFilter === "<70%" && "bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800",
              )}
              onClick={() => toggleFilter("<70%")}
            >
              &lt;70%
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8",
                activeFilter === "70-79%" && "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800",
              )}
              onClick={() => toggleFilter("70-79%")}
            >
              70-79%
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8",
                activeFilter === "80-89%" && "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800",
              )}
              onClick={() => toggleFilter("80-89%")}
            >
              80-89%
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8",
                activeFilter === "90%+" && "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800",
              )}
              onClick={() => toggleFilter("90%+")}
            >
              90%+
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <Button variant="ghost" className="flex items-center gap-1 p-0 font-medium">
                    Student
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="flex items-center gap-1 p-0 font-medium">
                    Exam
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" className="flex items-center gap-1 p-0 font-medium">
                    Score
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Weakest Area</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No reports match the selected filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id} className={cn(report.score < 70 && "bg-red-50")}>
                    <TableCell className="font-medium">{report.studentName}</TableCell>
                    <TableCell>{report.examTitle}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          report.score >= 90
                            ? "border-green-500 bg-green-50 text-green-700"
                            : report.score >= 80
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : report.score >= 70
                                ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                                : "border-red-500 bg-red-50 text-red-700",
                        )}
                      >
                        {report.score}%
                      </Badge>
                    </TableCell>
                    <TableCell>{report.weakestArea}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/reports/${report.id}`}>
                          View
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
