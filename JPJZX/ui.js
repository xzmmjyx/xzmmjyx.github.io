// ==================== UI 管理器 ====================

const ui = {
    // 更新统计显示
    updateStats(state) {
        const money = document.getElementById('money');
        const reputation = document.getElementById('reputation');
        const round = document.getElementById('round');
        const backpackSpace = document.getElementById('backpack-space');

        if (money) money.textContent = state.money;
        if (reputation) reputation.textContent = state.reputation;
        if (round) round.textContent = `${state.round}/8`;
        if (backpackSpace) backpackSpace.textContent = `${state.backpackUsed}/81`;
    },

    // 渲染地图选择器
    renderMapSelector(maps, selectedMap, onSelect) {
        const container = document.getElementById('mapSelector');
        if (!container) return;

        container.innerHTML = '';
        maps.forEach((map, index) => {
            const card = document.createElement('div');
            card.className = `map-card ${selectedMap === index ? 'selected' : ''}`;
            card.onclick = () => onSelect(index);
            card.innerHTML = `
                <div class="map-name">${map.name}</div>
                <div class="map-info">难度: ${'⭐'.repeat(map.difficulty)}</div>
                <div class="map-info">掉落: ${map.dropRate}%</div>
            `;
            container.appendChild(card);
        });
    },

    // 渲染 AI 玩家
    renderAIPlayers(aiPlayers, currentPlayerIndex) {
        const container = document.getElementById('aiPlayers');
        if (!container) return;

        container.innerHTML = '';
        aiPlayers.forEach((player, index) => {
            const div = document.createElement('div');
            div.className = `ai-player ${index === currentPlayerIndex ? 'active' : ''}`;
            div.innerHTML = `
                <span class="ai-name">${player.name}</span>
                <span class="ai-money">💰${player.money}</span>
            `;
            container.appendChild(div);
        });
    },

    // 渲染背包预览
    renderBackpackPreview(grid) {
        const container = document.getElementById('backpackPreview');
        if (!container) return;

        container.innerHTML = '';
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = document.createElement('div');
                cell.className = `backpack-cell ${grid[y][x] ? 'occupied' : ''}`;
                if (grid[y][x]) {
                    const item = ItemUtils.findById(grid[y][x]);
                    if (item) cell.textContent = item.icon;
                }
                container.appendChild(cell);
            }
        }
    },

    // 渲染搜刮网格
    renderLootGrid(placedItems) {
        const container = document.getElementById('lootGrid');
        if (!container) return;

        container.innerHTML = '';
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = document.createElement('div');
                cell.className = 'loot-cell fog';
                cell.dataset.x = x;
                cell.dataset.y = y;

                const item = placedItems.find(item =>
                    x >= item.gridX && x < item.gridX + (item.width || 1) &&
                    y >= item.gridY && y < item.gridY + (item.height || 1)
                );

                if (item) {
                    cell.dataset.itemId = item.id;
                    cell.onclick = () => this.clickLootCell(cell, item);
                } else {
                    cell.onclick = () => {
                        cell.classList.remove('fog');
                        cell.classList.add('revealed');
                    };
                }

                container.appendChild(cell);
            }
        }
    },

    // 点击搜刮格子
    clickLootCell(cell, item) {
        if (cell.classList.contains('revealed')) return;

        cell.classList.remove('fog');
        cell.classList.add('revealed', `quality-${item.quality}`);
        cell.innerHTML = `
            <div class="item-info">
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
            </div>
        `;

        // 更新统计
        if (window.game) {
            window.game.lootRevealed++;
            window.game.lootValue += item.baseValue;

            const lootFound = document.getElementById('lootFound');
            const lootValue = document.getElementById('lootValue');
            if (lootFound) lootFound.textContent = window.game.lootRevealed;
            if (lootValue) lootValue.textContent = window.game.lootValue;

            // 检查是否全部揭示
            if (window.game.lootRevealed >= GameState.currentItems.length) {
                setTimeout(() => {
                    window.game.addItemsToInventory();
                    this.closeModal('lootModal');
                }, 1500);
            }
        }
    },

    // 渲染仓库网格
    renderWarehouseGrid(grid) {
        const container = document.getElementById('warehouseGrid');
        if (!container) return;

        container.innerHTML = '';
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';

                if (grid[y][x]) {
                    const item = ItemUtils.findById(grid[y][x]);
                    if (item) {
                        cell.classList.add(`quality-${item.quality}`);
                        cell.innerHTML = `
                            <div class="item-info">
                                <div class="item-icon">${item.icon}</div>
                            </div>
                        `;
                    }
                }

                container.appendChild(cell);
            }
        }
    },

    // 打开模态框
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'flex';
    },

    // 关闭模态框
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    },

    // 显示随机事件
    showRandomEvent(event) {
        const eventTitle = document.getElementById('eventTitle');
        const eventDesc = document.getElementById('eventDesc');
        const optionsDiv = document.getElementById('eventOptions');

        if (eventTitle) eventTitle.textContent = event.title;
        if (eventDesc) eventDesc.textContent = event.description;

        if (optionsDiv) {
            optionsDiv.innerHTML = '';
            event.options.forEach((option) => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-primary';
                btn.textContent = option.text;
                btn.onclick = () => {
                    option.effect();
                    this.closeModal('eventModal');
                };
                optionsDiv.appendChild(btn);
            });
        }

        this.openModal('eventModal');
    },

    // 显示游戏结束
    showGameOver(stats) {
        const container = document.getElementById('gameOverStats');
        if (container) {
            container.innerHTML = `
                <div class="game-over-stat"><span>最终排名:</span><span>${stats.ranking}/4</span></div>
                <div class="game-over-stat"><span>总资金:</span><span>¥${stats.money}</span></div>
                <div class="game-over-stat"><span>声望:</span><span>${stats.reputation}</span></div>
                <div class="game-over-stat"><span>评级:</span><span>${stats.rating}</span></div>
                <div class="game-over-stat"><span>总资产:</span><span>¥${stats.totalAssets}</span></div>
            `;
        }
        this.openModal('gameOverModal');
    },

    // 显示消息提示
    showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // 添加日志
    addLog(message) {
        const logContent = document.getElementById('gameLog');
        if (logContent) {
            const entry = document.createElement('p');
            entry.className = 'log-entry';
            entry.textContent = message;
            logContent.insertBefore(entry, logContent.firstChild);

            // 保持日志数量
            while (logContent.children.length > 50) {
                logContent.removeChild(logContent.lastChild);
            }
        }
    }
};
