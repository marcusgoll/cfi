"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { FileText, Video, HelpCircle, GraduationCap, Save, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useLessonMock } from "@/lib/hooks/use-lesson-mock"
import { useToast } from "@/components/ui/use-toast"

export default function LessonPage() {
  const params = useParams()
  const lessonId = params.lessonId as string
  const { toast } = useToast()
  const lesson = useLessonMock(lessonId)
  const [notes, setNotes] = useState(lesson.instructorNotes)
  const [status, setStatus] = useState<"draft" | "published">(lesson.status)
  const [currentStep, setCurrentStep] = useState<"identify" | "explain" | "quiz" | "assign">(lesson.currentStep)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update state when lesson data loads
  useEffect(() => {
    if (!lesson.isLoading) {
      setNotes(lesson.instructorNotes)
      setStatus(lesson.status)
      setCurrentStep(lesson.currentStep)
    }
  }, [lesson.isLoading, lesson.instructorNotes, lesson.status, lesson.currentStep])

  const handleSaveNotes = () => {
    lesson.updateNotes(notes)
    toast({
      title: "Notes saved",
      description: "Your instructor notes have been saved successfully.",
    })
  }

  const handleStatusChange = (checked: boolean) => {
    const newStatus = checked ? "published" : "draft"
    setStatus(newStatus)
    lesson.updateStatus(newStatus)
    toast({
      title: `Lesson ${newStatus}`,
      description: `The lesson has been ${newStatus}.`,
    })
  }

  const handleStepChange = (step: "identify" | "explain" | "quiz" | "assign") => {
    setCurrentStep(step)
    lesson.updateStep(step)
  }

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your lesson draft has been saved successfully.",
    })
  }

  const handlePublish = () => {
    setStatus("published")
    lesson.updateStatus("published")
    toast({
      title: "Lesson published",
      description: "Your lesson has been published successfully.",
    })
  }

  if (!mounted) return null

  if (lesson.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-64 animate-pulse rounded-md bg-neutral-100" />
        <div className="mt-8 h-96 animate-pulse rounded-md bg-neutral-100" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <Badge variant={status === "published" ? "default" : "outline"}>
              {status === "published" ? "Published" : "Draft"}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {lesson.studentName}
            </Badge>
            <Badge variant="outline" className="font-mono">
              {lesson.acsCode}
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div
            className={`flex cursor-pointer flex-col items-center ${
              currentStep === "identify" ? "text-primary" : "text-neutral-500"
            }`}
            onClick={() => handleStepChange("identify")}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentStep === "identify" ? "bg-primary text-white" : "border border-neutral-300 bg-white"
              }`}
            >
              <FileText className="h-5 w-5" />
            </div>
            <span className="mt-2 text-sm">Identify</span>
          </div>
          <div className="relative flex-1">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-neutral-200" />
          </div>
          <div
            className={`flex cursor-pointer flex-col items-center ${
              currentStep === "explain" ? "text-primary" : "text-neutral-500"
            }`}
            onClick={() => handleStepChange("explain")}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentStep === "explain" ? "bg-primary text-white" : "border border-neutral-300 bg-white"
              }`}
            >
              <Video className="h-5 w-5" />
            </div>
            <span className="mt-2 text-sm">Explain</span>
          </div>
          <div className="relative flex-1">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-neutral-200" />
          </div>
          <div
            className={`flex cursor-pointer flex-col items-center ${
              currentStep === "quiz" ? "text-primary" : "text-neutral-500"
            }`}
            onClick={() => handleStepChange("quiz")}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentStep === "quiz" ? "bg-primary text-white" : "border border-neutral-300 bg-white"
              }`}
            >
              <HelpCircle className="h-5 w-5" />
            </div>
            <span className="mt-2 text-sm">Quiz</span>
          </div>
          <div className="relative flex-1">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-neutral-200" />
          </div>
          <div
            className={`flex cursor-pointer flex-col items-center ${
              currentStep === "assign" ? "text-primary" : "text-neutral-500"
            }`}
            onClick={() => handleStepChange("assign")}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentStep === "assign" ? "bg-primary text-white" : "border border-neutral-300 bg-white"
              }`}
            >
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="mt-2 text-sm">Assign</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-4">
        <div className="xl:col-span-3">
          {/* Content based on current step */}
          {currentStep === "identify" && (
            <Card>
              <CardHeader>
                <CardTitle>ACS Code & Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-neutral-50 p-4">
                  <div className="font-mono font-medium">{lesson.acsCode}</div>
                  <p className="mt-2 text-neutral-600">{lesson.acsDescription}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "explain" && (
            <Card>
              <CardHeader>
                <CardTitle>Explanation & Video</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md bg-neutral-50 p-4">
                  <p className="whitespace-pre-line">{lesson.explanation}</p>
                </div>

                {lesson.videoUrl && (
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <iframe
                      width="100%"
                      height="100%"
                      src={lesson.videoUrl}
                      title="Video explanation"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === "quiz" && (
            <Card>
              <CardHeader>
                <CardTitle>Practice Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {lesson.quizQuestions.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <h3 className="font-medium">
                        {index + 1}. {question.question}
                      </h3>
                      <RadioGroup
                        value={selectedAnswers[question.id] || ""}
                        onValueChange={(value) => {
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [question.id]: value,
                          }))
                        }}
                      >
                        {question.options.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                            <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}

                  <Button className="mt-4">Submit Answers</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "assign" && (
            <Card>
              <CardHeader>
                <CardTitle>Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Assign this lesson to your student to complete their training on this topic.</p>

                  <div className="rounded-md bg-neutral-50 p-4">
                    <h3 className="font-medium">Assignment Details</h3>
                    <p className="mt-2 text-neutral-600">
                      The student will need to review the explanation, watch the video, and complete the quiz with a
                      score of at least 80%.
                    </p>
                  </div>

                  <Button>Assign to Student</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6 xl:block">
          <Card>
            <CardHeader>
              <CardTitle>Instructor Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes about this lesson..."
                className="min-h-[150px] resize-none"
              />
              <Button onClick={handleSaveNotes} className="w-full">
                Save Notes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publish Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="publish-toggle">Published</Label>
                <Switch id="publish-toggle" checked={status === "published"} onCheckedChange={handleStatusChange} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-md">
        <div className="mx-auto flex max-w-7xl justify-end gap-4">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handlePublish}>
            <Send className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}
