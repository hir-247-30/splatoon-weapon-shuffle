import { assert } from 'chai';
import { describe, it } from 'mocha';
import { claimPlayerNames } from '@services/playerService';

describe('playerService', () => {
    describe('claimPlayerNames', () => {
        it('should return player names from environment variables', () => {
            const originalEnv = {
                PLAYER_NAME_1: process.env['PLAYER_NAME_1'],
                PLAYER_NAME_2: process.env['PLAYER_NAME_2'],
                PLAYER_NAME_3: process.env['PLAYER_NAME_3'],
                PLAYER_NAME_4: process.env['PLAYER_NAME_4']
            };
            
            process.env['PLAYER_NAME_1'] = 'プレイヤー1';
            process.env['PLAYER_NAME_2'] = 'プレイヤー2';
            process.env['PLAYER_NAME_3'] = '';
            delete process.env['PLAYER_NAME_4'];
            
            try {
                const result = claimPlayerNames();
                
                assert.isTrue(result.isOk());
                if (result.isOk()) {
                    const playerNames = result.value;
                    assert.deepEqual(playerNames, ['プレイヤー1', 'プレイヤー2']);
                }
            } finally {
                // 環境変数を元に戻す
                Object.entries(originalEnv).forEach(([key, value]) => {
                    if (value === undefined) {
                        delete process.env[key];
                    } else {
                        process.env[key] = value;
                    }
                });
            }
        });

        it('should return error when no players are registered', () => {
            const originalEnv = {
                PLAYER_NAME_1: process.env['PLAYER_NAME_1'],
                PLAYER_NAME_2: process.env['PLAYER_NAME_2'],
                PLAYER_NAME_3: process.env['PLAYER_NAME_3'],
                PLAYER_NAME_4: process.env['PLAYER_NAME_4']
            };
            
            delete process.env['PLAYER_NAME_1'];
            delete process.env['PLAYER_NAME_2'];
            delete process.env['PLAYER_NAME_3'];
            delete process.env['PLAYER_NAME_4'];
            
            try {
                const result = claimPlayerNames();
                
                assert.isTrue(result.isErr());
                if (result.isErr()) {
                    assert.equal(result.error.message, 'プレイヤーを1人以上登録してください。');
                }
            } finally {
                // 環境変数を元に戻す
                Object.entries(originalEnv).forEach(([key, value]) => {
                    if (value === undefined) {
                        delete process.env[key];
                    } else {
                        process.env[key] = value;
                    }
                });
            }
        });

        it('should return error when all player names are empty strings', () => {
            const originalEnv = {
                PLAYER_NAME_1: process.env['PLAYER_NAME_1'],
                PLAYER_NAME_2: process.env['PLAYER_NAME_2'],
                PLAYER_NAME_3: process.env['PLAYER_NAME_3'],
                PLAYER_NAME_4: process.env['PLAYER_NAME_4']
            };
            
            process.env['PLAYER_NAME_1'] = '';
            process.env['PLAYER_NAME_2'] = '';
            process.env['PLAYER_NAME_3'] = '';
            process.env['PLAYER_NAME_4'] = '';
            
            try {
                const result = claimPlayerNames();
                
                assert.isTrue(result.isErr());
                if (result.isErr()) {
                    assert.equal(result.error.message, 'プレイヤーを1人以上登録してください。');
                }
            } finally {
                // 環境変数を元に戻す
                Object.entries(originalEnv).forEach(([key, value]) => {
                    if (value === undefined) {
                        delete process.env[key];
                    } else {
                        process.env[key] = value;
                    }
                });
            }
        });

        it('should handle all four players registered', () => {
            const originalEnv = {
                PLAYER_NAME_1: process.env['PLAYER_NAME_1'],
                PLAYER_NAME_2: process.env['PLAYER_NAME_2'],
                PLAYER_NAME_3: process.env['PLAYER_NAME_3'],
                PLAYER_NAME_4: process.env['PLAYER_NAME_4']
            };
            
            process.env['PLAYER_NAME_1'] = 'プレイヤー1';
            process.env['PLAYER_NAME_2'] = 'プレイヤー2';
            process.env['PLAYER_NAME_3'] = 'プレイヤー3';
            process.env['PLAYER_NAME_4'] = 'プレイヤー4';
            
            try {
                const result = claimPlayerNames();
                
                assert.isTrue(result.isOk());
                if (result.isOk()) {
                    const playerNames = result.value;
                    assert.deepEqual(playerNames, ['プレイヤー1', 'プレイヤー2', 'プレイヤー3', 'プレイヤー4']);
                }
            } finally {
                // 環境変数を元に戻す
                Object.entries(originalEnv).forEach(([key, value]) => {
                    if (value === undefined) {
                        delete process.env[key];
                    } else {
                        process.env[key] = value;
                    }
                });
            }
        });
    });
});