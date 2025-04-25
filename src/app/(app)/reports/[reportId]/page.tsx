"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, FileText, Percent, AlertTriangle, UserCheck, Download, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { NotesPanel } from "@/components/Reports/NotesPanel"
import { useReportMock, type Deficiency, type InstructorNote } from "@/lib/hooks/use-report-mock"
import { format, formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock User Role - Replace with actual logic later
const MOCK_USER_ROLE: "Student" | "Instructor" | "Admin" | "SuperAdmin" = "Instructor";
const MOCK_CURRENT_USER_NAME = "Jane Instructor"; // Mock current user

// Helper function to find the toughest area(s)
const findToughestAreas = (deficiencies: Deficiency[]): string[] => {
  if (!deficiencies || deficiencies.length === 0) return ["N/A"];

  const areaCounts: Record<string, number> = {};
  deficiencies.forEach(def => {
    const area = def.details?.area || "Unknown Area";
    areaCounts[area] = (areaCounts[area] || 0) + 1;
  });

  let maxCount = 0;
  for (const area in areaCounts) {
    if (areaCounts[area] > maxCount) {
      maxCount = areaCounts[area];
    }
  }

  if (maxCount === 0) return ["N/A"]; // Should not happen if deficiencies exist, but safeguard

  const toughest = Object.entries(areaCounts)
    .filter(([_, count]) => count === maxCount)
    .map(([area, _]) => area);

  return toughest;
};

// Helper to extract stats from description
const extractStat = (description: string): { mainDesc: string; stat: string | null } => {
  const match = description.match(/\s*\(Stat:[^)]+\)\s*$/);
  if (match) {
    const stat = match[0].trim();
    const mainDesc = description.replace(match[0], "").trim();
    return { mainDesc, stat };
  }
  return { mainDesc: description, stat: null };
};

