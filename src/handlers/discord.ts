import  dotenv from 'dotenv';
import { claimPlayerNames } from '@services/playerService';
import { buildMessage } from '@services/reportService';
import { assertUndefined } from '@common/functions';
import { Report } from '@common/types';
import { getWeaponsByNumber } from '@lib/choice';
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

    const players = message.content.split('、');

    process.env['PLAYER_NAME_1'] = players[0];
    process.env['PLAYER_NAME_2'] = players[1];
    process.env['PLAYER_NAME_3'] = players[2];
    process.env['PLAYER_NAME_4'] = players[3];

    const playerNames: string[] = claimPlayerNames();

    const weapons = getWeaponsByNumber(playerNames.length);

    const reportPlayerWeapon: Report[] = playerNames.map((playerName, index) => {
        const weapon = weapons[index];

        assertUndefined(weapon);

        return {
            player_name: playerName,
            weapon_name: weapon.name,
        };
    });

    const reply = buildMessage(reportPlayerWeapon);

    message.channel.send(reply);
});

client.on('ready', () => {
    console.log('起動中');
});

client.login(process.env['DISCORD_BOT_TOKEN']);