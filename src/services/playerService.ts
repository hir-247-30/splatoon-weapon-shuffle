export function claimPlayrerNames (): string[] {
    const undefinedPlayerNames = [
        process.env['PLAYER_NAME_1'],
        process.env['PLAYER_NAME_2'],
        process.env['PLAYER_NAME_3'],
        process.env['PLAYER_NAME_4']
    ];

    const tmp = undefinedPlayerNames.filter(v => v !== undefined);
    const playerNames = tmp.filter(v => v !== '');

    if (!playerNames.length) {
        throw new Error('プレイヤーを1人以上登録してください');
    }

    return playerNames;
}