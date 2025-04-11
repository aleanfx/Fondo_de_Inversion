const CONFIG = {
    MAX_LEVEL: 10,
    UPDATE_INTERVAL: 1000, // 1 second
    BASE_MINING_RATE: 0.000001, // Fixed base mining rate of 0.000001 USDT/s
    SWORDS: {
        wooden_sword: {
            name: "Espada de Madera",
            cost: 10,
            multiplier: 1.2,
            mining_rate_boost: 0.00000462962963, // 0.00000462962963 USDT/s
            image: "/IMG_3619.webp"
        },
        stone_sword: {
            name: "Espada de Piedra", 
            cost: 50,
            multiplier: 1.5,
            mining_rate_boost: 0.0000231481481, // 0.0000231481481 USDT/s
            image: "/IMG_3624.png"  
        },
        iron_sword: {
            name: "Espada de Hierro",
            cost: 100,
            multiplier: 2,
            mining_rate_boost: 0.0000413359788, // 0.0000413359788 USDT/s
            image: "/IMG_3620.png"  
        },
        gold_sword: {
            name: "Espada de Oro",
            cost: 250,
            multiplier: 1.8,
            mining_rate_boost: 0.0000964506173, // 0.0000964506173 USDT/s
            image: "/IMG_3621.webp"
        },
        diamond_sword: {
            name: "Espada de Diamante",
            cost: 500,
            multiplier: 3,
            mining_rate_boost: 0.000192901235, // 0.000192901235 USDT/s
            image: "/IMG_3622.png"
        }
    },
    ARMOR: {
        leather_boots: {
            name: "Botas de Cuero",
            cost: 15,
            defense: 0.8,
            mining_rate_boost: 0.00000694444444, // 0.00000694444444 USDT/s
            image: "/IMG_3783.png"
        },
        leather_pants: {
            name: "Pantalón de Cuero",
            cost: 20,
            defense: 1,
            mining_rate_boost: 0.00000926, // 0.00000926 USDT/s
            image: "/IMG_3784.png"
        },
        leather_shirt: {
            name: "Camisa de Cuero",
            cost: 30,
            defense: 0.9,
            mining_rate_boost: 0.00001389, // 0.00001389 USDT/s
            image: "/IMG_3785.png"
        },
        leather_helmet: {
            name: "Casco de Cuero",
            cost: 15,
            defense: 0.7,
            mining_rate_boost: 0.00000694444444, // 0.00000694444444 USDT/s
            image: "/IMG_3786.png"
        },
        chainmail_boots: {
            name: "Botas de Malla",
            cost: 30,
            defense: 1.2,
            mining_rate_boost: 0.0000138889, // 0.0000138889 USDT/s
            image: "/IMG_3844.png"  
        },
        chainmail_pants: {
            name: "Pantalón de Malla",
            cost: 40,
            defense: 1.5,
            mining_rate_boost: 0.00001852, // 0.00001852 USDT/s
            image: "/IMG_3843.png"  
        },
        chainmail_shirt: {
            name: "Camisa de Malla",
            cost: 60,
            defense: 1.3,
            mining_rate_boost: 0.00002778, // 0.00002778 USDT/s
            image: "/IMG_3842.png"  
        },
        chainmail_helmet: {
            name: "Casco de Malla",
            cost: 30,
            defense: 1.1,
            mining_rate_boost: 0.0000138889, // 0.0000138889 USDT/s
            image: "/IMG_3841.png"  
        },
        iron_boots: {
            name: "Botas de Hierro",
            cost: 60,
            defense: 1.6,
            mining_rate_boost: 0.00002315, // 0.00002315 USDT/s
            image: "/IMG_3845.png"  
        },
        iron_pants: {
            name: "Pantalón de Hierro",
            cost: 80,
            defense: 2,
            mining_rate_boost: 0.00003086, // 0.00003086 USDT/s
            image: "/IMG_3846.png"
        },
        iron_shirt: {
            name: "Camisa de Hierro",
            cost: 120,
            defense: 1.8,
            mining_rate_boost: 0.0000463, // 0.0000463 USDT/s
            image: "/IMG_3847.png"  
        },
        iron_helmet: {
            name: "Casco de Hierro",
            cost: 60,
            defense: 1.5,
            mining_rate_boost: 0.00002315, // 0.00002315 USDT/s
            image: "/IMG_3848.png"  
        },
        gold_boots: {
            name: "Botas de Oro",
            cost: 120,
            defense: 1.4,
            mining_rate_boost: 0.0000463, // 0.0000463 USDT/s
            image: "/IMG_3826.png"
        },
        gold_pants: {
            name: "Pantalón de Oro",
            cost: 160,
            defense: 1.7,
            mining_rate_boost: 0.00006172, // 0.00006172 USDT/s
            image: "/IMG_3825.png"
        },
        gold_shirt: {
            name: "Camisa de Oro",
            cost: 240,
            defense: 1.6,
            mining_rate_boost: 0.0000926, // 0.0000926 USDT/s
            image: "/IMG_3824.png"
        },
        gold_helmet: {
            name: "Casco de Oro",
            cost: 120,
            defense: 1.3,
            mining_rate_boost: 0.0000463, // 0.0000463 USDT/s
            image: "/IMG_3823.png"
        },
        diamond_boots: {
            name: "Botas de Diamante",
            cost: 240,
            defense: 2.2,
            mining_rate_boost: 0.0000926, // 0.0000926 USDT/s
            image: "/IMG_3830.png"
        },
        diamond_pants: {
            name: "Pantalón de Diamante",
            cost: 320,
            defense: 2.5,
            mining_rate_boost: 0.00012344, // 0.00012344 USDT/s
            image: "/IMG_3829.png"
        },
        diamond_shirt: {
            name: "Camisa de Diamante",
            cost: 480,
            defense: 2.3,
            mining_rate_boost: 0.0001852, // 0.0001852 USDT/s
            image: "/IMG_3828.png"
        },
        diamond_helmet: {
            name: "Casco de Diamante",
            cost: 240,
            defense: 2,
            mining_rate_boost: 0.0000926, // 0.0000926 USDT/s
            image: "/IMG_3827.png"
        }
    },
    ITEMS: {
        netherite_pickaxe: {
            name: "Pico de Netherita",
            cost: 1000,
            multiplier: 5
        },
        enchanted_golden_pickaxe: {
            name: "Pico de Oro Encantada",
            cost: 250,
            multiplier: 1.8
        },
        silk_touch_pickaxe: {
            name: "Pico de Toque de Seda",
            cost: 750,
            multiplier: 2.5
        },
        beacon_amplifier: {
            name: "Amplificador de Beacon",
            cost: 1500,
            multiplier: 3.5
        },
        speed_potion: {
            name: "Poción de Velocidad",
            cost: 200,
            multiplier: 1.5
        },
        strength_potion: {
            name: "Poción de Fuerza",
            cost: 300,
            multiplier: 2
        },
        efficiency_enchantment: {
            name: "Encantamiento de Eficiencia",
            cost: 400,
            multiplier: 1.7
        },
        fortune_enchantment: {
            name: "Encantamiento de Fortuna",
            cost: 600,
            multiplier: 2.2
        },
        haste_beacon: {
            name: "Beacon de Prisa",
            cost: 1200,
            multiplier: 3
        },
        redstone_booster: {
            name: "Potenciador de Redstone",
            cost: 350,
            multiplier: 1.6
        },
        obsidian_drill: {
            name: "Taladro de Obsidiana",
            cost: 900,
            multiplier: 2.7
        },
        end_crystal_enhancer: {
            name: "Potenciador de Cristal del End",
            cost: 1800,
            multiplier: 4
        },
        emerald_upgrade: {
            name: "Mejora de Esmeralda",
            cost: 650,
            multiplier: 2.3
        },
        nether_star_generator: {
            name: "Generador de Estrella del Nether",
            cost: 2000,
            multiplier: 4.5
        },
        ancient_debris_catalyst: {
            name: "Catalizador de Escombros Antiguos",
            cost: 1600,
            multiplier: 3.8
        },
        rocket_boost: {
            name: "Impulso de Cohete",
            cost: 500,
            multiplier: 2.1
        },
        compressed_glowstone: {
            name: "Piedra Luminosa Comprimida",
            cost: 450,
            multiplier: 1.9
        }
    },
    MAX_INVENTORY_SLOTS: 23,
    DAILY_REWARDS: [
        { amount: 0.0001, probability: 0.70 },   // 70%
        { amount: 0.001, probability: 0.20 },    // 20%
        { amount: 0.01, probability: 0.05 },     // 5%
        { amount: 0.1, probability: 0.02 },      // 2%
        { amount: 0.5, probability: 0.015 },     // 1.5%
        { amount: 1, probability: 0.013 },       // 1.3%
        { amount: 5, probability: 0.0019 },      // 0.19%
        { amount: 10, probability: 0.0001 }      // 0.01%
    ],
    DAILY_REWARD_COOLDOWN: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    PURCHASED_ITEMS: {
        SWORDS: [],
        ARMOR: []
    },
    BALANCE_DECIMAL_PLACES: 6  
};