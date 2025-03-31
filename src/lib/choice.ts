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
    // `range` が SHORT の武器を抽出
    const weapons = getBlFilteredWeapon();
    const shortRangeWeapons = weapons.filter(w => w.range === 'SHORT');
    
    // `range` が MID または LONG の武器を抽出
    const midLongWeapons = weapons.filter(w => w.range === 'MID' || w.range === 'LONG');

    if (shortRangeWeapons.length === 0 || midLongWeapons.length === 0) {
        throw new Error('適切な武器が見つかりませんでした。');
    }

    // SHORT の武器をランダムに1つ取得
    const shortWeapon = chooseRandomly(shortRangeWeapons);

    let secondWeapon: Weapon;
    while (true) {
        // MID または LONG の武器をランダムに1つ取得
        const candidateWeapon = chooseRandomly(midLongWeapons);

        // どちらかが PAINT であるが、両方とも PAINT にならないようにする
        const isShortPaint = shortWeapon.role === 'PAINT';
        const isCandidatePaint = candidateWeapon.role === 'PAINT';

        if (isShortPaint !== isCandidatePaint) {
            secondWeapon = candidateWeapon;
            break;
        }
    }

    return [shortWeapon, secondWeapon];
};

const getRandomWeaponTrio = (): [Weapon, Weapon, Weapon] => {
    const weaponPair = getRandomWeaponPair();

    // 持っていない射程
    const weapons = getBlFilteredWeapon();
    const ranges = weaponPair.map(v => v.range);
    const filterRange = weapons.filter(v => !ranges.includes(v.range));

    // 持っていない役割
    const roles = weaponPair.map(v => v.role);
    const filterRangeRole = filterRange.filter(v => !roles.includes(v.role));

    // シューター以外のカテゴリ被りが発生しないように
    const largeCategories = weaponPair.map(v => v.lc);
    const filterRangeRoleLc = filterRangeRole.filter(v => v.lc === 'SHOOTER' || !largeCategories.includes(v.lc));

    if (!filterRangeRoleLc.length) {
        throw new Error('適切な武器が見つかりませんでした。');
    }

    const thirdWeapon = chooseRandomly(filterRangeRoleLc);

    return [...weaponPair, thirdWeapon];
};

const getRandomWeaponTeam = (): [Weapon, Weapon, Weapon, Weapon] => {
    const weaponTrio = getRandomWeaponTrio();

    // 長射程が2人にならないようにする
    const weapons = getBlFilteredWeapon();
    const filterRange = weapons.filter(v => v.range !== 'LONG');

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
        throw new Error('適切な武器が見つかりませんでした。');
    }

    return [...weaponTrio, lastWeapon];
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