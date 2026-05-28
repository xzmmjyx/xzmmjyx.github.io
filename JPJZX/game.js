// ==================== 主游戏逻辑 - 完整版 ====================

// 合并物品数据库
const ALL_ITEMS = ItemUtils.getAll();

// 游戏配置
const GAME_CONFIG = {
    initialMoney: 15000,
    totalRounds: 8,
    maxPlayers: 4,
    backpackSize: 81,
    warehouseSize: 81
};

// 地图数据
const MAPS = [
    { name: '废弃港口', difficulty: 1, dropRate: 60, bonus: '基础掉落', background: 'linear-gradient(135deg, #2a2a3e, #1a1a2e)' },
    { name: '军事基地', difficulty: 2, dropRate: 70, bonus: '武器掉落增加', background: 'linear-gradient(135deg, #3e2a2a, #2e1a1a)' },
    { name: '科技园区', difficulty: 3, dropRate: 75, bonus: '电子物品增加', background: 'linear-gradient(135deg, #2a3e3e, #1a2e2e)' },
    { name: '黑市街区', difficulty: 4, dropRate: 80, bonus: '贵重物品增加', background: 'linear-gradient(135deg, #3e3e2a, #2e2e1a)' },
    { name: '地下实验室', difficulty: 5, dropRate: 85, bonus: '医疗物品增加', background: 'linear-gradient(135deg, #2a2a3e, #1a1a3e)' },
    { name: '沙漠遗迹', difficulty: 6, dropRate: 88, bonus: '特殊物品增加', background: 'linear-gradient(135deg, #3e2a2a, #3e1a1a)' },
    { name: '极地空间站', difficulty: 7, dropRate: 92, bonus: '高品质物品增加', background: 'linear-gradient(135deg, #2a3e3e, #1a3e3e)' },
    { name: '虚空裂缝', difficulty: 8, dropRate: 95, bonus: '红色物品概率提升', background: 'linear-gradient(135deg, #3e2a3e, #3e1a3e)' }
];

// AI 名字和性格
const AI_NAMES = ['影刃', '夜枭', '猎鹰', '毒牙'];
const AI_PERSONALITIES = ['aggressive', 'cautious', 'balanced', 'random'];

// 随机事件池
const RANDOM_EVENTS = [
    {
        title: '🎰 幸运轮盘',
        description: '你遇到了一个神秘商人，他愿意给你一个机会！',
        options: [
            { text: '花费 1000 参与', effect: () => {
                const reward = Math.random() > 0.5 ? 3000 : 0;
                GameState.update({ money: GameState.data.money + reward - 1000 });
                if (reward > 0) {
                    ui.showToast(`获得 ${reward}！`);
                } else {
                    ui.showToast('血本无归...');
                }
            }},
            { text: '拒绝', effect: () => ui.showToast('你错过了一个机会') }
        ]
    },
    {
        title: '📦 神秘包裹',
        description: '一个匿名包裹出现在你的仓库！',
        options: [
            { text: '打开', effect: () => {
                const item = ItemUtils.randomByDropRate(80);
                GameState.autoStoreItem(item);
                ui.showToast(`获得 ${item.name}！`);
            }},
            { text: '检查', effect: () => ui.showToast('包裹很安全，但你决定不打开') }
        ]
    },
    {
        title: '💰 投资机会',
        description: '有人向你推荐一个投资项目',
        options: [
            { text: '投资 5000', effect: () => {
                const success = Math.random() > 0.4;
                if (success) {
                    GameState.update({ money: GameState.data.money + 8000 });
                    ui.showToast('投资成功！获得 8000');
                } else {
                    GameState.update({ money: GameState.data.money - 5000 });
                    ui.showToast('投资失败...损失 5000');
                }
            }},
            { text: '拒绝', effect: () => ui.showToast('你保持谨慎') }
        ]
    }
];

// 游戏主类
class Game {
    constructor() {
        // 初始化状态管理器
        GameState.init();

        this.aiPlayers = [];
        this.lootRevealed = 0;
        this.lootValue = 0;

        this.init();
    }

