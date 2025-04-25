"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import {
  ArrowLeft,
  ArrowUpDown,
  BarChart3,
  Edit,
  FileText,
  GraduationCap,
  LibraryBig,
  Pencil,
  Trash2,
  User,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStudentDetailsMock, type Student } from "@/lib/hooks/use-students-mock"
import { useReportsMock, type Report } from "@/lib/hooks/use-reports-mock"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Type for mock documents
type MockDocument = {
  id: string
  name: string
  uploaded: string
}

// Local type combining Student base + additional profile fields
type ProfileData = Student & {
  certificateGoal?: string
  phone?: string
  dob?: string // Store as string (YYYY-MM-DD) for input compatibility
  address?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
};

// Type for Weak Area Frequency
type WeakAreaFrequency = {
  name: string
  count: number
}

// Placeholder for file upload component (modified)
const FileUploadPlaceholder = ({ onUploadClick }: { onUploadClick: () => void }) => (
  <div className="mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted p-6 text-center">
    <p className="text-sm text-muted-foreground">Upload Required FAA Documents</p>
    <Button size="sm" variant="outline" className="mt-2" onClick={onUploadClick}>
      Upload Document
    </Button>
  </div>
)

export default function StudentProfilePage() {
  const params = useParams()
  const studentId = params.id as string
  const { student: initialStudent, isLoading } = useStudentDetailsMock(studentId)
  const [studentData, setStudentData] = useState<ProfileData | null>(null)
  const { reports, isLoading: reportsLoading } = useReportsMock(studentId)
  const [activeTab, setActiveTab] = useState("reports")

  // State for Edit Profile Dialog
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null)

  // State for Edit Status Dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<"active" | "inactive">("inactive")

  // Mock FAA Documents (moved to state)
  const [documents, setDocuments] = useState<MockDocument[]>([
    { id: "doc1", name: "Medical_Certificate_Exp_12-2024.pdf", uploaded: "2023-10-26" },
    { id: "doc2", name: "Student_Pilot_License.pdf", uploaded: "2023-09-15" },
    { id: "doc3", name: "TSA_Approval.png", uploaded: "2023-09-10" },
  ])

  // State for Document Edit Dialog
  const [docEditDialogOpen, setDocEditDialogOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<MockDocument | null>(null)
  const [newDocName, setNewDocName] = useState("")

  // Ref for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for Profile Inline Edit Mode
  const [isEditing, setIsEditing] = useState(false)

  // Update local state when initial data loads
  useEffect(() => {
    if (initialStudent) {
      // Ensure studentData and editedProfile conform to ProfileData
      const profile: ProfileData = {
        ...initialStudent,
        // Initialize potentially missing fields directly
        certificateGoal: "",
        phone: "",
        dob: "", // Expecting YYYY-MM-DD string
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
      };
      setStudentData(profile);
      setEditedProfile(profile);
      setSelectedStatus(initialStudent.status);
    }
  }, [initialStudent]);

  // Mock Performance Data for Chart
  // const mockPerformanceData = [...];

  // Mock Weak Area Frequency Data for Bar Chart
  // const mockWeakAreaData = [...];

  // Mock Assignments Data
  // const mockAssignments = [...];

  if (isLoading || !studentData || !editedProfile) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="grid grid-cols-1 gap-6">
          <div className="h-24 animate-pulse rounded-md bg-muted" />
          <div className="h-48 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-96 animate-pulse rounded-md bg-muted" />
      </div>
    )
  }

  // Handle Profile Save (Mock)
  const handleProfileSave = () => {
    setStudentData(editedProfile) // Update main state
    setIsEditing(false) // Close edit mode
    setProfileDialogOpen(false) // Close dialog if it were still used (harmless here)
    // TODO: Add API call to save profile
    console.log("Profile saved (mock):", editedProfile)
  }

  // Handle Profile Edit Cancel
  const handleCancelEdit = () => {
    setEditedProfile(studentData) // Reset edited state to original data
    setIsEditing(false)
  }

  // Handle Status Save (Mock)
  const handleStatusSave = () => {
    if (studentData) {
      const updatedStudent = { ...studentData, status: selectedStatus };
      setStudentData(updatedStudent) // Update main state
      setEditedProfile(updatedStudent) // Keep edit form in sync
      setStatusDialogOpen(false)
      // TODO: Add API call to save status
      console.log("Status saved (mock):", selectedStatus)
    }
  }

  // --- Document Handling Functions ---

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newDoc: MockDocument = {
        id: `doc${Date.now()}`,
        name: file.name,
        uploaded: new Date().toISOString().split("T")[0], // Today's date
      }
      setDocuments((prevDocs) => [newDoc, ...prevDocs])
      console.log("File uploaded (mock):", file.name)
      // Reset file input value to allow uploading the same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      // TODO: Add actual file upload API call here
    }
  }

  const handleDocumentView = (doc: MockDocument) => {
    console.log("Viewing document (mock):", doc.name)
    // In a real app, this might open a new tab or a preview modal
    alert(`Mock view: ${doc.name}`)
  }

  const openEditDialog = (doc: MockDocument) => {
    setEditingDoc(doc)
    setNewDocName(doc.name)
    setDocEditDialogOpen(true)
  }

  const handleDocumentEditSave = () => {
    if (editingDoc && newDocName.trim()) {
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === editingDoc.id ? { ...doc, name: newDocName.trim() } : doc
        )
      )
      setDocEditDialogOpen(false)
      setEditingDoc(null)
      console.log(`Document renamed (mock) to: ${newDocName.trim()}`)
      // TODO: Add API call to rename document
    }
  }

  const handleDocumentDelete = (docId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== docId))
      console.log("Document deleted (mock):", docId)
      // TODO: Add API call to delete document
    }
  }

  // --- End Document Handling ---

  const reportColumns: ColumnDef<Report>[] = [
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
            <span>{row.original.title}</span>
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
        const score = row.original.score
        return (
          <Badge
            variant="outline"
            className={`${score >= 90
              ? "border-green-500 bg-green-50 text-green-700"
              : score >= 80
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : score >= 70
                  ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                  : "border-red-500 bg-red-50 text-red-700"
              }`}
          >
            {score}%
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant="outline"
            className={`${status === "reviewed"
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-yellow-500 bg-yellow-50 text-yellow-700"
              }`}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: () => {
        return (
          <Button variant="ghost" size="sm">
            View
          </Button>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" size="sm" onClick={() => window.history.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={studentData.avatar || "/placeholder.svg"} alt={studentData.name} />
            <AvatarFallback>{studentData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{studentData.name}</h1>
            <p className="text-muted-foreground">{studentData.email}</p>
          </div>
          <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
            <DialogTrigger asChild>
              <Badge
                variant="outline"
                className={`ml-auto cursor-pointer ${studentData.status === "active"
                  ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                  : "border-neutral-500 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                  }`}
              >
                {studentData.status}
              </Badge>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Status</DialogTitle>
                <DialogDescription>
                  Update the student's current status.
                </DialogDescription>
              </DialogHeader>
              <RadioGroup
                value={selectedStatus}
                onValueChange={(value: "active" | "inactive") => setSelectedStatus(value)}
                className="grid gap-4 py-4"
              >
                <Label htmlFor="status-active" className="flex items-center space-x-2 rounded-md border p-3 [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="active" id="status-active" />
                  <span>Active</span>
                </Label>
                <Label htmlFor="status-inactive" className="flex items-center space-x-2 rounded-md border p-3 [&:has([data-state=checked])]:border-primary">
                  <RadioGroupItem value="inactive" id="status-inactive" />
                  <span>Inactive</span>
                </Label>
              </RadioGroup>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusSave}>Save Status</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Student Profile</CardTitle>
              <CardDescription>Detailed student information</CardDescription>
            </div>
            <div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleProfileSave}>
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent key={isEditing ? 'editing' : 'viewing'} className="grid grid-cols-1 gap-x-6 gap-y-4 pt-0 text-sm md:grid-cols-2">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Joined</Label>
              <p className="font-medium">
                {new Date(studentData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label htmlFor="profile-name" className="text-xs font-medium text-muted-foreground">Name</Label>
              {isEditing ? (
                <Input
                  id="profile-name"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, name: e.target.value })}
                  className="h-8"
                />
              ) : (
                <p className="font-medium">{studentData.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="profile-email" className="text-xs font-medium text-muted-foreground">Email</Label>
              {isEditing ? (
                <Input
                  id="profile-email"
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, email: e.target.value })}
                  className="h-8"
                />
              ) : (
                <p className="font-medium">{studentData.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="profile-goal" className="text-xs font-medium text-muted-foreground">Certificate Goal</Label>
              {isEditing ? (
                <Input
                  id="profile-goal"
                  value={editedProfile.certificateGoal || ""}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, certificateGoal: e.target.value })}
                  placeholder="e.g., Private Pilot"
                  className="h-8"
                />
              ) : (
                <p className="font-medium">{studentData.certificateGoal || "Private Pilot"}</p>
              )}
            </div>
            <div>
              <Label htmlFor="profile-phone" className="text-xs font-medium text-muted-foreground">Phone</Label>
              {isEditing ? (
                <Input
                  id="profile-phone"
                  value={editedProfile.phone || ""}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="h-8"
                />
              ) : (
                <p className="font-medium">{studentData.phone || "(555) 123-4567"}</p>
              )}
            </div>
            <div>
              <Label htmlFor="profile-dob" className="text-xs font-medium text-muted-foreground">DOB</Label>
              {isEditing ? (
                <Input
                  id="profile-dob"
                  type="date"
                  value={editedProfile.dob || ""}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, dob: e.target.value })}
                  className="h-8"
                />
              ) : (
                <p className="font-medium">{studentData.dob ? new Date(studentData.dob + 'T00:00:00').toLocaleDateString() : "05/15/1998"}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="profile-address" className="text-xs font-medium text-muted-foreground">Address</Label>
              {isEditing ? (
                <Input
                  id="profile-address"
                  value={editedProfile.address || ""}
                  onChange={(e) => setEditedProfile({ ...editedProfile!, address: e.target.value })}
                  placeholder="123 Aviation Way, Flightsville, FL 12345"
                  className="h-8"
                />
              ) : (
                <p className="font-medium">{studentData.address || "123 Aviation Way, Flightsville, FL 12345"}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="profile-emergency-name" className="text-xs font-medium text-muted-foreground">Emergency Contact</Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    id="profile-emergency-name"
                    placeholder="Name"
                    value={editedProfile.emergencyContactName || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile!, emergencyContactName: e.target.value })}
                    className="h-8 flex-1"
                  />
                  <Input
                    id="profile-emergency-phone"
                    placeholder="Phone"
                    value={editedProfile.emergencyContactPhone || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile!, emergencyContactPhone: e.target.value })}
                    className="h-8 flex-1"
                  />
                </div>
              ) : (
                <p className="font-medium">
                  {studentData.emergencyContactName || "Pat Doe"} (
                  {studentData.emergencyContactPhone || "(555) 987-6543"})
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex">
              <TabsTrigger value="reports" className="flex-1 flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex-1 flex items-center justify-center gap-2">
                <LibraryBig className="h-4 w-4" />
                FAA Documents
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reports" className="mt-6">
              <DataTable
                columns={reportColumns}
                data={reports}
                isLoading={reportsLoading}
                searchPlaceholder="Search reports..."
                searchColumn="title"
              />
            </TabsContent>
            <TabsContent value="documents" className="mt-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: "none" }}
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <FileUploadPlaceholder onUploadClick={triggerFileUpload} />
              <h3 className="mb-2 text-lg font-medium">Uploaded Documents</h3>
              {documents.length > 0 ? (
                <ul className="space-y-2">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between rounded-md border bg-background p-3 text-sm shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Uploaded: {new Date(doc.uploaded).toLocaleDateString()}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDocumentView(doc)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(doc)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDocumentDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={docEditDialogOpen} onOpenChange={setDocEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Document</DialogTitle>
            <DialogDescription>
              Enter a new name for the document: {editingDoc?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="docName" className="sr-only">
              New Name
            </Label>
            <Input
              id="docName"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              placeholder="Enter new file name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDocumentEditSave} disabled={!newDocName.trim()}>Save Name</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
