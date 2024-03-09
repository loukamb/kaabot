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

export default {
  name: "source",
  description: "Retrieve the source code of the bot.",
  async command(interaction) {
    await interaction.editReply(
      embed({
        title: "Source code",
        contents: "https://github.com/mblouka/kaabot",
        fields: [
          {
            name: "License",
            value:
              "This bot is licensed under the GNU Affero General Public License (AGPL) Version 3. For more information, consult [the license file.](https://github.com/mblouka/kaabot/blob/main/LICENSE)",
          },
        ],
      })
    )
  },
} satisfies BotCommand as BotCommand
