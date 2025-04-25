"use client"

import { useState, useEffect } from "react"

export type LessonStep = "identify" | "explain" | "quiz" | "assign"

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctAnswer: string
}

export type Lesson = {
  id: string
  title: string
  studentId: string
  studentName: string
  status: "draft" | "published"
  acsCode: string
  acsDescription: string
  explanation: string
  videoUrl?: string
  quizQuestions: QuizQuestion[]
  instructorNotes: string
  currentStep: LessonStep
  isLoading: boolean
}

export function useLessonMock(lessonId?: string): Lesson & {
  updateNotes: (notes: string) => void
  updateStatus: (status: "draft" | "published") => void
  updateStep: (step: LessonStep) => void
} {
  const [lesson, setLesson] = useState<Lesson>({
    id: "",
    title: "",
    studentId: "",
    studentName: "",
    status: "draft",
    acsCode: "",
    acsDescription: "",
    explanation: "",
    quizQuestions: [],
    instructorNotes: "",
    currentStep: "identify",
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const mockLesson: Lesson = {
        id: lessonId || "1",
        title: "Understanding Airspace Classes and Requirements",
        studentId: "1",
        studentName: "Alex Johnson",
        status: "draft",
        acsCode: "PA.I.C.K1",
        acsDescription:
          "Airspace classes, operating rules, pilot certification, and aircraft equipment requirements for operating in Class B airspace",
        explanation:
          "Class B airspace is the controlled airspace surrounding the nation's busiest airports. It's designed like an upside-down wedding cake with multiple layers of varying dimensions. To operate in Class B airspace, pilots must have explicit ATC clearance, and aircraft must be equipped with a two-way radio, an operable radar transponder with automatic altitude reporting capability, and ADS-B Out equipment.\n\nPilots must also have at least a private pilot certificate or be a student pilot who has received specific training and logbook endorsements from an authorized instructor for the Class B airspace they wish to fly in.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        quizQuestions: [
          {
            id: "1",
            question: "What equipment is required for operating in Class B airspace?",
            options: [
              "Two-way radio only",
              "Two-way radio and transponder",
              "Two-way radio, transponder with Mode C, and ADS-B Out",
              "No special equipment is required",
            ],
            correctAnswer: "Two-way radio, transponder with Mode C, and ADS-B Out",
          },
          {
            id: "2",
            question: "What is required for a student pilot to operate in Class B airspace?",
            options: [
              "Nothing special, all pilots can operate in Class B",
              "A private pilot certificate",
              "Specific training and logbook endorsements from an authorized instructor",
              "A commercial pilot certificate",
            ],
            correctAnswer: "Specific training and logbook endorsements from an authorized instructor",
          },
          {
            id: "3",
            question: "What is the shape of Class B airspace often compared to?",
            options: ["A cylinder", "An upside-down wedding cake", "A dome", "A rectangle"],
            correctAnswer: "An upside-down wedding cake",
          },
        ],
        instructorNotes:
          "Alex has been struggling with airspace classifications. Focus on the differences between Class B and Class C airspace during the next lesson.",
        currentStep: "identify",
        isLoading: false,
      }

      setLesson(mockLesson)
    }, 1000)

    return () => clearTimeout(timer)
  }, [lessonId])

  const updateNotes = (notes: string) => {
    setLesson((prev) => ({
      ...prev,
      instructorNotes: notes,
    }))
  }

  const updateStatus = (status: "draft" | "published") => {
    setLesson((prev) => ({
      ...prev,
      status,
    }))
  }

  const updateStep = (step: LessonStep) => {
    setLesson((prev) => ({
      ...prev,
      currentStep: step,
    }))
  }

  return {
    ...lesson,
    updateNotes,
    updateStatus,
    updateStep,
  }
}
