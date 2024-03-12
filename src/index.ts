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

import "dotenv/config"

import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder as Command,
  REST,
  Routes,
  Guild,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js"

import version from "./version"
import embed from "./embed"
import commands, { build } from "./commands"
import settings from "./settings"

const secret = process.env.DISCORD_BOT_SECRET!

// Mode. Used for the nightly bot.
const mode = process.env.MODE

// Create the client.
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})
const globalRest = new REST().setToken(secret)

let globalCmds: RESTPostAPIChatInputApplicationCommandsJSONBody[]
if (mode === "nightly") {
  globalCmds = commands.map((cmd) =>
    build({ ...cmd, name: `nightly-${cmd.name}` }).toJSON()
  )
} else {
  globalCmds = commands.map((cmd) => build(cmd).toJSON())
}

async function onGuildRecognition(
  guild: Guild,
  logCommandRegistration: boolean
) {
  console.log(`Updating commands for "${guild.name}" (${guild.id})`)
  try {
    await globalRest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_BOT_CLIENT!,
        guild.id
      ),
      { body: globalCmds }
    )
  } catch (e) {
    if (logCommandRegistration) {
      console.error(
        `Error updating commands for "${guild.name}" (${guild.id}):`
      )
      console.error(e)
    }
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return
  }

  const existingCommand = commands.find(
    (cmd) =>
      (mode === "nightly" ? `nightly-${cmd.name}` : cmd.name) ===
      interaction.commandName
  )
  if (existingCommand !== undefined) {
    const { logging } = await settings()

    if (logging?.logCommandInvocations) {
      const optionsFormatted = interaction.options.data
        .map((opt) => `${opt.name}=${opt.value?.toString() ?? "undefined"}`)
        .join(", ")
      console.log(
        `Command "${
          interaction.commandName
        }" executing with options ${optionsFormatted} by ${
          interaction.user.id
        } (${interaction.user.username}) in guild ${
          interaction.guild?.id ?? "undefined"
        } (${interaction.guild?.name ?? "undefined"})`
      )
    }

    try {
      await interaction.deferReply()
      await existingCommand.command(interaction)
    } catch (e) {
      if (logging?.logErrors?.commandRuntime) {
        console.error(e)
      }
      await interaction.editReply(
        embed({
          title: "Error.",
          contents: (e as Error).message,
          color: 0xff0000,
        })
      )
    }
  }
})

client.on("guildCreate", async (guild) => {
  console.log(`Joining guild "${guild.name}" (${guild.id})`)
  try {
    const { logging } = await settings()
    await onGuildRecognition(
      guild,
      logging?.logErrors?.commandRegistration ?? true
    )
  } catch (e) {
    console.error(e)
  }
})

client.on("guildDelete", async (guild) => {
  console.log(`Removed from guild "${guild.name}" (${guild.id})`)
})

client.on("ready", async () => {
  const { logging } = await settings()
  for (const [, guild] of client.guilds.cache) {
    try {
      await onGuildRecognition(
        guild,
        logging?.logErrors?.commandRegistration ?? true
      )
    } catch (e) {
      console.error(e)
    }
  }
})

console.log(
  `Kaab'ot ${version}${
    mode ? ` (${mode})` : ""
  } @ https://kaabot.org\nSource code available at https://github.com/mblouka/kaabot`
)

// Preload settings.
await settings()

// Start bot!
client.login(secret)
