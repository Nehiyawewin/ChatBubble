const { Client, Collection, GatewayIntentBits } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const { token } = require('../config.json');

//setup intents
const client = new Client({ 
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
	] });


//collection for commands and cooldowns
client.commands = new Collection();
client.cooldowns = new Collection();

const commandFolder = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandFolder).filter(file => file.endsWith('.js'));

//get commands
for (const file of commandFiles) {

	const filePath = path.join(commandFolder, file);

	const command = require(filePath);

	if ('data' in command && 'execute' in command)
		client.commands.set(command.data.name, command);
	else
		console.log('[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.');
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

//execute events
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once)
		client.once(event.name, (...args) => event.execute(...args));
	else
		client.on(event.name, (...args) => event.execute(...args));
}

client.login(token);