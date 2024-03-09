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
import { sermons } from "../api/MTA"
import embed from "../embed"

export default {
  name: "sermons",
  description: "Fetch the newest and latest Friday sermon(s).",
  options: [
    {
      name: "lookup",
      description: 'Type of lookup. Defaults to "latest".',
      type: "options",
      choices: ["latest", "list"],
    },
  ],
  async command(interaction) {
    const latestSermons = await sermons()
    const lookupType = interaction.options.getString("lookup") ?? "latest"

    if (lookupType === "list") {
      await interaction.editReply(
        embed({
          title: "Last 10 Friday sermons",
          contents: latestSermons
            .map((s) => `[${s.title}](${s.uri})\n`)
            .join(""),
        })
      )
    } else {
      const latestSermon = latestSermons[0]
      await interaction.editReply(
        embed({
          color: 0x0e1f49,
          title: latestSermon.title,
          contents: latestSermon.description,
          thumbnail: latestSermon.thumbnail,
          fields: [
            {
              name: "Permalink",
              value: latestSermon.uri,
            },

            {
              name: "Direct download",
              value: latestSermon.raw!,
            },
          ],
        })
      )
    }
  },
} as BotCommand