    // 初始化游戏
    init() {
        this.initAIPlayers();
        this.updateUI();
        this.renderMaps();

        // 注册状态监听
        GameState.on('stateChange', () => this.updateUI());

        ui.showToast('🎮 游戏开始！初始资金 15000');
    }

    // 初始化 AI 玩家
    initAIPlayers() {
        this.aiPlayers = AI_NAMES.map((name, index) => ({
            name,
            money: GAME_CONFIG.initialMoney,
            backpack: new GridManager(9),
            backpackUsed: 0,
            personality: AI_PERSONALITIES[index],
            active: true
        }));
        GameState.aiPlayers = this.aiPlayers;
    }

    // 渲染地图
    renderMaps() {
        ui.renderMapSelector(MAPS, GameState.data.selectedMap, (index) => {
            GameState.update({ selectedMap: index });
            this.renderMaps();
            this.updateContainerDesc();
        });
    }

    // 更新集装箱描述
    updateContainerDesc() {
        const map = MAPS[GameState.data.selectedMap];
        if (map) {
            document.getElementById('containerDesc').textContent =
                `🗺️ ${map.name} | ⭐${'⭐'.repeat(map.difficulty)} | 📊${map.dropRate}% | 🎁 ${map.bonus}`;
        }
    }

    // 开始竞拍
    startAuction() {
        if (GameState.data.selectedMap === null) {
            ui.showToast('请先选择地图！');
            return;
        }

        GameState.update({
            currentBid: 1000,
            currentPlayerIndex: 0
        });
        GameState.currentItems = this.generateLoot();

        document.getElementById('currentBid').textContent = GameState.data.currentBid;
        document.getElementById('startAuctionBtn').disabled = true;
        document.getElementById('bidBtn').disabled = false;
        document.getElementById('passBtn').disabled = false;
        document.getElementById('specialActions').style.display = 'flex';

        ui.showToast('🔔 竞拍开始！');
        this.updateAIPlayersUI();

        // 随机触发事件
        if (Math.random() < 0.2) {
            setTimeout(() => {
                const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
                ui.showRandomEvent(event);
            }, 2000);
        }
    }

    // 生成战利品
    generateLoot() {
        const map = MAPS[GameState.data.selectedMap];
        const itemCount = 6 + Math.floor(Math.random() * 6);
        const items = [];

        for (let i = 0; i < itemCount; i++) {
            items.push(ItemUtils.randomByDropRate(map.dropRate));
        }

        return items;
    }

    // 玩家出价
    playerBid() {
        if (GameState.data.money < GameState.data.currentBid) {
            ui.showToast('💸 资金不足！');
            return;
        }

        GameState.update({
            money: GameState.data.money - GameState.data.currentBid,
            currentBid: GameState.data.currentBid + 500
        });

        document.getElementById('currentBid').textContent = GameState.data.currentBid;
        ui.showToast(`💰 你出价 ${GameState.data.currentBid - 500}`);
        this.nextPlayer();
    }

    // 玩家放弃
    playerPass() {
        GameState.update({
            currentPlayerIndex: (GameState.data.currentPlayerIndex + 1) % (this.aiPlayers.length + 1)
        });

        if (GameState.data.currentPlayerIndex !== 0) {
            this.updateAIPlayersUI();
        }

        // 检查是否只剩一个玩家
        const activePlayers = [this, ...this.aiPlayers.filter(p => p.active)];
        if (activePlayers.length <= 1) {
            this.wonAuction();
        } else if (GameState.data.currentPlayerIndex === 0) {
            document.getElementById('bidBtn').disabled = false;
            document.getElementById('passBtn').disabled = false;
        }
    }

