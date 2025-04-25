"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, FileText, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReportUploadForm } from "@/components/report-upload-form"
import { useReportsMock, type Report } from "@/lib/hooks/use-reports-mock"
import { useStudentsMock } from "@/lib/hooks/use-students-mock"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define more specific types for the combined data
type IndividualReportDisplay = Report & { type: "individual" };
type BatchReportDisplay = {
  id: string;
  type: "batch";
  title: string;
  date: string;
  reportCount: number;
  averageScore: number; // Use averageScore as score
  status: string; // Batch status might differ
  // Add dummy fields to match Report structure if needed by DataTable, or handle in columns
  studentName: string; // Will be derived (e.g., "Batch Summary")
  score: number; // Will use averageScore
  // Other Report fields might be needed if DataTable expects them strictly
  studentId?: string; // Individual reports have this
};

type DisplayReport = IndividualReportDisplay | BatchReportDisplay;

// Mock User Role - Replace with actual logic later
const MOCK_USER_ROLE: "Student" | "Instructor" | "Admin" | "SuperAdmin" = "Instructor";
const ALLOWED_STATUS_CHANGE_ROLES: string[] = ["Instructor", "Admin", "SuperAdmin"];
const REPORT_STATUS_OPTIONS: Report["status"][] = ["pending", "reviewed"]; // Assuming these are the valid statuses for Report type

