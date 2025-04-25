"use client"

import { useState, useEffect } from "react"

export type Deficiency = {
  id: string
  acsCode: string
  knowledgeArea: string
  description: string
  reviewed: boolean
  details?: {
    id: string;
    description: string;
    area: string;
    task: string;
    subTask: string;
    knowledge: string;
    examType: string;
  } | null;
}

// Define type for individual notes
export type InstructorNote = {
  id: string;
  author: string;
  timestamp: string; // ISO string format recommended
  content: string;
};

export type ReportData = {
  id: string
  title: string
  studentName: string
  studentId: string
  examDate: string
  score: number
  passingScore: number
  totalQuestions: number
  missedQuestions: number
  deficiencies: Deficiency[]
  instructorNotes: InstructorNote[] // Changed to array of InstructorNote
  isLoading: boolean
  examId?: string;
  examSite?: string;
  grade?: "Pass" | "Fail" | string;
  faa_tracking_number?: string;
  expiration_date?: string;
}

// Mock ACS description data (subset for details) - Updated with longer descriptions and stats
const mockAcsDetails = {
  "PA.I.C.K1": {
    id: "PA.I.C.K1",
    description: "Thorough understanding of airspace classes, including specific operating rules, necessary pilot certifications, and mandatory aircraft equipment requirements for operations within Class B airspace boundaries. This involves knowledge of entry procedures, communication protocols, and speed restrictions.",
    area: "Airman Certification", task: "Airspace", subTask: "Class B", knowledge: "Regulations", examType: "PAR"
  },
  "PA.I.C.K2": {
    id: "PA.I.C.K2",
    description: "Identification and operational characteristics of special use airspace, encompassing prohibited areas, restricted zones, warning areas, military operation areas (MOAs), and alert areas. Includes understanding limitations and procedures for flight within or near these zones.",
    area: "Airman Certification", task: "Airspace", subTask: "Special Use", knowledge: "Regulations", examType: "PAR"
  },
  "PA.III.A.K3": {
    id: "PA.III.A.K3",
    description: "Detailed knowledge of runway markings (centerlines, thresholds, aiming points, touchdown zones), taxiway markings, airport signs (mandatory instruction, location, direction, destination, information, runway distance remaining), and airport lighting systems (runway edge lights, taxiway lights, beacons, PAPI/VASI). (Stat: Often confused, missed by ~35% of applicants)",
    area: "Airports, Air Traffic Control, and Airspace", task: "Airport Operations", subTask: "Markings/Signs/Lighting", knowledge: "Operations", examType: "PAR"
  },
  "PA.IV.B.K1": {
    id: "PA.IV.B.K1",
    description: "Ability to obtain and interpret various sources of weather data crucial for flight planning purposes, including METARs, TAFs, PIREPs, Surface Analysis Charts, Weather Depiction Charts, Radar Summary Charts, and Winds and Temperatures Aloft forecasts.",
    area: "Aviation Weather", task: "Weather Information", subTask: "Sources", knowledge: "Meteorology", examType: "PAR"
  },
  "PA.V.C.K1": {
    id: "PA.V.C.K1",
    description: "Comprehension of factors significantly affecting aircraft performance, such as atmospheric conditions (density altitude, temperature, humidity), airport elevation, runway conditions (slope, surface contamination), and the aircraft's gross weight and center of gravity.",
    area: "Aircraft Performance", task: "Factors", subTask: "General", knowledge: "Performance", examType: "PAR"
  },
  "PA.VI.A.K2": {
    id: "PA.VI.A.K2",
    description: "Understanding the critical effects of weight distribution and balance (Center of Gravity) on aircraft performance characteristics, stability, and controllability throughout various phases of flight.",
    area: "Aircraft Systems", task: "Weight and Balance", subTask: "Effects", knowledge: "Performance", examType: "PAR"
  },
  "PA.VIII.D.K1": {
    id: "PA.VIII.D.K1",
    description: "Proficiency in utilizing emergency procedures and associated checklists for various potential scenarios, including engine failure, fires, system malfunctions, and loss of control. (Stat: Critical knowledge area, consistently tested)",
    area: "Emergency Operations", task: "Procedures", subTask: "General", knowledge: "Operations", examType: "PAR"
  },
  "PA.IX.A.K2": {
    id: "PA.IX.A.K2",
    description: "Application of risk management principles and understanding the key factors influencing aeronautical decision-making (ADM), such as the PAVE checklist (Pilot, Aircraft, enVironment, External pressures) and the DECIDE model.",
    area: "Aeromedical Factors", task: "Aeronautical Decision Making (ADM)", subTask: "Risk Management", knowledge: "Human Factors", examType: "PAR"
  },
  "PA.X.A.K1": {
    id: "PA.X.A.K1",
    description: "Knowledge of physiological aspects specific to night flying, particularly the human eye\'s adaptation process to darkness, night vision limitations, illusions, and techniques for effective scanning. (Stat: Frequently missed on oral exams)",
    area: "Night Operations", task: "Physiology", subTask: "Vision", knowledge: "Aeromedical", examType: "PAR"
  },
  "PA.XI.A.K1": {
    id: "PA.XI.A.K1",
    description: "Procedures related to aircraft security after flight completion and maintaining required documentation, including logbooks and aircraft records.",
    area: "Cross-Country Flight Planning", task: "Postflight Procedures", subTask: "Security/Docs", knowledge: "Operations", examType: "PAR"
  },
  "PA.I.H.K1": {
    id: "PA.I.H.K1",
    description: "Understanding the principles and operation of ground-based navigation systems (VOR, DME, ILS) and satellite-based navigation systems (GPS), including their limitations and usage in the National Airspace System.",
    area: "Navigation", task: "Systems", subTask: "VOR/GPS", knowledge: "Navigation", examType: "PAR"
  }
};

