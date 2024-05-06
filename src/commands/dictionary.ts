import { BotCommand } from "."

import dictionary from "../api/Dictionary"
import embed from "../embed"

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

    // We only need the first definition.
    const definition = (await dictionary(arabicWord)).entries[0]
    if (!definition) {
      throw new Error(`Couldn't find a definition for word "${arabicWord}".`)
    }

    await interaction.editReply(
      embed({
        title: `\u200E${arabicWord} (${definition.noun ? "noun" : "verb"})`,
        href: `https://www.arabicreference.com/q/${arabicWord}`,
        contents: `**NOTE**: The dictionary command is currently experimental. Accuracy of definitions may vary. This will improve over time.\n\n${
          definition.noun?.definitions.map((def) => `- ${def}`).join("\n") ??
          definition
            .verb!.form_one.definitions.map((def) => `- ${def}`)
            .join("\n")
        }`,
        fields: definition.verb
          ? [
              {
                name: "Masadir",
                value: definition.verb.form_one.form_one_info[0].masadir
                  .map((md) => `${md.arabic ?? "n/a"} - ${md.pronunciation}`)
                  .join(", "),
              },
            ]
          : [],
      })
    )
  },
} as BotCommand
