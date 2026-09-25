import { AlertTriangle, ArrowDown, ArrowUp, CreditCard, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FraudData } from "@/lib/types"

interface KpiCardsProps {
  data: FraudData[]
}

export default function KpiCards({ data }: KpiCardsProps) {
  // Calculate KPIs
  const totalTransactions = data.length
  const fraudTransactions = data.filter((item) => item.is_fraud === "1").length
  const fraudRate = totalTransactions === 0 ? 0 : (fraudTransactions / totalTransactions) * 100

  const totalAmount = data.reduce((sum, item) => sum + Number(item.amount), 0)
  const fraudAmount = data.filter((item) => item.is_fraud === "1").reduce((sum, item) => sum + Number(item.amount), 0)

  // Calculate week-over-week change (mock data for demonstration)
  const fraudRateChange = 2.5
  const fraudAmountChange = -3.2
  const transactionsChange = 5.7

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fraud Rate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fraudRate.toFixed(2)}% 🚨</div>
          <p className="text-xs text-muted-foreground">
            {fraudRateChange > 0 ? (
              <span className="text-red-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                {fraudRateChange}% from last week
              </span>
            ) : (
              <span className="text-green-500 flex items-center">
                <ArrowDown className="mr-1 h-4 w-4" />
                {Math.abs(fraudRateChange)}% from last week
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Fraud Amount</CardTitle>
          <DollarSign className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${fraudAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })} 💸</div>
          <p className="text-xs text-muted-foreground">
            {fraudAmountChange > 0 ? (
              <span className="text-red-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                {fraudAmountChange}% from last week
              </span>
            ) : (
              <span className="text-green-500 flex items-center">
                <ArrowDown className="mr-1 h-4 w-4" />
                {Math.abs(fraudAmountChange)}% from last week
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTransactions.toLocaleString()} 💳</div>
          <p className="text-xs text-muted-foreground">
            {transactionsChange > 0 ? (
              <span className="text-green-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                {transactionsChange}% from last week
              </span>
            ) : (
              <span className="text-red-500 flex items-center">
                <ArrowDown className="mr-1 h-4 w-4" />
                {Math.abs(transactionsChange)}% from last week
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