export function useReportMock(reportId?: string): ReportData {
  const [data, setData] = useState<ReportData>({
    id: "",
    title: "",
    studentName: "",
    studentId: "",
    examDate: "",
    score: 0,
    passingScore: 0,
    totalQuestions: 0,
    missedQuestions: 0,
    deficiencies: [],
    instructorNotes: [], // Initialize as empty array
    isLoading: true,
    examId: undefined,
    examSite: undefined,
    grade: undefined,
    faa_tracking_number: undefined,
    expiration_date: undefined
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      // Add details to deficiencies
      const deficienciesWithDetails: Deficiency[] = [
        {
          id: "1",
          acsCode: "PA.I.C.K1",
          knowledgeArea: "Airspace",
          description: "Airspace classes... Class B airspace", // Original shorter description is fine here for the Deficiency type itself
          reviewed: false,
          details: mockAcsDetails["PA.I.C.K1"] // Link to the full details
        },
        {
          id: "2",
          acsCode: "PA.I.C.K2",
          knowledgeArea: "Airspace",
          description: "Special use airspace...",
          reviewed: true,
          details: mockAcsDetails["PA.I.C.K2"]
        },
        {
          id: "3",
          acsCode: "PA.III.A.K3",
          knowledgeArea: "Airport Operations",
          description: "Runway markings, signs, and lighting",
          reviewed: false,
          details: mockAcsDetails["PA.III.A.K3"]
        },
        {
          id: "4",
          acsCode: "PA.IV.B.K1",
          knowledgeArea: "Weather Information",
          description: "Sources of weather data for flight planning purposes",
          reviewed: false,
          details: mockAcsDetails["PA.IV.B.K1"]
        },
        {
          id: "5",
          acsCode: "PA.V.C.K1",
          knowledgeArea: "Performance and Limitations",
          description: "Factors affecting performance, including atmospheric conditions, airport or runway conditions, and aircraft weight",
          reviewed: false,
          details: mockAcsDetails["PA.V.C.K1"]
        },
        {
          id: "6",
          acsCode: "PA.VI.A.K2",
          knowledgeArea: "Weight and Balance",
          description: "Effects of weight and balance on aircraft performance",
          reviewed: true,
          details: mockAcsDetails["PA.VI.A.K2"]
        },
        {
          id: "7",
          acsCode: "PA.VIII.D.K1",
          knowledgeArea: "Emergency Operations",
          description: "Emergency procedures and checklists",
          reviewed: false,
          details: mockAcsDetails["PA.VIII.D.K1"]
        },
        {
          id: "8",
          acsCode: "PA.IX.A.K2",
          knowledgeArea: "Aeronautical Decision-Making",
          description: "Risk management and the factors affecting decision-making",
          reviewed: false,
          details: mockAcsDetails["PA.IX.A.K2"]
        },
        {
          id: "9",
          acsCode: "PA.X.A.K1",
          knowledgeArea: "Night Operations",
          description: "Physiological aspects of night flying including the human eye's adaptation to darkness",
          reviewed: false,
          details: mockAcsDetails["PA.X.A.K1"]
        },
        {
          id: "10",
          acsCode: "PA.XI.A.K1",
          knowledgeArea: "Postflight Procedures",
          description: "Aircraft security and documentation",
          reviewed: false,
          details: mockAcsDetails["PA.XI.A.K1"]
        },
        {
          id: "11",
          acsCode: "PA.I.H.K1",
          knowledgeArea: "Navigation Systems",
          description: "Ground-based navigation (VOR, DME, ILS) and satellite-based navigation (GPS) systems",
          reviewed: false,
          details: mockAcsDetails["PA.I.H.K1"]
        },
      ];

      // Mock instructor notes array
      const mockNotes: InstructorNote[] = [
        {
          id: "note-1",
          author: "Jane Instructor",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          content: "Alex shows good understanding of most concepts but needs additional work on airspace classifications (PA.I.C.K1, PA.I.C.K2) and weather interpretation (PA.IV.B.K1). Recommend focused study on these areas before scheduling the checkride."
        },
        {
          id: "note-2",
          author: "Jane Instructor",
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
          content: "Discussed airspace today, much better grasp. We'll review weather next session."
        }
      ];

      const mockReport: ReportData = {
        id: reportId || "mock-123",
        title: "Private Pilot - Airplane (PAR)",
        studentName: "Alex Johnson",
        studentId: "stu-alexj",
        examDate: "2025-04-15",
        score: 82,
        passingScore: 70,
        totalQuestions: 60,
        missedQuestions: deficienciesWithDetails.length,
        deficiencies: deficienciesWithDetails,
        instructorNotes: mockNotes, // Use mock notes array
        isLoading: false,
        examId: "EXAM98765",
        examSite: "SITE001",
        grade: "Pass",
        faa_tracking_number: "FTN54321",
        expiration_date: "2027-04-30"
      }

      setData(mockReport)
    }, 1000)

    return () => clearTimeout(timer)
  }, [reportId])

  return data
}
