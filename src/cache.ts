import { promises as fs, existsSync as exists } from "node:fs"
import path from "node:path"

import settings from "./settings"
import { type OpenQuranIdiomaticVerse } from "./api/OpenQuran"

type CacheType = {
  image: Buffer
  verse: OpenQuranIdiomaticVerse
}

const memory = {} as Record<string, any>

export default {
  async setup() {
    if ((await settings()).cache && !exists("./.cache")) {
      await fs.mkdir("./.cache")
    }
  },

  async get<T extends keyof CacheType>(type: T, key: string) {
    if (!(await settings()).cache) {
      return undefined // Cache is disabled.
    }

    if (type === "image") {
      const cachefile = path.join("./.cache", key)
      if (exists(cachefile)) {
        return (await fs.readFile(cachefile)) as CacheType[T]
      }
      return undefined
    } else if (type === "verse") {
      return memory[key] as CacheType[T]
    }
    throw new Error("Guh??")
  },

  async set<T extends keyof CacheType>(
    type: T,
    key: string,
    value: CacheType[T]
  ): Promise<CacheType[T]> {
    if (!(await settings()).cache) {
      return undefined as unknown as CacheType[T] // Cache is disabled.
    }

    if (type === "image") {
      const cachefile = path.join("./.cache", key)
      await fs.writeFile(cachefile, value as Buffer)
      return value as CacheType[T]
    } else if (type === "verse") {
      return (memory[key] = value) as CacheType[T]
    }
    throw new Error("Guh??")
  },
}
