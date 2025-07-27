export type Weapon = {
    name : string;
    lc   : string;
    sc   : string;
    role : 'PAINT' | 'BALANCED' | 'KILL' | 'TANK' | 'FREE';
    range: 'SHORT' | 'MID' | 'LONG' | 'FREE';
};

export type Report = {
    player_name : string,
    weapon_name : string,
    weapon_role : string,
    weapon_range: string,
};

export interface Config {
    playerNumber                : number;
    gameVersion                 : '2' | '3';
    safetyMode                  : boolean;
    weaponBlacklist             : string[]; // 具体的な武器の名前「スプラシューターコラボ」とか
    weaponSmallCategoryBlacklist: string[]; // 武器種 例えば「シャープマーカー」ならシャープマーカー、シャープマーカーネオ、シャープマーカーGECKが選出されなくなる
    weaponLargeCategoryBlacklist: string[]; // カテゴリ 「CHARGER」ならチャージャー種全て選出されなくなる
};

export interface ConfigAdapter {
    getConfig(): Config;
};