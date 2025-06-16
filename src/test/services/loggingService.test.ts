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
            
            setTimeout(() => {
                try {
                    const logContent = fs.readFileSync(logPath, 'utf8');
                    assert.include(logContent, 'value', 'Log should contain object values');
                    assert.include(logContent, '123', 'Log should contain object numbers');
                    
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100);
        });
    });
});