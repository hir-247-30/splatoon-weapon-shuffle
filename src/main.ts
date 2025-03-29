import  dotenv from 'dotenv';
import { claimPlayrerNames } from '@services/playerService';
import { claimWeapons } from '@services/weaponService';
import { reportByDiscord } from '@services/reportService';
import { WeaponEntity } from '@entities/weaponEntity';
import { shuffle, assertUndefined } from '@common/functions';
import { Report } from '@common/types';

dotenv.config({ path: '.env' });

function main (): void {
    const playerNames: string[] = claimPlayrerNames();
    const weaponEntity: WeaponEntity = claimWeapons();

    const weapons = weaponEntity.selectWeapon(playerNames.length);
    const shuffledPlayers = shuffle(playerNames);

    const reportPlayerWeapon: Report[] = weapons.map((weapon, i) => {
        const playerName = shuffledPlayers[i];

        assertUndefined(playerName);

        return {
            player_name: playerName,
            weapon_name: weapon.name,
        };
    });
    
    reportByDiscord(reportPlayerWeapon);
}

main();