import { expect } from 'chai';
import sinon from 'sinon';
import { Context } from 'hono';
import { messagingApi } from '@line/bot-sdk';
import * as playerService from '@services/playerService';
import * as messageService from '@services/messageService';
import * as reportService from '@services/reportService';
import * as loggingService from '@services/loggingService';
import * as choice from '@lib/choice';
import { hono } from '@handlers/line';

// MessagingApiClientのモック用の型定義
type MockMessagingApiClient = {
    replyMessage: sinon.SinonStub;
};

describe('LINE Handler', () => {
    let claimPlayerNamesStub: sinon.SinonStub;
    let buildMessageStub: sinon.SinonStub;
    let execReportStub: sinon.SinonStub;
    let errorLogStub: sinon.SinonStub;
    let getWeaponsByNumberStub: sinon.SinonStub;
    let replyMessageStub: sinon.SinonStub;

    beforeEach(() => {
        claimPlayerNamesStub = sinon.stub(playerService, 'claimPlayerNames');
        buildMessageStub = sinon.stub(messageService, 'buildMessage');
        execReportStub = sinon.stub(reportService, 'execReport');
        errorLogStub = sinon.stub(loggingService, 'errorLog');
        getWeaponsByNumberStub = sinon.stub(choice, 'getWeaponsByNumber');
        replyMessageStub = sinon.stub();

        // MessagingApiClientのモック
        sinon.stub(messagingApi, 'MessagingApiClient').returns({
            replyMessage: replyMessageStub
        } as MockMessagingApiClient);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should handle successful weapon selection', async () => {
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
        replyMessageStub.resolves();

        // モックのContextを作成
        const mockContext = {
            req: {
                text: () => Promise.resolve(JSON.stringify({
                    events: [{
                        type: 'message',
                        message: {
                            type: 'text',
                            text: 'プレイヤー1、プレイヤー2'
                        },
                        replyToken: 'test-reply-token'
                    }]
                })),
                header: () => 'valid-signature'
            },
            body: sinon.stub()
        } as unknown as Context;

        // テスト対象の関数を実行
        await hono.fetch(new Request('http://localhost/webhook'), mockContext);

        // 期待される呼び出しの検証
        expect(claimPlayerNamesStub.calledOnce).to.equal(true);
        expect(getWeaponsByNumberStub.calledWith(mockPlayers.length)).to.equal(true);
        expect(buildMessageStub.calledOnce).to.equal(true);
        expect(execReportStub.calledWith(mockMessage)).to.equal(true);
        expect(replyMessageStub.calledWith({
            replyToken: 'test-reply-token',
            messages: [{ type: 'text', text: mockMessage }]
        })).to.equal(true);
    });

    it('should handle error in player names claim', async () => {
        // エラーケースのモック
        const mockError = new Error('プレイヤー名の取得に失敗');
        claimPlayerNamesStub.returns({ isErr: () => true, error: mockError });

        // モックのContextを作成
        const mockContext = {
            req: {
                text: () => Promise.resolve(JSON.stringify({
                    events: [{
                        type: 'message',
                        message: {
                            type: 'text',
                            text: 'プレイヤー1、プレイヤー2'
                        }
                    }]
                })),
                header: () => 'valid-signature'
            },
            body: sinon.stub()
        } as unknown as Context;

        // テスト対象の関数を実行
        await hono.fetch(new Request('http://localhost/webhook'), mockContext);

        // エラーログが呼ばれたことを確認
        expect(errorLogStub.calledWith(mockError)).to.equal(true);
    });

    it('should handle invalid message type', async () => {
        // モックのContextを作成
        const mockContext = {
            req: {
                text: () => Promise.resolve(JSON.stringify({
                    events: [{
                        type: 'message',
                        message: {
                            type: 'image'
                        }
                    }]
                })),
                header: () => 'valid-signature'
            },
            body: sinon.stub()
        } as unknown as Context;

        // テスト対象の関数を実行
        await hono.fetch(new Request('http://localhost/webhook'), mockContext);

        // エラーログが呼ばれていないことを確認
        expect(errorLogStub.called).to.equal(false);
    });
}); 