    // 特殊行动
    specialAction(type) {
        const costs = { scout: 500, suppress: 800, interfere: 1000 };
        const cost = costs[type];

        if (GameState.data.money < cost) {
            ui.showToast('💸 资金不足！');
            return;
        }

        GameState.update({ money: GameState.data.money - cost });

        switch(type) {
            case 'scout':
                this.scoutContainer();
                break;
            case 'suppress':
                this.suppressPrice();
                break;
            case 'interfere':
                this.interfereAI();
                break;
        }
    }

    // 侦察集装箱
    scoutContainer() {
        const revealed = Math.min(3, GameState.currentItems.length);
        const highValueItems = GameState.currentItems
            .filter(item => ['purple', 'gold', 'red'].includes(item.quality))
            .slice(0, revealed);

        if (highValueItems.length > 0) {
            let msg = '🔍 侦察结果：';
            highValueItems.forEach(item => {
                msg += `${item.name}(${ItemUtils.getQualityName(item.quality)}) `;
            });
            ui.showToast(msg);
        } else {
            ui.showToast('🔍 没有发现高价值物品');
        }
    }

    // 压价
    suppressPrice() {
        const reduction = 1000 + Math.floor(Math.random() * 500);
        const newBid = Math.max(500, GameState.data.currentBid - reduction);
        GameState.update({ currentBid: newBid });
        document.getElementById('currentBid').textContent = GameState.data.currentBid;
        ui.showToast('📉 成功压价！');
    }

    // 干扰 AI
    interfereAI() {
        const activeAI = this.aiPlayers.filter(p => p.active);
        if (activeAI.length > 0) {
            const target = activeAI[Math.floor(Math.random() * activeAI.length)];
            target.active = false;
            ui.showToast(`👊 干扰成功！${target.name} 暂时退出`);
            setTimeout(() => {
                target.active = true;
                ui.showToast(`${target.name} 恢复竞拍`);
            }, 3000);
        }
    }

    // 下一个玩家
    nextPlayer() {
        GameState.update({
            currentPlayerIndex: (GameState.data.currentPlayerIndex + 1) % (this.aiPlayers.length + 1)
        });

        if (GameState.data.currentPlayerIndex === 0) {
            document.getElementById('bidBtn').disabled = false;
            document.getElementById('passBtn').disabled = false;
            ui.showToast('🎯 轮到你决策');
        } else {
            document.getElementById('bidBtn').disabled = true;
            document.getElementById('passBtn').disabled = true;
            setTimeout(() => this.aiBid(), 800);
        }

        this.updateAIPlayersUI();
    }

    // AI 出价逻辑
    aiBid() {
        const aiIndex = GameState.data.currentPlayerIndex - 1;
        const ai = this.aiPlayers[aiIndex];

        if (!ai || !ai.active || ai.money < GameState.data.currentBid) {
            if (ai) ai.active = false;
            ui.showToast(`${ai ? ai.name : 'AI'} 放弃`);
            this.nextPlayer();
            return;
        }

        const shouldBid = this.shouldAIBid(ai);
        if (shouldBid) {
            ai.money -= GameState.data.currentBid;
            GameState.update({ currentBid: GameState.data.currentBid + 500 });
            ui.showToast(`${ai.name} 出价！💰`);
        } else {
            ai.active = false;
            ui.showToast(`${ai.name} 放弃`);
        }

        this.nextPlayer();
    }

    // AI 是否出价
    shouldAIBid(ai) {
        const totalValue = GameState.currentItems.reduce((sum, item) => sum + item.baseValue, 0);
        const estimatedValue = totalValue * 0.7;

        switch(ai.personality) {
            case 'aggressive':
                return ai.money >= GameState.data.currentBid && Math.random() > 0.25;
            case 'cautious':
                return ai.money >= GameState.data.currentBid && GameState.data.currentBid < estimatedValue * 0.8;
            case 'balanced':
                return ai.money >= GameState.data.currentBid && Math.random() > 0.4;
            default:
                return Math.random() > 0.5;
        }
    }

    // 赢得竞拍
    wonAuction() {
        ui.showToast('🎉 恭喜赢得竞拍！开始搜刮！');
        setTimeout(() => this.openLootPanel(), 500);
    }

