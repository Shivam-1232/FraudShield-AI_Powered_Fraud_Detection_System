import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FraudData } from "@/lib/types"

interface FraudHeatmapProps {
  data: FraudData[]
  className?: string
}

export default function FraudHeatmap({ data, className }: FraudHeatmapProps) {
  // Process data for the heatmap
  const locations = Array.from(new Set(data.map((item) => item.location)))
  const timeSlots = Array.from(new Set(data.map((item) => item.time))).sort(
    (a, b) => Number.parseInt(a) - Number.parseInt(b),
  )

  // Create a matrix of fraud amounts by location and time
  const heatmapData = locations.map((location) => {
    const row: Record<string, number> = { location }

    timeSlots.forEach((time) => {
      const fraudAmount = data
        .filter((item) => item.location === location && item.time === time && item.is_fraud === "1")
        .reduce((sum, item) => sum + Number(item.amount), 0)

      row[`time_${time}`] = fraudAmount
    })

    return row
  })

  // Calculate max value for color scaling
  const maxValue = Math.max(...heatmapData.flatMap((row) => timeSlots.map((time) => row[`time_${time}`] || 0)))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Fraud Amount by Location & Time 🌍⏰</CardTitle>
        <CardDescription>Heatmap showing fraud amounts across locations and time periods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Location</th>
                {timeSlots.map((time) => (
                  <th key={time} className="p-2 text-center">
                    {formatTimeSlot(time)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, index) => (
                <tr key={index}>
                  <td className="p-2 font-medium">{row.location}</td>
                  {timeSlots.map((time) => {
                    const value = row[`time_${time}`] || 0
                    const intensity = value / maxValue

                    return (
                      <td
                        key={time}
                        className="p-2 text-center"
                        style={{
                          backgroundColor: getHeatmapColor(intensity),
                          color: intensity > 0.5 ? "white" : "black",
                        }}
                      >
                        ${value.toFixed(0)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to format time slot
function formatTimeSlot(time: string): string {
  const hour = Number.parseInt(time)
  return `${hour}:00`
}

// Helper function to get color based on intensity
function getHeatmapColor(intensity: number): string {
  // Red gradient from light to dark
  const r = Math.floor(255 - intensity * 0)
  const g = Math.floor(255 - intensity * 200)
  const b = Math.floor(255 - intensity * 200)

  return `rgba(255, ${g}, ${b}, ${Math.max(0.1, intensity)})`
}

