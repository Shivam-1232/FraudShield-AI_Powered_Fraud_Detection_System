"use client"

import { useState } from "react"
import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import type { FraudData } from "@/lib/types"

interface DownloadReportProps {
  data: FraudData[]
}

export default function DownloadReport({ data }: DownloadReportProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadCSV = () => {
    setIsDownloading(true)
    try {
      if (data.length === 0) {
        throw new Error("There are no transactions to export")
      }

      // Get headers from the first data item
      const headers = Object.keys(data[0])

      // Create CSV content
      const csvContent = [
        headers.join(","), // Header row
        ...data.map((row) =>
          headers
            .map((header) => {
              // Wrap values with commas in quotes
              const value = row[header as keyof FraudData]
              return value.includes(",") ? `"${value}"` : value
            })
            .join(","),
        ),
      ].join("\n")

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `fraud_report_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Report downloaded",
        description: "CSV report has been downloaded successfully",
      })
    } catch (error) {
      console.error("Error downloading CSV:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading the report",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const downloadJSON = () => {
    setIsDownloading(true)
    try {
      if (data.length === 0) {
        throw new Error("There are no transactions to export")
      }

      // Create JSON content
      const jsonContent = JSON.stringify(data, null, 2)

      // Create and download the file
      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `fraud_report_${new Date().toISOString().split("T")[0]}.json`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Report downloaded",
        description: "JSON report has been downloaded successfully",
      })
    } catch (error) {
      console.error("Error downloading JSON:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading the report",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download Report
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={downloadCSV} disabled={isDownloading} className="cursor-pointer">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Download as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadJSON} disabled={isDownloading} className="cursor-pointer">
          <FileJson className="mr-2 h-4 w-4" />
          <span>Download as JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
