const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('chatbubble')
		.setDescription('Sends a chatbubble to mock the last user.')
		.addBooleanOption(option =>
            option.setName('questionable')
                .setRequired(true)
                .setDescription('Include questionably sfw images.')),
	async execute(interaction) {

        await interaction.reply({ content: 'Ok! Sending now!', ephemeral: true });

		console.log("Trying to send a chat bubble image to user")

        var questionable = interaction.options.getBoolean("questionable");

		sendChatBubble(interaction, questionable);
	},
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendChatBubble(interaction, questionable) {
	
	const assetsPath = path.join(__dirname, '../assets/chatbubble');
	const sfwFolder = path.join(assetsPath, "sfw");
	const questionableFolder = path.join(assetsPath, "questionable");

	var sfwImages = 0;
	var questionableImages = 0;

	for (const file of fs.readdirSync(sfwFolder)) {
		if (file.toLowerCase().indexOf(".png") >= 0)
			sfwImages++
	}

	for (const file of fs.readdirSync(questionableFolder)) {
		if (file.toLowerCase().indexOf(".png") >= 0)
			questionableImages++
	}

	var randomInt = getRandomInt(0, sfwImages + questionableImages);

	console.log("Sfw Images: " + sfwImages)
	console.log("Questionable Images: " + questionableImages)
	console.log("Total Images: " + (sfwImages + questionableImages))
	console.log("Random: " + randomInt)

	if (randomInt > sfwImages)
		console.log("Random - Sfw Images: " + (randomInt - sfwImages))

	if (questionable) {

		if (randomInt > sfwImages)
			interaction.channel.messages.fetch({ limit: 1 }).then((messages) => messages.last().reply({ files: [questionableFolder + "/" + (randomInt - sfwImages) + ".png"] }));
		else
			interaction.channel.messages.fetch({ limit: 1 }).then((messages) => messages.last().reply({ files: [sfwFolder + "/" + randomInt + ".png"] }));

	} else {
		interaction.channel.messages.fetch({ limit: 1 }).then((messages) => messages.last().reply({ files: [sfwFolder + "/" + getRandomInt(0, sfwImages) + ".png"] }));
	}

}