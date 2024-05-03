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
import cache from "../cache"

import sharp from "sharp"
import { parse } from "node-html-parser"

export default {
  name: "5v",
  description: "Retrieves verse commentary from the five volume commentary.",
  options: [
    {
      name: "query",
      description: "Chapter and verse. E.g., '1:1'.",
      type: "string",
      required: true,
    },
  ],
  async command(interaction) {
    const query = interaction.options.getString("query", true).trim()
    // Pattern match the components of the query.
    let [, chapter_str, verse_str] = query.match(/(\d+)[:\s]+(\d+)/) ?? []
    if (chapter_str === undefined) {
      throw new Error("Invalid query format.")
    }

    // See if we already have the page cached for it.
    // This will result in an arbitrary fs lookup - we really trust regex in
    // not screwing us over here :v
    const cacheId = `5v-${chapter_str}-${verse_str}.jpg`
    const cachedBuffer = await cache.get("image", cacheId)
    if (cachedBuffer !== undefined) {
      await interaction.editReply({ files: [cachedBuffer] })
      return
    }

    // Fetch 5v redirect information.
    const fvRedirect = await (
      await fetch(
        `https://www.alislam.org/quran/view/?page=0&region=E51&CR=&verse=${chapter_str}:${verse_str}`,
        { redirect: "follow" }
      )
    ).text()

    let fvPage: string

    // Did alislam.org do a good job?
    if (fvRedirect.includes("MainImage")) {
      // No additional redirect work necessary.
      fvPage = fvRedirect
    } else {
      // Do the funny page extraction.
      const segments = fvRedirect.match(/\d+&region=E\d+&CR=/)
      if (!segments?.[0]) {
        throw new Error("Five volume query failed.")
      }

      // Fetch page information.
      fvPage = await (
        await fetch(`https://www.alislam.org/quran/view/?page=${segments[0]}`)
      ).text()
    }

    // Parse the webpage.
    const fakedom = parse(fvPage)

    // Retrieve the page image.
    const mainImagePathname = fakedom
      .querySelector("#MainImage")
      ?.getAttribute("src")
    const mainImageUrl = `https://www.alislam.org${mainImagePathname}`

    // Download the image.
    const imageBuffer = await (
      await fetch(mainImageUrl, { redirect: "follow" })
    ).arrayBuffer()

    // Load the image into Sharp, flatten transparency to white background.
    const flattenedImage = await sharp(imageBuffer)
      .flatten({
        background: { r: 255, g: 255, b: 255 },
      })
      .toBuffer()

    // Post image!
    await interaction.editReply({ files: [flattenedImage] })

    // Write to cache for subsequent lookups.
    cache.set("image", cacheId, flattenedImage)
  },
} as BotCommand
