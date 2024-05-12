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
      name: "query",
      description: "Chapter and verse(s). E.g., '1:1' or '1:1-3'.",
      type: "string",
      required: true,
    },
    {
      name: "translations",
      description:
        "Separate by commas. Supported: `en`, `ar`, `ur`. Only supported in single verse mode.",
      type: "string",
      required: false,
    },
    {
      name: "analysis",
      description:
        "Whether an analysis of the Arabic text should be included. Only supported in single verse mode.",
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
    const query = interaction.options.getString("query", true).trim()
    const analysis = interaction.options.getBoolean("analysis") ?? false
    const translations = (interaction.options.getString("translations") ?? "en")
      .split(",")
      .map((lang) => lang.trim())

    // Pattern match the components of the query.
    let [, chapter_str, verse_str, range_str] =
      query.match(/(\d+)[:\s]+(\d+)(?:\s*-\s*(\d+))?/) ?? []
    if (chapter_str === undefined) {
      throw new Error("Invalid query format. Queries must be formatted as `chapter:verse` (colon optional).")
    }

    // Parse provided parameters into integers.
    let [chapter, verse, range] = [
      parseInt(chapter_str),
      parseInt(verse_str),
      parseInt(range_str),
    ]

    // Adjust for those who want to disregard the bismillah.
    let finalRange = range
    let finalVerse = verse
    if (chapter !== 9) {
      const nobismillah =
        interaction.options.getBoolean("disregard-bismillah") ?? !countBismillah
      if (nobismillah) {
        finalRange = range
        finalVerse = verse
        range = Math.max(1, range + 1)
        verse = Math.max(1, verse + 1)
      }
    }

    // Do da search.
    const verses = await idiomaticSearch(
      `${chapter}:${verse}${range != null ? `-${range}` : ""}`
    )

    if (verses[0] === undefined) {
      throw new Error(
        `Verse(s) "${chapter}:${verse}${
          range != null ? `-${range}` : ""
        } not found."`
      )
    }

    if (verses.length === 1) {
      const url = `https://www.alislam.org/quran/app/${chapter}:${verse}`
      const singleVerse = verses[0]
      await interaction.editReply(
        embed({
          title: `Holy Quran, ${singleVerse.chapterName.transliteration} (${singleVerse.chapterName.arabic}, "${singleVerse.chapterName.english}"), Verse ${finalVerse}`,
          buttons: [
            {
              text: "📖 Open in Quran",
              url,
            },
          ],
          href: url,
          contents: singleVerse.translations.english,
          fields: analysis
            ? [
                { name: "Arabic", value: singleVerse.translations.arabic },
                {
                  name: "Analysis",
                  value: Object.entries(singleVerse.analysis)
                    .map(([arabicWord, info]) =>
                      typeof info !== "string"
                        ? `- \u200E( **${arabicWord}** ): ${info.transliterations.english} (${info.translations.english})`
                        : "- " + arabicWord
                    )
                    .join("\n"),
                },
              ]
            : [
                ...(translations.includes("ar")
                  ? [{ name: "Arabic", value: singleVerse.translations.arabic }]
                  : []),
                ...(translations.includes("ur")
                  ? [{ name: "Urdu", value: singleVerse.translations.urdu }]
                  : []),
              ],
        })
      )
    } else {
      await interaction.editReply(
        embed({
          title: `Holy Quran, ${verses[0].chapterName.transliteration} (${verses[0].chapterName.arabic}, "${verses[0].chapterName.english}"), Verses ${query}`,
          buttons: [
            {
              text: "📖 Open in Quran",
              url: `https://www.alislam.org/quran/app/${chapter}:${verse}`,
            },
          ],
          contents: `${verses.length} verses found.`,
          fields: verses.map((v) => ({
            name: `${v.chapterName.transliteration} ${v.chapter}:${v.verse}`,
            value: v.translations.english,
          })),
        })
      )
    }
  },
} as BotCommand
