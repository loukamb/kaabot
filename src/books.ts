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
