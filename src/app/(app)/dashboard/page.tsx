"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import {
  BarChart3,
  UserPlus,
  FileText,
  FileUp,
  NotebookPen,
  GraduationCap,
  BookOpenCheck,
  CalendarCheck,
  Book,
  CheckCircle,
  Plane,
  UserCog,
  Users,
  ListChecks,
  School
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MetricCard } from "@/components/Shell/MetricCard"
import { useDashboardMock } from "@/lib/hooks/use-dashboard-mock"
import { useDashboardStatsMock } from "@/lib/hooks/use-dashboard-stats-mock"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { type UserRole } from "@/components/Shell/Topbar"

export default function DashboardPage() {
  const { recentReports, isLoading: loadingReports } = useDashboardMock()
  const {
    students,
    reports,
    avgScore,
    isLoading: loadingStats,
  } = useDashboardStatsMock()

  const isLoading = loadingReports || loadingStats
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Get current role from URL or localStorage - in a real app this would come from context/auth
  const [currentRole, setCurrentRole] = useState<UserRole>("student")

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Read current role from localStorage (set in the layout component)
    const storedRole = localStorage.getItem("userRole") || "student"
    setCurrentRole(storedRole as UserRole)

    // Redirect if not logged in
    if (storedRole === "none") {
      router.push('/')
    }
  }, [router])

  if (!mounted) return null

  /* ---------------------------------- */
  /* ROLE-SPECIFIC CONTENT
  /* ---------------------------------- */

  // Student-specific content
  if (currentRole === "student") {
    return <StudentDashboard isLoading={isLoading} />
  }

  // Instructor-specific content
  if (currentRole === "instructor") {
    return <InstructorDashboard isLoading={isLoading} recentReports={recentReports} />
  }

  // Admin & SuperAdmin get the same view
  if (currentRole === "admin" || currentRole === "superadmin") {
    return <AdminDashboard isLoading={isLoading} reports={reports} avgScore={avgScore} students={students} recentReports={recentReports} />
  }

  // Fallback content (shouldn't normally be shown)
  return <div>Loading dashboard...</div>
}

