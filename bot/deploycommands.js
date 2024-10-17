const { REST, Routes } = require('discord.js');
const { clientId, token } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandFolder = path.join(__dirname, 'commands');
	
const commandFiles = fs.readdirSync(commandFolder).filter(file => file.endsWith('.js'));
    
//get commands
for (const file of commandFiles) {

	const filePath = path.join(commandFolder, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command)
		commands.push(command.data.toJSON());
	else
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);

}

const rest = new REST().setToken(token);


//refresh the commands
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
    
})();
