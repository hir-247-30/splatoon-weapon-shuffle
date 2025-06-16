import { assert } from 'chai';
import { describe, it } from 'mocha';
import { buildMessage } from '@services/messageService';
import type { Report } from '@common/types';

describe('messageService', () => {
    describe('buildMessage', () => {
        it('should build message for normal weapon', () => {
            const reports: Report[] = [
                {
                    player_name: 'テストプレイヤー',
                    weapon_name: 'スプラシューター',
                    weapon_role: 'BALANCED',
                    weapon_range: 'MID'
                }
            ];
            
            const message = buildMessage(reports);
            
            assert.include(message, 'テストプレイヤーさんのブキは「スプラシューター」です。');
            assert.include(message, 'ポジションは「中衛」、役割は「塗りとキル」です。');
        });

        it('should build message for FREE role weapon', () => {
            const reports: Report[] = [
                {
                    player_name: 'フリープレイヤー',
                    weapon_name: 'ホットブラスター',
                    weapon_role: 'FREE',
                    weapon_range: 'SHORT'
                }
            ];
            
            const message = buildMessage(reports);
            
            assert.include(message, 'フリープレイヤーさんのブキは「ホットブラスター」です。');
            assert.include(message, '今回は好きなブキを選んでください。');
        });

        it('should build message for multiple players', () => {
            const reports: Report[] = [
                {
                    player_name: 'プレイヤー1',
                    weapon_name: 'スプラシューター',
                    weapon_role: 'PAINT',
                    weapon_range: 'SHORT'
                },
                {
                    player_name: 'プレイヤー2',
                    weapon_name: 'スプラチャージャー',
                    weapon_role: 'KILL',
                    weapon_range: 'LONG'
                }
            ];
            
            const message = buildMessage(reports);
            
            assert.include(message, 'プレイヤー1さんのブキは「スプラシューター」です。');
            assert.include(message, 'ポジションは「前衛」、役割は「塗り」です。');
            assert.include(message, 'プレイヤー2さんのブキは「スプラチャージャー」です。');
            assert.include(message, 'ポジションは「後衛」、役割は「キル」です。');
        });

        it('should handle all weapon ranges', () => {
            const reports: Report[] = [
                {
                    player_name: 'プレイヤー1',
                    weapon_name: 'ローラー',
                    weapon_role: 'TANK',
                    weapon_range: 'SHORT'
                },
                {
                    player_name: 'プレイヤー2',
                    weapon_name: 'シューター',
                    weapon_role: 'BALANCED',
                    weapon_range: 'MID'
                },
                {
                    player_name: 'プレイヤー3',
                    weapon_name: 'チャージャー',
                    weapon_role: 'KILL',
                    weapon_range: 'LONG'
                }
            ];
            
            const message = buildMessage(reports);
            
            assert.include(message, '「前衛」');
            assert.include(message, '「中衛」');
            assert.include(message, '「後衛」');
            assert.include(message, '「ヘイト集め」');
            assert.include(message, '「塗りとキル」');
            assert.include(message, '「キル」');
        });

        it('should handle empty reports array', () => {
            const reports: Report[] = [];
            
            const message = buildMessage(reports);
            
            assert.equal(message, '');
        });
    });
});