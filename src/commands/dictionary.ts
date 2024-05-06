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
