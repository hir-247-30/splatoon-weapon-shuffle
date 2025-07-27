import type { ConfigAdapter, Config } from '@common/types';

export class WebConfigAdapter implements ConfigAdapter {
    playerNumber                : number;
    gameVersion                 : '2' | '3';
    safetyMode                  : boolean;
    weaponBlacklist             : string[];
    weaponSmallCategoryBlacklist: string[];
    weaponLargeCategoryBlacklist: string[];

    constructor (args: {
        playerNumber?                : number;
        gameVersion?                 : '2' | '3';
        safetyMode?                  : boolean;
        weaponBlacklist?             : string[];
        weaponSmallCategoryBlacklist?: string[];
        weaponLargeCategoryBlacklist?: string[];
    } = {}) {
        const {
            playerNumber                 = 4,
            gameVersion                  = '3',
            safetyMode                   = true,
            weaponBlacklist              = [],
            weaponSmallCategoryBlacklist = [],
            weaponLargeCategoryBlacklist = []
        } = args;

        this.playerNumber                 = playerNumber;
        this.gameVersion                  = gameVersion;
        this.safetyMode                   = safetyMode;
        this.weaponBlacklist              = weaponBlacklist;
        this.weaponSmallCategoryBlacklist = weaponSmallCategoryBlacklist;
        this.weaponLargeCategoryBlacklist = weaponLargeCategoryBlacklist;
    }

    getConfig (): Config {
        return {
            playerNumber                : this.playerNumber,
            gameVersion                 : this.gameVersion,
            safetyMode                  : this.safetyMode,
            weaponBlacklist             : this.weaponBlacklist,
            weaponSmallCategoryBlacklist: this.weaponSmallCategoryBlacklist,
            weaponLargeCategoryBlacklist: this.weaponLargeCategoryBlacklist
        };
    }
}
