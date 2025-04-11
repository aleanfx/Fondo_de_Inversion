class SoundInteractions {
    constructor() {
        this.setupShopSounds();
    }

    setupShopSounds() {
        // Weapon Shop Sounds
        this.addSoundToShopItems('itemShopContent');
        
        // Armor Shop Sounds
        this.addSoundToShopItems('armorShopContent');

        // Item Preview Modal Sounds
        this.setupItemPreviewModalSounds();
    }

    addSoundToShopItems(containerId) {
        const shopContent = document.getElementById(containerId);
        const itemCards = shopContent.querySelectorAll('.item-card:not(.purchased)');

        itemCards.forEach(card => {
            card.addEventListener('click', (event) => {
                if (!event.soundPlayed) {
                    soundManager.playSound('minecraftButton');
                    event.soundPlayed = true;
                }
            });
        });
    }

    setupItemPreviewModalSounds() {
        const buyButton = document.querySelector('.minecraft-item-preview-buy');
        const cancelButton = document.querySelector('.minecraft-item-preview-cancel');

        if (buyButton) {
            buyButton.addEventListener('click', () => {
                soundManager.playSound('minecraftButton');
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                soundManager.playSound('minecraftButton');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.soundInteractions = new SoundInteractions();
});

