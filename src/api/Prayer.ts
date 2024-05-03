/**
 *  Copyright (C) 2024 Louka Ménard Blondin
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/** May Allah have mercy on my soul for this GARBAGE port. */
import getPrayerTimes from "./ChernobylPrayer/PrayUi"

import settings from "../settings"

interface Geolocalization {
  lat: string
  lon: string
  display_name: string
}

async function geolocalize(query: string) {
  const nominatimUrl = (await settings()).geolocalizationUrl
  if (nominatimUrl === undefined) {
    throw new Error("Geolocalization URL is not provided in settings.json.")
  }

  const params = new URLSearchParams()
  params.set("q", query)
  params.set("format", "jsonv2")

  // TODO: Self-host.
  const request = await fetch(`${nominatimUrl}/search?${params.toString()}`, {
    headers: {
      "User-Agent": "Kaabot <https://github.com/mblouka/kaabot>",
    },
  })

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
