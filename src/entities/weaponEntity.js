import { chooseRandomly } from '@common/functions';
export class WeaponEntity {
    #weapons = [];
    constructor(weapons) {
        this.#weapons = weapons.map(this.#createEntity);
    }
    #createEntity(weapons) {
        return {
            name: weapons.name,
            lc: weapons.lc,
            sc: weapons.sc,
            role: weapons.role,
            range: weapons.range,
            charger: weapons.charger,
            tank: weapons.tank,
        };
    }
    getAll() {
        return this.#weapons;
    }
    selectWeapon(requireNum) {
        const allWeapons = this.getAll();
        switch (requireNum) {
            case 1: {
                // ランダムで1つ選ぶ
                const weapons = chooseRandomly(allWeapons);
                return [weapons];
            }
            case 2: {
                // 1人は短射程、もう1人は中射程あるいは長射程
                // 両方ともキル武器ではない
                const shortRanges = allWeapons.filter(v => v.range === 'SHORT');
                const shortRange = chooseRandomly(shortRanges);
                const midLongRanges = allWeapons
                    .filter(v => v.range === 'MID' || v.range === 'LONG')
                    .filter(v => shortRange.role === 'KILL' ? v.role !== 'KILL' : v);
                const midLongRange = chooseRandomly(midLongRanges);
                return [shortRange, midLongRange];
            }
            default:
                throw new Error('不正なプレイヤー数を検知しました');
        }
    }
}
