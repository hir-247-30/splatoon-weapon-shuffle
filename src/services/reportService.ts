import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { WeaponEntity } from '@entities/weaponEntity';

export function reportByDiscord (weaponEntity: WeaponEntity): void {
    const content = buildMessage(weaponEntity);

    const requestOptions = {
        url    : process.env['DISCORD_WEBHOOK_URL']!,
        method : 'POST',
        data   : { content },
        headers: { 'Content-Type': 'application/json' },
    };

    axiosRequest<void | string>(requestOptions);
}

function buildMessage (weaponEntity: WeaponEntity): string {
    return `選ばれたのは${weaponEntity.getAll().map(v => v.name).join('、')}だ！`;
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