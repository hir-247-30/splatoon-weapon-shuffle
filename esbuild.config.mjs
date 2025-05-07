import * as esbuild from 'esbuild';
import dotenv from 'dotenv';

dotenv.config();

// .envを注入
const define = Object.fromEntries(
    Object.entries(process.env).map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)])
);

await esbuild.build({
    entryPoints: ['src/handlers/web.ts'],
    bundle     : true,
    outfile    : 'public/splatoon.js',
    platform   : 'browser',
    format     : 'esm',
    define,
}).catch(() => process.exit(1));