require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  if (message.content.startsWith('!play')) {
    const args = message.content.split(' ');
    if (!args[1]) return message.channel.send('Please provide a YouTube link!');
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play(ytdl(args[1], { filter: 'audioonly' }));
      dispatcher.on('finish', () => {
        connection.disconnect();
      });
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
