import { chooseRandomly } from '@common/functions';
import { RawWeapon } from '@common/types';

type WeaponEntityType = {
    name   : string,
    lc     : string,
    sc     : string,
    role   : string,
    range  : string,
    charger: boolean,
    tank   : boolean,
};

export class WeaponEntity {
    #weapons: WeaponEntityType[] = [];

    constructor (weapons: RawWeapon[]){
        this.#weapons = weapons.map(this.#createEntity);
    }

    #createEntity (weapons: RawWeapon): WeaponEntityType {
        return {
            name   : weapons.name,
            lc     : weapons.lc,
            sc     : weapons.sc,
            role   : weapons.role,
            range  : weapons.range,
            charger: weapons.charger,
            tank   : weapons.tank,
        };
    }

    getAll (): WeaponEntityType[] {
        return this.#weapons;
    }

    selectWeapon (requireNum: number): WeaponEntityType[] {
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