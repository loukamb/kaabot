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

import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"
import version from "./version"

interface EmbedButton {
  text: string
  emoji?: string
  url: string
}

export default function embed({
  title,
  contents,
  fields,
  color,
  image,
  thumbnail,
  buttons,
  href,
  logo,
}: {
  title: string
  contents: string
  fields?: { name: string; value: string }[]
  color?: number
  image?: string
  thumbnail?: string
  buttons?: EmbedButton[]
  href?: string
  logo?: boolean
}) {
  const components = [] as any[]
  if (buttons) {
    const row = new ActionRowBuilder().addComponents(
      buttons.map((btn) => {
        let btnbuild = new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel(btn.text)
          .setURL(btn.url)

        if (btn.emoji) {
          btnbuild = btnbuild.setEmoji(btn.emoji)
        }

        return btnbuild
      })
    )
    components.push(row)
  }

  let embed = new EmbedBuilder()
    .setColor(color ?? "#000000")
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
      iconURL: "https://www.alislam.org/images/AMC_logo.png",
    })

  if (href) {
    embed = embed.setURL(href)
  }

  if (logo) {
    embed = embed.setThumbnail("https://www.alislam.org/images/AMC_logo.png")
  }

  return {
    embeds: [embed],
    components,
  }
}
