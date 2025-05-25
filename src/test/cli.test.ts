import { expect } from 'chai';
import sinon from 'sinon';
import * as playerService from '@services/playerService';
import * as messageService from '@services/messageService';
import * as reportService from '@services/reportService';
import * as loggingService from '@services/loggingService';
import * as choice from '@lib/choice';
import { main } from '@handlers/cli';

describe('CLI Handler', () => {
    let claimPlayerNamesStub: sinon.SinonStub;
    let buildMessageStub: sinon.SinonStub;
    let execReportStub: sinon.SinonStub;
    let errorLogStub: sinon.SinonStub;
    let getWeaponsByNumberStub: sinon.SinonStub;

    beforeEach(() => {
        claimPlayerNamesStub = sinon.stub(playerService, 'claimPlayerNames');
        buildMessageStub = sinon.stub(messageService, 'buildMessage');
        execReportStub = sinon.stub(reportService, 'execReport');
        errorLogStub = sinon.stub(loggingService, 'errorLog');
        getWeaponsByNumberStub = sinon.stub(choice, 'getWeaponsByNumber');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should handle successful weapon selection', () => {
        // モックデータの設定
        const mockPlayers = ['プレイヤー1', 'プレイヤー2'];
        const mockWeapons = [
            { name: '武器1', role: 'ロール1', range: 'レンジ1' },
            { name: '武器2', role: 'ロール2', range: 'レンジ2' }
        ];
        const mockMessage = 'テストメッセージ';

        // スタブの戻り値設定
        claimPlayerNamesStub.returns({ isErr: () => false, value: mockPlayers });
        getWeaponsByNumberStub.returns({ isErr: () => false, value: mockWeapons });
        buildMessageStub.returns(mockMessage);
        execReportStub.returns({ isErr: () => false });

        // テスト対象の関数を実行
        main();

        // 期待される呼び出しの検証
        expect(claimPlayerNamesStub.calledOnce).to.equal(true);
        expect(getWeaponsByNumberStub.calledWith(mockPlayers.length)).to.equal(true);
        expect(buildMessageStub.calledOnce).to.equal(true);
        expect(execReportStub.calledWith(mockMessage)).to.equal(true);
    });

    it('should handle error in player names claim', () => {
        // エラーケースのモック
        const mockError = new Error('プレイヤー名の取得に失敗');
        claimPlayerNamesStub.returns({ isErr: () => true, error: mockError });

        // テスト対象の関数を実行
        main();

        // エラーログが呼ばれたことを確認
        expect(errorLogStub.calledWith(mockError)).to.equal(true);
    });

    it('should handle error in weapon selection', () => {
        // モックデータの設定
        const mockPlayers = ['プレイヤー1', 'プレイヤー2'];
        const mockError = new Error('武器選択に失敗');

        // スタブの戻り値設定
        claimPlayerNamesStub.returns({ isErr: () => false, value: mockPlayers });
        getWeaponsByNumberStub.returns({ isErr: () => true, error: mockError });

        // テスト対象の関数を実行
        main();

        // エラーログが呼ばれたことを確認
        expect(errorLogStub.calledWith(mockError)).to.equal(true);
    });
});