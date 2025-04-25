export interface SimulationMeta {
  slug: string
  title: string
  description: string
  tags: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  coverImage: string // URL to placeholder SVG
}

export function useSimulationsMock(): { simulations: SimulationMeta[]; isLoading: boolean } {
  // Hard-coded array of simulations
  const simulations: SimulationMeta[] = [
    {
      slug: "basic-aircraft-controls",
      title: "Basic Aircraft Controls",
      description: "Learn the primary flight controls and their effects on aircraft movement.",
      tags: ["Aerodynamics", "Controls"],
      difficulty: "Beginner",
      coverImage: "/placeholder.svg?height=300&width=400",
    },
    {
      slug: "understanding-stalls",
      title: "Understanding Stalls",
      description: "Explore how stalls occur and practice recovery techniques in different scenarios.",
      tags: ["Aerodynamics", "Safety"],
      difficulty: "Intermediate",
      coverImage: "/placeholder.svg?height=300&width=400",
    },
    {
      slug: "vfr-navigation",
      title: "VFR Navigation Fundamentals",
      description: "Practice visual flight rules navigation using charts, landmarks and basic instruments.",
      tags: ["Navigation", "VFR"],
      difficulty: "Beginner",
      coverImage: "/placeholder.svg?height=300&width=400",
    },
    {
      slug: "instrument-approaches",
      title: "ILS Approaches",
      description: "Step-by-step guide to executing precision instrument landing system approaches.",
      tags: ["Instruments", "Navigation", "IFR"],
      difficulty: "Advanced",
      coverImage: "/placeholder.svg?height=300&width=400",
    },
    {
      slug: "crosswind-landings",
      title: "Crosswind Landing Techniques",
      description: "Master the art of landing in crosswind conditions using proper control inputs.",
      tags: ["Aerodynamics", "Landing"],
      difficulty: "Intermediate",
      coverImage: "/placeholder.svg?height=300&width=400",
    },
    {
      slug: "thunderstorm-avoidance",
      title: "Thunderstorm Avoidance",
      description: "Learn to interpret weather radar and navigate safely around convective activity.",
      tags: ["Weather", "Safety"],
      difficulty: "Advanced",
      coverImage: "/placeholder.svg?height=300&width=400",
    },
    {
      slug: "emergency-procedures",
      title: "Emergency Procedures",
      description: "Practice handling common emergency situations from engine failure to electrical issues.",
      tags: ["Safety", "Emergency"],
      difficulty: "Intermediate",
      coverImage: "/placeholder.svg?height=300&width=400",
    },
    {
      slug: "radio-communications",
      title: "Radio Communications",
      description: "Interactive scenarios to practice proper aviation radio phraseology and procedures.",
      tags: ["Communications", "ATC"],
      difficulty: "Beginner",
      coverImage: "/placeholder.svg?height=300&width=400",
    },
    {
      slug: "mountain-flying",
      title: "Mountain Flying Techniques",
      description: "Understand the unique challenges and techniques for safe mountain flying operations.",
      tags: ["Navigation", "Safety", "Weather"],
      difficulty: "Advanced",
      coverImage: "/placeholder.svg?height=300&width=400",
    },
  ]

  return { simulations, isLoading: false }
}

// Helper to get a single simulation by slug
export function useSimulationBySlugMock(slug: string): { simulation: SimulationMeta | null; isLoading: boolean } {
  const { simulations } = useSimulationsMock()
  const simulation = simulations.find((sim) => sim.slug === slug) || null
  return { simulation, isLoading: false }
}

// Get all unique tags from simulations
export function useSimulationTagsMock(): { tags: string[]; isLoading: boolean } {
  const { simulations } = useSimulationsMock()
  const allTags = simulations.flatMap((sim) => sim.tags)
  const uniqueTags = Array.from(new Set(allTags)).sort()
  return { tags: uniqueTags, isLoading: false }
}
