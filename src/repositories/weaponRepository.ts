import { RawWeaponModel } from '@models/rawWeaponModel';
import { WeaponEntity } from '@entities/weaponEntity';
import { RawWeapon } from '@common/types';

export function getWeapons (): WeaponEntity {
    // いずれはベタ書き、KVS、RDB3種類のモデルを作成して、どれからも取得できるようにする
    // 3種類のうちどれを選択したとしても、Entityの型にして返す
    const rawWeaponModel = new RawWeaponModel();

    const allWeapons: RawWeapon[] = rawWeaponModel.getAll();

    return new WeaponEntity(allWeapons);
}