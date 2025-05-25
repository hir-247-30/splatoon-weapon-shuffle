import { expect } from 'chai';
import sinon from 'sinon';
import { Client, Message, User, TextChannel, Guild, GuildMessageManager, PermissionOverwriteManager, Invite, MessageReaction, OmitPartialGroupDMChannel } from 'discord.js';
import * as playerService from '@services/playerService';
import * as messageService from '@services/messageService';
import * as reportService from '@services/reportService';
import * as loggingService from '@services/loggingService';
import * as choice from '@lib/choice';
import { client } from '@handlers/discord';

describe('Discord Handler', () => {
    let claimPlayerNamesStub: sinon.SinonStub;
    let buildMessageStub: sinon.SinonStub;
    let execReportStub: sinon.SinonStub;
    let errorLogStub: sinon.SinonStub;
    let getWeaponsByNumberStub: sinon.SinonStub;
    let mockMessage: OmitPartialGroupDMChannel<Message>;
    let mockChannel: TextChannel;
    let mockUser: User;

    beforeEach(() => {
        claimPlayerNamesStub = sinon.stub(playerService, 'claimPlayerNames');
        buildMessageStub = sinon.stub(messageService, 'buildMessage');
        execReportStub = sinon.stub(reportService, 'execReport');
        errorLogStub = sinon.stub(loggingService, 'errorLog');
        getWeaponsByNumberStub = sinon.stub(choice, 'getWeaponsByNumber');

        // ユーザーのモック
        mockUser = {
            bot: false,
            id: '123456789',
            username: 'testuser',
            tag: 'testuser#0000',
            createdAt: new Date(),
            createdTimestamp: Date.now(),
            displayName: 'testuser',
            avatar: null,
            avatarURL: () => null,
            banner: null,
            bannerURL: () => null,
            accentColor: null,
            avatarDecoration: null,
            avatarDecorationURL: () => null,
            avatarDecorationData: null,
            flags: null,
            globalName: null,
            system: false,
            toString: () => '<@123456789>',
            valueOf: () => '123456789',
            _equals: () => false,
            discriminator: '0000',
            defaultAvatarURL: '',
            dmChannel: null,
            hexAccentColor: null,
            partial: false,
            presence: null
        } as unknown as User;

        // チャンネルのモック
        mockChannel = {
            send: sinon.stub().resolves(),
            id: '123456789',
            type: 0, // GUILD_TEXT
            createdTimestamp: Date.now(),
            createdAt: new Date(),
            guild: {} as Guild,
            guildId: '123456789',
            lastMessageId: '123456789',
            lastPinTimestamp: null,
            messages: {} as GuildMessageManager,
            name: 'test-channel',
            nsfw: false,
            parent: null,
            parentId: null,
            permissionOverwrites: {} as PermissionOverwriteManager,
            position: 0,
            rawPosition: 0,
            rateLimitPerUser: 0,
            topic: null,
            url: '',
            toString: () => '<#123456789>',
            valueOf: () => '123456789',
            threads: new Map(),
            defaultThreadRateLimitPerUser: 0,
            createInvite: () => Promise.resolve({} as Invite),
            fetchInvites: () => Promise.resolve([]),
            bulkDelete: () => Promise.resolve([]),
            clone: () => Promise.resolve({} as TextChannel),
            delete: () => Promise.resolve({} as TextChannel),
            edit: () => Promise.resolve({} as TextChannel),
            lockPermissions: () => Promise.resolve({} as TextChannel),
            setName: () => Promise.resolve({} as TextChannel),
            setParent: () => Promise.resolve({} as TextChannel),
            setPosition: () => Promise.resolve({} as TextChannel),
            setTopic: () => Promise.resolve({} as TextChannel),
            setType: () => Promise.resolve({} as TextChannel),
            setNSFW: () => Promise.resolve({} as TextChannel),
            setRateLimitPerUser: () => Promise.resolve({} as TextChannel),
            setBitrate: () => Promise.resolve({} as TextChannel),
            setUserLimit: () => Promise.resolve({} as TextChannel),
            setRtcRegion: () => Promise.resolve({} as TextChannel),
            setVideoQualityMode: () => Promise.resolve({} as TextChannel),
            setDefaultAutoArchiveDuration: () => Promise.resolve({} as TextChannel),
            setDefaultReactionEmoji: () => Promise.resolve({} as TextChannel),
            setDefaultSortOrder: () => Promise.resolve({} as TextChannel),
            setAvailableTags: () => Promise.resolve({} as TextChannel),
            setDefaultForumLayout: () => Promise.resolve({} as TextChannel),
            setFlags: () => Promise.resolve({} as TextChannel),
            setDefaultThreadRateLimitPerUser: () => Promise.resolve({} as TextChannel),
            setDefaultThreadAutoArchiveDuration: () => Promise.resolve({} as TextChannel),
            setDefaultThreadSlowmode: () => Promise.resolve({} as TextChannel),
            setDefaultThreadLocked: () => Promise.resolve({} as TextChannel),
            setDefaultThreadInvitable: () => Promise.resolve({} as TextChannel),
            setDefaultThreadAppliedTags: () => Promise.resolve({} as TextChannel),
            setDefaultThreadName: () => Promise.resolve({} as TextChannel),
            setDefaultThreadMessage: () => Promise.resolve({} as TextChannel)
        } as unknown as TextChannel;

        // メッセージのモック
        mockMessage = {
            author: mockUser,
            content: 'プレイヤー1、プレイヤー2',
            channel: mockChannel,
            id: '123456789',
            createdTimestamp: Date.now(),
            createdAt: new Date(),
            editedTimestamp: null,
            system: false,
            type: 0, // DEFAULT
            url: '',
            webhookId: null,
            valueOf: () => '123456789',
            _cacheType: 'Message',
            _patch: {},
            attachments: [],
            components: [],
            embeds: [],
            flags: null,
            interaction: null,
            member: null,
            mentions: {
                channels: new Map(),
                members: new Map(),
                roles: new Map(),
                users: new Map(),
                everyone: false,
                crosspostedChannels: new Map()
            },
            nonce: null,
            pinned: false,
            position: null,
            reactions: {
                cache: new Map()
            },
            reference: null,
            stickers: [],
            thread: null,
            tts: false,
            activity: null,
            application: null,
            applicationId: null,
            cleanContent: 'プレイヤー1、プレイヤー2',
            crosspostable: false,
            deletable: false,
            deleted: false,
            editable: false,
            editedAt: null,
            fetch: () => Promise.resolve(mockMessage),
            fetchReference: () => Promise.resolve(null),
            hasThread: false,
            inGuild: () => true,
            isSystem: () => false,
            isTextBased: () => true,
            isVoiceBased: () => false,
            partial: false,
            pinnable: false,
            react: () => Promise.resolve({} as MessageReaction),
            removeAttachments: () => mockMessage,
            reply: () => Promise.resolve(mockMessage),
            startThread: () => Promise.resolve({} as TextChannel),
            suppressEmbeds: () => Promise.resolve(mockMessage),
            toString: () => '',
            bulkDeletable: false,
            channelId: '123456789',
            groupActivityApplication: null,
            guildId: '123456789'
        } as unknown as OmitPartialGroupDMChannel<Message>;

        // Clientのモック
        sinon.stub(Client.prototype, 'on').returns(new Client({ intents: [] }));
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
        const mockResponseMessage = 'テストメッセージ';

        // スタブの戻り値設定
        claimPlayerNamesStub.returns({ isErr: () => false, value: mockPlayers });
        getWeaponsByNumberStub.returns({ isErr: () => false, value: mockWeapons });
        buildMessageStub.returns(mockResponseMessage);
        execReportStub.returns({ isErr: () => false });

        // テスト対象のモジュールを読み込み
        await client.emit('messageCreate', mockMessage);

        // 期待される呼び出しの検証
        expect(claimPlayerNamesStub.calledOnce).to.equal(true);
        expect(getWeaponsByNumberStub.calledWith(mockPlayers.length)).to.equal(true);
        expect(buildMessageStub.calledOnce).to.equal(true);
        expect(execReportStub.calledWith(mockResponseMessage)).to.equal(true);
        expect((mockChannel.send as sinon.SinonStub).calledWith(mockResponseMessage)).to.equal(true);
    });

    it('should handle error in player names claim', async () => {
        // エラーケースのモック
        const mockError = new Error('プレイヤー名の取得に失敗');
        claimPlayerNamesStub.returns({ isErr: () => true, error: mockError });

        // テスト対象のモジュールを読み込み
        await client.emit('messageCreate', mockMessage);

        // エラーログが呼ばれたことを確認
        expect(errorLogStub.calledWith(mockError)).to.equal(true);
    });

    it('should ignore bot messages', async () => {
        // ボットメッセージの設定
        mockMessage.author = { ...mockUser, bot: true } as User;

        // テスト対象のモジュールを読み込み
        await client.emit('messageCreate', mockMessage);

        // サービスが呼ばれていないことを確認
        expect(claimPlayerNamesStub.called).to.equal(false);
        expect(getWeaponsByNumberStub.called).to.equal(false);
        expect(buildMessageStub.called).to.equal(false);
        expect(execReportStub.called).to.equal(false);
    });
}); 