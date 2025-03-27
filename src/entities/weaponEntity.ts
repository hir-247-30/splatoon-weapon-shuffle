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
}