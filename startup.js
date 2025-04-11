document.addEventListener('DOMContentLoaded', () => {
    const startupScreen = document.getElementById('startup-screen');
    const startupLogoSubtitle = document.querySelector('.startup-logo-subtitle');
    const startupContent = document.querySelector('.startup-content');
    const features = document.querySelectorAll('.feature');
    const startGameBtn = document.getElementById('start-game-btn');
    const mainGameContainer = document.getElementById('main-game-container');

    // Prevent multiple sound instances
    let buttonSoundPlayed = false;

    // Create an audio element for the Minecraft button sound
    const minecraftButtonSound = new Audio('/Botón de Minecraft 0.mp3');
    minecraftButtonSound.volume = 0.5; // Adjust volume as needed

    // Initially hide the content
    startupContent.style.display = 'none';

    // Add typing effect to description with 3D parallax
    const descriptionElements = document.querySelectorAll('.startup-description p');
    descriptionElements.forEach((el, index) => {
        const text = el.textContent;
        el.textContent = '';
        let charIndex = 0;
        
        function typeText() {
            if (charIndex < text.length) {
                el.textContent += text.charAt(charIndex);
                charIndex++;
                el.style.transform = `translateZ(${10 * (charIndex / text.length)}px)`;
                setTimeout(typeText, 50);
            } else {
                el.style.transform = 'translateZ(0)';
            }
        }
        
        typeText();
    });

    // Delayed subtitle appearance - slightly larger and more pronounced
    setTimeout(() => {
        startupLogoSubtitle.style.opacity = '1';
        startupLogoSubtitle.style.transform = 'translateZ(0)';
        startupLogoSubtitle.style.fontSize = '0.8em';  // Slightly larger
    }, 1000);

    // Delayed content appearance
    setTimeout(() => {
        startupContent.style.display = 'block';
        startupContent.style.animation = 'slide-in 1.5s forwards ease-out';
    }, 2000);

    // Enhanced 3D hover effects for features
    features.forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            feature.style.transform = 'scale(1.05) translateZ(20px) rotateX(-5deg)';
        });
        
        feature.addEventListener('mouseleave', () => {
            feature.style.transform = 'scale(1) translateZ(0) rotateX(0)';
        });
    });

    // 3D transition effect for start game with sound
    startGameBtn.addEventListener('click', (event) => {
        // Use the SoundManager to play the sound
        soundManager.playSound('minecraftButton');

        startupScreen.style.transition = 'all 0.7s cubic-bezier(0.445, 0.05, 0.55, 0.95)';
        startupScreen.style.transform = `
            perspective(2000px) 
            rotateY(90deg) 
            rotateX(30deg) 
            scale(0.7) 
            translateZ(-500px)
        `;
        startupScreen.style.opacity = '0';
        
        setTimeout(() => {
            startupScreen.classList.add('hidden');
            mainGameContainer.classList.remove('hidden');
        }, 700);
    });
});