import { Report } from '@common/types';
import { assertUndefined } from '@common/functions';

export function buildMessage (reports: Report[]): string {
    let message = '';
    for (const report of reports) {
        message += `\n\n${report.player_name}さんのブキは「${report.weapon_name}」です。`;

        if (report.weapon_role === 'FREE') {
            message += `\n今回は好きなブキを選んでください。`;
        } else {
            message += `\nポジションは「${convertRange(report.weapon_range)}」、役割は「${convertRole(report.weapon_role)}」です。`;
        }
    }

    // 先頭の改行を削除
    return message.substring(2);
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