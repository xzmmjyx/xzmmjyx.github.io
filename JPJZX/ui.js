// ==================== UI 管理器 ====================

const ui = {
    // 更新统计显示
    updateStats(state) {
        document.getElementById('money').textContent = state.money;
        document.getElementById('reputation').textContent = state.reputation;
        document.getElementById('round').textContent = `${state.round}/8`;
        document.getElementById('ranking').textContent = `${state.ranking}/4`;
        document.getElementById('backpack-space').textContent = `${state.backpackUsed}/81`;
    },

    // 渲染地图选择器
    renderMapSelector(maps, selectedMap, onSelect) {
        const container = document.getElementById('mapSelector');
        container.innerHTML = '';
        
        maps.forEach((map, index) => {
            const card = document.createElement('div');
            card.className = `map-card ${selectedMap === index ? 'selected' : ''}`;
            card.onclick = () => onSelect(index);
            card.innerHTML = `
                <h3>${map.name}</h3>
                <p>难度：${'⭐'.repeat(map.difficulty)}</p>
                <p>掉落率：${map.dropRate}%</p>
            `;
            container.appendChild(card);
        });
    },

    // 渲染 AI 玩家
    renderAIPlayers(aiPlayers, currentPlayerIndex) {
        const container = document.getElementById('aiPlayers');
        container.innerHTML = '';
        
        aiPlayers.forEach((player, index) => {
            const div = document.createElement('div');
            div.className = `ai-player ${index === currentPlayerIndex ? 'active' : ''}`;
            div.innerHTML = `
                <span class="ai-name">${player.name}</span>
                <span class="ai-status">💰${player.money} | 🎒${player.backpackUsed}/81</span>
            `;
            container.appendChild(div);
        });
    },

    // 渲染背包预览
    renderBackpackPreview(grid) {
        const container = document.getElementById('backpackPreview');
        container.innerHTML = '';
        
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = document.createElement('div');
                cell.className = `backpack-cell ${grid[y][x] ? 'occupied' : ''}`;
                if (grid[y][x]) {
                    const item = game.getItemById(grid[y][x]);
                    if (item) cell.textContent = item.icon;
                }
                container.appendChild(cell);
            }
        }
    },

    // 渲染搜刮网格
    renderLootGrid(placedItems) {
        const container = document.getElementById('lootGrid');
        container.innerHTML = '';
        
        // 创建 81 个格子
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell fog';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // 检查这个位置是否有物品
                const item = placedItems.find(item => 
                    x >= item.gridX && x < item.gridX + item.width &&
                    y >= item.gridY && y < item.gridY + item.height
                );
                
                if (item) {
                    cell.dataset.itemId = item.id;
                    cell.onclick = () => this.clickLootCell(cell, item);
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
        
        // 创建粒子效果
        this.createParticles(cell, item.quality);
        
        // 更新统计
        game.lootRevealed++;
        game.lootValue += item.baseValue;
        document.getElementById('lootFound').textContent = game.lootRevealed;
        document.getElementById('lootValue').textContent = game.lootValue;
        
        // 检查是否全部揭示
        if (game.lootRevealed >= game.state.currentItems.length) {
            setTimeout(() => {
                game.addItemsToInventory();
                this.closeModal('lootModal');
            }, 1500);
        }
    },

    // 创建粒子效果
    createParticles(element, quality) {
        const colors = {
            green: '#00ff00',
            blue: '#0064ff',
            purple: '#9600ff',
            gold: '#ffd700',
            red: '#ff0000'
        };
        
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.background = colors[quality] || '#fff';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            
            const angle = (Math.PI * 2 * i) / 10;
            const distance = 50 + Math.random() * 50;
            particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    },

    // 渲染仓库网格
    renderWarehouseGrid(grid) {
        const container = document.getElementById('warehouseGrid');
        container.innerHTML = '';
        
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                
                if (grid[y][x]) {
                    const item = game.getItemById(grid[y][x]);
                    if (item) {
                        cell.classList.add(`quality-${item.quality}`);
                        cell.innerHTML = `
                            <div class="item-info">
                                <div class="item-icon">${item.icon}</div>
                                <div class="item-name">${item.name}</div>
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
        document.getElementById(modalId).style.display = 'block';
    },

    // 关闭模态框
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    },

    // 显示随机事件
    showRandomEvent(event) {
        document.getElementById('eventTitle').textContent = event.title;
        document.getElementById('eventDesc').textContent = event.description;
        
        const optionsDiv = document.getElementById('eventOptions');
        optionsDiv.innerHTML = '';
        
        event.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary';
            btn.textContent = option.text;
            btn.onclick = () => {
                option.effect();
                this.closeModal('eventModal');
            };
            optionsDiv.appendChild(btn);
        });
        
        this.openModal('eventModal');
    },

    // 显示游戏结束
    showGameOver(stats) {
        const container = document.getElementById('gameOverStats');
        container.innerHTML = `
            <div class="game-over-stat"><span>最终排名:</span><span>${stats.ranking}/4</span></div>
            <div class="game-over-stat"><span>总资金:</span><span>${stats.money}</span></div>
            <div class="game-over-stat"><span>声望:</span><span>${stats.reputation}</span></div>
            <div class="game-over-stat"><span>评级:</span><span>${stats.rating}</span></div>
        `;
        this.openModal('gameOverModal');
    },

    // 显示消息提示
    showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
            color: #000;
            padding: 15px 30px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 2000;
            box-shadow: 0 5px 20px rgba(0,255,255,0.5);
            animation: slideDown 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown { from { transform: translate(-50%, -100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
    @keyframes slideUp { from { transform: translate(-50%, 0); opacity: 1; } to { transform: translate(-50%, -100%); opacity: 0; } }
`;
document.head.appendChild(style);

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ui;
}
