import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Report } from '@common/types';

export function reportByDiscord (reports: Report[]): void {
    const content = buildMessage(reports);

    const requestOptions = {
        url    : process.env['DISCORD_WEBHOOK_URL']!,
        method : 'POST',
        data   : { content },
        headers: { 'Content-Type': 'application/json' },
    };

    axiosRequest<void | string>(requestOptions);
}

export function reportByDiscordMock (reports: Report[]): void {
    console.dir(reports, { depth: null });
}

function buildMessage (reports: Report[]): string {
    let message = 'ブキチョイス';
    reports.forEach(report => {
        message += `\n${report.player_name}さんのブキは、「${report.weapon_name}」です`;
    });
    return message;
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