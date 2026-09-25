"use client"

import { Treemap, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FraudData } from "@/lib/types"

interface DeviceTypeTreemapProps {
  data: FraudData[]
  className?: string
}

interface TreemapData {
  name: string
  size: number
  fill: string
}

export default function DeviceTypeTreemap({ data, className }: DeviceTypeTreemapProps) {
  // Process data for the treemap
  const deviceTypes = Array.from(new Set(data.map((item) => item.device)))

  const fraudByDevice = deviceTypes
    .map((device) => {
      const deviceTransactions = data.filter((item) => item.device === device)
      const fraudCount = deviceTransactions.filter((item) => item.is_fraud === "1").length

      return {
        name: `${device} (${fraudCount})`,
        size: fraudCount,
        fill: getColorForDevice(device),
      }
    })
    .filter((item) => item.size > 0)

  const chartData = [
    {
      name: "Fraud by Device",
      children: fraudByDevice,
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Fraud by Device Type 📱</CardTitle>
        <CardDescription>Distribution of fraud transactions across different devices</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <Treemap data={chartData} dataKey="size" ratio={4 / 3} stroke="#fff" fill="#8884d8">
            <Tooltip formatter={(value) => [`${value} Transactions`, "Fraud Count"]} />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Helper function to get color for device type
function getColorForDevice(device: string): string {
  const colors: Record<string, string> = {
    Mobile: "#f97316",
    Desktop: "#3b82f6",
    Tablet: "#8b5cf6",
    ATM: "#ec4899",
    POS: "#14b8a6",
  }

  return colors[device] || "#6b7280"
}

