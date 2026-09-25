"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FraudData } from "@/lib/types"

interface HighRiskScatterPlotProps {
  data: FraudData[]
  className?: string
}

export default function HighRiskScatterPlot({ data, className }: HighRiskScatterPlotProps) {
  // Process data for the chart
  const scatterData = data.map((item) => ({
    amount: Number(item.amount),
    frequency: Number(item.num_transactions_last_24h),
    isFraud: item.is_fraud === "1",
    id: item.transaction_id,
  }))

  const fraudData = scatterData.filter((item) => item.isFraud)
  const legitimateData = scatterData.filter((item) => !item.isFraud)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>High-Risk Transactions 🎯</CardTitle>
        <CardDescription>Scatter plot of transactions by amount and frequency</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="amount" name="Amount" unit="$" domain={["auto", "auto"]} />
            <YAxis type="number" dataKey="frequency" name="Frequency" unit=" txns" />
            <ZAxis range={[60, 60]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value, name) => [name === "Amount" ? `$${value}` : `${value} transactions`, name]}
            />
            <Scatter name="Fraud" data={fraudData} fill="#ef4444" shape="circle" />
            <Scatter name="Legitimate" data={legitimateData} fill="#22c55e" shape="circle" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

