import { err, ok } from 'neverthrow';
import { WEAPON as WEAPON_V3 } from '@const/v3/weapons';
import { WEAPON as WEAPON_V2 } from '@const/v2/weapons';
import type { Weapon, Config, ConfigAdapter } from '@common/types';
import { chooseRandomly, shuffle, assertUndefined } from '@common/functions';
import type { Result } from 'neverthrow';

export class WeaponEntity {
    private currentConfig: Config;

    constructor (adapter: ConfigAdapter) {
        this.currentConfig = adapter.getConfig();
    }

    private getAllWeapons (): readonly Weapon[] {
        switch (this.currentConfig.gameVersion) {
            case '2':
                return WEAPON_V2;
            case '3':
                return WEAPON_V3;
            default:
                return WEAPON_V3;
        }
    }

    // ブラックリストに登録されているものを省く
    private getBlFilteredWeapon (): Weapon[] {
        const weapons = this.getAllWeapons();
        return weapons.filter(v => !this.currentConfig.weaponBlacklist.includes(v.name))
                     .filter(v => !this.currentConfig.weaponSmallCategoryBlacklist.includes(v.sc))
                     .filter(v => !this.currentConfig.weaponLargeCategoryBlacklist.includes(v.lc));
    }

    // ブキの中からランダムに1つ選ぶ
    private getRandomWeapon (): Weapon {
        const weapons = this.getBlFilteredWeapon();
        const weapon = weapons[Math.floor(Math.random() * weapons.length)];

        assertUndefined(weapon);

        return weapon;
    }

    private getRandomWeaponPair (): [Weapon, Weapon] {
        // セーフティモードでない = 編成事故防止ロジックを適用しない
        if (!this.currentConfig.safetyMode) {
            return [this.getRandomWeapon(), this.getRandomWeapon()];
        }

        // 短射程の武器をランダムに1つ取得
        const weapons = this.getBlFilteredWeapon();
        const shortRangeWeapons = weapons.filter(w => w.range === 'SHORT');

        if (!shortRangeWeapons.length) {
            return [this.getFreeWeapon(), this.getFreeWeapon()];
        }

        const shortWeapon = chooseRandomly(shortRangeWeapons);

        // 射程が MID または LONG の武器を抽出
        // どちらかが KILL であるが、両方とも KILL にならないようにする
        const midLongWeapons = weapons.filter(v => v.range === 'MID' || v.range === 'LONG');
        const midLongFiltered = midLongWeapons.filter(v => shortWeapon.role !== 'KILL' ? v.role === 'KILL' : v);

        // シューター以外のカテゴリ被りが発生しないように
        const midLongLcFiltered = midLongFiltered.filter(v => v.lc === 'SHOOTER' || v.lc !== shortWeapon.lc);
        
        if (!midLongLcFiltered.length) {
            return [shortWeapon, this.getFreeWeapon()];
        }
        
        const secondWeapon = chooseRandomly(midLongLcFiltered);

        return [shortWeapon, secondWeapon];
    }

    private getRandomWeaponTrio (): [Weapon, Weapon, Weapon] {
        // セーフティモードでない = 編成事故防止ロジックを適用しない
        if (!this.currentConfig.safetyMode) {
            return [this.getRandomWeapon(), this.getRandomWeapon(), this.getRandomWeapon()];
        }

        const weaponPair = this.getRandomWeaponPair();

        // 持っていない射程
        const weapons = this.getBlFilteredWeapon();
        const ranges = weaponPair.map(v => v.range);
        const filterRange = weapons.filter(v => !ranges.includes(v.range));

        // 持っていない役割 塗り優先
        const roles = weaponPair.map(v => v.role);
        const paintSelected = weaponPair.some(v => v.role === 'PAINT');
        const filterRangeRole = filterRange.filter(v => !paintSelected ? v.role === 'PAINT' : !roles.includes(v.role));

        // シューター以外のカテゴリ被りが発生しないように
        const largeCategories = weaponPair.map(v => v.lc);
        const filterRangeRoleLc = filterRangeRole.filter(v => v.lc === 'SHOOTER' || !largeCategories.includes(v.lc));

        if (!filterRangeRoleLc.length) {
            return [...weaponPair, this.getFreeWeapon()];
        }

        const thirdWeapon = chooseRandomly(filterRangeRoleLc);

        return [...weaponPair, thirdWeapon];
    }

    private getRandomWeaponTeam (): [Weapon, Weapon, Weapon, Weapon] {
        // セーフティモードでない = 編成事故防止ロジックを適用しない
        if (!this.currentConfig.safetyMode) {
            return [this.getRandomWeapon(), this.getRandomWeapon(), this.getRandomWeapon(), this.getRandomWeapon()];
        }

        const weaponTrio = this.getRandomWeaponTrio();

        // 2人目の短射程をチョイス
        const weapons = this.getBlFilteredWeapon();
        const filterRange = weapons.filter(v => v.range === 'SHORT');

        // シューター以外のカテゴリ被りが発生しないように
        const largeCategories = weaponTrio.map(v => v.lc);
        const filterRangeLc = filterRange.filter(v => v.lc === 'SHOOTER' || !largeCategories.includes(v.lc));

        // スモールカテゴリでの被りがないようにする
        // 例えばボールドマーカーとボールドマーカーネオなど
        const smallCategories = weaponTrio.map(v => v.sc);
        const filterRangeLcSc = filterRangeLc.filter(v => !smallCategories.includes(v.sc));

        // ヘイト役が2枚編成にならないように
        const tankSelected = weaponTrio.some(v => v.role === 'TANK');
        const filterRangeLcScRole = filterRangeLcSc.filter(v => tankSelected ? v.role !== 'TANK' : v);
        const lastWeapon = chooseRandomly(filterRangeLcScRole);

        if (!filterRangeLcScRole.length) {
            return [...weaponTrio, this.getFreeWeapon()];
        }

        return [...weaponTrio, lastWeapon];
    }

    private getFreeWeapon (): Weapon {
        const weapons = this.getAllWeapons();
        const free = weapons.find(v => v.role === 'FREE');

        assertUndefined(free);

        return free;
    }

    public getWeapons (): Result<Weapon[], Error> {
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
                return err(new Error('プレイヤー数は1～4の値を指定してください。'));
        }

        const shuffled = shuffle(weapons);
        return ok(shuffled);
    }
}



