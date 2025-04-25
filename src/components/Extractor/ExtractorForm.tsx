"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Upload, Loader2, FileCheck, X, File as FileIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area" // Import ScrollArea

interface ExtractorDropzoneProps {
  onAnalyze: (files: File[]) => Promise<void> // Expecting an array of File objects
  className?: string
  accept?: string // e.g., "application/pdf, text/plain, image/*"
}

export function ExtractorDropzone({
  onAnalyze,
  className,
  accept = "application/pdf, image/*" // Updated default
}: ExtractorDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [files, setFiles] = useState<File[]>([]) // Changed state to handle array
  const [error, setError] = useState<string | null>(null) // State for errors
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Removed readFileContent as analysis logic is now in the page

  const handleFilesSelected = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setError(null); // Clear previous errors
    const acceptedFiles: File[] = [];
    const rejectedFiles: string[] = [];
    const allowedTypes = accept.split(',').map(s => s.trim());

    Array.from(selectedFiles).forEach(file => {
      // Check if the file type is accepted or if accept is '*'
      if (allowedTypes.includes(file.type) || allowedTypes.includes(file.type.split('/')[0] + '/*') || accept === '*') {
        acceptedFiles.push(file);
      } else {
        rejectedFiles.push(`${file.name} (type: ${file.type || 'unknown'})`);
      }
    });

    if (rejectedFiles.length > 0) {
      setError(`Rejected files due to type mismatch: ${rejectedFiles.join(', ')}. Accepted types: ${accept}`);
      // Optionally, only proceed with accepted files or stop entirely
      // For now, let's proceed with accepted ones if any
    }

    if (acceptedFiles.length === 0) {
      // No accepted files, maybe show error and return
      if (rejectedFiles.length === 0) setError("No files selected."); // Or handle this case differently
      return;
    }


    setFiles(acceptedFiles); // Set the accepted files
    setIsAnalyzing(true);
    try {
      // Pass the array of File objects directly
      await onAnalyze(acceptedFiles);
    } catch (err) {
      console.error("Error analyzing files:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
      // TODO: Add user-facing error handling (e.g., toast notification)
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalyze, accept]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
      e.dataTransfer.clearData()
    }
  }, [handleFilesSelected])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesSelected(e.target.files);
    // Reset the input value to allow selecting the same file again
    if (e.target) e.target.value = '';
  }, [handleFilesSelected])

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleRemoveFiles = useCallback(() => {
    setFiles([]); // Clear all files
    setError(null); // Clear errors
    // Reset analysis state if needed, maybe clear results in parent?
    // Consider if onAnalyze([]) should be called to clear parent state
  }, [])

  // Helper to format file size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  return (
    <div className={className}>
      <Card
        className={cn(
          "flex flex-col items-center justify-center border-2 border-dashed p-6 transition-colors min-h-[200px]", // Adjusted padding/min-height
          isDragging ? "border-primary bg-primary/5" : "border-neutral-300 hover:border-primary/50",
          files.length > 0 ? "border-solid border-green-500 bg-green-50" : "",
          isAnalyzing ? "cursor-wait opacity-75" : "", // Added opacity when analyzing
          error ? "border-solid border-red-500 bg-red-50" : "" // Error state styling
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-live="polite"
      >
        <CardContent className="flex flex-col items-center justify-center p-0 text-center w-full">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={isAnalyzing}
            multiple // Added multiple attribute
          />

          {isAnalyzing ? (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-lg font-medium">Analyzing Files...</p>
              <p className="text-sm text-neutral-500">Processing {files.length} item(s)</p>
            </>
          ) : files.length > 0 ? (
            <div className="space-y-3 w-full">
              <FileCheck className="h-10 w-10 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-medium">Files Ready!</p>
              {/* Display list of files */}
              <ScrollArea className="h-24 w-full rounded-md border p-2 text-left">
                <ul className="space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center text-sm text-neutral-700">
                      <FileIcon className="h-4 w-4 mr-2 flex-shrink-0 text-neutral-500" />
                      <span className="truncate flex-grow" title={file.name}>{file.name}</span>
                      <span className="ml-2 text-xs text-neutral-500 flex-shrink-0">{formatBytes(file.size)}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveFiles}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="mr-1 h-4 w-4" /> Remove All Files
              </Button>
            </div>
          ) : (
            <>
              {error && ( // Display error message
                <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="mb-2 text-lg font-medium">Drag & drop files here</p>
              <p className="mb-4 text-sm text-neutral-500">{accept.replace("image/*", "Images").replace("application/pdf", "PDF").replace("text/plain", "TXT")} accepted</p>
              <Button type="button" variant="outline" size="lg" onClick={handleBrowseClick}>
                Browse Files
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
