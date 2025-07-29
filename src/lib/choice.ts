import { err, ok } from 'neverthrow';
import { WEAPON as WEAPON_V3 } from '@const/v3/weapons';
import { WEAPON as WEAPON_V2 } from '@const/v2/weapons';
import type { Weapon, Config, ConfigAdapter } from '@common/types';
import { chooseRandomly, shuffle, assertUndefined } from '@common/functions';
import type { Result } from 'neverthrow';

class WeaponEntity {
    private currentConfig: Config;

    constructor (adapter: ConfigAdapter) {
        this.currentConfig = adapter.getConfig();
    }

    private getWeapons (): readonly Weapon[] {
        switch (this.currentConfig.gameVersion) {
            case '2':
                return WEAPON_V2;
            case '3':
                return WEAPON_V3;
            default:
                return WEAPON_V3;
        }
    }

    private getBlFilteredWeapon (): Weapon[] {
        const weapons = this.getWeapons();
        return weapons.filter(v => !this.currentConfig.weaponBlacklist.includes(v.name))
                     .filter(v => !this.currentConfig.weaponSmallCategoryBlacklist.includes(v.sc))
                     .filter(v => !this.currentConfig.weaponLargeCategoryBlacklist.includes(v.lc));
    }

    private getRandomWeapon (): Weapon {
        const weapons = this.getBlFilteredWeapon();
        const weapon = weapons[Math.floor(Math.random() * weapons.length)];

        assertUndefined(weapon);

        return weapon;
    }

    private getRandomWeaponPair (): [Weapon, Weapon] {
        if (!this.currentConfig.safetyMode) {
            return [this.getRandomWeapon(), this.getRandomWeapon()];
        }

        const weapons = this.getBlFilteredWeapon();
        const shortRangeWeapons = weapons.filter(w => w.range === 'SHORT');

        if (!shortRangeWeapons.length) {
            return [this.getFreeWeapon(), this.getFreeWeapon()];
        }

        const shortWeapon = chooseRandomly(shortRangeWeapons);

        const midLongWeapons = weapons.filter(v => v.range === 'MID' || v.range === 'LONG');
        const midLongFiltered = midLongWeapons.filter(v => shortWeapon.role !== 'KILL' ? v.role === 'KILL' : v);

        const midLongLcFiltered = midLongFiltered.filter(v => v.lc === 'SHOOTER' || v.lc !== shortWeapon.lc);
        
        if (!midLongLcFiltered.length) {
            return [shortWeapon, this.getFreeWeapon()];
        }
        
        const secondWeapon = chooseRandomly(midLongLcFiltered);

        return [shortWeapon, secondWeapon];
    }

    private getRandomWeaponTrio (): [Weapon, Weapon, Weapon] {
        if (!this.currentConfig.safetyMode) {
            return [this.getRandomWeapon(), this.getRandomWeapon(), this.getRandomWeapon()];
        }

        const weaponPair = this.getRandomWeaponPair();

        const weapons = this.getBlFilteredWeapon();
        const ranges = weaponPair.map(v => v.range);
        const filterRange = weapons.filter(v => !ranges.includes(v.range));

        const roles = weaponPair.map(v => v.role);
        const paintSelected = weaponPair.some(v => v.role === 'PAINT');
        const filterRangeRole = filterRange.filter(v => !paintSelected ? v.role === 'PAINT' : !roles.includes(v.role));

        const largeCategories = weaponPair.map(v => v.lc);
        const filterRangeRoleLc = filterRangeRole.filter(v => v.lc === 'SHOOTER' || !largeCategories.includes(v.lc));

        if (!filterRangeRoleLc.length) {
            return [...weaponPair, this.getFreeWeapon()];
        }

        const thirdWeapon = chooseRandomly(filterRangeRoleLc);

        return [...weaponPair, thirdWeapon];
    }

    private getRandomWeaponTeam (): [Weapon, Weapon, Weapon, Weapon] {
        if (!this.currentConfig.safetyMode) {
            return [this.getRandomWeapon(), this.getRandomWeapon(), this.getRandomWeapon(), this.getRandomWeapon()];
        }

        const weaponTrio = this.getRandomWeaponTrio();

        const weapons = this.getBlFilteredWeapon();
        const filterRange = weapons.filter(v => v.range === 'SHORT');

        const largeCategories = weaponTrio.map(v => v.lc);
        const filterRangeLc = filterRange.filter(v => v.lc === 'SHOOTER' || !largeCategories.includes(v.lc));

        const smallCategories = weaponTrio.map(v => v.sc);
        const filterRangeLcSc = filterRangeLc.filter(v => !smallCategories.includes(v.sc));

        const tankSelected = weaponTrio.some(v => v.role === 'TANK');
        const filterRangeLcScRole = filterRangeLcSc.filter(v => tankSelected ? v.role !== 'TANK' : v);
        const lastWeapon = chooseRandomly(filterRangeLcScRole);

        if (!filterRangeLcScRole.length) {
            return [...weaponTrio, this.getFreeWeapon()];
        }

        return [...weaponTrio, lastWeapon];
    }

    private getFreeWeapon (): Weapon {
        const weapons = this.getWeapons();
        const free = weapons.find(v => v.role === 'FREE');

        assertUndefined(free);

        return free;
    }

    public getWeaponsByNumber (): Result<Weapon[], Error> {
        let weapons: Weapon[];
        switch (this.currentConfig.playerNumber) {
            case 1:
                weapons = [this.getRandomWeapon()];
                break;
            case 2:
                weapons = this.getRandomWeaponPair(); 
                break;
            case 3:
                weapons = this.getRandomWeaponTrio();
                break; 
            case 4:
                weapons = this.getRandomWeaponTeam();
                break;
            default:
                return err(new Error('無効な番号です。1～4の値を指定してください。'));
        }

        const shuffled = shuffle(weapons);
        return ok(shuffled);
    }
}

export const getWeaponsByNumber = (adapter: ConfigAdapter): Result<Weapon[], Error> => {
    const weaponEntity = new WeaponEntity(adapter);
    return weaponEntity.getWeaponsByNumber();
};


