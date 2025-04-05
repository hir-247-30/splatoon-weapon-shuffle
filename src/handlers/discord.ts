import  dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

dotenv.config({ path: '.env' });

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]}
);

client.on('messageCreate', message => {
    if (message.author.bot) return;

    if(message.content === 'スプラトゥーン') {
        message.channel.send('スプラトゥーン3');
    }
});

client.on('ready', () => {
    console.log('起動中');
});

client.login(process.env['DISCORD_BOT_TOKEN']);