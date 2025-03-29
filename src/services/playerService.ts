export function claimPlayerNames (): string[] {
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

export function claimPlayerNamesMock (): string[] {
    // コマンドライン引数からプレイヤー名を取得
    const playerNames = process.argv.slice(2).filter(v => v !== '');

    if (!playerNames.length) {
        throw new Error('プレイヤーを1人以上登録してください');
    }
    
    return playerNames;
}
