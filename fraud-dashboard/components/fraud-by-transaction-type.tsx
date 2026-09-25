"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FraudData } from "@/lib/types"

interface FraudByTransactionTypeProps {
  data: FraudData[]
  className?: string
}

export default function FraudByTransactionType({ data, className }: FraudByTransactionTypeProps) {
  // Process data for the chart
  const transactionTypes = Array.from(new Set(data.map((item) => item.transaction_type)))

  const chartData = transactionTypes.map((type) => {
    const typeTransactions = data.filter((item) => item.transaction_type === type)
    const fraudCount = typeTransactions.filter((item) => item.is_fraud === "1").length
    const legitimateCount = typeTransactions.filter((item) => item.is_fraud === "0").length

    return {
      type,
      Fraud: fraudCount,
      Legitimate: legitimateCount,
    }
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Fraud by Transaction Type 📊</CardTitle>
        <CardDescription>Distribution of fraud across different transaction types</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" angle={-45} textAnchor="end" height={60} interval={0} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Fraud" stackId="a" fill="#ef4444" />
            <Bar dataKey="Legitimate" stackId="a" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

