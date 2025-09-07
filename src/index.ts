import 'dotenv/config';
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import fs from "fs";
import * as Sentry from "@sentry/node";
import type { SlashCommand } from './types/SlashCommand';

// Extend the Client interface to include the commands property
declare module "discord.js" {
  interface Client {
    commands: Collection<string, SlashCommand>;
  }
}

Sentry.init({
  dsn: process.env.SENTRY_DSN
})

const client = new Client({ intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js") || file.endsWith(".ts"));
for (const file of commandFiles) {
  const command: SlashCommand = require(`./commands/${file}`);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  }
}

client.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}`);
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName)
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error);
  }
  
})

client.login(process.env.DISCORD_TOKEN);

//* Remote Control Portion
// const express = require('express');
// const app = express();
// const port = 3000;

// app.get('/status', (req, res) => {
//   res.send('Bot is running');
// })

// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// })