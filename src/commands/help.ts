import { BotCommand } from "."
import embed from "../embed"

export default {
  name: "help",
  description: "Retrieves information about Kaab'ot's commands.",
  async command(interaction) {
    await interaction.editReply(
      embed({
        title: "Commands",
        contents:
          "A list of core commands can be accessed [here](https://kaabot.org). For a full list, either type in `/` or consult the [repository](https://github.com/mblouka/kaabot?tab=readme-ov-file#features).",
      })
    )
  },
} as BotCommand
