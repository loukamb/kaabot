import {
  existsSync as exists,
  createWriteStream,
  promises as fs,
} from "node:fs"
import { Readable } from "node:stream"
import { finished } from "node:stream/promises"
import path from "node:path"

import { parse } from "node-html-parser"

const baseUrl = "https://www.alislam.org"

// Ruse to prevent rate limitation.
const debounce = true
const debouceTime = 500

const blacklist = [
  "Other Authors",
  "Selected Audiobooks",
  "eBooks on Apple, Google and Kindle",
  "Other Languages",
]

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function processLibrary(outPath, href, authorId) {
  const libraryPage = await (await fetch(href)).text()
  const libraryHtml = parse(libraryPage)

  const books = []
  const bookTags = libraryHtml.querySelectorAll(".LibraryBookDiv")
  for (const bookTag of bookTags) {
    const bookLink = bookTag.querySelector(".LibraryBookTitle a")
    const bookName = bookLink.innerText
    const bookId = `${authorId
      .split("-")
      .map((n) => n[0])
      .join("")}-${bookLink.attributes.href.split("/")[2]}`
    const bookHref = `${baseUrl}${bookLink.attributes.href}`

    if (debounce) {
      await sleep(debouceTime)
    }

    // Get book information.
    const bookInfoPage = await (await fetch(bookHref)).text()
    const bookInfoHtml = parse(bookInfoPage)
    const bookDescription = bookInfoHtml.querySelector(
      'span[itemprop="description"]'
    )?.innerText
    const bookPdfLink = bookInfoHtml.querySelector('a[title="Download PDF"]')
      ?.attributes.href

    if (debounce) {
      await sleep(debouceTime)
    }

    // Download book.
    let bookPath
    if (bookPdfLink === undefined) {
      console.log(`Couldn't download ${bookId}. PDF link not found.`)
    } else {
      bookPath = path.join(outPath, `${bookId}.pdf`)
      console.log(`Downloading "${bookId}" into ${bookPath}`)

      const stream = createWriteStream(bookPath)
      const { body } = await fetch(`${baseUrl}${bookPdfLink}`)
      await finished(Readable.fromWeb(body).pipe(stream))
      stream.close()
    }

    // Push book.
    books.push({
      id: bookId,
      name: bookName,
      href: bookHref,
      description: bookDescription,
      path: bookPath,
      uri_pdf: `${baseUrl}${bookPdfLink}`,
    })
  }

  return books
}

async function processAuthor(tagOfAuthor) {
  // Retrieve basic information.
  const nameTag = tagOfAuthor.querySelector(".AuthorNameDiv a")
  const name = nameTag.innerText

  // Check against blacklist.
  if (blacklist.includes(name)) {
    throw new Error(`Author "${name}" blacklisted.`)
  }

  // Get id of author and make directory.
  const authorId = nameTag.attributes.href.split("/")[2]
  const authorDir = `./library/${authorId}`
  await fs.mkdir(authorDir)

  // Retrieve & parse the library.
  const booksDir = path.join(authorDir, "books")
  await fs.mkdir(booksDir)

  const libraryHref = `${baseUrl}${nameTag.attributes.href}`
  const books = await processLibrary(booksDir, libraryHref, authorId)

  return {
    id: authorId,
    name: name,
    uri_library: libraryHref,
    books,
  }
}

if (exists("./library")) {
  await fs.rm("./library", { recursive: true })
}
await fs.mkdir("./library")

const booksPage = await (await fetch(`${baseUrl}/books/`)).text()
const booksHtml = parse(booksPage)

const authors = []
const authorTags = booksHtml.querySelectorAll(".AuthorDiv")
for (const authorTag of authorTags) {
  try {
    authors.push(await processAuthor(authorTag))
    if (debounce) {
      await sleep(debouceTime)
    }
  } catch (e) {
    console.log(`${e}`)
  }
}

await fs.writeFile(
  path.join("./library", "authors.json"),
  JSON.stringify(authors, undefined, 4),
  "utf-8"
)
