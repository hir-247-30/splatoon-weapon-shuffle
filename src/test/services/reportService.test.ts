import { assert } from 'chai';
import { describe, it } from 'mocha';
import { execReport } from '@services/reportService';

describe('reportService', () => {

    describe('execReport', () => {
        it('should return error for invalid report type', () => {
            const originalReportType = process.env['REPORT_TYPE'];
            process.env['REPORT_TYPE'] = 'INVALID';
            
            try {
                const result = execReport('test message');
                
                assert.isTrue(result.isErr());
                if (result.isErr()) {
                    assert.equal(result.error.message, '通知先が正しくありません。');
                }
            } finally {
                if (originalReportType === undefined) {
                    delete process.env['REPORT_TYPE'];
                } else {
                    process.env['REPORT_TYPE'] = originalReportType;
                }
            }
        });


        it('should handle undefined report type', () => {
            const originalReportType = process.env['REPORT_TYPE'];
            delete process.env['REPORT_TYPE'];
            
            try {
                const result = execReport('test message');
                
                assert.isTrue(result.isErr());
                if (result.isErr()) {
                    assert.equal(result.error.message, '通知先が正しくありません。');
                }
            } finally {
                if (originalReportType === undefined) {
                    delete process.env['REPORT_TYPE'];
                } else {
                    process.env['REPORT_TYPE'] = originalReportType;
                }
            }
        });
    });
});