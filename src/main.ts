import  dotenv from 'dotenv';
import { claimPlayerNamesMock } from '@services/playerService';
import {  reportByDiscordMock } from '@services/reportService';
import { shuffle } from '@common/functions';
import { Report } from '@common/types';
import { getWeaponsByNumber } from './lib/choice';

dotenv.config({ path: '.env' });

function main (): void {
    const playerNames: string[] = claimPlayerNamesMock();

    const shuffledPlayers = shuffle(playerNames);
    const weapons = getWeaponsByNumber(shuffledPlayers.length);

    const reportPlayerWeapon: Report[] = shuffledPlayers.map((playerName, index) => {
        const weapon = weapons[index];
        if (!weapon) {
            throw new Error('武器が取得できませんでした');
        }
        return{
            player_name: playerName,
            weapon_name: weapon.name,
        };
    });
    reportByDiscordMock(reportPlayerWeapon);
}

main();