import { parse } from "node-html-parser"
import { createContext, runInContext } from "vm"

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
  if (process.env.UNSAFE !== "true") {
    throw new Error("The bot administrator has not enabled this command.")
  }

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

  // Create context.
  let retrievedDef: any = undefined
  const virtualenv = createContext({
    PubMain: {
      init(_: string, arr: any[][]) {
        retrievedDef = arr[0][1]
      },
    },
  })

  // Retrieve definition data.
  // Unsafe? Absolutely, which is why /dictionary is only enabled
  // when the UNSAFE environment variable is enabled and why the command
  // is currently considered experimental (pending the implementation of
  // another dictionary or at least a safer object literal parser. It's not
  // even going in the changelog (for now).
  runInContext(script, virtualenv)
  return retrievedDef as Definitions

  /*
  const [, definitionRaw] = script.match(/\[\[\d+,\s*{(.+)}\]\]/s) ?? []
  return JSON5.parse(`{${definitionRaw}}`) as Definitions // :troll:
  */
}
