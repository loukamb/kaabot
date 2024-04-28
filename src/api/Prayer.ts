/** May Allah have mercy on my soul for this GARBAGE port. */
import getPrayerTimes from "./ChernobylPrayer/PrayUi"

interface Geolocalization {
  lat: string
  lon: string
  display_name: string
}

async function geolocalize(query: string) {
  const params = new URLSearchParams()
  params.set("q", query)
  params.set("format", "jsonv2")

  // TODO: Self-host.
  const request = await fetch(
    `${process.env.NOMINATIM_URL}/search?${params.toString()}`,
    {
      headers: {
        "User-Agent": "Kaabot <https://github.com/mblouka/kaabot>",
      },
    }
  )

  // TODO: Sanity checks on response.
  return (await request.json()) as readonly Geolocalization[]
}

export default async function (query: string, time?: Date) {
  const locations = await geolocalize(query)
  if (locations.length === 0) {
    throw new Error(`Couldn't geolocalize the location query "${query}".`)
  }
  const { lat, lon, display_name } = locations[0]
  return { times: getPrayerTimes(lat, lon, time), name: display_name }
}
