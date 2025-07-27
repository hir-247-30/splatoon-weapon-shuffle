import { err, ok } from 'neverthrow';
import { WEAPON as WEAPON_V3 } from '@const/v3/weapons';
import { WEAPON as WEAPON_V2 } from '@const/v2/weapons';
import type { Weapon, Config, ConfigAdapter } from '@common/types';
import { chooseRandomly, shuffle, assertUndefined } from '@common/functions';
import type { Result } from 'neverthrow';
import { ServerConfigAdapter } from '@adapters/server';

let currentConfig: Config | null = null;

const setWeaponContext = (adapter: ConfigAdapter): void => {
    currentConfig = adapter.getConfig();
};

const getWeaponContext = (): Config => {
    if (!currentConfig) {
        currentConfig = new ServerConfigAdapter().getConfig();
    }
    return currentConfig;
};

const getWeapons = (): readonly Weapon[] => {
    const config = getWeaponContext();
    switch (config.gameVersion) {
        case '2':
            return WEAPON_V2;
        case '3':
            return WEAPON_V3;
        default:
            return WEAPON_V3;
    }
};

// ブラックリストに登録されているものを省く
const getBlFilteredWeapon = (): Weapon[] => {
    const config = getWeaponContext();
    const weapons = getWeapons();
    return weapons.filter(v => !config.weaponBlacklist.includes(v.name))
                 .filter(v => !config.weaponSmallCategoryBlacklist.includes(v.sc))
                 .filter(v => !config.weaponLargeCategoryBlacklist.includes(v.lc));
};

const getRandomWeapon = (): Weapon => {
    // WEAPON の中からランダムに1つ選ぶ
    const weapons = getBlFilteredWeapon();
    const weapon = weapons[Math.floor(Math.random() * weapons.length)];

    assertUndefined(weapon);

    return weapon;
};

const getRandomWeaponPair = (): [Weapon, Weapon] => {
    const config = getWeaponContext();
    // セーフティモードでない = 編成事故防止ロジックを適用しない
    if (!config.safetyMode) {
        return [getRandomWeapon(), getRandomWeapon()];
    }

    // SHORT の武器をランダムに1つ取得
    const weapons = getBlFilteredWeapon();
    const shortRangeWeapons = weapons.filter(w => w.range === 'SHORT');

    if (!shortRangeWeapons.length) {
        return [getFreeWeapon(), getFreeWeapon()];
    }

    const shortWeapon = chooseRandomly(shortRangeWeapons);

    // `range` が MID または LONG の武器を抽出
    // どちらかが KILL であるが、両方とも KILL にならないようにする
    const midLongWeapons = weapons.filter(v => v.range === 'MID' || v.range === 'LONG');
    const midLongFiltered = midLongWeapons.filter(v => shortWeapon.role !== 'KILL' ? v.role === 'KILL' : v);

    // シューター以外のカテゴリ被りが発生しないように
    const midLongLcFiltered = midLongFiltered.filter(v => v.lc === 'SHOOTER' || v.lc !== shortWeapon.lc);
    
    if (!midLongLcFiltered.length) {
        return [shortWeapon, getFreeWeapon()];
    }
    
    const secondWeapon = chooseRandomly(midLongLcFiltered);

    return [shortWeapon, secondWeapon];
};

const getRandomWeaponTrio = (): [Weapon, Weapon, Weapon] => {
    const config = getWeaponContext();
    // セーフティモードでない = 編成事故防止ロジックを適用しない
    if (!config.safetyMode) {
        return [getRandomWeapon(), getRandomWeapon(), getRandomWeapon()];
    }

    const weaponPair = getRandomWeaponPair();

    // 持っていない射程
    const weapons = getBlFilteredWeapon();
    const ranges = weaponPair.map(v => v.range);
    const filterRange = weapons.filter(v => !ranges.includes(v.range));

    // 持っていない役割 塗り優先
    const roles = weaponPair.map(v => v.role);
    const paintSelected = weaponPair.some(v => v.role === 'PAINT');
    const filterRangeRole = filterRange.filter(v => !paintSelected ? v.role === 'PAINT' : !roles.includes(v.role));

    // シューター以外のカテゴリ被りが発生しないように
    const largeCategories = weaponPair.map(v => v.lc);
    const filterRangeRoleLc = filterRangeRole.filter(v => v.lc === 'SHOOTER' || !largeCategories.includes(v.lc));

    if (!filterRangeRoleLc.length) {
        return [...weaponPair, getFreeWeapon()];
    }

    const thirdWeapon = chooseRandomly(filterRangeRoleLc);

    return [...weaponPair, thirdWeapon];
};

const getRandomWeaponTeam = (): [Weapon, Weapon, Weapon, Weapon] => {
    const config = getWeaponContext();
    // セーフティモードでない = 編成事故防止ロジックを適用しない
    if (!config.safetyMode) {
        return [getRandomWeapon(), getRandomWeapon(), getRandomWeapon(), getRandomWeapon()];
    }

    const weaponTrio = getRandomWeaponTrio();

    // 2人目の短射程
    const weapons = getBlFilteredWeapon();
    const filterRange = weapons.filter(v => v.range === 'SHORT');

    // シューター以外のカテゴリ被りが発生しないように
    const largeCategories = weaponTrio.map(v => v.lc);
    const filterRangeLc = filterRange.filter(v => v.lc === 'SHOOTER' || !largeCategories.includes(v.lc));

    // スモールカテゴリでの被りがないようにする
    // 例えばボールドマーカーとボールドマーカーネオなど
    const smallCategories = weaponTrio.map(v => v.sc);
    const filterRangeLcSc = filterRangeLc.filter(v => !smallCategories.includes(v.sc));

    // ヘイト役が2枚編成にならないように
    const tankSelected = weaponTrio.some(v => v.role === 'TANK');
    const filterRangeLcScRole = filterRangeLcSc.filter(v => tankSelected ? v.role !== 'TANK' : v);
    const lastWeapon = chooseRandomly(filterRangeLcScRole);

    if (!filterRangeLcScRole.length) {
        return [...weaponTrio, getFreeWeapon()];
    }

    return [...weaponTrio, lastWeapon];
};

const getFreeWeapon = (): Weapon => {
    const weapons = getWeapons();
    const free = weapons.find(v => v.role === 'FREE');

    assertUndefined(free);

    return free;
};

export const getWeaponsByNumber = (
    playerNum: number, 
    adapter: ConfigAdapter
): Result<Weapon[], Error> => {
    setWeaponContext(adapter);
    
    let weapons: Weapon[];
    switch (playerNum) {
        case 1:
            weapons = [getRandomWeapon()];
            break;
        case 2:
            weapons = getRandomWeaponPair(); 
            break;
        case 3:
            weapons = getRandomWeaponTrio();
            break; 
        case 4:
            weapons = getRandomWeaponTeam();
            break;
        default:
            return err(new Error('無効な番号です。1～4の値を指定してください。'));
    }

    const shuffled = shuffle(weapons);
    return ok(shuffled);
};

// TODO 消す
export const getWeaponsByNumberLegacy = (playerNum: number): Result<Weapon[], Error> => {
    return getWeaponsByNumber(playerNum, new ServerConfigAdapter());
};

