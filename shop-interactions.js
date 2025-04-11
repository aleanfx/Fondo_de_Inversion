class ShopInteractions {
    constructor(game) {
        this.game = game;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.shopInteractions = new ShopInteractions(window.miningGame);
});

