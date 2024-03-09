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
} from "discord.js"

import embed from "./embed"
import commands, { build } from "./commands"

// The guilds we have access to.
const guilds = process.env.GUILDS?.split(",")
if (!guilds) {
  throw new Error(
    '"GUILDS" environment variable must be set. Insert guild IDs separated by a comma.'
  )
}

// Create the client.
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on("ready", async () => {
  // Build all the commands.
  const body = commands.map((cmd) => build(cmd).toJSON())

  // Update the command on all guilds we have access to.
  const rest = new REST().setToken(process.env.DISCORD_BOT_SECRET!)
  for (const guild of guilds) {
    try {
      await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_BOT_CLIENT!, guild),
        { body }
      )
    } catch {
      // Skip for now.
    }
  }
})

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
          contents: e.message,
          color: 0xff0000,
        })
      )
    }
  }
})

client.login(process.env.DISCORD_BOT_SECRET)
