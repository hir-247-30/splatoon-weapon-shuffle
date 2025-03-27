import { getWeapons } from '@repositories/weaponRepository';
import { WeaponEntity } from '@common/types';

export function claimWeapons (): WeaponEntity[] {
    return getWeapons();
}

export function selectWeapons (weapons: WeaponEntity[]): WeaponEntity[] {
    return weapons;
}