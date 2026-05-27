// ==================== 黑市商店 ====================

const shop = {
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

    loadGameData() {
        try {
            const data = localStorage.getItem('containerAuctionSave');
            return data ? JSON.parse(data) : null;
        } catch(e) { return null; }
    },

    saveMoney(money) {
        try {
            const data = this.loadGameData() || { state: { money: 15000, reputation: 0, round: 1, ranking: 1, itemsSold: 0, totalValue: 0 }, backpack: Array(9).fill().map(() => Array(9).fill(null)), warehouse: Array(27).fill().map(() => Array(27).fill(null)) };
            data.state.money = money;
            localStorage.setItem('containerAuctionSave', JSON.stringify(data));
        } catch(e) {}
    },

    getMoney() {
        const data = this.loadGameData();
        return data ? data.state.money : 15000;
    },

    getReputation() {
        const data = this.loadGameData();
        return data ? (data.state.reputation || 0) : 0;
    },

    getAllItems() {
        const all = [];
        for (const pool of Object.values(ITEMS_DATABASE)) {
            all.push(...pool);
        }
        return all;
    },

    render() {
        const grid = document.getElementById('shopItemsGrid');
        if (!grid) return;

        let items = this.getAllItems();

        // Filter by category
        if (this.currentCategory !== 'all') {
            items = items.filter(item => item.category === this.currentCategory);
        }

        // Filter by quality
        if (this.currentQuality !== 'all') {
            items = items.filter(item => item.quality === this.currentQuality);
        }

        // Sort
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
                    <span class="shop-card-quality quality-${item.quality || 'green'}">${this.qualityName(item.quality || 'green')}</span>
                    <span class="shop-card-price">¥${item.baseValue || 0}</span>
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

    qualityName(q) {
        const map = { green: '🟢 普通', blue: '🔵 稀有', purple: '🟣 史诗', gold: '🟡 传说', red: '🔴 神话' };
        return map[q] || '🟢 普通';
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
                <span class="cart-item-price">¥${item.baseValue || 0}</span>
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
        const allItems = this.getAllItems();
        const dealItems = [];
        for (let i = 0; i < 4; i++) {
            const item = allItems[Math.floor(Math.random() * allItems.length)];
            dealItems.push(item);
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
        if (moneyEl) moneyEl.textContent = this.getMoney();
        if (repEl) repEl.textContent = '⭐ ' + ['新手', '老手', '专家', '大师', '传说'][Math.min(Math.floor(this.getReputation() / 200), 4)] || '新手';
        if (repFill) repFill.style.width = Math.min(this.getReputation() % 200 / 2, 100) + '%';
        if (repText) repText.textContent = (this.getReputation() % 200) + '/200';
    },

    checkout() {
        if (this.cart.length === 0) { alert('购物车是空的！'); return; }
        const total = this.cart.reduce((s, i) => s + (i.baseValue || 0), 0);
        const money = this.getMoney();
        if (total > money) { alert('资金不足！需要 ¥' + total + '，当前 ¥' + money); return; }
        if (!confirm('确认购买 ' + this.cart.length + ' 件物品，共 ¥' + total + ' 吗？')) return;
        this.saveMoney(money - total);
        this.cart = [];
        this.render();
        this.renderCart();
        this.updateUI();
        alert('购买成功！');
    },

    clearCart() {
        if (this.cart.length === 0) return;
        this.cart = [];
        this.render();
        this.renderCart();
    }
};

document.addEventListener('DOMContentLoaded', () => shop.init());
