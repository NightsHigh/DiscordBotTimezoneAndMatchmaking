// src/index.js
require('dotenv').config(); // Load environment variables

const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { clientReadyHandler } = require('./events/clientReady.js');
const { interactionCreateHandler } = require('./events/interactionCreate.js');

// Import your commands
const pingCommand = require('./commands/ping');
const requestTimezoneCommand = require('./commands/requestTimezone');  // Import the new timezone command

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Message, Partials.Reaction, Partials.User],
});


client.commands = new Collection();

// Register all your commands
client.commands.set(pingCommand.data.name, pingCommand);
client.commands.set(requestTimezoneCommand.data.name, requestTimezoneCommand); // Register timezone command

client.once(Events.ClientReady, clientReadyHandler);

client.on(Events.InteractionCreate, interactionCreateHandler);

// Use TOKEN from .env file
client.login(process.env.TOKEN);
