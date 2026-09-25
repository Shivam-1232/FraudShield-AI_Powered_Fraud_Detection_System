"use client"

import { RotateCcw, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FraudData } from "@/lib/types"

interface DashboardFiltersProps {
  data: FraudData[]
  query: string
  location: string
  device: string
  transactionType: string
  fraudStatus: string
  onQueryChange: (value: string) => void
  onLocationChange: (value: string) => void
  onDeviceChange: (value: string) => void
  onTransactionTypeChange: (value: string) => void
  onFraudStatusChange: (value: string) => void
  onReset: () => void
}

const uniqueValues = (data: FraudData[], key: keyof FraudData) =>
  Array.from(new Set(data.map((item) => item[key]).filter(Boolean))).sort()

export default function DashboardFilters({
  data,
  query,
  location,
  device,
  transactionType,
  fraudStatus,
  onQueryChange,
  onLocationChange,
  onDeviceChange,
  onTransactionTypeChange,
  onFraudStatusChange,
  onReset,
}: DashboardFiltersProps) {
  const router = useRouter()
  const locations = uniqueValues(data, "location")
  const devices = uniqueValues(data, "device")
  const transactionTypes = uniqueValues(data, "transaction_type")

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search transaction ID or location"
            className="pl-9"
            aria-label="Search transactions"
          />
        </div>
        <Select value={location} onValueChange={onLocationChange}>
          <SelectTrigger aria-label="Filter by location"><SelectValue placeholder="All locations" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={device} onValueChange={onDeviceChange}>
          <SelectTrigger aria-label="Filter by device"><SelectValue placeholder="All devices" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All devices</SelectItem>
            {devices.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={transactionType} onValueChange={onTransactionTypeChange}>
          <SelectTrigger aria-label="Filter by transaction type"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {transactionTypes.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={fraudStatus} onValueChange={onFraudStatusChange}>
          <SelectTrigger aria-label="Filter by fraud status"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="fraud">Fraud only</SelectItem>
            <SelectItem value="legitimate">Legitimate only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-3 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Showing the filtered dataset in every chart and report.</span>
        <div className="flex gap-2 self-end sm:self-auto">
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            Refresh data
          </Button>
        </div>
      </div>
    </div>
  )
}
