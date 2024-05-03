import { BotCommand } from "."
import Prayer from "../api/Prayer"
import embed from "../embed"
import * as chrono from "chrono-node"
import settings from "../settings"

export default {
  name: "salat",
  description: "Retrieves prayer times for the time and date",
  options: [
    {
      name: "location",
      description: "Your location. Can be a city name or a region name.",
      type: "string",
      required: true,
    },

    {
      name: "date",
      description: "Date of the time you want to check for. Defaults to today.",
      type: "string",
      required: false,
    },
  ],
  async command(interaction) {
    if ((await settings()).geolocalizationUrl === undefined) {
      throw new Error(
        "Salat timing calculation is an experimental feature, and must be manually enabled by the bot administrator."
      )
    }

    const location = interaction.options.getString("location", true)
    const date = interaction.options.getString("date")
    const parsedDate = date ? chrono.parseDate(date) ?? new Date() : new Date()

    // Get prayer times for the location.
    const prayers = await Prayer(location, parsedDate)

    await interaction.editReply(
      embed({
        title: `Salat`,
        contents: `Prayer times on ${Intl.DateTimeFormat("en", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(parsedDate)} for \`${prayers.name}\`:

- **Fajr**: ${prayers.times.fajr}
- **Zuhr**: ${prayers.times.dhuhr}
- **Asr**: ${prayers.times.asr}
- **Maghrib**: ${prayers.times.maghrib}
- **Isha**: ${prayers.times.isha}`,
      })
    )
  },
} as BotCommand
