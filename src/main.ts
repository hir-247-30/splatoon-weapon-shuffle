import  dotenv from 'dotenv';
import { claimPlayerNames } from '@services/playerService';
import { reportByDiscord } from '@services/reportService';
import { shuffle, assertUndefined } from '@common/functions';
import { Report } from '@common/types';
import { getWeaponsByNumber } from '@lib/choice';

dotenv.config({ path: '.env' });

function main (): void {
    const playerNames: string[] = claimPlayerNames();

    const shuffledPlayers = shuffle(playerNames);
    const weapons = getWeaponsByNumber(shuffledPlayers.length);

    const reportPlayerWeapon: Report[] = shuffledPlayers.map((playerName, index) => {
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