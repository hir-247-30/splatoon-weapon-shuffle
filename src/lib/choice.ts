import { WEAPON, Weapon } from "@const/weapons";
import { chooseRandomly, shuffle, assertUndefined } from '@common/functions';

const getRandomWeapon = (): Weapon => {
    // WEAPON の中からランダムに1つ選ぶ
    const weapon = WEAPON[Math.floor(Math.random() * WEAPON.length)];

    assertUndefined(weapon);

    return weapon;
};

const getRandomWeaponPair = (): [Weapon, Weapon] => {
    // `range` が SHORT の武器を抽出
    const shortRangeWeapons = WEAPON.filter(w => w.range === 'SHORT');
    
    // `range` が MID または LONG の武器を抽出
    const midLongWeapons = WEAPON.filter(w => w.range === 'MID' || w.range === 'LONG');

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
    const ranges = weaponPair.map(v => v.range);
    const filterRange = WEAPON.filter(v => !ranges.includes(v.range));

    // 持っていない役割
    const roles = weaponPair.map(v => v.role);
    const filterRangeRole = filterRange.filter(v => !roles.includes(v.role));

    // チャージャー2枚編成にならないように
    const chargerSelected = weaponPair.some(v => v.lc === 'CHARGER');
    const filterRangeRoleCharger = filterRangeRole.filter(v => chargerSelected ? v.lc !== 'CHARGER' : v);

    const thirdWeapon = chooseRandomly(filterRangeRoleCharger);

    return [...weaponPair, thirdWeapon];
};

const getRandomWeaponTeam = (): [Weapon, Weapon, Weapon, Weapon] => {
    const weaponTrio = getRandomWeaponTrio();

    // 長射程が2人にならないようにする
    const filterRange = WEAPON.filter(v => v.range !== 'LONG');

    // スモールカテゴリでの被りがないようにする
    // 例えばボールドマーカーとボールドマーカーネオなど
    const smallCategories = weaponTrio.map(v => v.sc);
    const filterRangeSc = filterRange.filter(v => !smallCategories.includes(v.sc));

    // チャージャー2枚編成にならないように
    const chargerSelected = weaponTrio.some(v => v.lc === 'CHARGER');
    const filterRangeScCharger = filterRangeSc.filter(v => chargerSelected ? v.lc !== 'CHARGER' : v);

    const lastWeapon = chooseRandomly(filterRangeScCharger);

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