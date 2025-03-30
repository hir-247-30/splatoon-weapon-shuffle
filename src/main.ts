import  dotenv from 'dotenv';
import { claimPlayerNames } from '@services/playerService';
import { reportByDiscord } from '@services/reportService';
import { assertUndefined } from '@common/functions';
import { Report } from '@common/types';
import { getWeaponsByNumber } from '@lib/choice';

dotenv.config({ path: '.env' });

function main (): void {
    const playerNames: string[] = claimPlayerNames();

    const weapons = getWeaponsByNumber(playerNames.length);

    const reportPlayerWeapon: Report[] = playerNames.map((playerName, index) => {
        const weapon = weapons[index];

        assertUndefined(weapon);

        return{
            player_name: playerName,
            weapon_name: weapon.name,
        };
    });
    reportByDiscord(reportPlayerWeapon);
}

main();