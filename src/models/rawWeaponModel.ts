import { RawWeapon } from '@common/types';
 
export class RawWeaponModel {
    #weapons: Set<RawWeapon>;

    constructor () {
        this.#weapons = new Set<RawWeapon>([
            this.#seed({name: 'わかばシューター', lc: 'SHOOTER', sc: 'わかばシューター', role: 'PAINT', range: 'SHORT'}),
            this.#seed({name: 'もみじシューター', lc: 'SHOOTER', sc: 'わかばシューター', role: 'PAINT', range: 'SHORT'}),
            this.#seed({name: 'ボールドマーカー', lc: 'SHOOTER', sc: 'ボールドマーカー', role: 'PAINT', range: 'SHORT'}),
            this.#seed({name: 'ボールドマーカーネオ', lc: 'SHOOTER', sc: 'ボールドマーカー', role: 'PAINT', range: 'SHORT'}),
            this.#seed({name: 'スプラシューター', lc: 'SHOOTER', sc: 'スプラシューター', role: 'BALANCED', range: 'SHORT'}),
            this.#seed({name: 'スプラシューターコラボ', lc: 'SHOOTER', sc: 'スプラシューター', role: 'BALANCED', range: 'SHORT'}),
        ]);
    }

    #seed ( args: {
        name    : string,
        lc      : string,
        sc      : string,
        role    : 'PAINT'|'BALANCED'|'KILL',
        range   : 'SHORT'|'MID'|'LONG',
        charger?: boolean,
        tank?   : boolean,
    } ): RawWeapon {
        const {
            name,
            lc,
            sc,
            role,
            range,
            charger = false,
            tank = false
        } = args;
        return { name, lc, sc, role, range, charger, tank } as RawWeapon;
    }

    getAll () {
        return [...this.#weapons];
    }
}
