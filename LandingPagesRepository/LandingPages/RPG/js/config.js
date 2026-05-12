export const CONFIG = {
    // Map settings
    DEFAULT_POSITION: [40.7128, -74.0060], // New York City
    DEFAULT_ZOOM: 13,
    TILE_LAYER_URL: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    TILE_LAYER_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',

    // Game settings
    DISCOVERY_RADIUS: 0.005, // ~500m
    EARTH_RADIUS_KM: 6371,

    // Entity Generation
    PLACE_COUNT: 15,
    USER_COUNT: 8,

    // Place Data
    PLACE_TYPES: [
        { type: 'cafe', icon: '☕', color: '#10b981' },
        { type: 'park', icon: '🌳', color: '#06b6d4' },
        { type: 'restaurant', icon: '🍽️', color: '#f59e0b' },
        { type: 'gym', icon: '💪', color: '#ec4899' },
        { type: 'library', icon: '📚', color: '#a855f7' },
        { type: 'shop', icon: '🛍️', color: '#ef4444' }
    ],

    PLACE_NAMES: {
        cafe: ['Pixel Brew', 'Cyber Cafe', 'Neon Coffee', 'Quest Espresso', 'Mana Beans'],
        park: ['Dragon Park', 'Crystal Gardens', 'Phoenix Plaza', 'Mystic Woods', 'Hero Square'],
        restaurant: ['The Hungry Knight', 'Wizard\'s Feast', 'Tavern 404', 'Epic Eats', 'Loot & Lunch'],
        gym: ['Power Up Fitness', 'Level Up Gym', 'Strength Quest', 'HP Recovery', 'Stamina Station'],
        library: ['Ancient Archives', 'Spell Library', 'Knowledge Keep', 'Lore Hall', 'Wisdom Tower'],
        shop: ['Item Shop', 'Potion Emporium', 'Gear Garage', 'Treasure Trove', 'Magic Mart']
    },

    USER_NAMES: [
        'ShadowWalker', 'NeonKnight', 'CyberMage', 'PixelPioneer',
        'QuestSeeker', 'DataDrifter', 'CodeCrusader', 'ByteBard'
    ]
};
