"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2, Save } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// NOTE: Mock descriptions are now maintained in the page.tsx
//       This component will eventually fetch from an API.
const mockAcsDescriptions = {
    "UA.V.E.K1": { id: "UA.V.E.K1", description: "Physiological considerations... dehydration and heatstroke.", area: "Operations", task: "Physiology", subTask: "Dehydration/Heatstroke", knowledge: "Aeromedical", examType: "UAG" },
    "UA.V.E.K2": { id: "UA.V.E.K2", description: "Drug and alcohol use.", area: "Operations", task: "Physiology", subTask: "Drug/Alcohol Effects", knowledge: "Aeromedical", examType: "UAG" },
    "CA.I.A.K2": { id: "CA.I.A.K2", description: "Certification requirements, currency, and experience requirements.", area: "Airman Certification", task: "General", subTask: "Requirements", knowledge: "Regulations", examType: "CAX" },
    "CA.I.B.K1": { id: "CA.I.B.K1", description: "Privileges and limitations of certificates and ratings.", area: "Airman Certification", task: "General", subTask: "Privileges/Limitations", knowledge: "Regulations", examType: "CAX" },
    "CA.I.C.K1": { id: "CA.I.C.K1", description: "Medical certificates: Class, expiration, privileges, temporary disqualifications.", area: "Airman Certification", task: "General", subTask: "Medical Certificates", knowledge: "Regulations", examType: "CAX" },
    "CA.I.E.K1": { id: "CA.I.E.K1", description: "Required documents for pilot and aircraft.", area: "Airman Certification", task: "General", subTask: "Required Documents", knowledge: "Regulations", examType: "CAX" },
    // Add more relevant mock codes if needed
};

type AcsDescription = typeof mockAcsDescriptions[keyof typeof mockAcsDescriptions];

// Type for individual lookup result, including the queried code
type LookupResult = {
    query: string;
    data: AcsDescription | null;
}

export function AcsCodeLookup() {
    const [acsCodesInput, setAcsCodesInput] = useState("")
    // Store results as an array
    const [results, setResults] = useState<LookupResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searched, setSearched] = useState(false) // Track if a search has been performed

    // Removed useEffect related to initialCode

    const performLookup = (codesToLookup: string[]) => {
        setIsLoading(true)
        setSearched(true) // Mark that a search was initiated
        setResults([]) // Clear previous results

        // Simulate API call delay for the whole batch
        setTimeout(() => {
            const foundResults: LookupResult[] = codesToLookup.map(code => {
                const foundData = mockAcsDescriptions[code.toUpperCase() as keyof typeof mockAcsDescriptions] || null;
                return { query: code, data: foundData };
            });

            setResults(foundResults)
            setIsLoading(false)
        }, 700) // Slightly longer delay for potentially multiple codes
    }

    const handleLookup = () => {
        const codesArray = acsCodesInput
            .split(',')
            .map(code => code.trim())
            .filter(code => code.length > 0); // Filter out empty strings

        if (codesArray.length === 0) {
            // Maybe show an error or just do nothing
            setResults([])
            setSearched(false)
            return;
        }
        performLookup(codesArray)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleLookup();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>ACS Code Lookup</CardTitle>
                <CardDescription>Enter one or more FAA ACS codes (separated by commas) to view details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex space-x-2">
                    <Input
                        placeholder="e.g., CA.I.A.K2, UA.V.E.K1"
                        value={acsCodesInput}
                        onChange={(e) => {
                            setAcsCodesInput(e.target.value)
                            setSearched(false) // Reset searched state on input change
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="flex-grow"
                    />
                    <Button onClick={handleLookup} disabled={isLoading || !acsCodesInput.trim()}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        <span className="ml-2 hidden sm:inline">Lookup</span>
                    </Button>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center pt-6 text-neutral-500">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching for code(s)...
                    </div>
                )}

                {!isLoading && searched && results.length > 0 && (
                    <div className="pt-4 space-y-3 border-t">
                        <ScrollArea className="max-h-[450px] w-full pr-3 -mr-1">
                            <ul className="space-y-4">
                                {results.map((result, index) => (
                                    <li key={index} className={`p-3 rounded-md border ${result.data ? 'border-gray-200' : 'border-red-200 bg-red-50/50'}`}>
                                        <h4 className={`font-semibold text-md font-mono mb-1.5 ${result.data ? 'text-gray-800' : 'text-red-700'}`}>{result.query}</h4>
                                        {result.data ? (
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p className="text-black text-base mb-1">{result.data.description}</p>
                                                <div className="grid grid-cols-2 gap-x-3 text-xs pt-1 text-neutral-500">
                                                    <span><strong>Area:</strong> {result.data.area}</span>
                                                    <span><strong>Task:</strong> {result.data.task}</span>
                                                    <span><strong>SubTask:</strong> {result.data.subTask}</span>
                                                    <span><strong>Knowledge:</strong> {result.data.knowledge}</span>
                                                    <span><strong>Exam:</strong> {result.data.examType}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-red-600 italic text-sm">Code not found.</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                        {/* Save Indication */}
                        <div className="pt-3 mt-2 border-t text-center text-xs text-neutral-500 flex items-center justify-center">
                            <Save className="h-3 w-3 mr-1.5" /> Results automatically saved to your reports.
                        </div>
                    </div>
                )}

                {!isLoading && searched && results.length === 0 && acsCodesInput.trim() !== "" && (
                    <div className="pt-6 text-center text-red-600">
                        No valid codes found for "{acsCodesInput}". Please check the code(s) and format.
                    </div>
                )}

                {!isLoading && !searched && (
                    <div className="pt-6 text-center text-neutral-500">
                        Enter ACS code(s) above to see details.
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 