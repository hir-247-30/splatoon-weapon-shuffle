import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { err, ok } from 'neverthrow';
import { WebClient } from '@slack/web-api';
import { assertUndefined } from '@common/functions';
import { Report } from '@common/types';
import type { Result } from 'neverthrow';

export function execReport (reports: Report[]): Result<void, Error> {
    const reportType = process.env['REPORT_TYPE'];

    switch (reportType) {
        case 'DISCORD':
            reportByDiscord(reports);
            break;
        case 'SLACK':
            reportBySlack(reports);
            break;
        default:
            return err(new Error('通知先が正しくありません。'));
    }

    return ok();
}

export function buildMessage (reports: Report[]): string {
    let message = 'ブキチョイス';
    for (const report of reports) {
        message += `\n\n${report.player_name}さんのブキは「${report.weapon_name}」です`;

        if (report.weapon_role === 'FREE') {
            message += `\n今回は好きなブキを選んでください`;
        } else {
            message += `\nポジションは「${convertRange(report.weapon_range)}」、役割は「${convertRole(report.weapon_role)}」です`;
        }
    }

    return message;
}

function convertRange (range: string): string {
    const convertMap: Map<string, string> = new Map([
        ['SHORT', '前衛'],
        ['MID', '中衛'],
        ['LONG', '後衛'],
    ]);

    const displayRange = convertMap.get(range);

    assertUndefined(displayRange);

    return displayRange;
}

function convertRole (role: string): string {
    const convertMap: Map<string, string> = new Map([
        ['PAINT', '塗り'],
        ['BALANCED', '塗りとキル'],
        ['KILL', 'キル'],
        ['TANK', 'ヘイト集め'],
    ]);

    const displayRole = convertMap.get(role);

    assertUndefined(displayRole);

    return displayRole;
}

function reportByDiscord (reports: Report[]): void {
    const content = buildMessage(reports);

    const requestOptions = {
        url    : process.env['DISCORD_REPORT_URL']!,
        method : 'POST',
        data   : { content },
        headers: { 'Content-Type': 'application/json' },
    };

    axiosRequest<void | string>(requestOptions);
}

async function reportBySlack (reports: Report[]): Promise<void> {
    const text = buildMessage(reports);

    const channel = `#${process.env['SLACK_CHANNEL']!}`;
    const client = new WebClient(process.env['SLACK_BOT_OAUTH_TOKEN']!);

    await client.chat.postMessage({ channel, text });
}

async function axiosRequest<T> (requestOptions: AxiosRequestConfig): Promise<T | void> {
    return axios(requestOptions)
        .then((res: AxiosResponse<T>) => {
            return res.data;
        })
        .catch((e: AxiosError<{ error: string }>) => {
            console.log(e.message);
        }
    );
}