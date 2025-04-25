"use client"

import { useState, useEffect, useRef } from "react"
import { FileText, ListChecks, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExtractorDropzone } from "@/components/Extractor/ExtractorForm"
import { AcsCodeLookup } from "@/components/AcsCodeLookup/AcsCodeLookup"
import { useRouter } from "next/navigation"

// Moved from AcsCodeLookup and expanded
const mockAcsDescriptions = {
  "UA.V.E.K1": { id: "UA.V.E.K1", description: "Physiological considerations... dehydration and heatstroke.", area: "Operations", task: "Physiology", subTask: "Dehydration/Heatstroke", knowledge: "Aeromedical", examType: "UAG" },
  "UA.V.E.K2": { id: "UA.V.E.K2", description: "Drug and alcohol use.", area: "Operations", task: "Physiology", subTask: "Drug/Alcohol Effects", knowledge: "Aeromedical", examType: "UAG" },
  "CA.I.A.K2": { id: "CA.I.A.K2", description: "Certification requirements, currency, and experience requirements.", area: "Airman Certification", task: "General", subTask: "Requirements", knowledge: "Regulations", examType: "CAX" },
  "CA.I.B.K1": { id: "CA.I.B.K1", description: "Privileges and limitations of certificates and ratings.", area: "Airman Certification", task: "General", subTask: "Privileges/Limitations", knowledge: "Regulations", examType: "CAX" },
  "CA.I.C.K1": { id: "CA.I.C.K1", description: "Medical certificates: Class, expiration, privileges, temporary disqualifications.", area: "Airman Certification", task: "General", subTask: "Medical Certificates", knowledge: "Regulations", examType: "CAX" },
  "CA.I.E.K1": { id: "CA.I.E.K1", description: "Required documents for pilot and aircraft.", area: "Airman Certification", task: "General", subTask: "Required Documents", knowledge: "Regulations", examType: "CAX" },
  "CA.I.G.K1c": { id: "CA.I.G.K1c", description: "Pilot logbook or flight records.", area: "Airman Certification", task: "General", subTask: "Recordkeeping", knowledge: "Regulations", examType: "CAX" },
  "CA.II.B.R1": { id: "CA.II.B.R1", description: "Calculate weight and balance, CG shifts.", area: "Aircraft Systems", task: "Weight and Balance", subTask: "Calculations", knowledge: "Performance", examType: "CAX" },
  "CA.III.A.K4": { id: "CA.III.A.K4", description: "Airport markings and signs.", area: "Airports, Air Traffic Control, and Airspace", task: "Airport Operations", subTask: "Markings/Signs", knowledge: "Operations", examType: "CAX" },
  "CA.III.A.K5": { id: "CA.III.A.K5", description: "Airport lighting.", area: "Airports, Air Traffic Control, and Airspace", task: "Airport Operations", subTask: "Lighting", knowledge: "Operations", examType: "CAX" },
  "CA.III.B.K3": { id: "CA.III.B.K3", description: "Air traffic control clearances and instructions.", area: "Airports, Air Traffic Control, and Airspace", task: "ATC Communications", subTask: "Clearances/Instructions", knowledge: "Operations", examType: "CAX" },
  "CA.IV.A.K1": { id: "CA.IV.A.K1", description: "Weather theory: atmospheric composition and stability.", area: "Aviation Weather", task: "Weather Theory", subTask: "Atmosphere/Stability", knowledge: "Meteorology", examType: "CAX" },
  "CA.IV.A.K2": { id: "CA.IV.A.K2", description: "Weather theory: temperature, pressure, wind.", area: "Aviation Weather", task: "Weather Theory", subTask: "Temp/Pressure/Wind", knowledge: "Meteorology", examType: "CAX" },
  "CA.IV.B.K1": { id: "CA.IV.B.K1", description: "Weather charts: surface analysis, prognosis.", area: "Aviation Weather", task: "Weather Charts", subTask: "Surface/Prognosis", knowledge: "Meteorology", examType: "CAX" },
  "CA.IV.B.K2": { id: "CA.IV.B.K2", description: "Weather charts: winds and temperatures aloft.", area: "Aviation Weather", task: "Weather Charts", subTask: "Winds/Temps Aloft", knowledge: "Meteorology", examType: "CAX" },
  "CA.IV.E.K1": { id: "CA.IV.E.K1", description: "Weather hazards: thunderstorms, icing, turbulence.", area: "Aviation Weather", task: "Hazards", subTask: "Thunderstorms/Icing/Turbulence", knowledge: "Meteorology", examType: "CAX" },
  "CA.IX.A.K1": { id: "CA.IX.A.K1", description: "Aerodynamics: lift, drag, thrust, weight.", area: "Aerodynamics", task: "Principles of Flight", subTask: "Forces of Flight", knowledge: "Aerodynamics", examType: "CAX" },
  "CA.IX.B.K2b": { id: "CA.IX.B.K2b", description: "Flight controls: ailerons, elevator, rudder.", area: "Aerodynamics", task: "Flight Controls", subTask: "Primary Controls", knowledge: "Aerodynamics", examType: "CAX" },
  "CA.IX.C.K1d": { id: "CA.IX.C.K1d", description: "Maneuvering flight: stalls, spins.", area: "Aerodynamics", task: "Maneuvers", subTask: "Stalls/Spins", knowledge: "Aerodynamics", examType: "CAX" },
  "CA.IX.D.K2": { id: "CA.IX.D.K2", description: "Performance: takeoff, climb, cruise, landing.", area: "Aerodynamics", task: "Performance", subTask: "Flight Phases", knowledge: "Performance", examType: "CAX" },
  "CA.VI.B.K1": { id: "CA.VI.B.K1", description: "Navigation systems: VOR, GPS.", area: "Navigation", task: "Systems", subTask: "VOR/GPS", knowledge: "Navigation", examType: "CAX" },
  "CA.VII.B.K4": { id: "CA.VII.B.K4", description: "Human factors: Aeronautical Decision Making (ADM).", area: "Aeromedical Factors", task: "Human Factors", subTask: "ADM", knowledge: "Human Factors", examType: "CAX" },
  "CA.VII.E.K3": { id: "CA.VII.E.K3", description: "Aeromedical factors: hypoxia, hyperventilation, spatial disorientation.", area: "Aeromedical Factors", task: "Physiology", subTask: "Hypoxia/Hyperventilation/Disorientation", knowledge: "Aeromedical", examType: "CAX" }
};

