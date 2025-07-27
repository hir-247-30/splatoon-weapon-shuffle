import { assert } from 'chai';
import { describe, it } from 'mocha';
import { getWeaponsByNumberLegacy as getWeaponsByNumber } from '@lib/choice';

describe('choice', () => {
    const LOOP = 1000;

    it('two players choice', () => {
        let actualLoop = 0;
        for (let i = 0; i < LOOP; i++) {
            const weaponResult = getWeaponsByNumber(2);

            if (weaponResult.isErr()) {
                assert.deepEqual(weaponResult.isErr(), false, 'Error occurred while getting 2 weapons');
                break;
            }
        
            const weapons = weaponResult.value;
        
            // 選出ができなかった場合はスキップ
            const free = weapons.find(v => v.role === 'FREE');
            if (free !== undefined) {
                actualLoop++;
                continue;
            }

            // 短射程が1人
            const shorts = weapons.filter(v => v.range === 'SHORT');

            const rangeJudge = (shorts.some(v => v === undefined) && shorts.length > 1);
            if (rangeJudge) {
                console.log(weapons);
                assert.deepEqual(rangeJudge, false, 'range conditions went wrong');
                break;
            }

            // キル武器がいるか
            const kill  = weapons.find(v => v.role === 'KILL');

            const roleJudge = (kill === undefined);
            if (roleJudge) {
                console.log(weapons);
                assert.deepEqual(roleJudge, false, 'role conditions went wrong');
                break;
            }

            // シューター以外のカテゴリ被りが発生していないか
            const lc = weapons.map(v => v.lc).filter(v => v !== 'SHOOTER');
            const lcJudge = new Set(lc).size !== lc.length;
            if (lcJudge) {
                console.log(weapons);
                assert.deepEqual(lcJudge, false, 'large category conditions went wrong');
                break;
            }

            actualLoop++;
        }

        assert.deepEqual(actualLoop, LOOP);
    });

    it('three players choice', () => {
        let actualLoop = 0;
        for (let i = 0; i < LOOP; i++) {
            const weaponResult = getWeaponsByNumber(3);

            if (weaponResult.isErr()) {
                assert.deepEqual(weaponResult.isErr(), false, 'Error occurred while getting 3 weapons');
                break;
            }
        
            const weapons = weaponResult.value;
        
            // 選出ができなかった場合はスキップ
            const free = weapons.find(v => v.role === 'FREE');
            if (free !== undefined) {
                actualLoop++;
                continue;
            }

            // 全ての射程が揃っているか
            const short = weapons.find(v => v.range === 'SHORT');
            const mid   = weapons.find(v => v.range === 'MID');
            const long  = weapons.find(v => v.range === 'LONG');

            const rangeJudge = [short, mid, long].some(v => v === undefined);
            if (rangeJudge) {
                console.log(weapons);
                assert.deepEqual(rangeJudge, false, 'range conditions went wrong');
                break;
            }

            // キル武器と塗り武器がいるか
            const kill  = weapons.find(v => v.role === 'KILL');
            const paint = weapons.find(v => v.role === 'PAINT');

            const roleJudge = [kill, paint].some(v => v === undefined);
            if (roleJudge) {
                console.log(weapons);
                assert.deepEqual(roleJudge, false, 'role conditions went wrong');
                break;
            }

            // シューター以外のカテゴリ被りが発生していないか
            const lc = weapons.map(v => v.lc).filter(v => v !== 'SHOOTER');
            const lcJudge = new Set(lc).size !== lc.length;
            if (lcJudge) {
                console.log(weapons);
                assert.deepEqual(lcJudge, false, 'large category conditions went wrong');
                break;
            }

            actualLoop++;
        }

        assert.deepEqual(actualLoop, LOOP);
    });

    it('four players choice', () => {
        let actualLoop = 0;
        for (let i = 0; i < LOOP; i++) {
            const weaponResult = getWeaponsByNumber(4);
  
            if (weaponResult.isErr()) {
                assert.deepEqual(weaponResult.isErr(), false, 'Error occurred while getting 4 weapons');
                break;
            }
          
            const weapons = weaponResult.value;
          
            // 選出ができなかった場合はスキップ
            const free = weapons.find(v => v.role === 'FREE');
            if (free !== undefined) {
                actualLoop++;
                continue;
            }
  
            // 全ての射程が揃っている
            // かつ短射程が2人
            const short  = weapons.find(v => v.range === 'SHORT');
            const shorts = weapons.filter(v => v.range === 'SHORT');
            const mid    = weapons.find(v => v.range === 'MID');
            const long   = weapons.find(v => v.range === 'LONG');
  
            const rangeJudge = ([short, mid, long].some(v => v === undefined) && shorts.length === 2);
            if (rangeJudge) {
                console.log(weapons);
                assert.deepEqual(rangeJudge, false, 'range conditions went wrong');
                break;
            }
  
            // キル武器と塗り武器がいるか
            const kill  = weapons.find(v => v.role === 'KILL');
            const paint = weapons.find(v => v.role === 'PAINT');
  
            const roleJudge = [kill, paint].some(v => v === undefined);
            if (roleJudge) {
                console.log(weapons);
                assert.deepEqual(roleJudge, false, 'role conditions went wrong');
                break;
            }
  
            // シューター以外のカテゴリ被りが発生していないか
            const lc = weapons.map(v => v.lc).filter(v => v !== 'SHOOTER');
            const lcJudge = new Set(lc).size !== lc.length;
            if (lcJudge) {
                console.log(weapons);
                assert.deepEqual(lcJudge, false, 'large category conditions went wrong');
                break;
            }

            // スモールカテゴリ被りが発生していないか
            const sc = weapons.map(v => v.sc);
            const scJudge = new Set(sc).size !== sc.length;
            if (scJudge) {
                console.log(weapons);
                assert.deepEqual(scJudge, false, 'small category conditions went wrong');
                break;
            }

            // ヘイト役2人になっていないか
            const tank = weapons.filter(v => v.role === 'TANK');
            const tankJudge = tank.length > 1;
            if (tankJudge) {
                console.log(weapons);
                assert.deepEqual(tankJudge, false, 'players have 2 tank roles');
                break;
            }

            actualLoop++;
        }
  
        assert.deepEqual(actualLoop, LOOP);
    });

    it('one player choice', () => {
        const weaponResult = getWeaponsByNumber(1);
        
        if (weaponResult.isErr()) {
            assert.fail('Error occurred while getting 1 weapon');
        }
        
        const weapons = weaponResult.value;
        assert.equal(weapons.length, 1);
        assert.exists(weapons[0]);
    });

    it('invalid player number', () => {
        const weaponResult = getWeaponsByNumber(0);
        assert.isTrue(weaponResult.isErr());
        
        const weaponResult2 = getWeaponsByNumber(5);
        assert.isTrue(weaponResult2.isErr());
        
        const weaponResult3 = getWeaponsByNumber(-1);
        assert.isTrue(weaponResult3.isErr());
    });

    it('safety mode off - two players', () => {
        const originalEnv = process.env['SAFETY_MODE'];
        process.env['SAFETY_MODE'] = 'false';
        
        try {
            const weaponResult = getWeaponsByNumber(2);
            
            if (weaponResult.isErr()) {
                assert.fail('Error occurred while getting 2 weapons in safety mode off');
            }
            
            const weapons = weaponResult.value;
            assert.equal(weapons.length, 2);
        } finally {
            // 環境変数を元に戻す
            if (originalEnv === undefined) {
                delete process.env['SAFETY_MODE'];
            } else {
                process.env['SAFETY_MODE'] = originalEnv;
            }
        }
    });

    it('safety mode off - three players', () => {
        const originalEnv = process.env['SAFETY_MODE'];
        process.env['SAFETY_MODE'] = 'false';
        
        try {
            const weaponResult = getWeaponsByNumber(3);
            
            if (weaponResult.isErr()) {
                assert.fail('Error occurred while getting 3 weapons in safety mode off');
            }
            
            const weapons = weaponResult.value;
            assert.equal(weapons.length, 3);
        } finally {
            if (originalEnv === undefined) {
                delete process.env['SAFETY_MODE'];
            } else {
                process.env['SAFETY_MODE'] = originalEnv;
            }
        }
    });

    it('safety mode off - four players', () => {
        const originalEnv = process.env['SAFETY_MODE'];
        process.env['SAFETY_MODE'] = 'false';
        
        try {
            const weaponResult = getWeaponsByNumber(4);
            
            if (weaponResult.isErr()) {
                assert.fail('Error occurred while getting 4 weapons in safety mode off');
            }
            
            const weapons = weaponResult.value;
            assert.equal(weapons.length, 4);
        } finally {
            if (originalEnv === undefined) {
                delete process.env['SAFETY_MODE'];
            } else {
                process.env['SAFETY_MODE'] = originalEnv;
            }
        }
    });

    it('blacklist filtering', () => {
        const originalWeaponBl = process.env['WEAPON_BLACKLIST'];
        const originalWeaponScBl = process.env['WEAPON_SMALL_CATEGORY_BLACKLIST'];
        const originalWeaponLcBl = process.env['WEAPON_LARGE_CATEGORY_BLACKLIST'];
        
        // ブラックリストを設定
        process.env['WEAPON_BLACKLIST'] = 'スプラシューターコラボ';
        process.env['WEAPON_SMALL_CATEGORY_BLACKLIST'] = 'シャープマーカー';
        process.env['WEAPON_LARGE_CATEGORY_BLACKLIST'] = 'CHARGER';
        
        try {
            const weaponResult = getWeaponsByNumber(2);
            
            if (weaponResult.isErr()) {
                assert.fail('Error occurred with blacklist filtering');
            }
            
            const weapons = weaponResult.value;
            assert.equal(weapons.length, 2);
            
            // ブラックリストに指定した武器が含まれていないことを確認
            weapons.forEach(weapon => {
                assert.notEqual(weapon.name, 'スプラシューターコラボ');
                assert.notEqual(weapon.sc, 'シャープマーカー');
                assert.notEqual(weapon.lc, 'CHARGER');
            });
        } finally {
            // 環境変数を元に戻す
            if (originalWeaponBl === undefined) {
                delete process.env['WEAPON_BLACKLIST'];
            } else {
                process.env['WEAPON_BLACKLIST'] = originalWeaponBl;
            }
            
            if (originalWeaponScBl === undefined) {
                delete process.env['WEAPON_SMALL_CATEGORY_BLACKLIST'];
            } else {
                process.env['WEAPON_SMALL_CATEGORY_BLACKLIST'] = originalWeaponScBl;
            }
            
            if (originalWeaponLcBl === undefined) {
                delete process.env['WEAPON_LARGE_CATEGORY_BLACKLIST'];
            } else {
                process.env['WEAPON_LARGE_CATEGORY_BLACKLIST'] = originalWeaponLcBl;
            }
        }
    });

    it('game version v2', () => {
        const originalGameVersion = process.env['GAME_VERSION'];
        process.env['GAME_VERSION'] = '2';
        
        try {
            const weaponResult = getWeaponsByNumber(2);
            
            if (weaponResult.isErr()) {
                assert.fail('Error occurred with game version v2');
            }
            
            const weapons = weaponResult.value;
            assert.equal(weapons.length, 2);
        } finally {
            if (originalGameVersion === undefined) {
                delete process.env['GAME_VERSION'];
            } else {
                process.env['GAME_VERSION'] = originalGameVersion;
            }
        }
    });
});