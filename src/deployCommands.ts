import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { SlashCommand } from "./types/SlashCommand";
import fs from "fs";
import { config } from "./config";
import 'dotenv/config';

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const commandFiles = fs.readdirSync("./src/commands");

for (const file of commandFiles) {
  const command: SlashCommand = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Refreshing ${commands.length} slash commands`);

    const data = await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId), {
        body: commands
      }
    );

    console.log(`Successfully reloaded ${commands.length} slash commands`);
  } catch (error) {
    console.error(error);
  }
})()