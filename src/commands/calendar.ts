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
import * as chrono from "chrono-node"
import embed from "../embed"

export default {
  name: "calendar",
  description:
    "Convert to and from the Islamic calendar. Tries its best to understand the date format you give it.",
  options: [
    {
      name: "direction",
      description: "To or from the Islamic calendar?",
      type: "options",
      choices: ["to", "from"],
      required: true,
    },

    {
      name: "date",
      description:
        'Can be a precise date, or something relative (e.g., "next friday"). Defaults to current time.',
      type: "string",
    },
  ],
  async command(interaction) {
    const direction = interaction.options.getString("direction", true)
    const date = interaction.options.getString("date")
    if (direction === "to") {
      // Input date is Gregorian, convert to Islamic.
      const parsedDate = date
        ? chrono.parseDate(date) ?? new Date()
        : new Date()
      await interaction.editReply(
        embed({
          title: Intl.DateTimeFormat("en", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(parsedDate),
          contents: `The Islamic date is ${Intl.DateTimeFormat(
            "en-u-ca-islamic-nu-latn",
            { year: "numeric", month: "long", day: "numeric" }
          ).format(parsedDate)}.`,
        })
      )
    } else {
      // Input date is Islamic, convert to Gregorian.
      // TODO
      await interaction.editReply(
        embed({
          title: "Not supported.",
          contents:
            "Conversion from Islamic to Gregorian dates is not yet supported. Sorry!",
          color: 0xff0000,
        })
      )
    }
  },
} as BotCommand
