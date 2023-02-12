const axios = require('axios');

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Gets a random meme from https://memeapi.pythonanywhere.com/'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		// await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
        const res = await axios.get('https://api.imgflip.com/get_memes');
        if(res.data.data.memes){
            const img= res.data.data.memes[0].url;
            const memeDescription = res.data.data.memes[0].name
            // msg.channel.send("Here's your meme!"); //Replies to user command
            //msg.channel.send(img); //send the image URL
            console.log(res.data.data.memes[0].url);
            await interaction.reply(`${memeDescription}.\n${img}`);
        }else
            await interaction.reply(`No meme found for the day`);
        
	},
};