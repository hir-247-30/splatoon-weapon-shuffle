import { serve } from '@hono/node-server';
import { Context, Hono } from 'hono';
import { logger } from 'hono/logger';

const hono = new Hono();
hono.use('*', logger());

hono.use('/msgapi', async (c: Context, next) => {
    await next();
    return c.json({ 'test': 'test' });
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