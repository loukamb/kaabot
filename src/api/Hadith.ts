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

/**
 * Virgin API consumer:
 * - Fears HTML
 * - Has to worry about quota
 * - Limited to what the API can do
 * - Thinks that he is making his life easier
 * - Has to identify himself even for readonly APIs (!)
 * - Begs his users for oauth
 * - API provider takes away his endpoint
 * - Has to verify his email, phone, driver's license, ssn, dna sample
 * - 429 Too Many Requests
 *
 * Chad 3rd party scrapper:
 * - Even JavaScript can't stop him
 * - Pays laborers to solve captchas
 * - Doesn't even have a phone number
 * - Can work anonymously
 * - Parses HTML with regex
 * - Has no limitations, can access any data he wants
 * - Entire industries are dedicated to stopping him
 * - Website thinks his user agent is a phone
 * - Doesn't care about changes in policy
 * - Can do whatever he wants
 * - Millions of engineer hours, still can't stop him from scraping
 * - Promising career at high-frequency trading firm
 */

import { parse } from "node-html-parser"

interface Hadith {
  id: number
  bookId: string
  bookName: string

  translations: {
    arabic?: string
    english?: string
    urdu?: string
  }
}

export default async function hadith(
  bookId: string,
  reference: string
): Promise<Hadith> {
  const text = await (
    await fetch(`https://sunnah.com/${bookId}:${reference}`)
  ).text()

  // Parse HTML.
  const parsed = parse(text)

  // Get hadith container.
  const hadithContainer = parsed.querySelector(".actualHadithContainer")

  // Scrape languages.
  const arabic = hadithContainer
    ?.querySelector(".arabic_hadith_full")
    ?.text?.replace(/(\r\n|\n|\r)/gm, "")
  const english = hadithContainer
    ?.querySelector(".english_hadith_full .text_details")
    ?.text?.replace(/(\r\n|\n|\r)/gm, "")
  const urdu = hadithContainer
    ?.querySelector(".urdu_hadith_full")
    ?.text?.replace(/(\r\n|\n|\r)/gm, "")

  // Scrape metadata.
  const metadata = hadithContainer?.querySelector(
    ".hadith_reference tr td:nth-child(2)"
  )
  const [, bookName, id_str] =
    metadata?.text.match(/:\s+([a-zA-Z\s-]+)\s+(\d+)/) ?? []

  return {
    id: parseInt(id_str),
    bookName,
    bookId,
    translations: { arabic, english, urdu },
  }
}
