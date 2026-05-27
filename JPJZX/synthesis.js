// ==================== 合成系统 ====================

const synthesis = {
    slots: [null, null, null, null],
    currentTab: 'backpack',
    currentQuality: 'all',

    init() {
        this.renderRecipes();
        this.renderMaterials();
        this.updateUI();
        this.initTabs();
    },

    loadGameData() {
        try {
            const data = localStorage.getItem('containerAuctionSave');
            return data ? JSON.parse(data) : null;
        } catch(e) { return null; }
    },

    saveGameData() {
        try {
            const data = this.loadGameData() || {
                state: { money: 15000, reputation: 0, round: 1, ranking: 1, itemsSold: 0, totalValue: 0 },
                backpack: Array(9).fill().map(() => Array(9).fill(null)),
                warehouse: Array(27).fill().map(() => Array(27).fill(null))
            };
            localStorage.setItem('containerAuctionSave', JSON.stringify(data));
        } catch(e) {}
    },

    getAllItems() {
        const all = [];
        for (const pool of Object.values(ITEMS_DATABASE)) {
            all.push(...pool);
        }
        return all;
    },

    getBackpackItems() {
        const data = this.loadGameData();
        if (!data || !data.backpack) return [];
        const bp = data.backpack;
        const items = [];
        const seen = new Set();
        for (let y = 0; y < bp.length; y++) {
            for (let x = 0; x < bp[y].length; x++) {
                const id = bp[y][x];
                if (id && !seen.has(id + '|' + x + '|' + y)) {
                    const item = this.getItemById(id);
                    if (item) {
                        let isTopLeft = true;
                        for (let dy = 0; dy < (item.height || 1); dy++) {
                            for (let dx = 0; dx < (item.width || 1); dx++) {
                                const ny = y - dy, nx = x - dx;
                                if (ny >= 0 && nx >= 0 && bp[ny] && bp[ny][nx] === id) {
                                    if (dy > 0 || dx > 0) isTopLeft = false;
                                }
                            }
                        }
                        if (isTopLeft) {
                            seen.add(id + '|' + x + '|' + y);
                            items.push({ ...item, gridX: x, gridY: y, location: 'backpack' });
                        }
                    }
                }
            }
        }
        return items;
    },

    getWarehouseItems() {
        const data = this.loadGameData();
        if (!data || !data.warehouse) return [];
        const wh = data.warehouse;
        const items = [];
        const seen = new Set();
        for (let y = 0; y < wh.length; y++) {
            for (let x = 0; x < wh[y].length; x++) {
                const id = wh[y][x];
                if (id && !seen.has(id + '|' + x + '|' + y)) {
                    const item = this.getItemById(id);
                    if (item) {
                        let isTopLeft = true;
                        for (let dy = 0; dy < (item.height || 1); dy++) {
                            for (let dx = 0; dx < (item.width || 1); dx++) {
                                const ny = y - dy, nx = x - dx;
                                if (ny >= 0 && nx >= 0 && wh[ny] && wh[ny][nx] === id) {
                                    if (dy > 0 || dx > 0) isTopLeft = false;
                                }
                            }
                        }
                        if (isTopLeft) {
                            seen.add(id + '|' + x + '|' + y);
                            items.push({ ...item, gridX: x, gridY: y, location: 'warehouse' });
                        }
                    }
                }
            }
        }
        return items;
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
        recipes.forEach((recipe, i) => {
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

        let items = this.currentTab === 'backpack' ? this.getBackpackItems() : this.getWarehouseItems();

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
                <span class="mat-quality">${this.qualityName(item.quality || 'green')}</span>
            `;
            el.addEventListener('click', () => this.addMaterial(item));
            container.appendChild(el);
        });
    },

    qualityName(q) {
        const map = { green: '🟢 普通', blue: '🔵 稀有', purple: '🟣 史诗', gold: '🟡 传说', red: '🔴 神话' };
        return map[q] || '🟢 普通';
    },

    addMaterial(item) {
        // Find first empty slot
        const emptyIdx = this.slots.indexOf(null);
        if (emptyIdx === -1) { alert('材料槽已满！'); return; }

        // Check if item already in a slot
        if (this.slots.some(s => s && s.id === item.id && s.gridX === item.gridX && s.gridY === item.gridY)) {
            alert('该物品已在材料槽中！');
            return;
        }

        this.slots[emptyIdx] = item;
        this.updateUI();

        // Remove from backpack/warehouse
        const data = this.loadGameData();
        if (data) {
            if (item.location === 'backpack' && data.backpack) {
                for (let dy = 0; dy < (item.height || 1); dy++) {
                    for (let dx = 0; dx < (item.width || 1); dx++) {
                        const ny = item.gridY + dy, nx = item.gridX + dx;
                        if (data.backpack[ny]) data.backpack[ny][nx] = null;
                    }
                }
            } else if (item.location === 'warehouse' && data.warehouse) {
                for (let dy = 0; dy < (item.height || 1); dy++) {
                    for (let dx = 0; dx < (item.width || 1); dx++) {
                        const ny = item.gridY + dy, nx = item.gridX + dx;
                        if (data.warehouse[ny]) data.warehouse[ny][nx] = null;
                    }
                }
            }
            localStorage.setItem('containerAuctionSave', JSON.stringify(data));
        }

        this.renderMaterials();
    },

    updateUI() {
        // Update material slots
        for (let i = 0; i < 4; i++) {
            const slot = document.querySelector(`.material-slot[data-slot="${i}"]`);
            if (!slot) continue;
            const item = this.slots[i];
            if (item) {
                slot.innerHTML = `
                    <span class="slot-item quality-${item.quality || 'green'}">${item.icon || '📦'}</span>
                    <span class="slot-name">${item.name}</span>
                `;
                slot.classList.add('filled');
            } else {
                slot.innerHTML = '<span class="slot-empty">+</span>';
                slot.classList.remove('filled');
            }
        }

        // Update success rate
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

        // Update result preview
        const result = document.getElementById('resultDisplay');
        if (result) {
            const filled = this.slots.filter(s => s !== null).length;
            if (filled >= 2) {
                const qualities = this.slots.filter(s => s).map(s => s.quality);
                const qOrder = { green: 0, blue: 1, purple: 2, gold: 3, red: 4 };
                const bestQ = qualities.sort((a, b) => qOrder[b] - qOrder[a])[0] || 'green';
                const previewItems = ITEMS_DATABASE[bestQ] || ITEMS_DATABASE.green;
                const preview = previewItems[Math.floor(Math.random() * previewItems.length)];
                result.innerHTML = `<span class="result-preview">${preview.icon || '📦'} ${preview.name}</span>`;
            } else {
                result.innerHTML = '<span class="slot-empty">?</span>';
            }
        }
    },

    selectSlot(index) {
        if (this.slots[index]) {
            // Remove item from slot and return to inventory
            const item = this.slots[index];
            this.slots[index] = null;

            // Put item back into grid
            const data = this.loadGameData();
            if (data) {
                if (item.location === 'backpack') {
                    // Find first empty cell
                    for (let y = 0; y < 9; y++) {
                        let placed = false;
                        for (let x = 0; x < 9; x++) {
                            if (!data.backpack[y][x]) {
                                for (let dy = 0; dy < (item.height || 1); dy++) {
                                    for (let dx = 0; dx < (item.width || 1); dx++) {
                                        const ny = y + dy, nx = x + dx;
                                        if (data.backpack[ny]) data.backpack[ny][nx] = item.id;
                                    }
                                }
                                placed = true;
                                break;
                            }
                        }
                        if (placed) break;
                    }
                }
                localStorage.setItem('containerAuctionSave', JSON.stringify(data));
            }

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

        // Show animation
        const anim = document.getElementById('synthesisAnimation');
        if (anim) anim.classList.add('active');

        setTimeout(() => {
            if (anim) anim.classList.remove('active');

            const success = Math.random() * 100 < rate;
            if (success) {
                // Determine result quality
                const qIdx = qOrder[bestQ];
                const resultQualities = ['green', 'blue', 'purple', 'gold', 'red'];
                const resultQ = resultQualities[Math.min(qIdx + 1, 4)];
                const pool = ITEMS_DATABASE[resultQ] || ITEMS_DATABASE.green;
                const result = pool[Math.floor(Math.random() * pool.length)];

                // Save to backpack
                const data = this.loadGameData();
                if (data) {
                    const bp = data.backpack;
                    for (let y = 0; y < 9; y++) {
                        let placed = false;
                        for (let x = 0; x < 9; x++) {
                            if (bp[y][x] === null) {
                                bp[y][x] = result.id;
                                for (let dx = 1; dx < (result.width || 1); dx++) {
                                    if (bp[y][x + dx] !== undefined) bp[y][x + dx] = result.id;
                                }
                                for (let dy = 1; dy < (result.height || 1); dy++) {
                                    if (bp[y + dy]) bp[y + dy][x] = result.id;
                                }
                                placed = true;
                                break;
                            }
                        }
                        if (placed) break;
                    }
                    localStorage.setItem('containerAuctionSave', JSON.stringify(data));
                }

                alert('合成成功！获得 ' + (result.icon || '📦') + ' ' + result.name);
            } else {
                alert('合成失败...材料已消耗。');
            }

            this.slots = [null, null, null, null];
            this.updateUI();
            this.renderMaterials();

            // Add to history
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
        // Return all items
        this.slots.forEach((item, i) => {
            if (item) this.selectSlot(i);
        });
        this.slots = [null, null, null, null];
        this.updateUI();
    },

    autoFill() {
        const items = this.currentTab === 'backpack' ? this.getBackpackItems() : this.getWarehouseItems();
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
                // Filter recipes
                const filter = btn.dataset.filter;
                document.querySelectorAll('.recipe-item').forEach(el => {
                    el.style.display = filter === 'all' || el.classList.contains(filter) ? '' : 'none';
                });
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => synthesis.init());
