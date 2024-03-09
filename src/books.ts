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

import { promises as fs, existsSync as exists } from "node:fs"
import path from "node:path"

export interface Author {
  id: string
  name: string
  uri_library: string
  books?: Book[]
}

export interface Book {
  id: string
  name: string
  href: string
  description?: string
  path?: string
  uri_pdf: string
}

export interface IdiomaticLibrary {
  // List of all authors.
  authors: Author[]

  // List of all books.
  books: Book[]

  // Map of book IDs to their authors.
  bookAuthors: Record<string, Author>
}

let cache: IdiomaticLibrary | undefined
export async function getLibrary() {
  if (cache !== undefined) {
    return cache
  }

  const libraryRoot = "./library"
  if (!exists(libraryRoot)) {
    // Cannot parse library.
    return undefined
  }

  const authorsRoot = path.join(libraryRoot, "authors.json")
  if (!exists(authorsRoot)) {
    // For some reason, authors.json is missing.
    return undefined
  }

  const authors = JSON.parse(
    await fs.readFile(authorsRoot, "utf-8")
  ) as Author[]

  const idiomaticLibrary = {
    authors,
    books: [],
    bookAuthors: {},
  } as IdiomaticLibrary

  for (const author of authors) {
    if (author.books) {
      idiomaticLibrary.books.push(...author.books)
      for (const book of author.books) {
        idiomaticLibrary.bookAuthors[book.id] = author
      }
    }
  }

  return (cache = idiomaticLibrary), idiomaticLibrary
}
