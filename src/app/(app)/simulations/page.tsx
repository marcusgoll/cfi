"use client"

import { useState } from "react"
import { Filter, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SimulationCard } from "@/components/simulations/SimulationCard"
import { useSimulationsMock, useSimulationTagsMock } from "@/lib/hooks/use-simulations-mock"

export default function SimulationsPage() {
  const { simulations, isLoading } = useSimulationsMock()
  const { tags } = useSimulationTagsMock()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([])

  // Filter simulations based on search and filters
  const filteredSimulations = simulations.filter((sim) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Topic filter
    const matchesTopic =
      selectedTopic === "all" || sim.tags.some((tag) => tag.toLowerCase() === selectedTopic.toLowerCase())

    // Difficulty filter (mobile)
    const matchesDifficulty = selectedDifficulty.length === 0 || selectedDifficulty.includes(sim.difficulty)

    return matchesSearch && matchesTopic && matchesDifficulty
  })

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interactive Flight Simulations</h1>
        <p className="text-muted-foreground mt-1">
          Practice flight maneuvers and scenarios in our interactive simulations.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search simulations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag} value={tag.toLowerCase()}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="sm:hidden">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="space-y-6 py-4">
              <div>
                <h3 className="text-lg font-medium">Filters</h3>
                <p className="text-sm text-muted-foreground">Refine the simulation results</p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Difficulty</h4>
                <div className="space-y-3">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`difficulty-${level}`}
                        checked={selectedDifficulty.includes(level)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDifficulty([...selectedDifficulty, level])
                          } else {
                            setSelectedDifficulty(selectedDifficulty.filter((d) => d !== level))
                          }
                        }}
                      />
                      <Label htmlFor={`difficulty-${level}`}>{level}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-80 rounded-lg bg-muted animate-pulse" aria-hidden="true" />
            ))}
        </div>
      ) : filteredSimulations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulations.map((simulation) => (
            <SimulationCard key={simulation.slug} simulation={simulation} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-1">No simulations found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
