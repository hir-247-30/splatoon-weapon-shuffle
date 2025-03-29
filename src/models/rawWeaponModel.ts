import { RawWeapon } from '@common/types';
 
export class RawWeaponModel {
    #weapons: Set<RawWeapon>;

    constructor () {
        this.#weapons = new Set<RawWeapon>([
            this.#seed({name: 'わかばシューター', lc: 'SHOOTER', sc: 'わかばシューター', role: 'PAINT', range: 'SHORT'}),
            this.#seed({name: 'もみじシューター', lc: 'SHOOTER', sc: 'わかばシューター', role: 'PAINT', range: 'SHORT'}),
            this.#seed({name: 'ボールドマーカー', lc: 'SHOOTER', sc: 'ボールドマーカー', role: 'PAINT', range: 'SHORT'}),
            this.#seed({name: 'ボールドマーカーネオ', lc: 'SHOOTER', sc: 'ボールドマーカー', role: 'PAINT', range: 'SHORT'}),
            this.#seed({name: 'スプラシューター', lc: 'SHOOTER', sc: 'スプラシューター', role: 'BALANCED', range: 'SHORT'}),
            this.#seed({name: 'スプラシューターコラボ', lc: 'SHOOTER', sc: 'スプラシューター', role: 'BALANCED', range: 'SHORT'}),
            this.#seed({name: 'プライムシューター', lc: 'SHOOTER', sc: 'プライムシューター', role: 'KILL', range: 'MID'}),
            this.#seed({name: 'プライムシューターコラボ', lc: 'SHOOTER', sc: 'プライムシューター', role: 'KILL', range: 'MID'}),
            this.#seed({name: 'イグザミナー', lc: 'SPINNER', sc: 'イグザミナー', role: 'BALANCED', range: 'MID'}),
            this.#seed({name: 'イグザミナーヒュー', lc: 'SPINNER', sc: 'イグザミナー', role: 'BALANCED', range: 'MID'}),
            this.#seed({name: 'ジムワイパー', lc: 'WIPER', sc: 'ジムワイパー', role: 'KILL', range: 'MID'}),
            this.#seed({name: 'ジムワイパーヒュー', lc: 'WIPER', sc: 'ジムワイパー', role: 'BALANCED', range: 'MID'}),
            this.#seed({name: 'スクイックリンα', lc: 'CHARGER', sc: 'スクイックリン', role: 'KILL', range: 'MID', charger: true}),
            this.#seed({name: 'スクイックリンβ', lc: 'CHARGER', sc: 'スクイックリン', role: 'KILL', range: 'MID', charger: true}),
            this.#seed({name: 'クーゲルシュライバー', lc: 'SPINNER', sc: 'クーゲルシュライバー', role: 'BALANCED', range: 'LONG'}),
            this.#seed({name: 'クーゲルシュライバーヒュー', lc: 'SPINNER', sc: 'クーゲルシュライバー', role: 'BALANCED', range: 'LONG'}),
            this.#seed({name: 'ハイドラント', lc: 'SPINNER', sc: 'ハイドラント', role: 'KILL', range: 'LONG'}),
            this.#seed({name: 'ハイドラントカスタム', lc: 'SPINNER', sc: 'ハイドラント', role: 'KILL', range: 'LONG'}),
            this.#seed({name: 'リッター4K', lc: 'CHARGER', sc: 'リッター4K', role: 'KILL', range: 'LONG', charger: true}),
            this.#seed({name: 'リッター4Kカスタム', lc: 'CHARGER', sc: 'リッター4K', role: 'KILL', range: 'LONG', charger: true}),
        ]);
    }

    #seed ( args: {
        name    : string,
        lc      : 'SHOOTER'|'ROLLER'|'WIPER'|'SPINNER'|'CHARGER',
        sc      : string,
        role    : 'PAINT'|'BALANCED'|'KILL',
        range   : 'SHORT'|'MID'|'LONG',
        charger?: boolean,
        tank?   : boolean,
    } ): RawWeapon {
        const {
            name,
            lc,
            sc,
            role,
            range,
            charger = false,
            tank = false
        } = args;
        return { name, lc, sc, role, range, charger, tank } as RawWeapon;
    }

    getAll () {
        return [...this.#weapons];
    }
}
