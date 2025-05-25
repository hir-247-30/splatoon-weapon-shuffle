import { err, ok } from 'neverthrow';
import { WEAPON as WEAPON_V3, Weapon as WeaponV3 } from '@const/v3/weapons';
import { WEAPON as WEAPON_V2, Weapon as WeaponV2 } from '@const/v2/weapons';
import { chooseRandomly, shuffle, assertUndefined } from '@common/functions';
import type { Result } from 'neverthrow';

const getWeapons = (): readonly WeaponV3[] | readonly WeaponV2[] => {
    const gameVersion = process.env['GAME_VERSION'];

    switch (gameVersion) {
        case '2':
            return WEAPON_V2;
        case '3':
            return WEAPON_V3;
        default:
            return WEAPON_V3;
    }
};

// ブラックリストに登録されているものを省く
const getBlFilteredWeapon = (): (WeaponV3 | WeaponV2)[] => {
    // 具体的な武器の名前「スプラシューターコラボ」とか
    const weaponBl = (process.env['WEAPON_BLACKLIST'] ?? '').split(',');

    // 武器種
    // 例えば「シャープマーカー」ならシャープマーカーとシャープマーカーネオが選出されなくなる
    const weaponScBl = (process.env['WEAPON_SMALL_CATEGORY_BLACKLIST'] ?? '').split(',');

    // カテゴリ
    // 「CHARGER」ならチャージャー種全て選出されなくなる
    const weaponLcBl = (process.env['WEAPON_LARGE_CATEGORY_BLACKLIST'] ?? '').split(',');

    const weapons = getWeapons();
    return weapons.filter(v => !weaponBl.includes(v.name))
                 .filter(v => !weaponScBl.includes(v.sc))
                 .filter(v => !weaponLcBl.includes(v.lc));
};

const getRandomWeapon = (): WeaponV3 | WeaponV2 => {
    // WEAPON の中からランダムに1つ選ぶ
    const weapons = getBlFilteredWeapon();
    const weapon = weapons[Math.floor(Math.random() * weapons.length)];

    assertUndefined(weapon);

    return weapon;
};

const getRandomWeaponPair = (): (WeaponV3 | WeaponV2)[] => {
    // セーフティモードでない = 編成事故防止ロジックを適用しない
    if (!isSafetyMode()) {
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

const getRandomWeaponTrio = (): (WeaponV3 | WeaponV2)[] => {
    // セーフティモードでない = 編成事故防止ロジックを適用しない
    if (!isSafetyMode()) {
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

const getRandomWeaponTeam = (): (WeaponV3 | WeaponV2)[] => {
    // セーフティモードでない = 編成事故防止ロジックを適用しない
    if (!isSafetyMode()) {
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

const getFreeWeapon = (): WeaponV3 | WeaponV3 => {
    const weapons = getWeapons();
    const free = weapons.find(v => v.role === 'FREE');

    assertUndefined(free);

    return free;
};

const isSafetyMode = (): boolean => {
    return (process.env['SAFETY_MODE'] === undefined || !!JSON.parse(process.env['SAFETY_MODE']));
};

export const getWeaponsByNumber = (playerNum: number): Result<(WeaponV3 | WeaponV2)[], Error> => {
    let weapons: (WeaponV3 | WeaponV2)[];
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