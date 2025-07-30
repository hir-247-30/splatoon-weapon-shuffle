import  dotenv from 'dotenv';
import { claimPlayerNames } from '@services/playerService';
import { buildMessage } from '@services/messageService';
import { execReport } from '@services/reportService';
import { errorLog } from '@services/loggingService';
import { assertUndefined } from '@common/functions';
import { Report } from '@common/types';
import { WeaponEntity } from '@domain/WeaponEntity';
import { ServerConfigAdapter } from '@adapters/server';

dotenv.config({ path: '.env' });

function main (): void {
    const playerNamesResult = claimPlayerNames();

    if (playerNamesResult.isErr()) {
        errorLog(playerNamesResult.error);
        console.error(playerNamesResult.error.message);
        return;
    }

    const playerNames = playerNamesResult.value;
    const weaponEntity = new WeaponEntity(new ServerConfigAdapter({playerNumber: playerNames.length}));
    const weaponResult = weaponEntity.getWeapons();

    if (weaponResult.isErr()) {
        errorLog(weaponResult.error);
        console.error(weaponResult.error.message);
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
        console.error(reportResult.error.message);
        return;
    }
}

main();