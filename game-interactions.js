class GameInteractions {
    constructor() {
        this.setupHoverAnimations();
        this.setupRandomEncouragements();
        this.setupParticleEffects();
        this.setupBalanceInteractions();
    }

    setupHoverAnimations() {
        const animatableElements = document.querySelectorAll('.item-card, .inventory-slot, .daily-reward-chest, .stat-box');
        
        animatableElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'scale(1.05) rotate(2deg)';
                el.style.transition = 'transform 0.2s ease';
                // Add a subtle glow effect
                el.style.boxShadow = '0 0 10px rgba(46, 204, 113, 0.5)';
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'scale(1) rotate(0deg)';
                el.style.boxShadow = 'none';
            });
        });
    }

    setupRandomEncouragements() {
        const encouragements = [
            "¡Vas por buen camino!",
            "¡Sigue minando, campeón!",
            "¡Cada clic te acerca más a tu meta!",
            "¡Tú puedes hacerlo!",
            "¡La fortuna sonríe hoy!",
            "¡Eres un máquina de minería!",
            "¡USDT llegando pronto!"
        ];

        const startMiningBtn = document.getElementById('startMining');
        const balanceEl = document.getElementById('balance');

        startMiningBtn.addEventListener('click', () => {
            this.showRandomEncouragement();
        });

        balanceEl.addEventListener('click', () => {
            this.showRandomEncouragement();
        });
    }

    showRandomEncouragement() {
        const encouragements = [
            "¡Vas por buen camino!",
            "¡Sigue minando, campeón!",
            "¡Cada clic te acerca más a tu meta!",
            "¡Tú puedes hacerlo!",
            "¡La fortuna sonríe hoy!",
            "¡Eres un máquina de minería!",
            "¡USDT llegando pronto!"
        ];

        const encouragementEl = document.createElement('div');
        encouragementEl.classList.add('encouragement-popup');
        encouragementEl.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
        
        document.body.appendChild(encouragementEl);

        encouragementEl.style.position = 'fixed';
        encouragementEl.style.top = '50%';
        encouragementEl.style.left = '50%';
        encouragementEl.style.transform = 'translate(-50%, -50%)';
        encouragementEl.style.backgroundColor = 'rgba(46, 204, 113, 0.9)';
        encouragementEl.style.color = 'white';
        encouragementEl.style.padding = '15px';
        encouragementEl.style.borderRadius = '10px';
        encouragementEl.style.zIndex = '9999';
        encouragementEl.style.animation = 'encouragement-popup 1s ease-out';

        setTimeout(() => {
            encouragementEl.style.animation = 'encouragement-fadeout 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(encouragementEl);
            }, 500);
        }, 2000);
    }

    setupParticleEffects() {
        const particleContainers = [
            document.getElementById('startMining'),
            document.getElementById('dailyRewardChest')
        ];

        particleContainers.forEach(container => {
            container.addEventListener('click', (e) => {
                this.createMinecraftParticleExplosion(e);
            });
        });
    }

    setupBalanceInteractions() {
        const balanceEl = document.getElementById('balance');
        
        // Completely remove all click interactions with balance
        balanceEl.style.pointerEvents = 'none';
    }

    createMinecraftParticleExplosion(e) {
        const minecraftColors = [
            '#8B4513',   // Brown (dirt/wood)
            '#A0522D',   // Sienna (stone)
            '#228B22',   // Forest Green (grass)
            '#FFD700',   // Gold
            '#FFFFFF',   // White (diamond)
            '#1E90FF'    // Dodger Blue (water/diamond)
        ];

        const particleCount = 30;
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('minecraft-particle');
            particle.style.backgroundColor = minecraftColors[Math.floor(Math.random() * minecraftColors.length)];
            
            particle.style.position = 'absolute';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '1px';  // More blocky, Minecraft-like
            
            container.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 15 + 5;
            const gravity = 0.2;
            let velocityX = Math.cos(angle) * speed;
            let velocityY = Math.sin(angle) * speed;

            const animateParticle = () => {
                try {
                    velocityY += gravity;
                    
                    const currentX = parseFloat(particle.style.left) || x;
                    const currentY = parseFloat(particle.style.top) || y;

                    particle.style.left = `${currentX + velocityX}px`;
                    particle.style.top = `${currentY + velocityY}px`;
                    particle.style.opacity = (1 - (velocityY / 50)).toString();

                    if (currentY < window.innerHeight && container.contains(particle)) {
                        requestAnimationFrame(animateParticle);
                    } else {
                        // Safely remove the particle
                        if (container.contains(particle)) {
                            container.removeChild(particle);
                        }
                    }
                } catch (error) {
                    console.error('Particle animation error:', error);
                    // Attempt to remove particle if possible
                    if (container.contains(particle)) {
                        container.removeChild(particle);
                    }
                }
            };

            animateParticle();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameInteractions();
});