// ==================== 网格管理器 - 81 格系统 ====================

class GridManager {
    constructor(size = 9) {
        this.size = size;
        this.grid = Array(size).fill().map(() => Array(size).fill(null));
    }

    // 清空网格
    clear() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(null));
    }

    // 查找可以放置物品的位置
    findSpace(width, height) {
        for (let y = 0; y <= this.size - height; y++) {
            for (let x = 0; x <= this.size - width; x++) {
                let canPlace = true;
                for (let dy = 0; dy < height; dy++) {
                    for (let dx = 0; dx < width; dx++) {
                        if (this.grid[y + dy][x + dx] !== null) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (!canPlace) break;
                }
                if (canPlace) return {x, y};
            }
        }
        return null;
    }

    // 放置物品
    placeItem(item, x, y) {
        for (let dy = 0; dy < item.height; dy++) {
            for (let dx = 0; dx < item.width; dx++) {
                this.grid[y + dy][x + dx] = item.id;
            }
        }
    }

    // 移除物品
    removeItem(item, x, y) {
        for (let dy = 0; dy < item.height; dy++) {
            for (let dx = 0; dx < item.width; dx++) {
                this.grid[y + dy][x + dx] = null;
            }
        }
    }

    // 检查位置是否可用
    isCellFree(x, y) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) return false;
        return this.grid[y][x] === null;
    }

    // 检查是否可以放置物品
    canPlaceItem(item, x, y) {
        if (x < 0 || y < 0) return false;
        if (x + item.width > this.size || y + item.height > this.size) return false;
        
        for (let dy = 0; dy < item.height; dy++) {
            for (let dx = 0; dx < item.width; dx++) {
                if (this.grid[y + dy][x + dx] !== null) return false;
            }
        }
        return true;
    }

    // 获取网格状态
    getGrid() {
        return this.grid;
    }

    // 计算已使用的格子数
    getUsedCells() {
        let count = 0;
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.grid[y][x] !== null) count++;
            }
        }
        return count;
    }

    // 获取空闲格子数
    getFreeCells() {
        return this.size * this.size - this.getUsedCells();
    }

    // 随机放置物品（用于生成战利品）
    randomPlaceItems(items) {
        const placedItems = [];
        const shuffledItems = [...items].sort(() => Math.random() - 0.5);
        
        for (const item of shuffledItems) {
            const space = this.findSpace(item.width, item.height);
            if (space) {
                this.placeItem(item, space.x, space.y);
                placedItems.push({
                    ...item,
                    gridX: space.x,
                    gridY: space.y
                });
            }
        }
        
        return placedItems;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridManager;
}
