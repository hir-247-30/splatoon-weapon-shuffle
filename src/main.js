import dotenv from 'dotenv';
import { claimPlayrerNames } from '@services/playerService';
import { claimWeapons } from '@services/weaponService';
import { reportByDiscord } from '@services/reportService';
import { shuffle, assertUndefined } from '@common/functions';
dotenv.config({ path: '.env' });
function main() {
    const playerNames = claimPlayrerNames();
    const weaponEntity = claimWeapons();
    const weapons = weaponEntity.selectWeapon(playerNames.length);
    const shuffledPlayers = shuffle(playerNames);
    const reportPlayerWeapon = weapons.map((weapon, i) => {
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
