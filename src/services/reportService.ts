import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Report } from '@common/types';

export function execReport (reports: Report[]): void {
    const reportType = process.env['REPORT_TYPE'];

    switch (reportType) {
        case 'DISCORD':
            reportByDiscord(reports);
            break;
        default:
            throw new Error('通知先が正しくありません。');
    }
}

function reportByDiscord (reports: Report[]): void {
    const content = buildMessage(reports);

    const requestOptions = {
        url    : process.env['REPORT_URL']!,
        method : 'POST',
        data   : { content },
        headers: { 'Content-Type': 'application/json' },
    };

    axiosRequest<void | string>(requestOptions);
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