    // 打开搜刮面板
    openLootPanel() {
        this.lootRevealed = 0;
        this.lootValue = 0;
        document.getElementById('lootFound').textContent = '0';
        document.getElementById('lootTotal').textContent = GameState.currentItems.length;
        document.getElementById('lootValue').textContent = '0';

        ui.renderLootGrid(GameState.currentItems);
        ui.openModal('lootModal');
    }

    // 添加物品到背包
    addItemsToInventory() {
        let added = 0;
        let warehouseAdded = 0;
        let totalValue = 0;

        for (const item of GameState.currentItems) {
            const location = GameState.autoStoreItem(item);
            if (location === 'backpack') {
                added++;
                totalValue += item.baseValue;
            } else if (location === 'warehouse') {
                warehouseAdded++;
                totalValue += item.baseValue;
            }
        }

        GameState.update({
            itemsSold: GameState.data.itemsSold + added + warehouseAdded,
            totalValue: GameState.data.totalValue + totalValue
        });

        // 爽点反馈
        if (added > 0) {
            ui.showToast(`🎒 背包获得 ${added} 个物品 | 价值 ${totalValue}`);
        }
        if (warehouseAdded > 0) {
            ui.showToast(`📦 仓库获得 ${warehouseAdded} 个物品`);
        }

        // 检查是否有高价值物品
        const highValueItems = GameState.currentItems.filter(item =>
            ['gold', 'red'].includes(item.quality)
        );
        if (highValueItems.length > 0) {
            setTimeout(() => {
                ui.showToast(`🔥🔥 获得稀有物品：${highValueItems.map(i => i.name).join(', ')}！`);
            }, 1000);
        }

        this.resetAuctionState();

        // 进入下一回合
        setTimeout(() => {
            if (GameState.data.round < 8) {
                GameState.update({ round: GameState.data.round + 1 });
                ui.showToast(`📊 第 ${GameState.data.round} 回合`);
            } else {
                this.endGame();
            }
        }, 2000);
    }

    // 重置竞拍状态
    resetAuctionState() {
        GameState.update({
            currentBid: 0,
            currentPlayerIndex: 0
        });
        GameState.currentItems = [];

        document.getElementById('startAuctionBtn').disabled = false;
        document.getElementById('bidBtn').disabled = true;
        document.getElementById('passBtn').disabled = true;
        document.getElementById('specialActions').style.display = 'none';

        // AI 恢复活跃
        this.aiPlayers.forEach(ai => ai.active = true);
    }

    // 更新 AI 玩家显示
    updateAIPlayersUI() {
        ui.renderAIPlayers(this.aiPlayers, GameState.data.currentPlayerIndex);
    }

    // 更新 UI
    updateUI() {
        GameState.data.backpackUsed = GameState.getBackpack().getUsedCells();
        ui.updateStats(GameState.data);
        ui.renderBackpackPreview(GameState.getBackpack().getGrid());
    }

    // 打开仓库
    openWarehouse() {
        window.location.href = 'warehouse.html';
    }

    // 打开合成
    openSynthesis() {
        window.location.href = 'synthesis.html';
    }

    // 打开商店
    openShop() {
        window.location.href = 'shop.html';
    }

    // 保存游戏
    saveGame() {
        GameState.save();
        ui.showToast('💾 游戏已保存！');
    }

    // 读取游戏
    loadGame() {
        if (GameState.load()) {
            this.updateUI();
            ui.showToast('📂 游戏已读取！');
        } else {
            ui.showToast('❌ 没有存档！');
        }
    }

    // 结束游戏
    endGame() {
        GameState.update({ gameOver: true });

        const stats = {
            ranking: GameState.data.ranking,
            money: GameState.data.money,
            reputation: GameState.data.reputation,
            rating: GameState.getRating(),
            itemsSold: GameState.data.itemsSold,
            totalValue: GameState.data.totalValue,
            totalAssets: GameState.getTotalAssets()
        };

        ui.showGameOver(stats);
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}
