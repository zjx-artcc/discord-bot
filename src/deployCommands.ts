import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { SlashCommand } from "./types/SlashCommand";
import fs from "fs";
import 'dotenv/config';

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const commandFiles = fs.readdirSync("./commands");

for (const file of commandFiles) {
  const command: SlashCommand = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Refreshing ${commands.length} slash commands`);

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
        body: commands
      }
    );

    console.log(`Successfully reloaded ${commands.length} slash commands`);
  } catch (error) {
    console.error(error);
  }
})()