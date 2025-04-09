import  dotenv from 'dotenv';
import { serve } from '@hono/node-server';
import { Context, Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { middleware, messagingApi, WebhookEvent } from "@line/bot-sdk";

dotenv.config({ path: '.env' });

const config = {
    channelAccessToken: process.env['LINE_CHANNEL_ACCESS_TOKEN']!,
    channelSecret: process.env['LINE_CHANNEL_ACCESS_SECRET']!,
};

const hono = new Hono();
const { MessagingApiClient } = messagingApi

hono.use('/webhook', logger());
hono.use('/webhook', cors());

// 認証用ミドルウェア
hono.use('/webhook', async (c: Context, next) => {
    const req = c.req.raw;
    const res = c.res;
    const lineAuth = middleware(config);
    return new Promise((resolve, reject) => {
        // Hono.js(Fetch API)と型が合わない
        // @ts-expect-error
        lineAuth(req, res, (err: unknown) => {
            if (err) reject(err);
            else resolve(next());
        });
    });
});

hono.post('/webhook', async (c: Context) => {
    const body = await c.req.json();
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

const gracefulShutdown = function() {
    server.close(function() {
        console.log('終了中');
        process.exit();
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGHUP', gracefulShutdown);