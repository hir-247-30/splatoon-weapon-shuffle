import { getWeapons } from '@repositories/weaponRepository';
import { WeaponEntity } from '@entities/weaponEntity';

export function claimWeapons (): WeaponEntity {
    return getWeapons();
}