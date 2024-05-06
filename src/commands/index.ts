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

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"

// Import & export stuff.
import source from "./source"
import verse from "./verse"
import salat from "./salat"
import sermon from "./sermon"
import calendar from "./calendar"
import library from "./library"
import fivevol from "./5v"
import hadith from "./hadith"
import baiat from "./baiat"
import dictionary from "./dictionary"
import help from "./help"
export default [
  source,
  verse,
  salat,
  sermon,
  calendar,
  library,
  fivevol,
  hadith,
  baiat,
  dictionary,
  help,
]

export interface BotCommandOption {
  readonly name: string
  readonly description: string
  readonly type: "number" | "options" | "boolean" | "string"
  readonly required?: boolean
  readonly choices?: string[]
}

export interface BotCommand {
  readonly name: string
  readonly description: string
  readonly command: (interaction: ChatInputCommandInteraction) => Promise<void>
  readonly options?: BotCommandOption[]
}

export function build(command: BotCommand) {
  let bcmd = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)

  if (command.options) {
    command.options.forEach((opt) => {
      if (opt.type === "options") {
        bcmd = <any>bcmd.addStringOption((option) =>
          option
            .setName(opt.name)
            .setDescription(opt.description)
            .setRequired(opt.required ?? false)
            .setChoices(...opt.choices!.map((c) => ({ name: c, value: c })))
        )
      } else if (opt.type === "boolean") {
        bcmd = <any>bcmd.addBooleanOption((option) =>
          option
            .setName(opt.name)
            .setDescription(opt.description)
            .setRequired(opt.required ?? false)
        )
      } else if (opt.type === "number") {
        bcmd = <any>bcmd.addNumberOption((option) =>
          option
            .setName(opt.name)
            .setDescription(opt.description)
            .setRequired(opt.required ?? false)
        )
      } else if (opt.type === "string") {
        bcmd = <any>bcmd.addStringOption((option) =>
          option
            .setName(opt.name)
            .setDescription(opt.description)
            .setRequired(opt.required ?? false)
        )
      }
    })
  }

  return bcmd
}
