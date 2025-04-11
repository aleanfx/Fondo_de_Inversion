// TODO: Consider refactoring this class into smaller, more focused classes
// Potential candidates for separation:
// - Mining logic
// - Shop management
// - Inventory handling
// - Reward system
class MiningGame {
    constructor() {
        this.balance = 0;
        this.totalMined = 0;
        this.startTime = null;
        this.isAnimating = false;
        this.isMining = false;
        this.miningInterval = null;
        this.timeLeftInterval = null;
        this.miningEndTime = null;
        this.MINING_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
        this.weaponInventory = [];
        this.armorInventory = [];
        this.equippedWeapon = null;
        this.equippedArmor = [];

        this.initializeElements();
        this.initializeEventListeners();
        
        this.itemShopToggleBtn = document.getElementById('toggleItemShop');
        this.itemShopToggleBtn.addEventListener('click', () => this.toggleItemShop());

        this.closeItemShopBtn = document.getElementById('closeItemShop');
        this.itemShopOverlay = document.getElementById('itemShopOverlay');
        this.closeItemShopBtn.addEventListener('click', () => this.closeItemShop());

        this.lastDailyRewardTime = localStorage.getItem('lastDailyRewardTime') || null;
        this.dailyRewardChest = document.getElementById('dailyRewardChest');
        this.dailyRewardOverlay = document.getElementById('dailyRewardOverlay');
        this.dailyRewardAmountEl = document.getElementById('dailyRewardAmount');
        this.claimDailyRewardBtn = document.getElementById('claimDailyReward');
        this.closeDailyRewardBtn = document.getElementById('closeDailyReward');

        this.dailyRewardChest.addEventListener('click', (event) => {
            // Prevent multiple sound plays
            if (!event.soundPlayed) {
                this.openDailyRewardModal();
                event.soundPlayed = true;
            }
        });
        this.claimDailyRewardBtn.addEventListener('click', () => this.claimDailyReward());
        this.closeDailyRewardBtn.addEventListener('click', () => this.closeDailyRewardModal());

        this.DAILY_REWARD_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.checkDailyReward();
        this.startTimeUpdate();
        this.populateItemShop();

        this.itemShopOverlay.addEventListener('click', (event) => {
            if (event.target === this.itemShopOverlay) {
                this.closeItemShop();
            }
        });

        // Armor Shop
        this.armorShopToggleBtn = document.getElementById('toggleArmorShop');
        this.armorShopToggleBtn.addEventListener('click', () => this.toggleArmorShop());

        this.closeArmorShopBtn = document.getElementById('closeArmorShop');
        this.armorShopOverlay = document.getElementById('armorShopOverlay');
        this.closeArmorShopBtn.addEventListener('click', () => this.closeArmorShop());

        this.armorShopOverlay.addEventListener('click', (event) => {
            if (event.target === this.armorShopOverlay) {
                this.closeArmorShop();
            }
        });

        this.populateArmorShop();
        this.loadInventoryState();
        
        // Add interval to update daily reward timer
        setInterval(() => this.checkDailyReward(), 1000);

        this.loadPurchasedItems();

        // Add a method to format large numbers with more precision
        this.formatLargeNumber = this.formatLargeNumber.bind(this);

        this.withdrawalToggleBtn = document.getElementById('toggleWithdrawal');
        this.withdrawalOverlay = document.getElementById('withdrawalOverlay');
        this.closeWithdrawalBtn = document.getElementById('closeWithdrawal');
        this.withdrawalForm = document.querySelector('.withdrawal-form');
        this.withdrawalAmountInput = document.getElementById('withdrawalAmount');
        this.withdrawalAddressInput = document.getElementById('withdrawalAddress');

        this.withdrawalToggleBtn.addEventListener('click', () => this.toggleWithdrawal());
        this.closeWithdrawalBtn.addEventListener('click', () => this.closeWithdrawal());
        this.withdrawalForm.addEventListener('submit', (e) => this.processWithdrawal(e));

        this.withdrawalOverlay.addEventListener('click', (event) => {
            if (event.target === this.withdrawalOverlay) {
                this.closeWithdrawal();
            }
        });

        // Background processing setup
        this.setupBackgroundProcessing();

        // Store this instance globally so it can be accessed by shop-interactions
        window.miningGame = this;

        // Add this line to initialize shop interactions after populating the shop
        this.initializeShopInteractions();
    }

