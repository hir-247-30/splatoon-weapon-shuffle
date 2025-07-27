import type { WeaponConfig, ConfigAdapter } from '@common/types';

// サーバー用
export class ServerConfigAdapter implements ConfigAdapter {
    getConfig (): WeaponConfig {
        return {
            gameVersion: (process.env['GAME_VERSION'] === '2' ? '2' : '3'),
            safetyMode: (process.env['SAFETY_MODE'] === undefined || !!JSON.parse(process.env['SAFETY_MODE'])),
            // 具体的な武器の名前「スプラシューターコラボ」とか
            weaponBlacklist: (process.env['WEAPON_BLACKLIST'] ?? '').split(',').filter(v => v !== ''),
            // 武器種
            // 例えば「シャープマーカー」ならシャープマーカー、シャープマーカーネオ、シャープマーカーGECKが選出されなくなる
            weaponSmallCategoryBlacklist: (process.env['WEAPON_SMALL_CATEGORY_BLACKLIST'] ?? '').split(',').filter(v => v !== ''),
            // カテゴリ
            //「CHARGER」ならチャージャー種全て選出されなくなる
            weaponLargeCategoryBlacklist: (process.env['WEAPON_LARGE_CATEGORY_BLACKLIST'] ?? '').split(',').filter(v => v !== '')
        };
    }
}

// Web画面用
export class WebConfigAdapter implements ConfigAdapter {
    constructor (
        private gameVersion: '2' | '3',
        private safetyMode: boolean
    ) {}

    getConfig (): WeaponConfig {
        return {
            gameVersion: this.gameVersion,
            safetyMode: this.safetyMode,
            // Webでは画面上から自由に設定
            weaponBlacklist: [],
            weaponSmallCategoryBlacklist: [],
            weaponLargeCategoryBlacklist: []
        };
    }
}

// Discord用
export class DiscordConfigAdapter implements ConfigAdapter {
    constructor (private messageOverrides?: Partial<WeaponConfig>) {}

    getConfig (): WeaponConfig {
        const baseConfig = new ServerConfigAdapter().getConfig();
        return {
            ...baseConfig,
            ...this.messageOverrides
        };
    }
}

// LINE用
export class LineConfigAdapter implements ConfigAdapter {
    constructor (private messageOverrides?: Partial<WeaponConfig>) {}

    getConfig (): WeaponConfig {
        const baseConfig = new ServerConfigAdapter().getConfig();
        return {
            ...baseConfig,
            ...this.messageOverrides
        };
    }
}