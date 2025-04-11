class ItemPreview {
    constructor() {
        this.initializeModal();
    }

    initializeModal() {
        this.previewModal = document.createElement('div');
        this.previewModal.classList.add('minecraft-item-preview', 'hidden');
        
        this.previewModal.innerHTML = `
            <div class="minecraft-item-preview-content">
                <button class="minecraft-item-preview-close">✕</button>
                <img class="minecraft-item-preview-image" src="" alt="Item Preview">
                <h2 class="minecraft-item-preview-name"></h2>
                <div class="minecraft-item-preview-details"></div>
                <div class="minecraft-item-preview-stats">
                    <div class="item-cost">
                        <span>Costo</span>
                        <div class="minecraft-item-preview-cost"></div>
                    </div>
                    <div class="item-roi">
                        <span>ROI</span>
                        <div class="minecraft-item-preview-roi"></div>
                    </div>
                </div>
                <div class="minecraft-item-preview-actions">
                    <button class="minecraft-item-preview-cancel">Cancelar</button>
                    <button class="minecraft-item-preview-buy">Comprar</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.previewModal);

        // Setup event listeners with sound
        this.previewModal.querySelector('.minecraft-item-preview-close').addEventListener('click', () => this.hide());
        
        const cancelBtn = this.previewModal.querySelector('.minecraft-item-preview-cancel');
        cancelBtn.addEventListener('click', () => {
            soundManager.playSound('minecraftButton');
            this.hide();
        });

        const buyBtn = this.previewModal.querySelector('.minecraft-item-preview-buy');
        buyBtn.addEventListener('click', () => {
            soundManager.playSound('minecraftButton');
        });
    }

    calculateROI(item, type) {
        const BASE_MINING_RATE = CONFIG.BASE_MINING_RATE;
        const miningBoost = item.mining_rate_boost || 0;
        
        // Calculate daily mining increase
        const dailyMiningIncrease = miningBoost * (24 * 60 * 60); // seconds in a day
        
        // If no mining boost, return a high number to indicate minimal benefit
        if (dailyMiningIncrease <= 0) {
            return '∞';
        }
        
        // Calculate days to recover investment
        const daysToRecoverInvestment = item.cost / dailyMiningIncrease;
        
        return daysToRecoverInvestment.toFixed(2);
    }

    showPreview(item, type, buyCallback) {
        const imageEl = this.previewModal.querySelector('.minecraft-item-preview-image');
        const nameEl = this.previewModal.querySelector('.minecraft-item-preview-name');
        const detailsEl = this.previewModal.querySelector('.minecraft-item-preview-details');
        const costEl = this.previewModal.querySelector('.minecraft-item-preview-cost');
        const roiEl = this.previewModal.querySelector('.minecraft-item-preview-roi');
        const buyBtn = this.previewModal.querySelector('.minecraft-item-preview-buy');

        imageEl.src = item.image;
        nameEl.textContent = item.name;
        costEl.textContent = `${item.cost} USDT`;

        // Set details based on item type
        if (type === 'weapon') {
            detailsEl.textContent = `Mejora tu minería con la ${item.name}`;
        } else if (type === 'armor') {
            detailsEl.textContent = `Protección y mejora de minería con ${item.name}`;
        }

        // Calculate and display ROI
        const roi = this.calculateROI(item, type);
        roiEl.textContent = roi === '∞' ? 'Beneficio mínimo' : `${roi} días`;

        // Setup buy button
        buyBtn.onclick = () => {
            this.hide();
            buyCallback();
        };

        this.previewModal.classList.remove('hidden');
    }

    hide() {
        this.previewModal.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.itemPreview = new ItemPreview();
});