import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { FraudData } from "@/lib/types"

export default function TransactionsTable({ data }: { data: FraudData[] }) {
  const transactions = [...data]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Highest-value transactions</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {transactions.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No transactions match the active filters.</p>
        ) : (
          <Table className="min-w-[680px]">
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.transaction_id}>
                  <TableCell className="font-medium">{transaction.transaction_id}</TableCell>
                  <TableCell>{transaction.location}</TableCell>
                  <TableCell>{transaction.transaction_type}</TableCell>
                  <TableCell className="text-right">${Number(transaction.amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.is_fraud === "1" ? "destructive" : "secondary"}>
                      {transaction.is_fraud === "1" ? "Fraud" : "Legitimate"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
