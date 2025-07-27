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
    gameVersion: '2' | '3';
    safetyMode: boolean;
    // 具体的な武器の名前「スプラシューターコラボ」とか
    weaponBlacklist: string[];
    // 武器種
    // 例えば「シャープマーカー」ならシャープマーカー、シャープマーカーネオ、シャープマーカーGECKが選出されなくなる
    weaponSmallCategoryBlacklist: string[]; 
    // カテゴリ
    //「CHARGER」ならチャージャー種全て選出されなくなる
    weaponLargeCategoryBlacklist: string[];
};

export interface ConfigAdapter {
    getConfig(): Config;
};