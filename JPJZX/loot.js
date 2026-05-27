// ==================== 战利品搜刮管理器 ====================

const lootManager = {
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

    loadGameData() {
        try {
            const data = localStorage.getItem('containerAuctionSave');
            return data ? JSON.parse(data) : null;
        } catch(e) { return null; }
    },

    saveGameData() {
        try {
            const existing = this.loadGameData() || {
                state: { money: 15000, reputation: 0, round: 1, ranking: 1, itemsSold: 0, totalValue: 0 },
                backpack: Array(9).fill().map(() => Array(9).fill(null)),
                warehouse: Array(27).fill().map(() => Array(27).fill(null))
            };

            // Add newly found items to backpack
            this.foundItems.forEach(item => {
                const space = this.findBackpackSpace(existing);
                if (space) {
                    existing.backpack[space.y][space.x] = item.id;
                    // Fill the item's grid cells
                    for (let dy = 0; dy < (item.height || 1); dy++) {
                        for (let dx = 1; dx < (item.width || 1); dx++) {
                            const nx = space.x + dx, ny = space.y + dy;
                            if (ny < 9 && nx < 9) existing.backpack[ny][nx] = item.id;
                        }
                    }
                }
            });

            existing.state.totalValue += this.foundItems.reduce((s, i) => s + (i.baseValue || 0), 0);
            localStorage.setItem('containerAuctionSave', JSON.stringify(existing));
        } catch(e) {}
    },

    findBackpackSpace(saveData) {
        const bp = saveData.backpack;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (bp[y][x] === null) return { x, y };
            }
        }
        return null;
    },

    generateLoot() {
        this.items = [];
        this.foundItems = [];
        const allItems = [];
        for (const pool of Object.values(ITEMS_DATABASE)) {
            allItems.push(...pool);
        }

        // Generate 6-11 random items for the container
        const count = 6 + Math.floor(Math.random() * 6);
        const dropRate = 75; // Average drop rate

        for (let i = 0; i < count; i++) {
            let qualityPool;
            const roll = Math.random() * 100;
            if (roll < dropRate * 0.08) qualityPool = 'red';
            else if (roll < dropRate * 0.18) qualityPool = 'gold';
            else if (roll < dropRate * 0.35) qualityPool = 'purple';
            else if (roll < dropRate * 0.55) qualityPool = 'blue';
            else qualityPool = 'green';

            const pool = ITEMS_DATABASE[qualityPool] || ITEMS_DATABASE.green;
            const item = { ...pool[Math.floor(Math.random() * pool.length)] };
            this.items.push(item);
        }

        this.totalItems = this.items.length;

        // Place items in grid
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

        // Create grid cells
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'loot-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                const cellId = this.grid.grid[y][x];
                const revealed = this.fogRevealed[y][x];

                if (cellId && revealed) {
                    const item = this.items.find(i => i.gridX === x && i.gridY === y) ||
                                 this.items.find(i => i.id === cellId);
                    if (item && item.gridX === x && item.gridY === y) {
                        cell.classList.add('revealed', 'quality-' + (item.quality || 'green'));
                        cell.innerHTML = `<span class="loot-item-icon">${item.icon || '📦'}</span>`;
                        cell.title = item.name + ' (¥' + (item.baseValue || 0) + ')';
                        cell.addEventListener('click', () => this.showItemDetail(item));
                    } else {
                        // Part of a multi-cell item
                        const parentItem = this.items.find(i => {
                            return x >= i.gridX && x < i.gridX + (i.width || 1) &&
                                   y >= i.gridY && y < i.gridY + (i.height || 1);
                        });
                        if (parentItem) {
                            cell.classList.add('revealed', 'quality-' + (parentItem.quality || 'green'));
                            cell.style.opacity = '0.6';
                            cell.textContent = '';
                        }
                    }
                } else if (cellId) {
                    cell.classList.add('fog');
                    cell.innerHTML = '<span class="fog-icon">❓</span>';
                    cell.addEventListener('click', () => this.revealCell(x, y));
                } else {
                    cell.classList.add('empty');
                    if (revealed) {
                        cell.classList.add('revealed');
                    } else {
                        cell.classList.add('fog');
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

        // Update progress ring
        const total = this.gridSize * this.gridSize;
        let revealed = 0;
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.fogRevealed[y][x]) revealed++;
            }
        }

        const percent = Math.round(revealed / total * 100);
        const circle = document.getElementById('progressCircle');
        const percentEl = document.getElementById('progressPercent');
        if (circle) {
            const circumference = 2 * Math.PI * 45;
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference * (1 - revealed / total);
        }
        if (percentEl) percentEl.textContent = percent + '%';
    },

    revealCell(x, y) {
        if (this.isRevealing) return;
        this.isRevealing = true;
        this.fogRevealed[y][x] = true;

        const item = this.items.find(i => i.gridX === x && i.gridY === y);
        if (item && !this.foundItems.some(f => f.id === item.id)) {
            // Check if all cells of this item are revealed
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
                <span class="item-detail-quality quality-${item.quality || 'green'}" style="display: block; text-align: center;">${this.qualityName(item.quality || 'green')}</span>
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

    qualityName(q) {
        const map = { green: '🟢 普通', blue: '🔵 稀有', purple: '🟣 史诗', gold: '🟡 传说', red: '🔴 神话' };
        return map[q] || '🟢 普通';
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

    resetGrid() {
        if (!confirm('重置网格将清空所有进度，确定吗？')) return;
        this.grid = new GridManager(this.gridSize);
        this.fogRevealed = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(false));
        this.foundItems = [];
        this.generateLoot();
        this.render();
        this.updateStats();
    },

    toggleFog() {
        const cells = document.querySelectorAll('.loot-cell.fog');
        if (cells.length > 0) {
            cells.forEach(c => c.classList.toggle('fog-hidden'));
        }
    },

    finishLooting() {
        if (this.foundItems.length === 0) {
            if (!confirm('没有搜刮到任何物品，确定结束吗？')) return;
        }
        this.saveGameData();
        alert('搜刮完成！获得 ' + this.foundItems.length + ' 件物品，价值 ¥' + this.foundItems.reduce((s, i) => s + (i.baseValue || 0), 0));
        window.location.href = 'index.html';
    }
};

document.addEventListener('DOMContentLoaded', () => lootManager.init());
