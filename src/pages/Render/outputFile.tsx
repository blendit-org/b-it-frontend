"use client"

import { Button } from "@/components/ui/button"
import { Download, FileArchive } from "lucide-react"

interface OutputFileProps {
  fileUrl: string
  fileName: string
}

export function OutputFile({ fileUrl, fileName }: OutputFileProps) {
  if (!fileUrl) return null

  return (
    <div className="p-6 border rounded-lg bg-card shadow-sm w-full">
      <h2 className="text-xl font-semibold mb-4">Your Render is Ready! 🚀</h2>
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
        <div className="flex items-center gap-3">
          <FileArchive className="h-8 w-8 text-orange-500" />
          <span className="font-mono text-sm font-medium truncate">
            {fileName}
          </span>
        </div>
        <Button asChild size="sm">
          <a href={fileUrl} download={fileName}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </div>
    </div>
  )
}