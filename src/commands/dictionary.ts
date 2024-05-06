import { BotCommand } from "."

import dictionary from "../api/Dictionary"

export default {
  name: "dictionary",
  description: "Looks up an Arabic definition.",
  options: [
    {
      name: "query",
      description: "Arabic word.",
      type: "string",
      required: true,
    },
  ],
  async command(interaction) {
    const arabicWord = interaction.options.getString("query", true).trim()

    const definitions = await dictionary(arabicWord)

    await interaction.editReply("guh")
  },
} as BotCommand