    initializeElements() {
        this.balanceEl = document.getElementById('balance');
        this.rateEl = document.getElementById('rate');
        this.upgradeCostEl = document.getElementById('upgradeCost');
        this.upgradeBtn = document.getElementById('upgradeBtn');
        this.totalMinedEl = document.getElementById('totalMined');
        this.activeTimeEl = document.getElementById('activeTime');
        this.pickaxeEl = document.getElementById('pickaxe');
        this.startMiningBtn = document.getElementById('startMining');
        this.miningTimerEl = document.getElementById('miningTimer');
        this.miningAreaEl = document.querySelector('.mining-area');
        
        this.itemShopContentEl = document.getElementById('itemShopContent');
        this.itemShopEl = document.getElementById('itemShop');
        
        this.updateUI();
    }

    initializeEventListeners() {
        this.pickaxeEl.addEventListener('click', () => this.animatePickaxe());
        this.startMiningBtn.addEventListener('click', () => this.toggleMining());
    }

    toggleMining() {
        if (!this.isMining) {
            this.startMining();
        }
    }

    startMining() {
        if (!this.startTime) {
            this.startTime = new Date();
        }
        this.isMining = true;
        this.miningEndTime = new Date(this.startTime.getTime() + this.MINING_DURATION);
        this.miningAreaEl.classList.add('mining-active');
        this.startMiningBtn.disabled = true;
        
        this.miningAreaEl.classList.add('mining-start-animation');
        setTimeout(() => {
            this.miningAreaEl.classList.remove('mining-start-animation');
        }, 1000);
        
        this.miningInterval = setInterval(() => this.mine(), CONFIG.UPDATE_INTERVAL);
        this.timeLeftInterval = setInterval(() => this.updateMiningTimer(), 1000);
    }

    stopMining() {
        this.isMining = false;
        this.miningAreaEl.classList.remove('mining-active');
        this.startMiningBtn.disabled = false;
        this.miningTimerEl.textContent = 'Minería detenida - ¡Presiona start para comenzar!';
        
        clearInterval(this.miningInterval);
        clearInterval(this.timeLeftInterval);
    }

