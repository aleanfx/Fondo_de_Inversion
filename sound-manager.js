class SoundManager {
    constructor() {
        this.soundEnabled = true;
        this.volumeLevel = 0.5;
        this.audioContexts = {}; 
        this.backgroundMusic = null;
        this.soundSources = {
            backgroundMusic: '/Minecraft música fondo 2.mp3',
            minecraftButton: '/Botón de Minecraft 0.mp3',
            click: [
                'https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.wav',
                'https://assets.mixkit.co/sfx/preview/mixkit-game-level-up-2885.wav',
                'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.wav'
            ],
            copy: ['/Botón de Minecraft 0.mp3'],
            mine: [
                'https://assets.mixkit.co/sfx/preview/mixkit-stone-fall-into-water-1342.wav',
                'https://assets.mixkit.co/sfx/preview/mixkit-stone-hit-metal-2870.wav'
            ],
            withdrawal: ['/1Minecraft XP 2.mp3'],
            openChest: '/Abrir cofre Minecraft (1).mp3',
            closeChest: '/Cerrar cofre Minecraft.mp3'
        };
        
        this.playingAudios = new Set(); // Track currently playing audio elements
        
        this.preloadSounds('openChest', this.soundSources.openChest);
        this.preloadSounds('closeChest', this.soundSources.closeChest);
        this.initializeSounds();
        this.setupSoundControls();
        this.setupBackgroundMusic();
    }

    initializeSounds() {
        Object.entries(this.soundSources).forEach(([key, sources]) => {
            if (key !== 'backgroundMusic' && key !== 'openChest' && key !== 'closeChest') {
                this.preloadSounds(key, sources);
            }
        });
    }

    async preloadSounds(key, sources) {
        const sourceArray = Array.isArray(sources) ? sources : [sources];
        this.audioContexts[key] = [];

        for (const src of sourceArray) {
            try {
                const audio = new Audio(src);
                audio.preload = 'auto';
                this.audioContexts[key].push(audio);
            } catch (error) {
                console.warn(`Failed to preload sound: ${src}`, error);
            }
        }
    }

    playSound(soundKey) {
        if (!this.soundEnabled) return;

        try {
            const soundBuffers = this.audioContexts[soundKey];
            if (!soundBuffers || soundBuffers.length === 0) {
                console.warn(`No sounds found for key: ${soundKey}`);
                return;
            }

            const audioToPLay = soundBuffers[Math.floor(Math.random() * soundBuffers.length)];
            
            // Prevent multiple concurrent plays of the same sound
            if (this.playingAudios.has(audioToPLay)) {
                return;
            }

            audioToPLay.volume = this.volumeLevel;
            
            // Track the audio while it's playing
            this.playingAudios.add(audioToPLay);
            
            audioToPLay.play().catch(error => {
                console.warn('Error playing sound:', error);
            });

            audioToPLay.addEventListener('ended', () => {
                this.playingAudios.delete(audioToPLay);
            });

        } catch (error) {
            console.error(`Unexpected error playing sound ${soundKey}:`, error);
        }
    }

    setupSoundControls() {
        this.soundToggleButton = document.createElement('button');
        this.soundToggleButton.textContent = '🔊';
        this.soundToggleButton.style.position = 'fixed';
        this.soundToggleButton.style.bottom = '10px';
        this.soundToggleButton.style.right = '10px';
        this.soundToggleButton.style.zIndex = '9999';
        this.soundToggleButton.style.backgroundColor = 'rgba(0,0,0,0.5)';
        this.soundToggleButton.style.color = 'white';
        this.soundToggleButton.style.border = 'none';
        this.soundToggleButton.style.padding = '10px';
        this.soundToggleButton.style.borderRadius = '50%';
        this.soundToggleButton.addEventListener('click', () => this.toggleSound());
        this.soundToggleButton.addEventListener('dblclick', () => {
            this.toggleBackgroundMusic();
        });
        document.body.appendChild(this.soundToggleButton);
    }

    setupBackgroundMusic() {
        this.backgroundMusic = new Audio(this.soundSources.backgroundMusic);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3; // Lower volume for background music

        // Start background music when game starts
        const startGameBtn = document.getElementById('start-game-btn');
        startGameBtn.addEventListener('click', () => this.startBackgroundMusic());
    }

    startBackgroundMusic() {
        if (this.soundEnabled && this.backgroundMusic) {
            this.backgroundMusic.play().catch(error => {
                console.warn('Error playing background music:', error);
            });
        }
    }

    pauseBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }

    toggleBackgroundMusic() {
        if (this.backgroundMusic) {
            if (this.backgroundMusic.paused) {
                this.startBackgroundMusic();
            } else {
                this.pauseBackgroundMusic();
            }
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggleButton.textContent = this.soundEnabled ? '🔊' : '🔇';
        
        // Update background music state
        if (this.soundEnabled) {
            this.startBackgroundMusic();
        } else {
            this.pauseBackgroundMusic();
        }
    }
}

const soundManager = new SoundManager();

document.addEventListener('DOMContentLoaded', () => {
    const soundTargets = [
        { id: 'startMining', soundKey: 'minecraftButton' },
        { id: 'toggleItemShop', soundKey: 'minecraftButton' },
        { id: 'toggleArmorShop', soundKey: 'minecraftButton' },
        { id: 'start-game-btn', soundKey: 'minecraftButton' },
        { id: 'copyAffiliateLink', soundKey: 'copy' },
        { id: 'toggleWithdrawal', soundKey: 'minecraftButton' },
        { id: 'confirmWithdrawal', soundKey: 'withdrawal' },
        { id: 'dailyRewardChest', soundKey: 'openChest' }
    ];

    soundTargets.forEach(target => {
        const element = document.getElementById(target.id);
        if (element) {
            element.addEventListener('click', (event) => {
                if (!event.soundPlayed) {
                    soundManager.playSound(target.soundKey);
                    event.soundPlayed = true;
                }
            });
        }
    });

    const clickableElements = document.querySelectorAll('button, .item-card, .inventory-slot, .daily-reward-chest');
    clickableElements.forEach(el => {
        el.addEventListener('click', (event) => {
            if (!event.soundPlayed) {
                soundManager.playSound('click');
                event.soundPlayed = true;
            }
        });
    });
});