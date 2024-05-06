import { parse } from "node-html-parser"
import JSON5 from "json5"

interface Example {
  phrase: string
  definition: string
  pronunciation?: string
}

interface Noun {
  examples: Example[]

  definitions: string[]

  forms: {
    plurals: {
      singular: string
      pronunication: string
    }[]
    singular: string
    pronunciation: string
  }[]

  dialect: boolean
  technical: boolean
  diptote: boolean
}

interface Verb {
  higher_forms: Verb[]
  form_one: {
    form_one_info: {
      medial: string[]
      masadir: {
        arabic?: string
        pronunciation: string
      }[]
      initial: string
    }[]

    form: number
    examples: Example[]
    definitions: string[]
  }
}

interface Definition {
  noun?: Noun
  verb?: Verb
  raw?: any
}

interface Definitions {
  root: string
  entries: Definition[]
}

export default async function dictionary(word: string) {
  const text = await (
    await fetch(`https://www.arabicreference.com/q/${word}`)
  ).text()

  // Keep the script!
  const parsed = parse(text, { blockTextElements: { script: true } })

  // Extract script contents out of the html.
  const script = parsed.querySelector("body script")?.textContent
  if (!script) {
    throw new Error("Couldn't look up word.")
  }

  const [, definitionRaw] = script.match(/\[\[\d+,\s*{(.+)}\]\]/s) ?? []
  return JSON5.parse(`{${definitionRaw}}`) as Definitions // :troll:
}