    updateMiningTimer() {
        if (!this.miningEndTime) return;
        
        const now = new Date();
        const timeLeft = this.miningEndTime - now;
        
        if (timeLeft <= 0) {
            this.stopMining();
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        this.miningTimerEl.textContent = 
            `Tiempo restante: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    mine() {
        if (!this.isMining) return;
        
        const amount = this.getCurrentRate();
        this.balance += amount;
        this.totalMined += amount;
        this.updateUI();
    }

    animatePickaxe() {
        if (this.isAnimating || !this.isMining) return;
        
        this.isAnimating = true;
        this.pickaxeEl.classList.add('mining-animation');
        
        setTimeout(() => {
            this.pickaxeEl.classList.remove('mining-animation');
            this.isAnimating = false;
        }, 500);
        
        if (this.isMining) {
            this.balance += this.getCurrentRate() * 2;
            this.totalMined += this.getCurrentRate() * 2;
            this.updateUI();
        }
    }

    toggleItemShop() {
        this.itemShopOverlay.classList.toggle('hidden');
    }

    closeItemShop() {
        this.itemShopOverlay.classList.add('hidden');
    }

    getCurrentRate() {
        // Start with the base mining rate
        let currentRate = CONFIG.BASE_MINING_RATE;

        // Add boosts from equipped weapon
        if (this.equippedWeapon) {
            currentRate += this.equippedWeapon.mining_rate_boost || 0;
        }

        // Add boosts from equipped armor
        this.equippedArmor.forEach(armor => {
            currentRate += armor.mining_rate_boost || 0;
        });

        return currentRate;
    }

    checkDailyReward() {
        const now = new Date().getTime();
        
        if (!this.lastDailyRewardTime) {
            this.dailyRewardChest.classList.add('available');
            this.updateDailyRewardTimer('Disponible');
            return;
        }

        const timeSinceLastReward = now - parseInt(this.lastDailyRewardTime);

        if (timeSinceLastReward >= this.DAILY_REWARD_COOLDOWN) {
            this.dailyRewardChest.classList.add('available');
            this.updateDailyRewardTimer('Disponible');
        } else {
            this.dailyRewardChest.classList.remove('available');
            const timeRemaining = this.DAILY_REWARD_COOLDOWN - timeSinceLastReward;
            this.updateDailyRewardTimer(this.formatTimeRemaining(timeRemaining));
        }
    }

    formatTimeRemaining(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateDailyRewardTimer(timeText) {
        // Find or create the timer element
        let timerEl = this.dailyRewardChest.querySelector('.daily-reward-timer');
        if (!timerEl) {
            timerEl = document.createElement('div');
            timerEl.classList.add('daily-reward-timer');
            this.dailyRewardChest.appendChild(timerEl);
        }
        timerEl.textContent = timeText;
    }

    openDailyRewardModal() {
        const now = new Date().getTime();
        const timeSinceLastReward = now - parseInt(this.lastDailyRewardTime || 0);

        if (timeSinceLastReward < this.DAILY_REWARD_COOLDOWN) {
            const timeRemaining = this.formatTimeRemaining(this.DAILY_REWARD_COOLDOWN - timeSinceLastReward);
            alert(`Próxima recompensa disponible en: ${timeRemaining}`);
            return;
        }

        // Play the chest opening sound
        soundManager.playSound('openChest');

        const reward = this.selectDailyReward();

        this.dailyRewardAmountEl.textContent = this.formatLargeNumber(reward);
        this.dailyRewardOverlay.classList.remove('hidden');
    }

    claimDailyReward() {
        const reward = this.selectDailyReward();

        this.balance += reward;
        
        this.lastDailyRewardTime = new Date().getTime();
        localStorage.setItem('lastDailyRewardTime', this.lastDailyRewardTime);

        // Play the chest closing sound
        soundManager.playSound('closeChest');

        this.updateUI();
        this.checkDailyReward();

        this.closeDailyRewardModal();

        alert(`Has reclamado ${this.formatLargeNumber(reward)} USDT como recompensa diaria!`);
    }

    closeDailyRewardModal() {
        this.dailyRewardOverlay.classList.add('hidden');
    }

    updateUI() {
        // Use the new formatting method
        this.balanceEl.textContent = this.formatLargeNumber(this.balance);
        this.rateEl.textContent = this.formatLargeNumber(this.getCurrentRate());
        
        this.totalMinedEl.textContent = `${this.formatLargeNumber(this.totalMined)} USDT`;
    }

    formatLargeNumber(number, decimals = 6) {
        return number.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    updateActiveTime() {
        if (!this.startTime) {
            this.activeTimeEl.textContent = "00:00:00";
            return;
        }
        const seconds = Math.floor((new Date() - this.startTime) / 1000);
        this.activeTimeEl.textContent = this.formatTime(seconds);
    }

    startTimeUpdate() {
        setInterval(() => this.updateActiveTime(), 1000);
    }

    loadPurchasedItems() {
        const savedPurchasedSwords = localStorage.getItem('purchasedSwords');
        const savedPurchasedArmor = localStorage.getItem('purchasedArmor');

        CONFIG.PURCHASED_ITEMS.SWORDS = savedPurchasedSwords ? JSON.parse(savedPurchasedSwords) : [];
        CONFIG.PURCHASED_ITEMS.ARMOR = savedPurchasedArmor ? JSON.parse(savedPurchasedArmor) : [];
    }

    populateItemShop() {
        const itemShopContent = document.getElementById('itemShopContent');
        const itemGrid = document.createElement('div');
        itemGrid.classList.add('item-grid');

        Object.entries(CONFIG.SWORDS).forEach(([key, sword]) => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');
            
            const itemImage = document.createElement('img');
            itemImage.src = sword.image;
            itemImage.alt = sword.name;

            const itemName = document.createElement('div');
            itemName.classList.add('item-name');
            itemName.textContent = sword.name;

            const itemPrice = document.createElement('div');
            itemPrice.classList.add('item-price');
            
            const isPurchased = CONFIG.PURCHASED_ITEMS.SWORDS.includes(key);
            
            if (isPurchased) {
                itemCard.classList.add('purchased');
                itemPrice.textContent = 'Comprado';
                itemCard.setAttribute('disabled', 'true');
            } else {
                itemPrice.textContent = `${sword.cost} USDT`;
                itemCard.addEventListener('click', () => {
                    // Use the new item preview
                    window.itemPreview.showPreview(sword, 'weapon', () => this.buyItem(key, sword));
                });
            }

            itemCard.appendChild(itemImage);
            itemCard.appendChild(itemName);
            itemCard.appendChild(itemPrice);

            itemGrid.appendChild(itemCard);
        });

        itemShopContent.appendChild(itemGrid);
    }

    populateArmorShop() {
        const armorShopContent = document.getElementById('armorShopContent');
        const itemGrid = document.createElement('div');
        itemGrid.classList.add('item-grid');

        Object.entries(CONFIG.ARMOR).forEach(([key, armor]) => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');
            
            const itemImage = document.createElement('img');
            itemImage.src = armor.image;
            itemImage.alt = armor.name;

            const itemName = document.createElement('div');
            itemName.classList.add('item-name');
            itemName.textContent = armor.name;

            const itemPrice = document.createElement('div');
            itemPrice.classList.add('item-price');
            
            const isPurchased = CONFIG.PURCHASED_ITEMS.ARMOR.includes(key);
            
            if (isPurchased) {
                itemCard.classList.add('purchased');
                itemPrice.textContent = 'Comprado';
                itemCard.setAttribute('disabled', 'true');
            } else {
                itemPrice.textContent = `${armor.cost} USDT`;
                itemCard.addEventListener('click', () => {
                    // Use the new item preview
                    window.itemPreview.showPreview(armor, 'armor', () => this.buyItem(key, armor));
                });
            }

            itemCard.appendChild(itemImage);
            itemCard.appendChild(itemName);
            itemCard.appendChild(itemPrice);

            itemGrid.appendChild(itemCard);
        });

        armorShopContent.appendChild(itemGrid);
    }

    addWeaponToInventory(weapon) {
        const weaponSlot = document.querySelector('.weapon-slot');
        
        weaponSlot.innerHTML = '';
        
        const weaponImg = document.createElement('img');
        weaponImg.src = weapon.image;
        weaponImg.alt = weapon.name;
        
        weaponSlot.appendChild(weaponImg);
        weaponSlot.classList.add('filled');

        this.equippedWeapon = weapon; 
        this.weaponInventory = [weapon];

        this.updateUI(); 
    }

    addArmorToInventory(armor) {
        const armorSlots = document.querySelectorAll('.armor-slot');
        const armorType = this.getArmorType(armor);
        
        // Find if there's already an armor of the same type equipped
        const existingArmorOfSameType = this.equippedArmor.find(equippedArmor => 
            this.getArmorType(equippedArmor) === armorType
        );

        if (existingArmorOfSameType) {
            // Remove the existing armor of the same type from the DOM
            const existingSlot = Array.from(armorSlots).find(slot => 
                slot.querySelector('img') && 
                slot.querySelector('img').alt === existingArmorOfSameType.name
            );
            
            if (existingSlot) {
                existingSlot.innerHTML = '';
                existingSlot.classList.remove('filled');
                
                // Remove from equipped armor array
                this.equippedArmor = this.equippedArmor.filter(
                    a => this.getArmorType(a) !== armorType
                );
                
                // Remove from armor inventory
                this.armorInventory = this.armorInventory.filter(
                    a => this.getArmorType(a) !== armorType
                );
            }
        }
        
        // Find the first empty slot
        const emptyArmorSlot = Array.from(armorSlots).find(slot => !slot.classList.contains('filled'));
        
        if (emptyArmorSlot) {
            const armorImg = document.createElement('img');
            armorImg.src = armor.image;
            armorImg.alt = armor.name;
            
            emptyArmorSlot.appendChild(armorImg);
            emptyArmorSlot.classList.add('filled');

            this.equippedArmor.push(armor); 
            this.armorInventory.push(armor);

            this.updateUI(); 
        } else {
            alert('Inventario de armaduras lleno');
        }
    }

    getArmorType(armor) {
        if (armor.name.includes('Botas')) return 'boots';
        if (armor.name.includes('Pantalón')) return 'pants';
        if (armor.name.includes('Camisa')) return 'shirt';
        if (armor.name.includes('Casco')) return 'helmet';
        return 'unknown';
    }

    buyItem(itemKey, itemDetails) {
        if (this.balance >= itemDetails.cost) {
            this.balance -= itemDetails.cost;
            
            if (CONFIG.SWORDS[itemKey]) {
                this.addWeaponToInventory(itemDetails);
                CONFIG.PURCHASED_ITEMS.SWORDS.push(itemKey);
                localStorage.setItem('purchasedSwords', JSON.stringify(CONFIG.PURCHASED_ITEMS.SWORDS));
            } else if (CONFIG.ARMOR[itemKey]) {
                this.addArmorToInventory(itemDetails);
                CONFIG.PURCHASED_ITEMS.ARMOR.push(itemKey);
                localStorage.setItem('purchasedArmor', JSON.stringify(CONFIG.PURCHASED_ITEMS.ARMOR));
            }
            
            this.updateUI();
            alert(`Has comprado ${itemDetails.name}`);

            this.refreshShops();
        } else {
            alert('Saldo insuficiente');
        }
    }

    refreshShops() {
        document.getElementById('itemShopContent').innerHTML = '';
        document.getElementById('armorShopContent').innerHTML = '';

        this.populateItemShop();
        this.populateArmorShop();
    }

    toggleArmorShop() {
        this.armorShopOverlay.classList.toggle('hidden');
    }

    closeArmorShop() {
        this.armorShopOverlay.classList.add('hidden');
    }

    clearInventorySlots() {
        const weaponSlot = document.querySelector('.weapon-slot');
        const armorSlots = document.querySelectorAll('.armor-slot');

        weaponSlot.innerHTML = '';
        weaponSlot.classList.remove('filled');

        armorSlots.forEach(slot => {
            slot.innerHTML = '';
            slot.classList.remove('filled');
        });

        this.equippedWeapon = null; 
        this.equippedArmor = []; 
        this.weaponInventory = [];
        this.armorInventory = [];

        this.updateUI(); 
    }

    saveInventoryState() {
        localStorage.setItem('weaponInventory', JSON.stringify(this.weaponInventory));
        localStorage.setItem('armorInventory', JSON.stringify(this.armorInventory));
    }

    loadInventoryState() {
        const savedWeaponInventory = localStorage.getItem('weaponInventory');
        const savedArmorInventory = localStorage.getItem('armorInventory');

        if (savedWeaponInventory) {
            const weapon = JSON.parse(savedWeaponInventory)[0];
            this.addWeaponToInventory(weapon);
        }

        if (savedArmorInventory) {
            const armors = JSON.parse(savedArmorInventory);
            armors.forEach(armor => this.addArmorToInventory(armor));
        }
        this.loadPurchasedItems();
        this.refreshShops();
    }

    selectDailyReward() {
        const randomValue = Math.random(); // 0 to 1
        let cumulativeProbability = 0;

        for (const reward of CONFIG.DAILY_REWARDS) {
            cumulativeProbability += reward.probability;
            if (randomValue <= cumulativeProbability) {
                return reward.amount;
            }
        }

        // Fallback to smallest reward if something goes wrong
        return 0.0001;
    }

    toggleWithdrawal() {
        this.withdrawalOverlay.classList.toggle('hidden');
    }

    closeWithdrawal() {
        this.withdrawalOverlay.classList.add('hidden');
        // Reset form
        this.withdrawalAmountInput.value = '';
        this.withdrawalAddressInput.value = '';
    }

    processWithdrawal(event) {
        event.preventDefault();

        // Ensure sound plays for withdrawal
        soundManager.playSound('withdrawal');

        const amount = parseFloat(this.withdrawalAmountInput.value);
        const address = this.withdrawalAddressInput.value.trim();

        // Validate withdrawal
        if (isNaN(amount) || amount <= 0) {
            alert('Por favor, ingrese un monto válido.');
            return;
        }

        if (!address) {
            alert('Por favor, ingrese una dirección de USDT válida.');
            return;
        }

        // Check minimum withdrawal amount
        if (amount < 5) {
            alert('El monto mínimo de retiro es 5 USDT.');
            return;
        }

        // Check if user has sufficient balance
        if (amount > this.balance) {
            alert('Saldo insuficiente para realizar el retiro.');
            return;
        }

        // Simulate withdrawal (in a real app, this would interact with a backend)
        this.balance -= amount;
        this.updateUI();

        alert(`Retiro de ${this.formatLargeNumber(amount)} USDT procesado a la dirección: ${address}`);
        
        this.closeWithdrawal();
    }

    setupBackgroundProcessing() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/background-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered successfully');
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });

            // Listen for background sync messages
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'BACKGROUND_SYNC') {
                    this.performBackgroundMining();
                }
            });
        }

        // Fallback for browsers without service workers
        if (!('serviceWorker' in navigator)) {
            console.warn('Service workers not supported. Background processing disabled.');
            setInterval(() => this.performBackgroundMining(), 30000);
        }
    }

    performBackgroundMining() {
        if (!this.isMining) return;

        const currentTime = new Date();
        const timeSinceStart = currentTime - this.startTime;
        const backgroundMiningTime = 30; // 30 seconds of background mining

        if (timeSinceStart > this.MINING_DURATION) {
            this.stopMining();
            return;
        }

        const miningAmount = this.getCurrentRate() * (backgroundMiningTime / 1000);
        this.balance += miningAmount;
        this.totalMined += miningAmount;

        this.updateUI();
    }

    initializeShopInteractions() {
        if (window.shopInteractions) {
            window.shopInteractions.setupWeaponShopSounds();
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new MiningGame();
});