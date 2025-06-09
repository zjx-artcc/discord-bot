import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from "discord.js";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN
})


const client = new Client({ intents: [GatewayIntentBits.Guilds]});

client.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}`);
})

client.login(process.env.DISCORD_TOKEN);

// Remote Control Portion
const express = require('express');
const app = express();
const port = 3000;

app.get('/status', (req, res) => {
  res.send('Bot is running');
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})

client.guilds.cache.forEach(guild => {
  console.log(guild.name);
})