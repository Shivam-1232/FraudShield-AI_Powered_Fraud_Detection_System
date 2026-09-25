"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FraudData } from "@/lib/types"

interface FraudTrendChartProps {
  data: FraudData[]
  className?: string
}

export default function FraudTrendChart({ data, className }: FraudTrendChartProps) {
  // Process data for the chart
  // Group by time periods and calculate fraud metrics
  const timeSlots = Array.from(new Set(data.map((item) => item.time))).sort(
    (a, b) => Number.parseInt(a) - Number.parseInt(b),
  )

  const chartData = timeSlots.map((time) => {
    const timeTransactions = data.filter((item) => item.time === time)
    const totalCount = timeTransactions.length
    const fraudCount = timeTransactions.filter((item) => item.is_fraud === "1").length
    const fraudAmount = timeTransactions
      .filter((item) => item.is_fraud === "1")
      .reduce((sum, item) => sum + Number(item.amount), 0)

    return {
      time: formatTimeSlot(time),
      "Fraud Count": fraudCount,
      "Fraud Rate": (fraudCount / totalCount) * 100,
      "Fraud Amount": fraudAmount,
    }
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Fraud Trend Over Time 📈</CardTitle>
        <CardDescription>Trend of fraud transactions, rates, and amounts over different time periods</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="Fraud Count" stroke="#ef4444" activeDot={{ r: 8 }} />
            <Line yAxisId="left" type="monotone" dataKey="Fraud Rate" stroke="#8b5cf6" />
            <Line yAxisId="right" type="monotone" dataKey="Fraud Amount" stroke="#f97316" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Helper function to format time slot
function formatTimeSlot(time: string): string {
  const hour = Number.parseInt(time)
  return `${hour}:00`
}

