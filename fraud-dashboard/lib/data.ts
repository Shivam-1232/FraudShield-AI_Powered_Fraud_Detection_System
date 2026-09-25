import type { FraudData } from "./types"

export async function fetchFraudData(): Promise<FraudData[]> {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fraud_dataset_500-3SVzIenA0A9O7PFQWj2KKilY2CKcAq.csv",
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const csvText = await response.text()
    return parseCSV(csvText)
  } catch (error) {
    console.error("Error fetching fraud data:", error)
    return []
  }
}

function parseCSV(csvText: string): FraudData[] {
  const lines = csvText.split("\n")
  const headers = lines[0].split(",")

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = line.split(",")
      const record: Record<string, string> = {}

      headers.forEach((header, index) => {
        record[header.trim()] = values[index]?.trim() || ""
      })

      return record as FraudData
    })
}

