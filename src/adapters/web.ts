import type { ConfigAdapter, Config } from '@common/types';

export class WebConfigAdapter implements ConfigAdapter {
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
            gameVersion                  = '3',
            safetyMode                   = true,
            weaponBlacklist              = [],
            weaponSmallCategoryBlacklist = [],
            weaponLargeCategoryBlacklist = []
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
