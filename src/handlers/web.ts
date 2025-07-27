import { assertUndefined } from '@common/functions';
import { Report } from '@common/types';
import { getWeaponsByNumber } from '@lib/choice';
import { WebConfigAdapter } from '@adapters/web';
import { buildMessage } from '@services/messageService';

function main (): void {
    document.getElementById('error')!.style.display = '';

    const player1 = (document.getElementById('player1')! as HTMLInputElement).value;
    const player2 = (document.getElementById('player2')! as HTMLInputElement).value;
    const player3 = (document.getElementById('player3')! as HTMLInputElement).value;
    const player4 = (document.getElementById('player4')! as HTMLInputElement).value;

    const playerNames = [player1, player2, player3, player4].filter(v => v !== '');

    if (!playerNames.length) {
        error('プレイヤー名を1人以上入力してください！');
        return;
    }

    const gameVersion = (document.getElementById('game-version')! as HTMLSelectElement).value as '2' | '3';
    const safetyMode = (document.getElementById('safety-mode')! as HTMLInputElement).checked;
    
    // 現状ブラックリストはWeb画面のインタフェースに存在しない
    const adapter = new WebConfigAdapter({playerNumber: playerNames.length, gameVersion, safetyMode});
    const weaponResult = getWeaponsByNumber(adapter);

    if (weaponResult.isErr()) {
        error('うまく選出できなかったので、リトライしてください！');
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

    document.getElementById('result')!.innerHTML = message;
}

function error (message: string): void {
    document.getElementById('error')!.innerHTML = message;
    document.getElementById('error')!.style.display = 'block';
}

function copy (): void {
    const text = document.getElementById('result')!.innerText;

    navigator.clipboard.writeText(text)
    .then(() => {
        const resultCopyBtn = document.getElementById('copy-result')!;
        const tmp = resultCopyBtn.textContent;
        resultCopyBtn.textContent = 'コピーしました！';

        setTimeout(() => {
            resultCopyBtn.textContent = tmp;
        }, 500);
    });
}

function shareByLine (): void {
    const text = document.getElementById('result')!.innerText;
    const encoded = encodeURIComponent(text);
    const url = `https://line.me/R/share?text=${encoded}`;

    window.open(url, '_blank');
}

document.getElementById('weapon-select')!.addEventListener('click', () => {
    main();
});

document.getElementById('copy-result')!.addEventListener('click', () => {
    copy();
});

document.getElementById('share-line')!.addEventListener('click', () => {
    shareByLine();
});