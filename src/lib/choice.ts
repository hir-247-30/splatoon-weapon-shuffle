import { WEAPON, Weapon } from "../const/weapons";

const getRandomWeapon = (): Weapon => {
    // WEAPON の中からランダムに 1 つ選ぶ
    const randomIndex = Math.floor(Math.random() * WEAPON.length);
    return WEAPON[randomIndex]!;
};

const getRandomWeaponPair = (): [Weapon, Weapon] => {
    // `range` が SHORT の武器を抽出
    const shortRangeWeapons = WEAPON.filter(w => w.range === 'SHORT');
    
    // `range` が MID または LONG の武器を抽出
    const midLongWeapons = WEAPON.filter(w => w.range === 'MID' || w.range === 'LONG');

    if (shortRangeWeapons.length === 0 || midLongWeapons.length === 0) {
        throw new Error("適切な武器が見つかりませんでした。");
    }

    // SHORT の武器をランダムに 1 つ取得
    const shortWeapon = shortRangeWeapons[Math.floor(Math.random() * shortRangeWeapons.length)]!;

    let secondWeapon: Weapon;
    
    while (true) {
        // MID または LONG の武器をランダムに 1 つ取得
        const candidateWeapon = midLongWeapons[Math.floor(Math.random() * midLongWeapons.length)]!;

        // どちらかが KILL であるが、両方とも KILL にならないようにする
        const isShortKill = shortWeapon.role === 'KILL';
        const isCandidateKill = candidateWeapon.role === 'KILL';

        if (isShortKill !== isCandidateKill) {
            secondWeapon = candidateWeapon;
            break;
        }
    }
    // 順番をランダムに入れ替える
    if (Math.random() < 0.5) {
        return [secondWeapon, shortWeapon];
    }
    return [shortWeapon, secondWeapon];
};

export const getWeaponsByNumber = (num: number): Weapon[] => {
    switch (num) {
        case 1:
            return [getRandomWeapon()];
        case 2:
            return getRandomWeaponPair(); 
        case 3:
            return [getRandomWeapon(), ...getRandomWeaponPair()]; 
        case 4:
            return [...getRandomWeaponPair(), ...getRandomWeaponPair()]; 
        default:
            throw new Error("無効な番号です。1～4の値を指定してください。");
    }
};



