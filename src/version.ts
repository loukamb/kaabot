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

import fs from "node:fs"
import { version as nodeVersion } from "../package.json"

function commit() {
  const rev = fs
    .readFileSync(".git/HEAD")
    .toString()
    .trim()
    .split(/.*[: ]/)
    .slice(-1)[0]
  if (rev.indexOf("/") === -1) {
    return rev
  } else {
    return fs
      .readFileSync(".git/" + rev)
      .toString()
      .trim()
  }
}

let cache: string | undefined
export default function version() {
  return (
    cache ??
    (cache =
      process.env.MODE === "nightly"
        ? `nightly-${commit().substring(0, 7)}`
        : nodeVersion)
  )
}
