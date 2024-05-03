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
