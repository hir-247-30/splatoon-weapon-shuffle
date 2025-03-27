import  dotenv from 'dotenv';
import { claimWeapons, selectWeapons } from '@services/weaponService';
import { reportByDiscord } from '@services/reportService';
import { WeaponEntity } from '@common/types';

dotenv.config({ path: '.env' });

function main (): void {
    const weapons: WeaponEntity[] = claimWeapons();
    const selectedWeapons: WeaponEntity[] = selectWeapons(weapons);
    reportByDiscord(selectedWeapons);
}

main();