"use client"

import { useState, useEffect } from "react"

export type ACSCode = {
  code: string
  description: string
  studyLink: string
  isWeakArea?: boolean
}

export type ExtractorResult = {
  codes: ACSCode[]
  weakestArea?: string
  isLoading: boolean
  error?: string
  analyze: (text: string) => Promise<void>
}

export function useExtractorMock(input?: string): ExtractorResult {
  const [result, setResult] = useState<Omit<ExtractorResult, 'analyze'>>({
    codes: [],
    isLoading: false,
  })

  const analyze = async (text: string) => {
    setResult({
      codes: [],
      isLoading: true,
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock analysis result
    const mockCodes: ACSCode[] = [
      {
        code: "PA.I.C.K1",
        description:
          "Airspace classes, operating rules, pilot certification, and aircraft equipment requirements for operating in Class B airspace",
        studyLink: "/resources/airspace-classes",
        isWeakArea: true,
      },
      {
        code: "PA.I.C.K2",
        description:
          "Special use airspace such as prohibited, restricted, warning areas, military operation areas, and alert areas",
        studyLink: "/resources/special-use-airspace",
      },
      {
        code: "PA.III.A.K3",
        description: "Runway markings, signs, and lighting",
        studyLink: "/resources/runway-markings",
      },
      {
        code: "PA.IV.B.K1",
        description: "Sources of weather data for flight planning purposes",
        studyLink: "/resources/weather-data",
      },
      {
        code: "PA.V.C.K1",
        description:
          "Factors affecting performance, including atmospheric conditions, airport or runway conditions, and aircraft weight",
        studyLink: "/resources/performance-factors",
      },
    ]

    setResult({
      codes: mockCodes,
      weakestArea: "Airspace classes and requirements",
      isLoading: false,
    })
  }

  useEffect(() => {
    if (input && input.trim().length > 0) {
      analyze(input)
    }
  }, [input])

  return {
    ...result,
    analyze,
  }
}
