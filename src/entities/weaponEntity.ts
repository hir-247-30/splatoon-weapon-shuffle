import { RawWeapon, WeaponEntity } from '@common/types';

export function createEntity (weapons: RawWeapon): WeaponEntity {
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