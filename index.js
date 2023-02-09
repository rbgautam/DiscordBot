const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'});
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
// const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
// client.login(token);

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token