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
    throw new Error(
      "Dictionary lookup is an experimental feature, and must be manually enabled by the bot administrator."
    )
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
