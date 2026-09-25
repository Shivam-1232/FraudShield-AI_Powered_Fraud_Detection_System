"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FraudData } from "@/lib/types"

interface FraudDonutChartProps {
  data: FraudData[]
  className?: string
}

export default function FraudDonutChart({ data, className }: FraudDonutChartProps) {
  // Process data for the chart
  const fraudCount = data.filter((item) => item.is_fraud === "1").length
  const legitimateCount = data.filter((item) => item.is_fraud === "0").length
  const totalCount = data.length

  const chartData = [
    { name: "Fraud", value: fraudCount, percentage: (fraudCount / totalCount) * 100 },
    { name: "Legitimate", value: legitimateCount, percentage: (legitimateCount / totalCount) * 100 },
  ]

  const COLORS = ["#ef4444", "#22c55e"]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Fraud vs. Non-Fraud Transactions 🍩</CardTitle>
        <CardDescription>Percentage breakdown of fraudulent and legitimate transactions</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold">{fraudCount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Fraud Transactions</div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} (${((value / totalCount) * 100).toFixed(1)}%)`, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

