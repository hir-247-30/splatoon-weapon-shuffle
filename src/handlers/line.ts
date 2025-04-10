import  dotenv from 'dotenv';
import crypto from 'crypto';
import { serve } from '@hono/node-server';
import { Context, Hono } from 'hono';
import { messagingApi, WebhookEvent } from "@line/bot-sdk";

dotenv.config({ path: '.env' });

const hono = new Hono();
const { MessagingApiClient } = messagingApi;

hono.post('/webhook', async (c: Context) => {
    const signatureAuth = await auth(c);
    if (!signatureAuth) {
        return c.body(null, 403);
    }

    const body = JSON.parse(await c.req.text());
    const event: WebhookEvent = body.events?.[0];
    if (event.type !== 'message') {
        return c.body(null, 200);
    }
	
    let message = '';
    if (event.message.type === 'text'){
        message = event.message.text;
    }

    const client = new MessagingApiClient({
        channelAccessToken: process.env['LINE_CHANNEL_ACCESS_TOKEN']!
    });

    await client.replyMessage({
        replyToken: event.replyToken,
        messages: [{type: 'text', text: message + 'スプラトゥーンAPI'}]
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