// ==================== 模块管理器 ====================

const ModuleManager = {
    // 已注册的模块
    modules: {},

    // 注册模块
    register(name, module) {
        this.modules[name] = module;
        if (module.init) {
            module.init();
        }
        console.log(`模块已注册: ${name}`);
    },

    // 获取模块
    get(name) {
        return this.modules[name];
    },

    // 初始化所有模块
    initAll() {
        Object.keys(this.modules).forEach(name => {
            const module = this.modules[name];
            if (module.init) {
                module.init();
            }
        });
    },

    // 通知所有模块状态变更
    notifyStateChange(state) {
        Object.values(this.modules).forEach(module => {
            if (module.onStateChange) {
                module.onStateChange(state);
            }
        });
    }
};

// ==================== 仓库模块 ====================
const WarehouseModule = {
    name: 'warehouse',
    currentTab: 'all',

    init() {
        this.render();
        this.initTabs();
    },

    render() {
        const backpackGrid = document.getElementById('backpackGrid');
        const warehouseGrid = document.getElementById('warehouseGrid');
        if (!backpackGrid || !warehouseGrid) return;

        const bpItems = GameState.getBackpackItems();
        const whItems = GameState.getWarehouseItems();

        this.renderGrid(this.currentTab, backpackGrid, bpItems);
        this.renderGrid(this.currentTab, warehouseGrid, whItems);
        this.updateStats(bpItems, whItems);
    },

    renderGrid(tab, container, items) {
        let filtered = items;
        if (tab !== 'all') {
            filtered = items.filter(item => item.category === tab);
        }

        container.innerHTML = '';
        filtered.forEach(item => {
            const el = document.createElement('div');
            el.className = 'grid-item quality-' + (item.quality || 'green');
            el.style.gridColumn = (item.gridX + 1) + ' / span ' + (item.width || 1);
            el.style.gridRow = (item.gridY + 1) + ' / span ' + (item.height || 1);
            el.dataset.id = item.id;
            el.innerHTML = `<span class="item-icon">${item.icon || '📦'}</span>`;
            el.title = `${item.name} (${ItemUtils.getQualityName(item.quality)}) - ¥${item.baseValue}`;
            el.addEventListener('click', () => this.selectItem(item));
            container.appendChild(el);
        });
    },

    updateStats(bpItems, whItems) {
        const backpack = GameState.getBackpack();
        const warehouse = GameState.getWarehouse();

        const bpUsage = document.getElementById('backpackUsage');
        const bpFill = document.getElementById('backpackFill');
        const whUsage = document.getElementById('warehouseUsage');
        const whFill = document.getElementById('warehouseFill');
        const bpVal = document.getElementById('backpackValue');
        const whVal = document.getElementById('warehouseValue');
        const totalAssets = document.getElementById('totalAssets');
        const totalCount = document.getElementById('totalItemsCount');

        if (bpUsage) bpUsage.textContent = backpack.getUsedCells() + '/81';
        if (bpFill) bpFill.style.width = (backpack.getUsedCells() / 81 * 100) + '%';
        if (whUsage) whUsage.textContent = warehouse.getUsedCells() + '/81';
        if (whFill) whFill.style.width = (warehouse.getUsedCells() / 81 * 100) + '%';

        const bpTotal = bpItems.reduce((s, i) => s + (i.baseValue || 0), 0);
        const whTotal = whItems.reduce((s, i) => s + (i.baseValue || 0), 0);

        if (bpVal) bpVal.textContent = '¥' + bpTotal;
        if (whVal) whVal.textContent = '¥' + whTotal;
        if (totalAssets) totalAssets.textContent = '¥' + (GameState.data.money + bpTotal + whTotal);
        if (totalCount) totalCount.textContent = '物品总数: ' + (bpItems.length + whItems.length);
    },

    selectItem(item) {
        // 高亮显示选中的物品
        document.querySelectorAll('.grid-item.selected').forEach(el => el.classList.remove('selected'));
        const el = document.querySelector(`.grid-item[data-id="${item.id}"]`);
        if (el) el.classList.add('selected');

        // 显示物品详情
        const panel = document.getElementById('itemInfoContent');
        if (panel) {
            panel.innerHTML = `
                <div class="item-detail-info">
                    <div class="item-detail-icon">${item.icon || '📦'}</div>
                    <h3 class="item-detail-name">${item.name}</h3>
                    <span class="item-detail-quality quality-${item.quality}">${ItemUtils.getQualityIcon(item.quality)} ${ItemUtils.getQualityName(item.quality)}</span>
                    <div class="item-detail-stats">
                        <div class="detail-stat"><span class="stat-lbl">价值</span><span class="stat-val">¥${item.baseValue}</span></div>
                        <div class="detail-stat"><span class="stat-lbl">尺寸</span><span class="stat-val">${item.width || 1}×${item.height || 1}</span></div>
                        <div class="detail-stat"><span class="stat-lbl">类别</span><span class="stat-val">${item.category || '未知'}</span></div>
                    </div>
                </div>
            `;
            this.selectedItem = item;
        }

        const actions = document.getElementById('selectedActions');
        if (actions) actions.style.display = 'block';
    },

    sellSelected() {
        if (!this.selectedItem) return;
        const item = this.selectedItem;
        const inBackpack = GameState.getBackpackItems().some(i => i.id === item.id);
        const location = inBackpack ? 'backpack' : 'warehouse';
        const value = GameState.sellItem(item, location);
        this.selectedItem = null;
        document.getElementById('selectedActions').style.display = 'none';
        document.getElementById('itemInfoContent').innerHTML = '<div class="empty-state"><span class="empty-icon">📦</span><p>选择物品查看详情</p></div>';
        this.render();
        alert('出售成功！获得 ¥' + value);
    },

    moveSelected() {
        if (!this.selectedItem) return;
        const item = this.selectedItem;
        const inBackpack = GameState.getBackpackItems().some(i => i.id === item.id);
        const from = inBackpack ? 'backpack' : 'warehouse';
        const to = inBackpack ? 'warehouse' : 'backpack';

        if (GameState.moveItem(item, from, to)) {
            this.selectedItem = null;
            document.getElementById('selectedActions').style.display = 'none';
            document.getElementById('itemInfoContent').innerHTML = '<div class="empty-state"><span class="empty-icon">📦</span><p>选择物品查看详情</p></div>';
            this.render();
        } else {
            alert('目标位置空间不足！');
        }
    },

    destroySelected() {
        if (!this.selectedItem) return;
        if (!confirm('确定要销毁 ' + this.selectedItem.name + ' 吗？')) return;

        const item = this.selectedItem;
        const inBackpack = GameState.getBackpackItems().some(i => i.id === item.id);
        const grid = inBackpack ? GameState.getBackpack() : GameState.getWarehouse();
        grid.removeItem(item, item.gridX, item.gridY);
        GameState.save();

        this.selectedItem = null;
        document.getElementById('selectedActions').style.display = 'none';
        document.getElementById('itemInfoContent').innerHTML = '<div class="empty-state"><span class="empty-icon">📦</span><p>选择物品查看详情</p></div>';
        this.render();
    },

    sortItems(type) {
        const grid = type === 'backpack' ? GameState.getBackpack() : GameState.getWarehouse();
        const items = GameState.getItemsInGrid(grid);
        items.sort((a, b) => (b.baseValue || 0) - (a.baseValue || 0));

        grid.clear();
        items.forEach(item => {
            const space = grid.findSpace(item.width || 1, item.height || 1);
            if (space) {
                grid.placeItem(item, space.x, space.y);
            }
        });
        this.render();
        GameState.save();
    },

    moveAllToWarehouse() {
        const items = GameState.getBackpackItems();
        let moved = 0;
        items.forEach(item => {
            if (GameState.moveItem(item, 'backpack', 'warehouse')) {
                moved++;
            }
        });
        this.render();
        if (moved > 0) alert('已入库 ' + moved + ' 件物品');
    },

    sellAll(type) {
        const value = GameState.sellAll(type);
        this.render();
        alert('出售完成！获得 ¥' + value);
    },

    initTabs() {
        const tabs = document.querySelectorAll('.warehouse-tabs .tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentTab = tab.dataset.tab;
                this.render();
            });
        });
    },

    onStateChange() {
        this.render();
    }
};

