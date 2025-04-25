"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { Deficiency } from "@/lib/hooks/use-report-mock"

interface DeficienciesTableProps {
  deficiencies: Deficiency[]
  onToggleReviewed: (id: string, reviewed: boolean) => void
  className?: string
}

export function DeficienciesTable({ deficiencies, onToggleReviewed, className }: DeficienciesTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDeficiencies = deficiencies.filter(
    (deficiency) =>
      deficiency.acsCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deficiency.knowledgeArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deficiency.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className={className}>
      <div className="mb-4 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter deficiencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead className="w-[120px]">ACS Code</TableHead>
              <TableHead className="w-[200px]">Knowledge Area</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px] text-center">Reviewed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-200 bg-white">
            {filteredDeficiencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No deficiencies found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDeficiencies.map((deficiency) => (
                <TableRow
                  key={deficiency.id}
                  className={cn(deficiency.reviewed && "text-muted-foreground line-through")}
                >
                  <TableCell className="font-mono text-sm">{deficiency.acsCode}</TableCell>
                  <TableCell>{deficiency.knowledgeArea}</TableCell>
                  <TableCell>{deficiency.description}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={deficiency.reviewed}
                        onCheckedChange={(checked) => onToggleReviewed(deficiency.id, checked as boolean)}
                        aria-label={`Mark ${deficiency.acsCode} as reviewed`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
