import  dotenv from 'dotenv';
import { claimPlayerNames } from '@services/playerService';
import { buildMessage } from '@services/messageService';
import { errorLog } from '@services/loggingService';
import { assertUndefined } from '@common/functions';
import { Report } from '@common/types';
import { getWeaponsByNumber } from '@lib/choice';
import { ServerConfigAdapter } from '@adapters/server';
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

    process.env['PLAYER_NAME_1'] = players[0] ?? '';
    process.env['PLAYER_NAME_2'] = players[1] ?? '';
    process.env['PLAYER_NAME_3'] = players[2] ?? '';
    process.env['PLAYER_NAME_4'] = players[3] ?? '';

    const playerNamesResult = claimPlayerNames();

    if (playerNamesResult.isErr()) {
        errorLog(playerNamesResult.error);
        return;
    }

    const playerNames = playerNamesResult.value;
    const weaponResult = getWeaponsByNumber(new ServerConfigAdapter({playerNumber: playerNames.length}));

    if (weaponResult.isErr()) {
        errorLog(weaponResult.error);
        return;
    }

    const weapons = weaponResult.value;

    const reportPlayerWeapon: Report[] = playerNames.map((playerName, index) => {
        const weapon = weapons[index];

        assertUndefined(weapon);

        return {
            player_name : playerName,
            weapon_name : weapon.name,
            weapon_role : weapon.role,
            weapon_range: weapon.range,
        };
    });

    const reply = buildMessage(reportPlayerWeapon);

    message.channel.send(reply);
});

client.on('ready', () => {
    console.log('起動中');
});

client.login(process.env['DISCORD_BOT_TOKEN']);