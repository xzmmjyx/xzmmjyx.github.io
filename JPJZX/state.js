// ==================== 统一状态管理器 ====================

const GameState = {
    // 游戏状态
    data: {
        money: 15000,
        reputation: 0,
        round: 1,
        ranking: 1,
        selectedMap: null,
        currentBid: 0,
        currentPlayerIndex: 0,
        gameOver: false,
        itemsSold: 0,
        totalValue: 0,
        backpackUsed: 0
    },

    // 网格数据
    grids: {
        backpack: null,
        warehouse: null
    },

    // 当前战利品
    currentItems: [],

    // AI玩家
    aiPlayers: [],

    // 监听器
    listeners: new Map(),

    // 初始化
    init() {
        this.load();
        return this;
    },

    // 注册监听器
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
        return () => this.off(event, callback);
    },

    // 移除监听器
    off(event, callback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) callbacks.splice(index, 1);
        }
    },

    // 触发事件
    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(cb => cb(data));
        }
    },

    // 更新状态
    update(updates) {
        Object.assign(this.data, updates);
        this.emit('stateChange', this.data);
        this.save();
    },

    // 获取状态
    get(key) {
        return key ? this.data[key] : { ...this.data };
    },

    // 保存到本地存储
    save() {
        try {
            const saveData = {
                state: { ...this.data },
                backpack: this.grids.backpack ? this.grids.backpack.getGrid() : null,
                warehouse: this.grids.warehouse ? this.grids.warehouse.getGrid() : null,
                version: '2.0',
                timestamp: Date.now()
            };
            localStorage.setItem('containerAuctionSave', JSON.stringify(saveData));
        } catch (e) {
            console.error('保存失败:', e);
        }
    },

    // 从本地存储加载
    load() {
        try {
            const data = localStorage.getItem('containerAuctionSave');
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.state) {
                    Object.assign(this.data, parsed.state);
                }
                if (parsed.backpack) {
                    this.grids.backpack = new GridManager(9);
                    this.grids.backpack.grid = parsed.backpack;
                }
                if (parsed.warehouse) {
                    this.grids.warehouse = new GridManager(9);
                    this.grids.warehouse.grid = parsed.warehouse;
                }
                return true;
            }
        } catch (e) {
            console.error('加载失败:', e);
        }
        return false;
    },

    // 重置状态
    reset() {
        this.data = {
            money: 15000,
            reputation: 0,
            round: 1,
            ranking: 1,
            selectedMap: null,
            currentBid: 0,
            currentPlayerIndex: 0,
            gameOver: false,
            itemsSold: 0,
            totalValue: 0,
            backpackUsed: 0
        };
        this.grids.backpack = new GridManager(9);
        this.grids.warehouse = new GridManager(9);
        this.currentItems = [];
        this.emit('stateChange', this.data);
        this.save();
    },

    // 初始化网格
    initGrids() {
        if (!this.grids.backpack) {
            this.grids.backpack = new GridManager(9);
        }
        if (!this.grids.warehouse) {
            this.grids.warehouse = new GridManager(9);
        }
    },

    // 获取背包网格
    getBackpack() {
        this.initGrids();
        return this.grids.backpack;
    },

    // 获取仓库网格
    getWarehouse() {
        this.initGrids();
        return this.grids.warehouse;
    },

    // 添加物品到背包
    addToBackpack(item) {
        const backpack = this.getBackpack();
        const space = backpack.findSpace(item.width || 1, item.height || 1);
        if (space) {
            backpack.placeItem(item, space.x, space.y);
            this.data.backpackUsed = backpack.getUsedCells();
            this.emit('itemAdded', { item, location: 'backpack', position: space });
            this.save();
            return true;
        }
        return false;
    },

    // 添加物品到仓库
    addToWarehouse(item) {
        const warehouse = this.getWarehouse();
        const space = warehouse.findSpace(item.width || 1, item.height || 1);
        if (space) {
            warehouse.placeItem(item, space.x, space.y);
            this.emit('itemAdded', { item, location: 'warehouse', position: space });
            this.save();
            return true;
        }
        return false;
    },

    // 自动收纳物品
    autoStoreItem(item) {
        if (this.addToBackpack(item)) {
            return 'backpack';
        }
        if (this.addToWarehouse(item)) {
            return 'warehouse';
        }
        return null;
    },

    // 移动物品
    moveItem(item, from, to) {
        const fromGrid = from === 'backpack' ? this.getBackpack() : this.getWarehouse();
        const toGrid = to === 'backpack' ? this.getBackpack() : this.getWarehouse();

        const space = toGrid.findSpace(item.width || 1, item.height || 1);
        if (space) {
            fromGrid.removeItem(item, item.gridX, item.gridY);
            toGrid.placeItem(item, space.x, space.y);
            this.data.backpackUsed = this.getBackpack().getUsedCells();
            this.emit('itemMoved', { item, from, to, position: space });
            this.save();
            return true;
        }
        return false;
    },

    // 出售物品
    sellItem(item, location) {
        const grid = location === 'backpack' ? this.getBackpack() : this.getWarehouse();
        grid.removeItem(item, item.gridX, item.gridY);
        this.data.money += item.baseValue || 0;
        this.data.itemsSold++;
        this.data.totalValue += item.baseValue || 0;
        this.data.backpackUsed = this.getBackpack().getUsedCells();
        this.emit('itemSold', { item, location, value: item.baseValue });
        this.save();
        return item.baseValue || 0;
    },

    // 批量出售
    sellAll(location) {
        const grid = location === 'backpack' ? this.getBackpack() : this.getWarehouse();
        const items = this.getItemsInGrid(grid);
        let totalValue = 0;

        items.forEach(item => {
            totalValue += item.baseValue || 0;
            grid.removeItem(item, item.gridX, item.gridY);
        });

        this.data.money += totalValue;
        this.data.itemsSold += items.length;
        this.data.totalValue += totalValue;
        this.data.backpackUsed = this.getBackpack().getUsedCells();
        this.emit('batchSold', { location, count: items.length, value: totalValue });
        this.save();
        return totalValue;
    },

    // 获取网格中的物品
    getItemsInGrid(gridManager) {
        const items = [];
        const seen = new Set();
        const g = gridManager.grid;

        for (let y = 0; y < g.length; y++) {
            for (let x = 0; x < g[y].length; x++) {
                const id = g[y][x];
                if (id && !seen.has(id)) {
                    const item = ItemUtils.findById(id);
                    if (item) {
                        // 检查是否是物品的左上角
                        let isTopLeft = true;
                        for (let dy = 0; dy < (item.height || 1); dy++) {
                            for (let dx = 0; dx < (item.width || 1); dx++) {
                                const ny = y - dy, nx = x - dx;
                                if (ny >= 0 && nx >= 0 && g[ny] && g[ny][nx] === id) {
                                    if (dy > 0 || dx > 0) isTopLeft = false;
                                }
                            }
                        }
                        if (isTopLeft) {
                            seen.add(id);
                            items.push({ ...item, gridX: x, gridY: y });
                        }
                    }
                }
            }
        }
        return items;
    },

    // 获取背包物品
    getBackpackItems() {
        return this.getItemsInGrid(this.getBackpack());
    },

    // 获取仓库物品
    getWarehouseItems() {
        return this.getItemsInGrid(this.getWarehouse());
    },

    // 获取总资产
    getTotalAssets() {
        const backpackValue = this.getBackpackItems().reduce((sum, item) => sum + (item.baseValue || 0), 0);
        const warehouseValue = this.getWarehouseItems().reduce((sum, item) => sum + (item.baseValue || 0), 0);
        return this.data.money + backpackValue + warehouseValue;
    },

    // 获取游戏评级
    getRating() {
        const totalAssets = this.getTotalAssets();
        if (totalAssets > 50000) return 'S';
        if (totalAssets > 30000) return 'A';
        if (totalAssets > 20000) return 'B';
        if (totalAssets > 10000) return 'C';
        return 'D';
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
}
