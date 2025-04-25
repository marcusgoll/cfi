import { AlertCircle } from "lucide-react"

export function SimulationCanvasPlaceholder() {
  return (
    <div
      className="h-[600px] bg-neutral-200 rounded-xl flex flex-col items-center justify-center text-muted"
      role="img"
      aria-label="Interactive flight simulation canvas - placeholder"
    >
      <AlertCircle className="h-12 w-12 mb-4 text-muted-foreground/70" />
      <p className="text-lg font-medium text-muted-foreground">WebGL / Canvas simulation placeholder</p>
      <p className="text-sm text-muted-foreground/70 max-w-md text-center mt-2">
        This is where the actual flight simulation would render. It would be built with WebGL, Three.js or a similar
        technology for interactive 3D visualizations.
      </p>
    </div>
  )
}
