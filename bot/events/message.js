const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const assetsPath = path.join(__dirname, '../assets/chatbubble');
const sfwFolder = path.join(assetsPath, "sfw");
const questionableFolder = path.join(assetsPath, "questionable");

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {

			var sfwImages = 0;
			var questionableImages = 0;

			for (const file of fs.readdirSync(sfwFolder))
				sfwImages++

			for (const file of fs.readdirSync(questionableFolder))
				questionableImages++

			var randomInt = getRandomInt(0, sfwImages + questionableImages);

			if (randomInt > sfwImages)
				message.reply({ files: [questionableFolder + "/" + (randomInt - sfwImages) + ".png"] });
			else
				message.reply({ files: [sfwFolder + "/" + randomInt + ".png"] });
		

	},
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * ((max) - min) ) + min;
}