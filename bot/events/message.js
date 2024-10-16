const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {

		const assetsPath = path.join(__dirname, '../assets/chatbubble');
		const sfwFolder = path.join(assetsPath, "sfw");
		const questionableFolder = path.join(assetsPath, "questionable");

		if (message.author == 12345678910) {

			var sfwImages = 0;
			var questionableImages = 0;

			for (const file of fs.readdirSync(sfwFolder))
				sfwImages++

			for (const file of fs.readdirSync(questionableFolder))
				questionableImages++

			var randomInt = getRandomInt(1, sfwImages + questionableImages);

			if (randomInt > sfwImages)
				message.reply({ files: [questionableFolder + "/" + (randomInt - sfwImages) + ".png"] });
			else
				message.reply({ files: [sfwFolder + "/" + randomInt + ".png"] });
		
		}
	},
};