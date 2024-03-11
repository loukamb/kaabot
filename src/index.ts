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
} from "discord.js"

import embed from "./embed"
import commands, { build } from "./commands"

const secret = process.env.DISCORD_BOT_SECRET!

// Create the client.
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const globalRest = new REST().setToken(secret)
const globalCmds = commands.map((cmd) => build(cmd).toJSON())

async function onGuildRecognition(guild: Guild) {
  console.log(`Updating commands for "${guild.name}" (${guild.id})`)
  await globalRest.put(
    Routes.applicationGuildCommands(process.env.DISCORD_BOT_CLIENT!, guild.id),
    { body: globalCmds }
  )
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return
  }

  const existingCommand = commands.find(
    (cmd) => cmd.name === interaction.commandName
  )
  if (existingCommand !== undefined) {
    try {
      await interaction.deferReply()
      await existingCommand.command(interaction)
    } catch (e) {
      console.error(e)
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
    await onGuildRecognition(guild)
  } catch (e) {
    console.error(e)
  }
})

client.on("guildDelete", async (guild) => {
  console.log(`Removed from guild "${guild.name}" (${guild.id})`)
})

client.on("ready", async () => {
  for (const [, guild] of client.guilds.cache) {
    try {
      await onGuildRecognition(guild)
    } catch (e) {
      console.error(e)
    }
  }
})

client.login(secret)
