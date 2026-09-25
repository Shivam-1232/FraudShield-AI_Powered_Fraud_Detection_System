"use client"

import { useMemo, useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
import DashboardFilters from "@/components/dashboard-filters"
import KpiCards from "@/components/kpi-cards"
import FraudByTransactionType from "@/components/fraud-by-transaction-type"
import DeviceTypeTreemap from "@/components/device-type-treemap"
import FraudHeatmap from "@/components/fraud-heatmap"
import FraudTrendChart from "@/components/fraud-trend-chart"
import FraudDonutChart from "@/components/fraud-donut-chart"
import HighRiskScatterPlot from "@/components/high-risk-scatter-plot"
import DownloadReport from "@/components/download-report"
import DashboardSummary from "@/components/dashboard-summary"
import TransactionsTable from "@/components/transactions-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FraudData } from "@/lib/types"

export default function DashboardClient({ data }: { data: FraudData[] }) {
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("all")
  const [device, setDevice] = useState("all")
  const [transactionType, setTransactionType] = useState("all")
  const [fraudStatus, setFraudStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return data.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.transaction_id.toLowerCase().includes(normalizedQuery) ||
        item.location.toLowerCase().includes(normalizedQuery)
      const matchesStatus =
        fraudStatus === "all" ||
        (fraudStatus === "fraud" && item.is_fraud === "1") ||
        (fraudStatus === "legitimate" && item.is_fraud === "0")
      return (
        matchesQuery &&
        matchesStatus &&
        (location === "all" || item.location === location) &&
        (device === "all" || item.device === device) &&
        (transactionType === "all" || item.transaction_type === transactionType)
      )
    })
  }, [data, query, location, device, transactionType, fraudStatus])

  const resetFilters = () => {
    setQuery("")
    setLocation("all")
    setDevice("all")
    setTransactionType("all")
    setFraudStatus("all")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 space-y-4 overflow-x-hidden p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Fraud Analytics Dashboard</h2>
            <p className="text-sm text-muted-foreground">{filteredData.length.toLocaleString()} of {data.length.toLocaleString()} transactions</p>
          </div>
        </div>
        <DashboardFilters
          data={data}
          query={query}
          location={location}
          device={device}
          transactionType={transactionType}
          fraudStatus={fraudStatus}
          onQueryChange={setQuery}
          onLocationChange={setLocation}
          onDeviceChange={setDevice}
          onTransactionTypeChange={setTransactionType}
          onFraudStatusChange={setFraudStatus}
          onReset={resetFilters}
        />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <KpiCards data={filteredData} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <FraudByTransactionType data={filteredData} className="col-span-4" />
              <FraudDonutChart data={filteredData} className="col-span-3" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <FraudTrendChart data={filteredData} className="col-span-4" />
              <DeviceTypeTreemap data={filteredData} className="col-span-3" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <FraudHeatmap data={filteredData} className="col-span-4" />
              <HighRiskScatterPlot data={filteredData} className="col-span-3" />
            </div>
            <TransactionsTable data={filteredData} />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <FraudTrendChart data={filteredData} className="col-span-7" />
              <FraudHeatmap data={filteredData} className="col-span-7" />
              <HighRiskScatterPlot data={filteredData} className="col-span-7" />
            </div>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Fraud Reports</h3>
              <DownloadReport data={filteredData} />
            </div>
            <DashboardSummary data={filteredData} />
            <TransactionsTable data={filteredData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