// Student Dashboard Component
function StudentDashboard({ isLoading }: { isLoading: boolean }) {
  const upcomingLessons = [
    { id: "1", title: "Ground School: Navigation", date: "Tomorrow, 10:00 AM", instructor: "Jane Smith" },
    { id: "2", title: "Flight Lesson: Steep Turns", date: "Friday, 2:30 PM", instructor: "Mike Johnson" },
    { id: "3", title: "Written Test Prep", date: "Next Monday, 1:00 PM", instructor: "Sarah Lee" },
  ]

  const studyMaterials = [
    { id: "1", title: "ACS Guide: Private Pilot", progress: 65 },
    { id: "2", title: "Radio Communications", progress: 30 },
    { id: "3", title: "Weather Theory", progress: 85 },
  ]

  return (
    <main className="flex-1 space-y-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Track your progress, upcoming lessons, and study materials
          </p>
        </div>

        {/* ----- METRICS ----- */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Overall Progress"
            value="68%"
            icon={CheckCircle}
            change={4}
            subtitle="towards private pilot"
            loading={isLoading}
          />
          <MetricCard
            title="Flight Hours"
            value="24.5"
            icon={Plane}
            change={2.5}
            subtitle="total accumulated"
            loading={isLoading}
          />
          <MetricCard
            title="Next Milestone"
            value="Solo XC"
            icon={GraduationCap}
            change={0}
            subtitle="coming up soon"
            loading={isLoading}
          />
        </div>

        {/* ----- MAIN GRID ----- */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Upcoming Lessons */}
          <Card className="shadow-xs lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <CalendarCheck className="h-5 w-5 text-neutral-500" /> Upcoming Lessons
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-primary">
                View calendar
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between rounded-md border p-3">
                      <div className="h-14 w-full animate-pulse rounded-md bg-neutral-100" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-md border border-neutral-200 p-3 hover:bg-neutral-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {lesson.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{lesson.title}</div>
                          <div className="text-xs text-neutral-500">
                            {lesson.date} · {lesson.instructor}
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Confirm</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Study Materials */}
          <Card className="shadow-xs lg:col-span-5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Book className="h-5 w-5 text-neutral-500" /> Study Materials
              </CardTitle>
              <CardDescription>Track your study progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studyMaterials.map((material) => (
                  <div key={material.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{material.title}</span>
                      <span className="text-xs text-neutral-500">{material.progress}%</span>
                    </div>
                    <Progress value={material.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="mt-2 w-full">Access Library</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}

// Instructor Dashboard Component
function InstructorDashboard({ isLoading, recentReports }: { isLoading: boolean, recentReports: any[] }) {
  const students = [
    { id: "1", name: "Alex Johnson", status: "Active", progress: 75, nextLesson: "Tomorrow, 2PM" },
    { id: "2", name: "Maria Garcia", status: "Active", progress: 42, nextLesson: "Friday, 10AM" },
    { id: "3", name: "James Wilson", status: "Inactive", progress: 90, nextLesson: "Not scheduled" },
    { id: "4", name: "Sarah Miller", status: "Active", progress: 22, nextLesson: "Thursday, 1PM" },
  ]

  /* ---------------------------------- */
  /* QUICK‑ACTIONS for Instructors
  /* ---------------------------------- */
  const quickActions = [
    { title: "Schedule Lesson", icon: CalendarCheck },
    { title: "Add New Student", icon: UserPlus },
    { title: "Create Lesson Plan", icon: NotebookPen },
    { title: "Submit Test Report", icon: FileUp },
    { title: "Student Progress", icon: BarChart3 },
    { title: "Resources", icon: BookOpenCheck },
  ]

  return (
    <main className="flex-1 space-y-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your students, lessons, and teaching materials
          </p>
        </div>

        {/* ----- METRICS ----- */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Active Students"
            value="12"
            icon={Users}
            change={2}
            subtitle="currently training"
            loading={isLoading}
          />
          <MetricCard
            title="Scheduled Hours"
            value="32"
            icon={CalendarCheck}
            change={8}
            subtitle="next 7 days"
            loading={isLoading}
          />
          <MetricCard
            title="Success Rate"
            value="92%"
            icon={CheckCircle}
            change={3}
            subtitle="test pass rate"
            loading={isLoading}
          />
        </div>

        {/* ----- MAIN GRID ----- */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Students list */}
          <Card className="shadow-xs lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Users className="h-5 w-5 text-neutral-500" /> Your Students
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-primary">
                View all
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between rounded-md border p-3">
                      <div className="h-14 w-full animate-pulse rounded-md bg-neutral-100" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between rounded-md border border-neutral-200 p-3 hover:bg-neutral-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-neutral-500">
                            Progress: {student.progress}% · Next: {student.nextLesson}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            student.status === "Active"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-yellow-500 bg-yellow-50 text-yellow-700"
                          )}
                        >
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-xs lg:col-span-5">
            <CardHeader
              className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--tw-gradient-stops)), repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.03) 5px, rgba(0,0,0,0.03) 6px)",
              }}
            >
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              <p className="text-sm text-neutral-600">Jump straight into common tasks</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
                {quickActions.map((item, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="flex h-auto flex-col gap-2 border-neutral-200 p-4 hover:bg-primary/5"
                  >
                    <item.icon className="h-6 w-6 text-primary" />
                    <span className="text-center text-xs font-normal leading-snug">
                      {item.title}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

// Admin Dashboard Component
function AdminDashboard({
  isLoading,
  reports,
  avgScore,
  students,
  recentReports
}: {
  isLoading: boolean,
  reports: any,
  avgScore: any,
  students: any,
  recentReports: any[]
}) {
  /* ---------------------------------- */
  /* QUICK‑ACTIONS for Admins
  /* ---------------------------------- */
  const quickActions = [
    { title: "User Management", icon: UserCog },
    { title: "Add Instructor", icon: UserPlus },
    { title: "School Settings", icon: School },
    { title: "View Analytics", icon: BarChart3 },
    { title: "Manage Reports", icon: ListChecks },
    { title: "Billing", icon: FileText },
  ]

  return (
    <main className="flex-1 space-y-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your organization, instructors and overall analytics
          </p>
        </div>

        {/* ----- METRICS ----- */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Reports Processed"
            value={reports.count}
            icon={FileText}
            change={reports.change}
            subtitle="since last login"
            loading={isLoading}
          />
          <MetricCard
            title="Average Score"
            value={`${avgScore.value}%`}
            icon={BarChart3}
            change={avgScore.change}
            subtitle="overall average"
            loading={isLoading}
          />
          <MetricCard
            title="Students Onboarded"
            value={students.count}
            icon={UserPlus}
            change={students.change}
            subtitle="this month"
            loading={isLoading}
          />
        </div>

        {/* ----- MAIN GRID ----- */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Recent Test Results */}
          <Card className="shadow-xs lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5 text-neutral-500" /> Recent Reports
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-primary">
                View all
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between rounded-md border p-3">
                      <div className="h-14 w-full animate-pulse rounded-md bg-neutral-100" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between rounded-md border border-neutral-200 p-3 hover:bg-neutral-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {report.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-xs text-neutral-500">
                            {report.date} · {report.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            report.status === "Completed"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : report.status === "Pending"
                                ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                                : "border-blue-500 bg-blue-50 text-blue-700",
                          )}
                        >
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-xs lg:col-span-5">
            <CardHeader
              className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--tw-gradient-stops)), repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.03) 5px, rgba(0,0,0,0.03) 6px)",
              }}
            >
              <CardTitle className="text-lg font-semibold">Admin Tools</CardTitle>
              <p className="text-sm text-neutral-600">School and organization management</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
                {quickActions.map((item, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="flex h-auto flex-col gap-2 border-neutral-200 p-4 hover:bg-primary/5"
                  >
                    <item.icon className="h-6 w-6 text-primary" />
                    <span className="text-center text-xs font-normal leading-snug">
                      {item.title}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
