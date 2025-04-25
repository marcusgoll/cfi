"use client"

import { useState, useEffect } from "react"
import { Send, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { type InstructorNote } from "@/lib/hooks/use-report-mock"
import { formatDistanceToNow } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface NotesPanelProps {
  notes: InstructorNote[]
  onAddNote: (content: string) => void
  currentUserName: string
  className?: string
  readOnly?: boolean
}

export function NotesPanel({
  notes,
  onAddNote,
  currentUserName,
  className,
  readOnly = false,
}: NotesPanelProps) {
  const { toast } = useToast()
  const [newNoteContent, setNewNoteContent] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddNote = () => {
    if (readOnly || !newNoteContent.trim()) return;
    setIsAdding(true)

    setTimeout(() => {
      onAddNote(newNoteContent.trim())
      setNewNoteContent("")
      setIsAdding(false)
      toast({
        title: "Note added",
        description: "Your note has been added successfully.",
      })
    }, 500)
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-lg">Instructor Notes</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="max-h-[500px] w-full">
          <div className="p-4 space-y-4">
            {notes.length > 0 ? (
              <ul className="space-y-4">
                {notes.map((note) => (
                  <li key={note.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback><UserCircle className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="text-sm font-medium text-gray-900">{note.author}</p>
                        <p className="text-xs text-gray-500" title={new Date(note.timestamp).toLocaleString()}>
                          {formatDistanceToNow(new Date(note.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              readOnly && <p className="text-sm text-center text-gray-500 py-4">No notes added yet.</p>
            )}

            {!readOnly && (
              <div className="pt-4 border-t space-y-2">
                <Textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder={`Add a note as ${currentUserName}...`}
                  className="min-h-[80px] resize-none text-sm"
                  disabled={isAdding}
                  rows={3}
                />
                <Button
                  className="w-full"
                  onClick={handleAddNote}
                  disabled={isAdding || !newNoteContent.trim()}
                  size="sm"
                >
                  {isAdding ? (
                    "Adding..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Add Note
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
