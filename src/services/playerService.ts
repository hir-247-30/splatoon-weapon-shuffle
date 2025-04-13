import { err, ok } from 'neverthrow';
import type { Result } from 'neverthrow';

export function claimPlayerNames (): Result<string[], Error> {
    const undefinedPlayerNames = [
        process.env['PLAYER_NAME_1'],
        process.env['PLAYER_NAME_2'],
        process.env['PLAYER_NAME_3'],
        process.env['PLAYER_NAME_4']
    ];

    const tmp = undefinedPlayerNames.filter(v => v !== undefined);
    const playerNames = tmp.filter(v => v !== '');

    if (!playerNames.length) {
        return err(new Error('プレイヤーを1人以上登録してください。'));
    }

    return ok(playerNames);
}