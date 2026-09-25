import { fetchFraudData } from "@/lib/data"
import DashboardClient from "@/components/dashboard-client"

export default async function Dashboard() {
  const data = await fetchFraudData()
  return <DashboardClient data={data} />
}
