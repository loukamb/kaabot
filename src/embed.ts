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

import { EmbedBuilder } from "discord.js"
import version from "./version"

export default function embed({
  title,
  contents,
  fields,
  color,
  image,
  thumbnail,
}: {
  title: string
  contents: string
  fields?: { name: string; value: string }[]
  color?: number
  image?: string
  thumbnail?: string
}) {
  return {
    embeds: [
      new EmbedBuilder()
        .setColor(color ?? 0x00ff00)
        .setImage(image ?? null)
        .setThumbnail(thumbnail ?? null)
        .setTitle(title)
        .setDescription(contents)
        .addFields(...(fields ?? []))
        .setTimestamp()
        .setFooter({
          text: `Kaab'ot ${version}${
            process.env.MODE ? ` (${process.env.MODE})` : ""
          }`,
        }),
    ],
  }
}
