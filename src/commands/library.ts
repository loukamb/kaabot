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
import { Book, Author, IdiomaticLibrary, getLibrary } from "../books"
import embed from "../embed"

import { ChatInputCommandInteraction } from "discord.js"

import { decode } from "html-entities"

function displayBook(book: Book, author: Author) {
  return embed({
    title: book.name,
    contents: decode(book.description?.trim() ?? "No description provided."),
    fields: [
      {
        name: "Read now!",
        value: book.uri_pdf,
      },
      {
        name: "Author",
        value: author.name,
      },
      {
        name: "Identifier",
        value: `\`${book.id}\``,
      },
    ],
  })
}

function tooManyBooks(count: number) {
  return embed({
    title: `Too many books to list (${count}).`,
    contents:
      "Provide a `limit` and/or a `skip` parameter to curate your search. For example, if you want to see book 20 until book 25, you can do skip=10, limit=5.",
  })
}

function getLimits(interaction: ChatInputCommandInteraction) {
  const limit = interaction.options.getNumber("limit")
  const skip = interaction.options.getNumber("skip") ?? 0
  return [limit ? Math.min(limit, 10) : 256, skip]
}

export default {
  name: "library",
  description:
    "Search and download selected writings from the Ahmadiyya Muslim Community.",
  options: [
    {
      name: "mode",
      description: "Interaction with the library",
      type: "options",
      choices: ["get", "search", "author", "list-authors", "list-books"],
      required: true,
    },

    {
      name: "query",
      description: "Parameters for mode. May be required.",
      type: "string",
    },

    {
      name: "limit",
      description: "Limit for result count. Maximum 10.",
      type: "number",
    },

    {
      name: "skip",
      description: 'Skip how many entries. Only valid if "limit" is provided..',
      type: "number",
    },
  ],
  async command(interaction) {
    const library = await getLibrary()
    if (!library) {
      throw new Error(
        'The manager of this bot hasn\'t initialized the library yet. Please run "npm run books" to fetch the books from alislam.org.'
      )
    }

    const mode = interaction.options.getString("mode", true)
    if (mode === "author") {
      const name = interaction.options
        .getString("query", true)
        .toLocaleLowerCase()

      for (const author of library.authors) {
        if (
          author.id === name ||
          author.name.toLocaleLowerCase().includes(name)
        ) {
          return await interaction.editReply(
            embed({
              title: author.name,
              contents: `Use \`/library list-books ${author.id}\` to list books from this author.`,
              fields: [
                {
                  name: "Learn more",
                  value: author.uri_library,
                },
                {
                  name: "Books written",
                  value: author.books?.length.toString() ?? "0",
                },
              ],
            })
          )
        }
      }

      return await interaction.editReply(
        embed({
          title: "No authors found.",
          contents: "Found no authors from your query. Please try again.",
        })
      )
    } else if (mode === "list-authors") {
      return await interaction.editReply(
        embed({
          title: `${library.authors.length} authors.`,
          contents:
            "Use the `/library author {id}` command to display information about an author.",
          fields: library.authors.map((author) => ({
            name: author.name,
            value: `- Books written: ${
              author.books?.length ?? 0
            }\n- Identifier: \`${author.id}\``,
          })),
        })
      )
    } else if (mode === "list-books") {
      const authorId = interaction.options
        .getString("query", true)
        .toLocaleLowerCase()

      const author = library.authors.find((author) => author.id === authorId)
      if (!author) {
        return await interaction.editReply(
          embed({
            title: "No authors found.",
            contents: "Found no authors from your query. Please try again.",
          })
        )
      }

      const [limit, skip] = getLimits(interaction)
      const books = (author.books ?? []).slice(skip).slice(0, limit)
      if (books.length > 10) {
        return await interaction.editReply(tooManyBooks(books.length))
      }

      return await interaction.editReply(
        embed({
          title: `${books.length} books found.`,
          contents:
            "Use the `/library get {id}` command to display information about a book.",
          fields: books.map((bk) => ({
            name: bk.name,
            value: `- Identifier: \`${bk.id}\``,
          })),
        })
      )
    } else if (mode === "search") {
      const title = interaction.options
        .getString("query", true)
        .toLocaleLowerCase()

      const [limit, skip] = getLimits(interaction)
      const books = library.books
        .filter((bk) => bk.name.toLocaleLowerCase().includes(title))
        .slice(skip)
        .slice(0, limit)

      if (books.length > 10) {
        return await interaction.editReply(tooManyBooks(books.length))
      }

      if (books.length === 0) {
        await interaction.editReply(
          embed({
            title: "No book found.",
            contents: `Found no books with query "${title}". Please try again.`,
          })
        )
      } else if (books.length === 1) {
        await interaction.editReply(
          displayBook(books[0], library.bookAuthors[books[0].id])
        )
      } else {
        await interaction.editReply(
          embed({
            title: `${books.length} books found.`,
            contents:
              "Use the `/library get {id}` command to display information about a book.",
            fields: books.map((bk) => ({
              name: bk.name,
              value: `- Author: ${
                library.bookAuthors[bk.id].name
              }\n- Identifier: \`${bk.id}\``,
            })),
          })
        )
      }
    } else if (mode === "get") {
      const bookId = interaction.options
        .getString("query", true)
        .toLocaleLowerCase()

      const findBook = library.books.find((bk) => bk.id === bookId)
      if (!findBook) {
        await interaction.editReply(
          embed({
            title: "No book found.",
            contents: `Found no books with identifier "${bookId}". Please try again.`,
          })
        )
      } else {
        await interaction.editReply(
          displayBook(findBook, library.bookAuthors[findBook.id])
        )
      }
    }
  },
} as BotCommand
