import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FraudData } from "@/lib/types"
import { FileText } from "lucide-react"

interface DashboardSummaryProps {
  data: FraudData[]
}

export default function DashboardSummary({ data }: DashboardSummaryProps) {
  // Calculate key metrics
  const totalTransactions = data.length
  const fraudTransactions = data.filter((item) => item.is_fraud === "1").length
  const fraudRate = totalTransactions === 0 ? 0 : (fraudTransactions / totalTransactions) * 100

  const totalAmount = data.reduce((sum, item) => sum + Number(item.amount), 0)
  const fraudAmount = data.filter((item) => item.is_fraud === "1").reduce((sum, item) => sum + Number(item.amount), 0)

  // Get unique locations, devices, and transaction types
  const uniqueLocations = new Set(data.map((item) => item.location))
  const uniqueDevices = new Set(data.map((item) => item.device))
  const uniqueTransactionTypes = new Set(data.map((item) => item.transaction_type))

  // Find most common fraud location
  const locationCounts: Record<string, number> = {}
  data
    .filter((item) => item.is_fraud === "1")
    .forEach((item) => {
      locationCounts[item.location] = (locationCounts[item.location] || 0) + 1
    })

  const mostFraudLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  // Find most common fraud device
  const deviceCounts: Record<string, number> = {}
  data
    .filter((item) => item.is_fraud === "1")
    .forEach((item) => {
      deviceCounts[item.device] = (deviceCounts[item.device] || 0) + 1
    })

  const mostFraudDevice = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  // Find most common fraud transaction type
  const transactionCounts: Record<string, number> = {}
  data
    .filter((item) => item.is_fraud === "1")
    .forEach((item) => {
      transactionCounts[item.transaction_type] = (transactionCounts[item.transaction_type] || 0) + 1
    })

  const mostFraudTransactionType = Object.entries(transactionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <FileText className="h-8 w-8 text-primary" />
        <CardTitle>Fraud Analysis Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Key Findings:</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Fraud Overview:</span>
              <ul className="list-disc pl-6 mt-1">
                <li>
                  Total transactions analyzed: <span className="font-medium">{totalTransactions.toLocaleString()}</span>
                </li>
                <li>
                  Fraudulent transactions detected:{" "}
                  <span className="font-medium">{fraudTransactions.toLocaleString()}</span>
                </li>
                <li>
                  Overall fraud rate: <span className="font-medium">{fraudRate.toFixed(2)}%</span>
                </li>
                <li>
                  Total fraud amount: <span className="font-medium">${fraudAmount.toLocaleString()}</span>
                </li>
              </ul>
            </li>

            <li>
              <span className="font-medium">Geographical Insights:</span>
              <ul className="list-disc pl-6 mt-1">
                <li>
                  Locations monitored: <span className="font-medium">{uniqueLocations.size}</span>
                </li>
                <li>
                  Highest fraud location: <span className="font-medium">{mostFraudLocation}</span>
                </li>
              </ul>
            </li>

            <li>
              <span className="font-medium">Transaction Patterns:</span>
              <ul className="list-disc pl-6 mt-1">
                <li>
                  Transaction types analyzed: <span className="font-medium">{uniqueTransactionTypes.size}</span>
                </li>
                <li>
                  Most common fraudulent transaction type:{" "}
                  <span className="font-medium">{mostFraudTransactionType}</span>
                </li>
              </ul>
            </li>

            <li>
              <span className="font-medium">Device Analysis:</span>
              <ul className="list-disc pl-6 mt-1">
                <li>
                  Device types monitored: <span className="font-medium">{uniqueDevices.size}</span>
                </li>
                <li>
                  Most vulnerable device type: <span className="font-medium">{mostFraudDevice}</span>
                </li>
              </ul>
            </li>

            <li>
              <span className="font-medium">Recommendations:</span>
              <ul className="list-disc pl-6 mt-1">
                <li>
                  Implement enhanced verification for transactions from{" "}
                  <span className="font-medium">{mostFraudLocation}</span>
                </li>
                <li>
                  Increase security measures for <span className="font-medium">{mostFraudTransactionType}</span>{" "}
                  transactions
                </li>
                <li>
                  Add additional authentication steps for <span className="font-medium">{mostFraudDevice}</span> users
                </li>
                <li>Monitor transactions with high amounts and unusual frequency patterns</li>
              </ul>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
