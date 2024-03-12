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
import { idiomaticSearch } from "../api/OpenQuran"
import settings from "../settings"
import embed from "../embed"

export default {
  name: "verse",
  description: "Lookup a verse in the Holy Quran.",
  options: [
    {
      name: "chapter",
      description: "Chapter to lookup",
      type: "number",
      required: true,
    },
    {
      name: "verse",
      description: "Verse to lookup",
      type: "number",
      required: true,
    },
    {
      name: "analysis",
      description: "Whether an analysis of the Arabic text should be included.",
      type: "boolean",
      default: false,
    },
    {
      name: "disregard-bismillah",
      description:
        "Whether the Bismillah should be disregarded during verse numbering.",
      type: "boolean",
      default: false,
    },
  ],
  async command(interaction) {
    const { countBismillah } = await settings()
    const analysis = interaction.options.getBoolean("analysis") ?? false
    const chapter = interaction.options.getNumber("chapter", true)

    let verse = interaction.options.getNumber("verse", true)
    let finalVerse = verse
    if (chapter !== 9) {
      const nobismillah =
        interaction.options.getBoolean("disregard-bismillah") ?? !countBismillah
      if (nobismillah) {
        finalVerse = verse
        verse = Math.max(1, verse + 1)
      }
    }

    const verseInfo = (await idiomaticSearch(`${chapter}:${verse}`))[0]
    if (verseInfo === undefined) {
      throw new Error(`Verse "${chapter}:${verse} not found."`)
    }

    await interaction.editReply(
      embed({
        title: `Holy Quran, ${verseInfo.chapterName.transliteration} (${verseInfo.chapterName.arabic}), Verse ${finalVerse}`,
        contents: verseInfo.translations.english,
        fields: analysis
          ? [
              { name: "Arabic", value: verseInfo.translations.arabic },
              {
                name: "Analysis",
                value: Object.entries(verseInfo.analysis)
                  .map(([arabicWord, info]) =>
                    typeof info !== "string"
                      ? `- \u200E( **${arabicWord}** ): ${info.transliterations.english} (${info.translations.english})`
                      : "- " + arabicWord
                  )
                  .join("\n"),
              },
            ]
          : [
              { name: "Arabic", value: verseInfo.translations.arabic },
              { name: "Urdu", value: verseInfo.translations.urdu },
            ],
      })
    )
  },
} as BotCommand
