import type { ConfigAdapter, Config } from '@common/types';

export class ServerConfigAdapter implements ConfigAdapter {
    gameVersion                 : '2' | '3';
    safetyMode                  : boolean;
    weaponBlacklist             : string[];
    weaponSmallCategoryBlacklist: string[];
    weaponLargeCategoryBlacklist: string[];

    constructor (args: {
        gameVersion?                 : '2' | '3';
        safetyMode?                  : boolean;
        weaponBlacklist?             : string[];
        weaponSmallCategoryBlacklist?: string[];
        weaponLargeCategoryBlacklist?: string[];
    } = {}) {
        const {
            gameVersion                  = (process.env['GAME_VERSION'] === '2' ? '2' : '3'),
            safetyMode                   = (process.env['SAFETY_MODE'] === undefined || !!JSON.parse(process.env['SAFETY_MODE'])),
            weaponBlacklist              = (process.env['WEAPON_BLACKLIST'] ?? '').split(',').filter(v => v !== ''),
            weaponSmallCategoryBlacklist = (process.env['WEAPON_SMALL_CATEGORY_BLACKLIST'] ?? '').split(',').filter(v => v !== ''),
            weaponLargeCategoryBlacklist = (process.env['WEAPON_LARGE_CATEGORY_BLACKLIST'] ?? '').split(',').filter(v => v !== '')
        } = args;

        this.gameVersion                  = gameVersion;
        this.safetyMode                   = safetyMode;
        this.weaponBlacklist              = weaponBlacklist;
        this.weaponSmallCategoryBlacklist = weaponSmallCategoryBlacklist;
        this.weaponLargeCategoryBlacklist = weaponLargeCategoryBlacklist;
    }

    getConfig (): Config {
        return {
            gameVersion                 : this.gameVersion,
            safetyMode                  : this.safetyMode,
            weaponBlacklist             : this.weaponBlacklist,
            weaponSmallCategoryBlacklist: this.weaponSmallCategoryBlacklist,
            weaponLargeCategoryBlacklist: this.weaponLargeCategoryBlacklist
        };
    }
}

