import  dotenv from 'dotenv';
import crypto from 'crypto';
import { serve } from '@hono/node-server';
import { Context, Hono } from 'hono';
import { messagingApi, WebhookEvent } from "@line/bot-sdk";
import { claimPlayerNames } from '@services/playerService';
import { buildMessage } from '@services/reportService';
import { errorLog } from '@services/loggingService';
import { assertUndefined } from '@common/functions';
import { Report } from '@common/types';
import { getWeaponsByNumber } from '@lib/choice';

dotenv.config({ path: '.env' });

const hono = new Hono();
const { MessagingApiClient } = messagingApi;

hono.post('/webhook', async (c: Context) => {
    const signatureAuth = await auth(c);

    if (!signatureAuth) return c.body(null, 403);

    const body = JSON.parse(await c.req.text());
    const event: WebhookEvent = body.events?.[0];

    if (event.type !== 'message') return c.body(null, 400);
    if (event.message.type !== 'text') return c.body(null, 400);

    const players = event.message.text.split('、');
	
    process.env['PLAYER_NAME_1'] = players[0] ?? '';
    process.env['PLAYER_NAME_2'] = players[1] ?? '';
    process.env['PLAYER_NAME_3'] = players[2] ?? '';
    process.env['PLAYER_NAME_4'] = players[3] ?? '';

    const playerNamesResult = claimPlayerNames();

    if (playerNamesResult.isErr()) {
        errorLog(playerNamesResult.error);
        return c.body(null, 400);
    }

    const playerNames = playerNamesResult.value;
    const weaponResult = getWeaponsByNumber(playerNames.length);

    if (weaponResult.isErr()) {
        errorLog(weaponResult.error);
        return c.body(null, 400);
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

    const client = new MessagingApiClient({
        channelAccessToken: process.env['LINE_CHANNEL_ACCESS_TOKEN']!
    });

    await client.replyMessage({
        replyToken: event.replyToken,
        messages: [{type: 'text', text: reply}],
    });

    return c.body(null, 200);
});

const server = serve({ ...hono, port: 3000 }, () => console.log('起動中'));

const auth = async function (c: Context): Promise<boolean> {
    const signature = c.req.header('x-line-signature');
    const rawBody = await c.req.text();
  
    if (signature === undefined) return false;
  
    const cry = crypto
        .createHmac('sha256', process.env['LINE_CHANNEL_ACCESS_SECRET']!)
        .update(rawBody)
        .digest('base64');
    
    return cry === signature;
};

const gracefulShutdown = function (): void {
    server.close(function () {
        console.log('終了中');
        process.exit();
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGHUP', gracefulShutdown);