// ==================== 商店模块 ====================
const ShopModule = {
    name: 'shop',
    cart: [],
    currentCategory: 'all',
    currentQuality: 'all',
    currentSort: 'default',

    init() {
        this.render();
        this.initFilters();
        this.renderDeals();
        this.updateUI();
    },

    render() {
        const grid = document.getElementById('shopItemsGrid');
        if (!grid) return;

        let items = ItemUtils.getAll();

        // 过滤
        if (this.currentCategory !== 'all') {
            items = items.filter(item => item.category === this.currentCategory);
        }
        if (this.currentQuality !== 'all') {
            items = items.filter(item => item.quality === this.currentQuality);
        }

        // 排序
        if (this.currentSort === 'price-asc') items.sort((a, b) => (a.baseValue || 0) - (b.baseValue || 0));
        else if (this.currentSort === 'price-desc') items.sort((a, b) => (b.baseValue || 0) - (a.baseValue || 0));
        else if (this.currentSort === 'quality') {
            const qOrder = { red: 0, gold: 1, purple: 2, blue: 3, green: 4 };
            items.sort((a, b) => (qOrder[a.quality] || 5) - (qOrder[b.quality] || 5));
        }

        grid.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'shop-card quality-' + (item.quality || 'green');
            const inCart = this.cart.some(c => c.id === item.id);
            card.innerHTML = `
                <div class="shop-card-icon">${item.icon || '📦'}</div>
                <div class="shop-card-info">
                    <h3>${item.name}</h3>
                    <span class="shop-card-quality quality-${item.quality}">${ItemUtils.getQualityIcon(item.quality)} ${ItemUtils.getQualityName(item.quality)}</span>
                    <span class="shop-card-price">¥${item.baseValue}</span>
                    <span class="shop-card-size">${item.width || 1}×${item.height || 1}</span>
                </div>
                <button class="btn btn-small ${inCart ? 'btn-danger' : 'btn-primary'}" data-item-id="${item.id}">
                    ${inCart ? '✓ 已添加' : '➕ 加入'}
                </button>
            `;
            const btn = card.querySelector('button');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.cart.some(c => c.id === item.id)) {
                    this.cart = this.cart.filter(c => c.id !== item.id);
                } else {
                    this.cart.push(item);
                }
                this.render();
                this.renderCart();
            });
            grid.appendChild(card);
        });
    },

    renderCart() {
        const container = document.getElementById('cartItems');
        const total = document.getElementById('cartTotal');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = '<p class="empty-tip">购物车是空的</p>';
            if (total) total.textContent = '0';
            return;
        }

        container.innerHTML = '';
        let sum = 0;
        this.cart.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <span>${item.icon || '📦'} ${item.name}</span>
                <span class="cart-item-price">¥${item.baseValue}</span>
                <button class="cart-remove" data-item-id="${item.id}">✕</button>
            `;
            el.querySelector('.cart-remove').addEventListener('click', () => {
                this.cart = this.cart.filter(c => c.id !== item.id);
                this.renderCart();
                this.render();
            });
            sum += item.baseValue || 0;
            container.appendChild(el);
        });
        if (total) total.textContent = '¥' + sum;
    },

    renderDeals() {
        const deals = document.getElementById('dailyDeals');
        if (!deals) return;

        const allItems = ItemUtils.getAll();
        const dealItems = [];
        for (let i = 0; i < 4; i++) {
            dealItems.push(allItems[Math.floor(Math.random() * allItems.length)]);
        }

        deals.innerHTML = '';
        dealItems.forEach(item => {
            const el = document.createElement('div');
            el.className = 'deal-item';
            el.innerHTML = `
                <span>${item.icon || '📦'} ${item.name}</span>
                <span class="deal-price">-20%</span>
            `;
            deals.appendChild(el);
        });
    },

    initFilters() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
                this.render();
            });
        });
    },

    filterByQuality() {
        const sel = document.getElementById('qualityFilter');
        if (sel) {
            this.currentQuality = sel.value;
            this.render();
        }
    },

    sortItems() {
        const sel = document.getElementById('sortFilter');
        if (sel) {
            this.currentSort = sel.value;
            this.render();
        }
    },

    updateUI() {
        const moneyEl = document.getElementById('playerMoney');
        const repEl = document.getElementById('playerReputation');
        const repFill = document.getElementById('reputationFill');
        const repText = document.getElementById('reputationText');

        if (moneyEl) moneyEl.textContent = GameState.data.money;
        if (repEl) repEl.textContent = '⭐ ' + ['新手', '老手', '专家', '大师', '传奇'][Math.min(Math.floor(GameState.data.reputation / 200), 4)];
        if (repFill) repFill.style.width = Math.min(GameState.data.reputation % 200 / 2, 100) + '%';
        if (repText) repText.textContent = (GameState.data.reputation % 200) + '/200';
    },

    checkout() {
        if (this.cart.length === 0) { alert('购物车是空的！'); return; }
        const total = this.cart.reduce((s, i) => s + (i.baseValue || 0), 0);
        if (total > GameState.data.money) { alert('资金不足！需要 ¥' + total + '，当前 ¥' + GameState.data.money); return; }
        if (!confirm('确认购买 ' + this.cart.length + ' 件物品，共 ¥' + total + ' 吗？')) return;

        // 扣除金钱
        GameState.update({ money: GameState.data.money - total });

        // 添加物品到背包/仓库
        let added = 0;
        this.cart.forEach(item => {
            const location = GameState.autoStoreItem(item);
            if (location) added++;
        });

        this.cart = [];
        this.render();
        this.renderCart();
        this.updateUI();
        alert('购买成功！' + added + ' 件物品已存入');
    },

    clearCart() {
        if (this.cart.length === 0) return;
        this.cart = [];
        this.render();
        this.renderCart();
    },

    onStateChange() {
        this.updateUI();
    }
};

// ==================== 合成模块 ====================
const SynthesisModule = {
    name: 'synthesis',
    slots: [null, null, null, null],
    currentTab: 'backpack',
    currentQuality: 'all',

    init() {
        this.renderRecipes();
        this.renderMaterials();
        this.updateUI();
        this.initTabs();
    },

    renderRecipes() {
        const container = document.getElementById('recipesList');
        if (!container) return;

        const recipes = [
            { name: '基础升级', result: '随机稀有物品', cost: '4个普通物品', filter: 'available' },
            { name: '精炼合成', result: '随机史诗物品', cost: '3个稀有物品', filter: 'available' },
            { name: '传说锻造', result: '随机传说物品', cost: '3个史诗物品', filter: 'available' },
            { name: '神话转化', result: '随机神话物品', cost: '2个传说物品', filter: 'special' },
        ];

        container.innerHTML = '';
        recipes.forEach((recipe) => {
            const el = document.createElement('div');
            el.className = 'recipe-item available';
            el.innerHTML = `
                <h4>${recipe.name}</h4>
                <p>${recipe.result}</p>
                <span class="recipe-cost">${recipe.cost}</span>
            `;
            container.appendChild(el);
        });
    },

    renderMaterials() {
        const container = document.getElementById('materialsGrid');
        if (!container) return;

        let items = this.currentTab === 'backpack' ? GameState.getBackpackItems() : GameState.getWarehouseItems();
        if (this.currentQuality !== 'all') {
            items = items.filter(item => item.quality === this.currentQuality);
        }

        container.innerHTML = '';
        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'material-item quality-' + (item.quality || 'green');
            el.innerHTML = `
                <span class="mat-icon">${item.icon || '📦'}</span>
                <span class="mat-name">${item.name}</span>
                <span class="mat-quality">${ItemUtils.getQualityIcon(item.quality)} ${ItemUtils.getQualityName(item.quality)}</span>
            `;
            el.addEventListener('click', () => this.addMaterial(item));
            container.appendChild(el);
        });
    },

    addMaterial(item) {
        const emptyIdx = this.slots.indexOf(null);
        if (emptyIdx === -1) { alert('材料槽已满！'); return; }
        if (this.slots.some(s => s && s.id === item.id && s.gridX === item.gridX && s.gridY === item.gridY)) {
            alert('该物品已在材料槽中！');
            return;
        }

        this.slots[emptyIdx] = item;
        this.updateUI();

        // 从网格中移除
        const inBackpack = GameState.getBackpackItems().some(i => i.id === item.id && i.gridX === item.gridX);
        const grid = inBackpack ? GameState.getBackpack() : GameState.getWarehouse();
        grid.removeItem(item, item.gridX, item.gridY);
        GameState.save();

        this.renderMaterials();
    },

    updateUI() {
        for (let i = 0; i < 4; i++) {
            const slot = document.querySelector(`.material-slot[data-slot="${i}"]`);
            if (!slot) continue;
            const item = this.slots[i];
            if (item) {
                slot.innerHTML = `
                    <span class="slot-item quality-${item.quality}">${item.icon || '📦'}</span>
                    <span class="slot-name">${item.name}</span>
                `;
                slot.classList.add('filled');
            } else {
                slot.innerHTML = '<span class="slot-empty">+</span>';
                slot.classList.remove('filled');
            }
        }

        const rateEl = document.getElementById('successRate');
        if (rateEl) {
            const filled = this.slots.filter(s => s !== null).length;
            if (filled >= 2) {
                const rate = Math.min(30 + filled * 15, 95);
                rateEl.textContent = '成功率: ' + rate + '%';
            } else {
                rateEl.textContent = '成功率: -- (至少需要2个材料)';
            }
        }

        const result = document.getElementById('resultDisplay');
        if (result) {
            const filled = this.slots.filter(s => s !== null).length;
            if (filled >= 2) {
                const qualities = this.slots.filter(s => s).map(s => s.quality);
                const qOrder = { green: 0, blue: 1, purple: 2, gold: 3, red: 4 };
                const bestQ = qualities.sort((a, b) => qOrder[b] - qOrder[a])[0] || 'green';
                const preview = ItemUtils.getRandom(bestQ);
                result.innerHTML = `<span class="result-preview">${preview.icon || '📦'} ${preview.name}</span>`;
            } else {
                result.innerHTML = '<span class="slot-empty">?</span>';
            }
        }
    },

    selectSlot(index) {
        if (this.slots[index]) {
            const item = this.slots[index];
            this.slots[index] = null;

            // 物品放回背包
            GameState.addToBackpack(item);
            this.updateUI();
            this.renderMaterials();
        }
    },

    craft() {
        const filled = this.slots.filter(s => s !== null).length;
        if (filled < 2) { alert('至少需要 2 个材料才能合成！'); return; }

        const qualities = this.slots.filter(s => s).map(s => s.quality);
        const qOrder = { green: 0, blue: 1, purple: 2, gold: 3, red: 4 };
        const bestQ = qualities.sort((a, b) => qOrder[b] - qOrder[a])[0] || 'green';
        const rate = Math.min(30 + filled * 15, 95);

        // 显示动画
        const anim = document.getElementById('synthesisAnimation');
        if (anim) anim.classList.add('active');

        setTimeout(() => {
            if (anim) anim.classList.remove('active');

            const success = Math.random() * 100 < rate;
            if (success) {
                const qIdx = qOrder[bestQ];
                const resultQualities = ['green', 'blue', 'purple', 'gold', 'red'];
                const resultQ = resultQualities[Math.min(qIdx + 1, 4)];
                const result = ItemUtils.getRandom(resultQ);

                GameState.addToBackpack(result);
                alert('合成成功！获得 ' + result.icon + ' ' + result.name);
            } else {
                alert('合成失败...材料已消耗。');
            }

            this.slots = [null, null, null, null];
            this.updateUI();
            this.renderMaterials();
            this.addHistory(success);
        }, 1500);
    },

    addHistory(success) {
        const list = document.getElementById('historyList');
        if (!list) return;
        const el = document.createElement('div');
        el.className = 'history-item';
        el.innerHTML = `<span class="history-result ${success ? 'success' : 'fail'}">${success ? '✅' : '❌'}</span>
            <span class="history-time">刚刚</span>`;
        list.insertBefore(el, list.firstChild);
        if (list.children.length > 20) list.removeChild(list.lastChild);
    },

    clearSlots() {
        this.slots.forEach((item, i) => {
            if (item) this.selectSlot(i);
        });
        this.slots = [null, null, null, null];
        this.updateUI();
    },

    autoFill() {
        const items = this.currentTab === 'backpack' ? GameState.getBackpackItems() : GameState.getWarehouseItems();
        const sorted = items.sort((a, b) => (a.baseValue || 0) - (b.baseValue || 0));
        let added = 0;
        for (const item of sorted) {
            if (added >= 4) break;
            const emptyIdx = this.slots.indexOf(null);
            if (emptyIdx === -1) break;
            this.slots[emptyIdx] = item;
            added++;
        }
        if (added > 0) {
            this.renderMaterials();
            this.updateUI();
        } else {
            alert('没有可用的材料！');
        }
    },

    filterMaterials() {
        const sel = document.getElementById('materialQuality');
        if (sel) {
            this.currentQuality = sel.value;
            this.renderMaterials();
        }
    },

    initTabs() {
        document.querySelectorAll('.materials-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.materials-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTab = btn.dataset.tab;
                this.renderMaterials();
            });
        });

        document.querySelectorAll('.recipe-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.recipe-filters .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                document.querySelectorAll('.recipe-item').forEach(el => {
                    el.style.display = filter === 'all' || el.classList.contains(filter) ? '' : 'none';
                });
            });
        });
    },

    onStateChange() {
        this.renderMaterials();
        this.updateUI();
    }
};

// ==================== 搜刮模块 ====================
const LootModule = {
    name: 'loot',
    grid: null,
    items: [],
    foundItems: [],
    totalItems: 0,
    gridSize: 9,
    fogRevealed: [],
    isRevealing: false,

    init() {
        this.grid = new GridManager(this.gridSize);
        this.fogRevealed = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        this.generateLoot();
        this.render();
        this.updateStats();
    },

    generateLoot() {
        this.items = [];
        this.foundItems = [];
        const map = MAPS[GameState.data.selectedMap] || MAPS[0];
        const count = 6 + Math.floor(Math.random() * 6);

        for (let i = 0; i < count; i++) {
            const item = ItemUtils.randomByDropRate(map.dropRate);
            this.items.push(item);
        }

        this.totalItems = this.items.length;
        this.grid.clear();
        this.items.forEach(item => {
            const space = this.grid.findSpace(item.width || 1, item.height || 1);
            if (space) {
                this.grid.placeItem(item, space.x, space.y);
                item.gridX = space.x;
                item.gridY = space.y;
            }
        });
    },

    render() {
        const container = document.getElementById('lootGrid');
        if (!container) return;

        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(' + this.gridSize + ', 1fr)';
        container.style.gridTemplateRows = 'repeat(' + this.gridSize + ', 1fr)';
        container.innerHTML = '';

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'loot-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                const cellId = this.grid.grid[y][x];
                const revealed = this.fogRevealed[y][x];

                if (cellId && revealed) {
                    const item = this.items.find(i => i.gridX === x && i.gridY === y);
                    if (item) {
                        cell.classList.add('revealed', 'quality-' + (item.quality || 'green'));
                        cell.innerHTML = `<span class="loot-item-icon">${item.icon || '📦'}</span>`;
                        cell.title = item.name + ' (¥' + (item.baseValue || 0) + ')';
                        cell.addEventListener('click', () => this.showItemDetail(item));
                    } else {
                        const parentItem = this.items.find(i =>
                            x >= i.gridX && x < i.gridX + (i.width || 1) &&
                            y >= i.gridY && y < i.gridY + (i.height || 1)
                        );
                        if (parentItem) {
                            cell.classList.add('revealed', 'quality-' + (parentItem.quality || 'green'));
                            cell.style.opacity = '0.6';
                        }
                    }
                } else if (cellId) {
                    cell.classList.add('fog');
                    cell.innerHTML = '<span class="fog-icon">❓</span>';
                    cell.addEventListener('click', () => this.revealCell(x, y));
                } else {
                    cell.classList.add(revealed ? 'revealed' : 'fog');
                    if (!revealed) {
                        cell.addEventListener('click', () => {
                            this.fogRevealed[y][x] = true;
                            this.render();
                            this.updateStats();
                        });
                    }
                }
                container.appendChild(cell);
            }
        }

        this.updateProgressRing();
    },

    updateProgressRing() {
        const total = this.gridSize * this.gridSize;
        let revealed = 0;
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.fogRevealed[y][x]) revealed++;
            }
        }

        const circle = document.getElementById('progressCircle');
        const percentEl = document.getElementById('progressPercent');
        if (circle) {
            const circumference = 2 * Math.PI * 45;
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference * (1 - revealed / total);
        }
        if (percentEl) percentEl.textContent = Math.round(revealed / total * 100) + '%';
    },

    revealCell(x, y) {
        if (this.isRevealing) return;
        this.isRevealing = true;
        this.fogRevealed[y][x] = true;

        const item = this.items.find(i => i.gridX === x && i.gridY === y);
        if (item && !this.foundItems.some(f => f.id === item.id)) {
            let allRevealed = true;
            for (let dy = 0; dy < (item.height || 1); dy++) {
                for (let dx = 0; dx < (item.width || 1); dx++) {
                    if (!this.fogRevealed[item.gridY + dy] || !this.fogRevealed[item.gridY + dy][item.gridX + dx]) {
                        allRevealed = false;
                    }
                }
            }
            if (allRevealed) {
                this.foundItems.push(item);
            }
        }

        this.render();
        this.updateStats();
        setTimeout(() => { this.isRevealing = false; }, 100);
    },

    showItemDetail(item) {
        const container = document.getElementById('itemDetailContent');
        if (!container) return;
        container.innerHTML = `
            <div class="item-detail-info">
                <div class="item-detail-icon" style="font-size: 3rem; text-align: center;">${item.icon || '📦'}</div>
                <h3 class="item-detail-name" style="text-align: center; margin: 10px 0;">${item.name}</h3>
                <span class="item-detail-quality quality-${item.quality}" style="display: block; text-align: center;">${ItemUtils.getQualityIcon(item.quality)} ${ItemUtils.getQualityName(item.quality)}</span>
                <div class="item-detail-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px;">
                    <div class="detail-stat" style="text-align: center; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <span class="stat-lbl" style="display: block; font-size: 0.7rem; color: var(--text-weak);">价值</span>
                        <span class="stat-val" style="font-size: 1.1rem; font-weight: 700; color: #ffd740;">¥${item.baseValue || 0}</span>
                    </div>
                    <div class="detail-stat" style="text-align: center; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <span class="stat-lbl" style="display: block; font-size: 0.7rem; color: var(--text-weak);">尺寸</span>
                        <span class="stat-val" style="font-size: 1.1rem; font-weight: 700;">${item.width || 1}×${item.height || 1}</span>
                    </div>
                </div>
            </div>
        `;
    },

    updateStats() {
        const found = document.getElementById('lootFound');
        const totalEl = document.getElementById('lootTotal');
        const value = document.getElementById('lootValue');
        const scans = document.getElementById('remainingScans');

        let revealed = 0;
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.fogRevealed[y][x]) revealed++;
            }
        }

        if (found) found.textContent = this.foundItems.length;
        if (totalEl) totalEl.textContent = this.totalItems;
        if (value) value.textContent = '¥' + this.foundItems.reduce((s, i) => s + (i.baseValue || 0), 0);
        if (scans) scans.textContent = (this.gridSize * this.gridSize - revealed) + '/' + (this.gridSize * this.gridSize);
    },

    autoScan() {
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (!this.fogRevealed[y][x] && this.grid.grid[y][x] !== null) {
                    this.revealCell(x, y);
                }
            }
        }
    },

    collectAll() {
        this.foundItems.forEach(item => {
            for (let dy = 0; dy < (item.height || 1); dy++) {
                for (let dx = 0; dx < (item.width || 1); dx++) {
                    const fx = item.gridX + dx, fy = item.gridY + dy;
                    if (fy < this.gridSize && fx < this.gridSize) {
                        this.fogRevealed[fy][fx] = true;
                    }
                }
            }
        });
        this.render();
        this.updateStats();
    },

    finishLooting() {
        if (this.foundItems.length === 0) {
            if (!confirm('没有搜刮到任何物品，确定结束吗？')) return;
        }

        // 将找到的物品存入背包/仓库
        let stored = 0;
        this.foundItems.forEach(item => {
            if (GameState.autoStoreItem(item)) stored++;
        });

        alert('搜刮完成！获得 ' + stored + ' 件物品，价值 ¥' + this.foundItems.reduce((s, i) => s + (i.baseValue || 0), 0));
        window.location.href = 'index.html';
    },

    onStateChange() {
        // 搜刮模块通常在独立页面，不需要响应状态变更
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModuleManager, WarehouseModule, ShopModule, SynthesisModule, LootModule };
}
