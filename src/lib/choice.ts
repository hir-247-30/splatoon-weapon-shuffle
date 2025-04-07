import { WEAPON, Weapon } from '@const/v3/weapons';
import { chooseRandomly, shuffle, assertUndefined } from '@common/functions';

// ブラックリストに登録されているものを省く
const getBlFilteredWeapon = (): Weapon[] => {
    // 具体的な武器の名前「スプラシューターコラボ」とか
    const weaponBl = (process.env['WEAPON_BLACKLIST'] ?? '').split(',');

    // 武器種
    // 例えば「シャープマーカー」ならシャープマーカーとシャープマーカーネオが選出されなくなる
    const weaponScBl = (process.env['WEAPON_SMALL_CATEGORY_BLACKLIST'] ?? '').split(',');

    // カテゴリ
    // 「CHARGER」ならチャージャー種全て選出されなくなる
    const weaponLcBl = (process.env['WEAPON_LARGE_CATEGORY_BLACKLIST'] ?? '').split(',');

    return WEAPON.filter(v => !weaponBl.includes(v.name))
                 .filter(v => !weaponScBl.includes(v.sc))
                 .filter(v => !weaponLcBl.includes(v.lc));
};

const getRandomWeapon = (): Weapon => {
    // WEAPON の中からランダムに1つ選ぶ
    const weapons = getBlFilteredWeapon();
    const weapon = weapons[Math.floor(Math.random() * WEAPON.length)];

    assertUndefined(weapon);

    return weapon;
};

const getRandomWeaponPair = (): [Weapon, Weapon] => {
    // SHORT の武器をランダムに1つ取得
    const weapons = getBlFilteredWeapon();
    const shortRangeWeapons = weapons.filter(w => w.range === 'SHORT');

    if (!shortRangeWeapons.length) {
        return [getFreeWeapon(), getFreeWeapon()];
    }

    const shortWeapon = chooseRandomly(shortRangeWeapons);

    // `range` が MID または LONG の武器を抽出
    // どちらかが KILL であるが、両方とも KILL にならないようにする
    const midLongWeapons = weapons.filter(w => w.range === 'MID' || w.range === 'LONG');
    const midLongFiltered = midLongWeapons.filter(v => shortWeapon.role !== 'KILL' ? v.role === 'KILL' : v);
    
    if (!shortRangeWeapons.length) {
        return [shortWeapon, getFreeWeapon()];
    }
    
    const secondWeapon = chooseRandomly(midLongFiltered);

    return [shortWeapon, secondWeapon];
};

const getRandomWeaponTrio = (): [Weapon, Weapon, Weapon] => {
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
    const free = WEAPON.find(v => v.role === 'FREE');

    assertUndefined(free);

    return free;
};

export const getWeaponsByNumber = (playerNum: number): Weapon[] => {
    switch (playerNum) {
        case 1:
            return shuffle([getRandomWeapon()]);
        case 2:
            return shuffle(getRandomWeaponPair()); 
        case 3:
            return shuffle(getRandomWeaponTrio()); 
        case 4:
            return shuffle(getRandomWeaponTeam()); 
        default:
            throw new Error('無効な番号です。1～4の値を指定してください。');
    }
};