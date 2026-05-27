// ==================== 仓库管理器 ====================

const warehouse = {
    grid: null,
    warehouseGrid: null,
    selectedItems: [],
    currentTab: 'all',

    init() {
        const saveData = this.loadGameData();
        if (saveData) {
            this.grid = new GridManager(9);
            this.grid.grid = saveData.backpack || Array(9).fill().map(() => Array(9).fill(null));
            this.warehouseGrid = new GridManager(27);
            this.warehouseGrid.grid = saveData.warehouse || Array(27).fill().map(() => Array(27).fill(null));
        } else {
            this.grid = new GridManager(9);
            this.warehouseGrid = new GridManager(27);
        }
        this.render();
        this.initTabs();
    },

    loadGameData() {
        try {
            const data = localStorage.getItem('containerAuctionSave');
            return data ? JSON.parse(data) : null;
        } catch(e) {
            return null;
        }
    },

    saveGameData() {
        try {
            const saveData = {
                state: { money: 15000, reputation: 0, round: 1, ranking: 1, itemsSold: 0, totalValue: 0 },
                backpack: this.grid.grid,
                warehouse: this.warehouseGrid.grid
            };
            localStorage.setItem('containerAuctionSave', JSON.stringify(saveData));
        } catch(e) {}
    },

    getItemById(id) {
        if (!id) return null;
        for (const pool of Object.values(ITEMS_DATABASE)) {
            for (const item of pool) {
                if (item.id === id) return item;
            }
        }
        return null;
    },

    getItemsInGrid(gridManager) {
        const items = [];
        const seen = new Set();
        const g = gridManager.grid;
        for (let y = 0; y < g.length; y++) {
            for (let x = 0; x < g[y].length; x++) {
                const id = g[y][x];
                if (id && !seen.has(id + '|' + x + '|' + y)) {
                    const item = this.getItemById(id);
                    if (item) {
                        // Check if this is the top-left cell of the item
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
                            seen.add(id + '|' + x + '|' + y);
                            items.push({ ...item, gridX: x, gridY: y });
                        }
                    }
                }
            }
        }
        return items;
    },

    renderTab(tab, gridContainer, gridManager, items) {
        let filtered = items;
        if (tab !== 'all') {
            filtered = items.filter(item => item.category === tab);
        }
        gridContainer.innerHTML = '';
        filtered.forEach(item => {
            const el = document.createElement('div');
            el.className = 'grid-item quality-' + (item.quality || 'green');
            el.style.gridColumn = (item.gridX + 1) + ' / span ' + (item.width || 1);
            el.style.gridRow = (item.gridY + 1) + ' / span ' + (item.height || 1);
            el.dataset.id = item.id;
            el.dataset.x = item.gridX;
            el.dataset.y = item.gridY;
            el.innerHTML = `<span class="item-icon">${item.icon || '📦'}</span>`;
            el.title = `${item.name} (${item.quality || '普通'}) - ¥${item.baseValue || 0}`;
            el.addEventListener('click', () => this.selectItem(el, item));
            gridContainer.appendChild(el);
        });
    },

    render() {
        const backpackGrid = document.getElementById('backpackGrid');
        const warehouseGrid = document.getElementById('warehouseGrid');
        if (!backpackGrid || !warehouseGrid) return;

        const bpItems = this.getItemsInGrid(this.grid);
        const whItems = this.getItemsInGrid(this.warehouseGrid);

        this.renderTab(this.currentTab, backpackGrid, this.grid, bpItems);
        this.renderTab(this.currentTab, warehouseGrid, this.warehouseGrid, whItems);

        // Update counts
        const bpUsage = document.getElementById('backpackUsage');
        const bpFill = document.getElementById('backpackFill');
        const whUsage = document.getElementById('warehouseUsage');
        const whFill = document.getElementById('warehouseFill');
        if (bpUsage) bpUsage.textContent = this.grid.getUsedCells() + '/81';
        if (bpFill) bpFill.style.width = (this.grid.getUsedCells() / 81 * 100) + '%';
        if (whUsage) whUsage.textContent = this.warehouseGrid.getUsedCells() + '/243';
        if (whFill) whFill.style.width = (this.warehouseGrid.getUsedCells() / 243 * 100) + '%';

        // Asset stats
        const bpVal = document.getElementById('backpackValue');
        const whVal = document.getElementById('warehouseValue');
        const totalAssets = document.getElementById('totalAssets');
        const bpTotal = bpItems.reduce((s, i) => s + (i.baseValue || 0), 0);
        const whTotal = whItems.reduce((s, i) => s + (i.baseValue || 0), 0);
        if (bpVal) bpVal.textContent = '¥' + bpTotal;
        if (whVal) whVal.textContent = '¥' + whTotal;
        if (totalAssets) totalAssets.textContent = '¥' + (bpTotal + whTotal);

        // Total items count
        const totalCount = document.getElementById('totalItemsCount');
        if (totalCount) totalCount.textContent = '物品总数: ' + (bpItems.length + whItems.length);
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

    sortItems(type) {
        const gridManager = type === 'backpack' ? this.grid : this.warehouseGrid;
        const items = this.getItemsInGrid(gridManager);
        items.sort((a, b) => (b.baseValue || 0) - (a.baseValue || 0));

        // Clear grid and re-place items
        gridManager.clear();
        items.forEach(item => {
            const space = gridManager.findSpace(item.width || 1, item.height || 1);
            if (space) {
                gridManager.placeItem(item, space.x, space.y);
                item.gridX = space.x;
                item.gridY = space.y;
            }
        });
        this.render();
        this.saveGameData();
    },

    autoOrganize(type) {
        this.sortItems(type);
    },

    sellAll(type) {
        const gridManager = type === 'backpack' ? this.grid : this.warehouseGrid;
        const items = this.getItemsInGrid(gridManager);
        let totalValue = 0;
        items.forEach(item => {
            totalValue += item.baseValue || 0;
            gridManager.removeItem(item, item.gridX, item.gridY);
        });
        this.render();
        this.saveGameData();
        alert('出售完成！获得 ¥' + totalValue);
    },

    moveAllToWarehouse() {
        const items = this.getItemsInGrid(this.grid);
        let moved = 0;
        items.forEach(item => {
            const space = this.warehouseGrid.findSpace(item.width || 1, item.height || 1);
            if (space) {
                this.grid.removeItem(item, item.gridX, item.gridY);
                this.warehouseGrid.placeItem(item, space.x, space.y);
                moved++;
            }
        });
        this.render();
        this.saveGameData();
        if (moved > 0) alert('已入库 ' + moved + ' 件物品');
    },

    selectItem(el, item) {
        const prev = document.querySelector('.grid-item.selected');
        if (prev) prev.classList.remove('selected');
        el.classList.add('selected');

        const panel = document.getElementById('itemInfoContent');
        if (panel) {
            panel.innerHTML = `
                <div class="item-detail-info">
                    <div class="item-detail-icon">${item.icon || '📦'}</div>
                    <h3 class="item-detail-name">${item.name}</h3>
                    <span class="item-detail-quality quality-${item.quality || 'green'}">${this.qualityName(item.quality || 'green')}</span>
                    <div class="item-detail-stats">
                        <div class="detail-stat"><span class="stat-lbl">价值</span><span class="stat-val">¥${item.baseValue || 0}</span></div>
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

    qualityName(q) {
        const map = { green: '🟢 普通', blue: '🔵 稀有', purple: '🟣 史诗', gold: '🟡 传说', red: '🔴 神话' };
        return map[q] || '🟢 普通';
    },

    sellSelected() {
        if (!this.selectedItem) return;
        const item = this.selectedItem;
        const inBackpack = this.getItemsInGrid(this.grid).some(i => i.id === item.id && i.gridX === item.gridX);
        const gridManager = inBackpack ? this.grid : this.warehouseGrid;
        gridManager.removeItem(item, item.gridX, item.gridY);
        this.selectedItem = null;
        document.getElementById('selectedActions').style.display = 'none';
        document.getElementById('itemInfoContent').innerHTML = '<div class="empty-state"><span class="empty-icon">📦</span><p>选择物品查看详情</p></div>';
        this.render();
        this.saveGameData();
        alert('出售成功！获得 ¥' + (item.baseValue || 0));
    },

    moveSelected() {
        if (!this.selectedItem) return;
        const item = this.selectedItem;
        const inBackpack = this.getItemsInGrid(this.grid).some(i => i.id === item.id && i.gridX === item.gridX);
        const targetGrid = inBackpack ? this.warehouseGrid : this.grid;
        const sourceGrid = inBackpack ? this.grid : this.warehouseGrid;
        const space = targetGrid.findSpace(item.width || 1, item.height || 1);
        if (space) {
            sourceGrid.removeItem(item, item.gridX, item.gridY);
            targetGrid.placeItem(item, space.x, space.y);
            this.selectedItem = null;
            document.getElementById('selectedActions').style.display = 'none';
            document.getElementById('itemInfoContent').innerHTML = '<div class="empty-state"><span class="empty-icon">📦</span><p>选择物品查看详情</p></div>';
            this.render();
            this.saveGameData();
        } else {
            alert('目标位置空间不足！');
        }
    },

    destroySelected() {
        if (!this.selectedItem) return;
        if (!confirm('确定要销毁 ' + this.selectedItem.name + ' 吗？')) return;
        const item = this.selectedItem;
        const inBackpack = this.getItemsInGrid(this.grid).some(i => i.id === item.id && i.gridX === item.gridX);
        const gridManager = inBackpack ? this.grid : this.warehouseGrid;
        gridManager.removeItem(item, item.gridX, item.gridY);
        this.selectedItem = null;
        document.getElementById('selectedActions').style.display = 'none';
        document.getElementById('itemInfoContent').innerHTML = '<div class="empty-state"><span class="empty-icon">📦</span><p>选择物品查看详情</p></div>';
        this.render();
        this.saveGameData();
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => warehouse.init());
