import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { WeaponEntity } from '@common/types';

export function reportByDiscord (weapons: WeaponEntity[]): void {
    const content = buildMessage(weapons);

    const requestOptions = {
        url    : process.env['DISCORD_WEBHOOK_URL']!,
        method : 'POST',
        data   : { content },
        headers: { 'Content-Type': 'application/json' },
    };

    axiosRequest<void | string>(requestOptions);
}

function buildMessage (weapons: WeaponEntity[]): string {
    const weaponNames: string[] = weapons.map(weapon => weapon.name );
    return `選ばれたのは${weaponNames.join('、')}だ！`;
}

async function axiosRequest<T> (requestOptions: AxiosRequestConfig): Promise<T | void> {
    return axios(requestOptions)
        .then((res: AxiosResponse<T>) => {
            return res.data;
        })
        .catch((e: AxiosError<{ error: string }>) => {
            console.log(e.message);
        }
    );
}