type AcsDescriptionData = typeof mockAcsDescriptions[keyof typeof mockAcsDescriptions];

// Updated mock data for multi-file analysis result
const mockMultiFileAnalysisResult = {
  files: [
    {
      data: {
        exam: "Commercial Pilot Airplane (CAX)",
        exam_date: "05/09/2023",
        exam_id: "90050920230155511",
        exam_site: "ABS78603",
        expiration_date: "05/31/2025",
        faa_tracking_number: "C1233209",
        grade: "Pass",
        incorrectly_answered_questions: [
          "CA.I.A.K2", "CA.I.B.K1", "CA.I.C.K1", "CA.I.E.K1", "CA.I.G.K1c", "CA.II.B.R1", "CA.III.A.K4", "CA.III.A.K5", "CA.III.B.K3", "CA.IV.A.K1", "CA.IV.A.K2", "CA.IV.B.K1", "CA.IV.B.K2", "CA.IV.E.K1", "CA.IX.A.K1", "CA.IX.B.K2b", "CA.IX.C.K1d", "CA.IX.D.K2", "CA.VI.B.K1", "CA.VII.B.K4", "CA.VII.E.K3"
        ],
        name: "ADRIAN EDUARDO DOMINGUEZ",
        score: "78%"
      },
      extraction_status: "Success",
      file_name: "Dominguez_CAX_Result.pdf"
    },
    {
      data: null,
      extraction_status: "Failed",
      failure_reason: "Could not parse document structure.",
      file_name: "unreadable_scan.jpg"
    }
  ],
  summary: {
    failed_extractions: "1",
    successful_extractions: "1",
    total_files: "2"
  }
};

// Updated interface for the analysis result
interface FileAnalysisData {
  exam: string;
  name: string;
  score: string;
  grade: string;
  exam_date: string;
  faa_tracking_number: string;
  exam_id: string;
  exam_site: string;
  incorrectly_answered_questions: string[];
}

// Update FileResult interface to hold full code details
interface FileResult {
  data: FileAnalysisData | null;
  extraction_status: "Success" | "Failed";
  file_name: string;
  failure_reason?: string;
  // Renamed and updated type to hold full AcsDescriptionData or null
  incorrect_codes_details?: Array<{ code: string; details: AcsDescriptionData | null }>;
}

interface AnalysisSummary {
  failed_extractions: string;
  successful_extractions: string;
  total_files: string;
}

interface AnalysisResult {
  files: FileResult[];
  summary: AnalysisSummary;
}

export default function ExtractorPage() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const lookupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAnalyze = async (files: File[]) => {
    setIsAnalyzing(true)
    console.log(`Received ${files.length} files for analysis:`, files.map(f => f.name));

    // Simulate API call/processing delay & saving the report
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In a real app, the backend would return a report ID after processing/saving
    const mockReportId = `report-${Date.now()}`;
    console.log(`Analysis complete. Mock Report ID: ${mockReportId}. Redirecting...`);

    setIsAnalyzing(false) // Set analyzing to false *before* redirecting

    // Redirect to the report page
    router.push(`/reports/${mockReportId}`);
  }

  if (!mounted) return null

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="text-center">
        <div className="inline-flex items-center rounded-full bg-primary/10 p-1 pr-2 mb-4">
          <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase mr-1 bg-primary text-white">Tool</Badge>
          <span className="text-sm font-medium text-primary">Knowledge Test Extractor & ACS Lookup</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Analyze Test Results & Explore ACS Codes
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 mx-auto">
          Upload your FAA Knowledge Test results (PDF or image) to extract missed ACS codes, or use the lookup tool to find ACS descriptions.
        </p>
      </section>

      {/* Input Area - Two Columns on Large Screens */}
      <section id="extractor-input" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Extractor Dropzone */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Knowledge Test Results</CardTitle>
              <CardDescription>Upload one or more PDF/image files of your test reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <ExtractorDropzone onAnalyze={handleAnalyze} accept="application/pdf, image/*" />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: ACS Lookup */}
        <div ref={lookupRef} className={isAnalyzing ? 'opacity-50 pointer-events-none' : ''}>
          <AcsCodeLookup />
        </div>
      </section>
    </div>
  )
}