export default function ReportDetailPage() {
  const params = useParams()
  const reportId = params.reportId as string
  const reportData = useReportMock(reportId)
  const [deficiencies, setDeficiencies] = useState<Deficiency[]>(reportData.deficiencies)
  const [instructorNotes, setInstructorNotes] = useState<InstructorNote[]>(reportData.instructorNotes)
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update state when data loads
  useEffect(() => {
    if (!reportData.isLoading) {
      setDeficiencies(reportData.deficiencies)
      setInstructorNotes(reportData.instructorNotes)
    }
  }, [reportData.isLoading, reportData.deficiencies, reportData.instructorNotes])

  const handleAddNote = (content: string) => {
    const newNote: InstructorNote = {
      id: `note-${Date.now()}`, // Simple unique ID for mock
      author: MOCK_CURRENT_USER_NAME,
      timestamp: new Date().toISOString(),
      content: content,
    };
    // TODO: Add API call to actually save the new note
    console.log("Adding note (mock):", newNote)
    setInstructorNotes((prevNotes) => [...prevNotes, newNote]);
  }

  if (!mounted) return null

  if (reportData.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-64 animate-pulse rounded-md bg-neutral-100" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="h-32 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-32 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-32 animate-pulse rounded-md bg-neutral-100" />
        </div>
        <div className="mt-8 h-96 animate-pulse rounded-md bg-neutral-100" />
      </div>
    )
  }

  // Format dates if they exist
  const formattedExamDate = reportData.examDate ? format(new Date(reportData.examDate), "MMM d, yyyy") : "N/A"
  const formattedExpirationDate = reportData.expiration_date ? format(new Date(reportData.expiration_date), "MMM d, yyyy") : "N/A"
  const toughestAreas = findToughestAreas(deficiencies)

  // Determine if NotesPanel should be shown (now includes checking if editable for input)
  const canEditNotes = ["Instructor", "Admin", "SuperAdmin"].includes(MOCK_USER_ROLE);
  // Show notes section if user can edit OR if there are notes already
  const showNotesSection = canEditNotes || instructorNotes.length > 0;

  // Mock handlers for new buttons
  const handleDownloadReport = () => {
    console.log("Download Report clicked for report:", reportId);
    // TODO: Implement actual download logic
  };

  const handleShareReport = () => {
    console.log("Share Report clicked for report:", reportId);
    // TODO: Implement actual sharing logic (e.g., open email client, show modal)
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header - Removed Generate Endorsement Button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2 mb-2" asChild>
            <Link href="/reports">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mb-1">{reportData.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
            <span>Student: <strong className="text-neutral-800">{reportData.studentName}</strong></span>
            {reportData.examId && <span>Exam ID: <strong className="text-neutral-800">{reportData.examId}</strong></span>}
            {reportData.faa_tracking_number && <span>FTN: <strong className="text-neutral-800">{reportData.faa_tracking_number}</strong></span>}
          </div>
        </div>

        {/* Action Buttons Container - Only Download/Share remain */}
        {canEditNotes && (
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 pt-1">
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handleShareReport}>
              <Send className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
        {/* Date Card - Add Expiration */}
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Date Taken / Expires</h3>
              <p className="text-lg font-semibold">{formattedExamDate}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Expires: {formattedExpirationDate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Score Card - Change p tag to div */}
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Percent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Score / Grade</h3>
              <div className="text-lg font-semibold">
                {reportData.score}%{" "}
                <Badge variant={reportData.grade === 'Pass' ? 'default' : 'destructive'} className="ml-1 align-middle">{reportData.grade}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toughest Area Card */}
        <Card className="bg-amber-50 border-amber-200 grid-span-2">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-amber-100 p-3">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-amber-700">Toughest Area(s)</h3>
              <p className="text-lg font-semibold text-amber-900">{toughestAreas.join(", ")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content - Table + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deficiencies Table - Extract and render stat badge */}
        <div className={showNotesSection ? "lg:col-span-2" : "lg:col-span-3"}>
          <h2 className="mb-4 text-xl font-semibold">Deficiencies Details</h2>
          <Card>
            <CardContent className="p-0">
              {deficiencies.length > 0 ? (
                <Table>
                  <TableBody>
                    {deficiencies.map((deficiency) => {
                      // Extract stat here
                      const originalDescription = deficiency.details?.description || deficiency.description || "No description available.";
                      const { mainDesc, stat } = extractStat(originalDescription);

                      return (
                        <TableRow key={deficiency.id} className="align-top hover:bg-muted/50">
                          <TableCell className="p-4 w-[150px] sm:w-[180px] border-r font-mono font-semibold text-sm">
                            {deficiency.acsCode}
                          </TableCell>
                          <TableCell className="p-4 space-y-1.5">
                            <p className="font-medium text-base leading-snug">{mainDesc}</p>
                            {/* Render stat badge if exists */}
                            {stat && (
                              <Badge variant="outline" className="text-xs font-normal text-amber-700 border-amber-300 bg-amber-50 mt-1">
                                {stat.replace("(Stat: ", "").replace(")", "")}
                              </Badge>
                            )}
                            {/* Show only Area and Task details */}
                            {deficiency.details && (
                              <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-neutral-500 pt-1.5">
                                <span><strong>Area:</strong> {deficiency.details.area}</span>
                                <span><strong>Task:</strong> {deficiency.details.task}</span>
                              </div>
                            )}
                            {/* Fallback for knowledgeArea */}
                            {!deficiency.details && deficiency.knowledgeArea && (
                              <p className="text-xs text-neutral-500 pt-1.5"><strong>Knowledge Area:</strong> {deficiency.knowledgeArea}</p>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="p-6 text-center text-neutral-500">No deficiencies recorded for this report.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notes Section (Conditionally Rendered) */}
        {showNotesSection && (
          <div className="lg:col-span-1 space-y-4">
            <NotesPanel
              notes={instructorNotes}
              onAddNote={handleAddNote}
              readOnly={!canEditNotes}
              currentUserName={MOCK_CURRENT_USER_NAME}
            />
            {canEditNotes && (
              <Button className="w-full" size="sm" disabled>
                <FileText className="mr-2 h-4 w-4" />
                Generate Endorsement
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
