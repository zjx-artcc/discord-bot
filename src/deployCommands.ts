import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { SlashCommand } from "./types/SlashCommand";
import fs from "fs";
import 'dotenv/config';
import path from "path";

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

const commandsDir = path.join(__dirname, process.env.NODE_ENV === 'production' ? "../build/commands" : "/src/commands");
console.log(commandsDir)

const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of commandFiles) {
  console.log(commandsDir)
  const command: SlashCommand = require(path.join(commandsDir,`/${file}`));
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