export default function ReportsPage() {
  const router = useRouter()
  const { reports: individualReports, isLoading: isLoadingReports } = useReportsMock()
  const { students } = useStudentsMock()

  // --- State for the combined reports list ---
  const [displayedReports, setDisplayedReports] = useState<DisplayReport[]>([])

  // Mock batch summaries (replace with actual fetching logic)
  const mockBatchReportsData: Omit<BatchReportDisplay, 'type' | 'studentName' | 'score'>[] = [
    {
      id: "batch-1",
      title: "Weekly Checkride Prep Summary",
      date: "2024-07-20",
      reportCount: 5,
      averageScore: 85,
      status: "complete",
    },
    {
      id: "batch-2",
      title: "Maneuvers Practice Batch",
      date: "2024-07-18",
      reportCount: 8,
      averageScore: 78,
      status: "complete",
    },
  ]

  const [uploadOpen, setUploadOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  // Adjust state to hold the combined type
  const [reportsToDelete, setReportsToDelete] = useState<DisplayReport[]>([])

  const handleDelete = (selectedRows: DisplayReport[]) => {
    setReportsToDelete(selectedRows)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Here you would implement the actual deletion logic
    console.log("Deleting reports:", reportsToDelete)
    // In a real application, you would make an API call here
    setDeleteDialogOpen(false)
  }

  const handleGenerateSummary = (selectedRows: DisplayReport[]) => {
    // In a real application, you would either:
    // 1. Generate a batch report ID and redirect to the batch report page
    // 2. Or make an API call to create a batch report and then redirect

    // For this demo, we'll simulate option 1
    const batchId = "new-" + Date.now() // In real app, this would be a proper ID from backend

    // You might want to store the selected report IDs in localStorage or in a state management solution
    // for the batch page to retrieve them
    const reportIds = selectedRows.map(report => report.id)
    console.log("Generating summary for reports:", reportIds)

    // Navigate to the batch report page
    router.push(`/reports/batch/${batchId}`)
  }

  // --- New Handler for Merging ---
  const handleMergeIntoSummary = (selectedRows: DisplayReport[]) => {
    const targetSummary = selectedRows.find(r => r.type === 'batch');
    const reportsToMerge = selectedRows.filter(r => r.type === 'individual');

    if (!targetSummary || reportsToMerge.length === 0) {
      console.error("Invalid selection for merging");
      // Optionally show an error message to the user
      return;
    }

    const reportIdsToMerge = reportsToMerge.map(r => r.id);
    console.log(`Merging ${reportIdsToMerge.length} reports into Summary ID: ${targetSummary.id}`);
    console.log("Report IDs to merge:", reportIdsToMerge);

    // TODO: Implement actual API call to update the batch summary
    // After successful API call, you might want to:
    // 1. Refresh the data in the table (refetch reports)
    // 2. Potentially remove the merged individual reports from the view
    // 3. Deselect rows
  };

  // --- Updated Handler for Status Change ---
  const handleStatusChange = (reportId: string, newStatus: Report["status"]) => {
    console.log(`Changing status for report ID: ${reportId} to: ${newStatus}`);

    // Update the state to reflect the change visually
    setDisplayedReports(currentReports =>
      currentReports.map(report => {
        if (report.type === 'individual' && report.id === reportId) {
          // Create a new object with the updated status
          return { ...report, status: newStatus };
        }
        return report; // Return unchanged report otherwise
      })
    );

    // TODO: Implement actual API call to persist the change
    // After successful API call, you might want to:
    // 1. Refresh the data in the table (refetch reports)
    //    - This would require making individualReports stateful with useState
    // 2. Show a success toast message

    // Note: Directly updating the `allReports` array here won't work reliably
    // because it's recalculated on every render from the original mock data sources.
    // State management for `individualReports` is needed for UI updates.
  };

  // --- Effect to combine and set initial state ---
  useEffect(() => {
    if (!isLoadingReports) {
      // Combine individual and mock batch reports
      const combined: DisplayReport[] = [
        ...individualReports.map((r): IndividualReportDisplay => ({ ...r, type: "individual" })),
        ...mockBatchReportsData.map((b): BatchReportDisplay => ({
          ...b,
          type: "batch",
          studentName: `Batch (${b.reportCount} reports)`, // Placeholder for student column
          score: b.averageScore, // Use average score for the score column
        })),
      ];
      setDisplayedReports(combined);
    }
  }, [isLoadingReports, individualReports]); // Rerun when loading state or data changes

  // Remove the direct calculation of allReports here
  // const allReports: DisplayReport[] = [...];
  const isLoading = isLoadingReports; // Still use isLoadingReports for the loading state of the table

  // Ensure columns are defined with the combined type
  const columns: ColumnDef<DisplayReport>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.type === "batch" ? "secondary" : "outline"}>
          {row.original.type === "batch" ? "Summary" : "Individual"}
        </Badge>
      ),
      size: 100, // Give type a smaller size
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          Report Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Link
              href={row.original.type === "batch" ? `/reports/batch/${row.original.id}` : `/reports/${row.original.id}`}
              className="hover:underline"
            >
              {row.original.title}
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "studentName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          Student
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original.type === "individual"
          ? students.find((s) => s.id === row.original.studentId)
          : null;

        if (row.original.type === "batch") {
          // Display batch-specific info (like report count) or a generic label
          return <span>{row.original.studentName}</span> // Uses the derived name e.g. "Batch (5 reports)"
        }

        // Handle individual reports
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={student?.avatar || "/placeholder.svg"} alt={row.original.studentName} />
              <AvatarFallback>{row.original.studentName.charAt(0)}</AvatarFallback>
            </Avatar>
            <Link href={`/students/${row.original.studentId}`} className="font-medium hover:underline">
              {row.original.studentName}
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "score",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const score = row.original.score // This now correctly refers to averageScore for batches
        const type = row.original.type
        return (
          <Badge
            variant="outline" // Keep outline, adjust colors inside className
            className={cn(
              type === "individual" ?
                (score >= 90
                  ? "border-green-500 bg-green-50 text-green-700"
                  : score >= 80
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : score >= 70
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-red-500 bg-red-50 text-red-700")
                : "border-purple-500 bg-purple-50 text-purple-700" // Distinct style for batch average score
            )}
          >
            {score}% {type === "batch" && <span className="text-xs font-normal">(Avg)</span>}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const report = row.original; // Get the full report object for the row
        const status = report.status;
        const type = report.type;
        const canChangeStatus = ALLOWED_STATUS_CHANGE_ROLES.includes(MOCK_USER_ROLE);

        // Batch reports status (non-interactive for now)
        if (type === "batch") {
          return <Badge variant="secondary">{status}</Badge>;
        }

        // Individual reports - interactive if user has permission
        if (type === "individual" && canChangeStatus) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-auto px-2 py-0.5 text-xs font-medium border", // Base styles for button to look like badge
                    status === "reviewed"
                      ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                      : "border-yellow-500 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  )}
                >
                  {status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {REPORT_STATUS_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    disabled={status === option} // Disable selecting the current status
                    onClick={() => handleStatusChange(report.id, option)}
                    className="capitalize"
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        // Fallback for individual reports if user cannot change status
        return (
          <Badge
            variant="outline"
            className={cn(
              status === "reviewed"
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-yellow-500 bg-yellow-50 text-yellow-700"
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button variant="ghost" size="sm" asChild>
            <Link href={row.original.type === "batch" ? `/reports/batch/${row.original.id}` : `/reports/${row.original.id}`}>
              View
            </Link>
          </Button>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Manage your flight training reports</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Report
        </Button>
      </div>

      <DataTable<DisplayReport, unknown>
        columns={columns}
        data={displayedReports}
        isLoading={isLoading}
        searchPlaceholder="Search reports..."
        searchColumn="title"
        enableRowSelection
        onDelete={handleDelete as (selectedRows: any[]) => void}
        onGenerateSummary={handleGenerateSummary as (selectedRows: any[]) => void}
        onMergeIntoSummary={handleMergeIntoSummary as (selectedRows: any[]) => void}
      />

      <ReportUploadForm open={uploadOpen} onOpenChange={setUploadOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {reportsToDelete.length} report{reportsToDelete.length !== 1 ? 's' : ''}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
