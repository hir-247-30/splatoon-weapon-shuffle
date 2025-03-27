import  dotenv from 'dotenv';
import { claimWeapons } from '@services/weaponService';
import { reportByDiscord } from '@services/reportService';
import { WeaponEntity } from '@entities/weaponEntity';

dotenv.config({ path: '.env' });

function main (): void {
    const weaponEntity: WeaponEntity = claimWeapons();
    reportByDiscord(weaponEntity);
}

main();