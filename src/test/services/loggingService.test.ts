import { assert } from 'chai';
import { describe, it } from 'mocha';
import { errorLog } from '@services/loggingService';
import * as fs from 'fs';
import * as path from 'path';
import dayjs from 'dayjs';

describe('loggingService', () => {
    describe('errorLog', () => {
        it('should create error log file', (done) => {
            const testMessage = 'Test error message';
            const date = dayjs().format('YYMMDD');
            const logPath = path.join('logs', `error_${date}.log`);
            
            // 既存のログファイルを削除
            if (fs.existsSync(logPath)) {
                fs.unlinkSync(logPath);
            }
            
            errorLog(testMessage);
            
            // ログファイルの作成を待つ
            setTimeout(() => {
                try {
                    assert.isTrue(fs.existsSync(logPath), 'Log file should be created');
                    
                    const logContent = fs.readFileSync(logPath, 'utf8');
                    assert.include(logContent, testMessage, 'Log content should include the test message');
                    
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100);
        });

        it('should log object content', (done) => {
            const testObject = { key: 'value', number: 123 };
            const date = dayjs().format('YYMMDD');
            const logPath = path.join('logs', `error_${date}.log`);
            
            errorLog(testObject);
            
            // ファイル書き込み完了を確実に待つ
            const checkLogFile = (attempts: number = 0) => {
                if (attempts > 50) {  // 5秒間待機
                    done(new Error('Log file was not created within timeout'));
                    return;
                }
                
                try {
                    if (fs.existsSync(logPath)) {
                        const logContent = fs.readFileSync(logPath, 'utf8');
                        // pinoのJSON出力形式に合わせて検証
                        if (logContent.includes('"key":"value"') && logContent.includes('"number":123')) {
                            assert.include(logContent, '"key":"value"', 'Log should contain object key-value pair');
                            assert.include(logContent, '"number":123', 'Log should contain object number');
                            done();
                            return;
                        }
                    }
                    
                    setTimeout(() => checkLogFile(attempts + 1), 100);
                } catch (error) {
                    done(error);
                }
            };
            
            checkLogFile();
        });
    });
});