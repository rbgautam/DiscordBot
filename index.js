const dotenv = require('dotenv');
const httpUploadData = require('./http/upload');
dotenv.config({path:'./config/config.env'});


const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
// const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
//,partials:[]
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}



client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.on(Events.MessageCreate, message => {
	console.log('message user = ', message.author.username);
	if (message.author === client.user) return;

	if (message.author.username === "Midjourney Bot") {
		var str = message.content;
		console.log('message attachment size = ',message.attachments.size);
		var sub = str.match(/^\*\*.*\*\*/);
		if (sub) {
			sub = sub[0];
			sub = sub.substr(2);
			sub = sub.substr(0, sub.length - 2)
			message.attachments.forEach(attachment => {
				const ImageLink = attachment.proxyURL;
				const ImageID = ImageLink.split('/');
				console.log('ImageID',ImageID[4]);
				let clientUserID = ''
				if (sub.indexOf('|') > -1){
					clientUserID = sub.split('|');
					clientUserID = clientUserID[1].split('=')[1];
					console.log('clientUserID=',clientUserID);
				}
					
				const isoStr = new Date().toISOString();
				// message.channel.send(`\`/imagine \n ${ImageLink} , ${sub}\``);
				const promptData = {'UserID':client.user.id,
									'ClientUserID': clientUserID, // always add at the end of the prompt |USERID = 45674124741|
									'ImageID' : ImageID[4], 
									'Prompt':sub,
									'ImgeURL':ImageLink,
									'Created': isoStr }
				// console.log(promptData);
				httpUploadData(promptData);

				message.channel.send(`\`/imagine \``);
				message.channel.send(`\`prompt: ${sub}\``);
				
			});
		}
		//message.channel.send('/imagine photo of a Gorgeous Asian woman, blue hair, close-up, watching camera, top view, too much fog, photorealistic, 8k');
	}
});
// Log in to Discord with your client's token
// client.login(token);

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token