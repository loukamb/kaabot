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

import embed from "../embed"
import hadith from "../api/Hadith"

export default {
  name: "hadith",
  description: "Retrieves a hadith from the many Hadith collections.",
  options: [
    {
      name: "query",
      description: "Book and id. E.g., 'bukhari:6594'.",
      type: "string",
      required: true,
    },

    {
      name: "translations",
      description: "Accepted values: en, ar, ur.",
      type: "string",
      required: false,
    },
  ],
  async command(interaction) {
    const translations = interaction.options
      .getString("translations", false)
      ?.split(",")
      .map((t) => t.toLowerCase().trim()) ?? ["en"]
    const query = interaction.options.getString("query", true).trim()
    // Pattern match the components of the query.
    let [, book_str, id_str] = query.match(/([\w\s]+)[:\s]+(\d+)/) ?? []
    if (book_str === undefined) {
      throw new Error("Invalid query format.")
    }
    book_str = book_str.toLowerCase().replace(/[\s-]/g, "")

    // Lookup the hadith.
    const foundHadith = await hadith(book_str, id_str)

    const fields = [] as { name: string; value: string }[]
    if (translations.includes("ar")) {
      fields.push({
        name: "Arabic",
        value: foundHadith.translations.arabic ?? "No Arabic text found.",
      })
    }
    if (translations.includes("ur")) {
      fields.push({
        name: "Urdu",
        value: foundHadith.translations.urdu ?? "No Urdu text found.",
      })
    }

    await interaction.editReply(
      embed({
        title: `${foundHadith.bookName} - ${foundHadith.id}`,
        contents: foundHadith.translations.english!,
        href: `https://sunnah.com/${book_str}:${id_str}`,
        fields,
        buttons: [
          {
            text: "💬 Open in Sunnah",
            url: `https://sunnah.com/${book_str}:${id_str}`,
          },
        ],
      })
    )
  },
} as BotCommand
