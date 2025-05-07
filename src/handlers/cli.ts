import  dotenv from 'dotenv';
import { claimPlayerNames } from '@services/playerService';
import { buildMessage } from '@services/messageService';
import { execReport } from '@services/reportService';
import { errorLog } from '@services/loggingService';
import { assertUndefined } from '@common/functions';
import { Report } from '@common/types';
import { getWeaponsByNumber } from '@lib/choice';

dotenv.config({ path: '.env' });

function main (): void {
    const playerNamesResult = claimPlayerNames();

    if (playerNamesResult.isErr()) {
        errorLog(playerNamesResult.error);
        return;
    }

    const playerNames = playerNamesResult.value;
    const weaponResult = getWeaponsByNumber(playerNames.length);

    if (weaponResult.isErr()) {
        errorLog(weaponResult.error);
        return;
    }

    const weapons = weaponResult.value;
    const reportPlayerWeapon: Report[] = playerNames.map((playerName, index) => {
        const weapon = weapons[index];

        assertUndefined(weapon);

        return {
            player_name : playerName,
            weapon_name : weapon.name,
            weapon_role : weapon.role,
            weapon_range: weapon.range,
        };
    });

    const message = buildMessage(reportPlayerWeapon);
    const reportResult = execReport(message);

    if (reportResult.isErr()) {
        errorLog(reportResult.error);
    }
}

main();