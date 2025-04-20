import { assert } from 'chai';
import { describe, it } from 'mocha';
import { getWeaponsByNumber } from '@lib/choice';

describe('choice', () => {
    it('three players choice', () => {

      const loop      = 1000;
      let actual_loop = 0;
      
      for (let i = 0; i < loop; i++) {
        const weaponResult = getWeaponsByNumber(3);

        if (weaponResult.isErr()) {
            assert.deepEqual(weaponResult.isErr(), false, 'Error occurred while getting weapons');
            break;
        }
        
        const weapons = weaponResult.value;
        
        // 選出ができなかった場合はスキップ
        const free = weapons.find(v => v.role === 'FREE');
        if (free !== undefined) {
            actual_loop++;
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

        actual_loop++;
      }

      assert.deepEqual(actual_loop, loop);
    });
});