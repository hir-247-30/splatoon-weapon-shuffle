import { expect, use } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

use(sinonChai);

// テスト用の型定義
type MockNavigator = Partial<Navigator> & {
    clipboard: {
        writeText: sinon.SinonStub;
    };
};

type MockWindow = Partial<Window> & {
    open: sinon.SinonStub;
};

// グローバルオブジェクトの型拡張
interface CustomGlobal extends Global {
    document: Document;
    navigator: MockNavigator;
    window: MockWindow;
}

declare const global: CustomGlobal;

describe('Web Handler', () => {
    let dom: JSDOM;
    let document: Document;

    beforeEach(() => {
        // DOMのセットアップ
        dom = new JSDOM(`
            <html>
                <body>
                    <input id="player1" value="プレイヤー1">
                    <input id="player2" value="プレイヤー2">
                    <input id="player3" value="プレイヤー3">
                    <input id="player4" value="プレイヤー4">
                    <div id="error" style="display: none;"></div>
                    <div id="result"></div>
                    <button id="weapon-select">武器選択</button>
                    <button id="copy-result">コピー</button>
                    <button id="share-line">LINEで共有</button>
                </body>
            </html>
        `);
        document = dom.window.document;
        global.document = document;
        global.navigator = {
            clipboard: {
                writeText: sinon.stub().resolves()
            }
        } as MockNavigator;
        global.window = dom.window as unknown as MockWindow;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should display error when no players are entered', () => {
        // プレイヤー名を空にする
        (document.getElementById('player1') as HTMLInputElement).value = '';
        (document.getElementById('player2') as HTMLInputElement).value = '';
        (document.getElementById('player3') as HTMLInputElement).value = '';
        (document.getElementById('player4') as HTMLInputElement).value = '';

        // 武器選択ボタンをクリック
        document.getElementById('weapon-select')?.click();

        // エラーメッセージが表示されることを確認
        const errorElement = document.getElementById('error');
        expect(errorElement?.style.display).to.equal('block');
        expect(errorElement?.innerHTML).to.equal('プレイヤー名を1人以上入力してください！');
    });

    it('should copy result to clipboard', async () => {
        // 結果を設定
        const resultElement = document.getElementById('result');
        resultElement!.innerHTML = 'テスト結果';

        // コピーボタンをクリック
        document.getElementById('copy-result')?.click();

        // クリップボードにコピーされたことを確認
        expect(navigator.clipboard.writeText).to.have.been.calledWith('テスト結果');
    });

    it('should open LINE share URL', () => {
        // window.openのスタブを作成
        const openStub = sinon.stub(window, 'open');

        // 結果を設定
        const resultElement = document.getElementById('result');
        resultElement!.innerHTML = 'テスト結果';

        // LINE共有ボタンをクリック
        document.getElementById('share-line')?.click();

        // LINE共有URLが開かれたことを確認
        expect(openStub).to.have.been.calledWith(
            'https://line.me/R/share?text=テスト結果',
            '_blank'
        );
    });
}); 