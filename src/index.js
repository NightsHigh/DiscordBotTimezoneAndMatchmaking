require('dotenv').config(); // Load environment variables

const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { clientReadyHandler } = require('./events/clientReady.js');
const { interactionCreateHandler } = require('./events/interactionCreate.js');

// Import your commands
const pingCommand = require('./commands/ping');
const requestTimezoneCommand = require('./commands/requestTimezone');  // Existing timezone command
const availabilityCommand = require('./commands/availability');        // New availability command
const viewAvailabilityCommand = require('./commands/view_availability'); // New view availability command
const deleteAvailabilityCommand = require('./commands/delete_availability');
const updateAvailabilityCommand = require('./commands/update_availability');
const viewOthersAvailabilityCommand = require('./commands/view_others_availability');

// Create a new client instance
const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Message, Partials.Reaction, Partials.User],
});

// Create a collection to store commands
client.commands = new Collection();

// Register all your commands
client.commands.set(pingCommand.data.name, pingCommand);
client.commands.set(requestTimezoneCommand.data.name, requestTimezoneCommand);
client.commands.set(availabilityCommand.data.name, availabilityCommand);          // Register availability command
client.commands.set(viewAvailabilityCommand.data.name, viewAvailabilityCommand);  // Register view availability command
client.commands.set(deleteAvailabilityCommand.data.name, deleteAvailabilityCommand); // Register delete availability command
client.commands.set(updateAvailabilityCommand.data.name, updateAvailabilityCommand); // Register update availability command
client.commands.set(viewOthersAvailabilityCommand.data.name, viewOthersAvailabilityCommand); // Register view others' availability command

// Event handlers
client.once(Events.ClientReady, clientReadyHandler);
client.on(Events.InteractionCreate, interactionCreateHandler);

// Use TOKEN from .env file
client.login(process.env.TOKEN);