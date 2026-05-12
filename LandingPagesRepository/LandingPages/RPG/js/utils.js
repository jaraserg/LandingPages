import { CONFIG } from './config.js';

export const Utils = {
    calculateDistance(pos1, pos2) {
        const R = CONFIG.EARTH_RADIUS_KM;
        const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
        const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    getRandomPosition(center, variance = 0.02) {
        const lat = center[0] + (Math.random() - 0.5) * variance;
        const lng = center[1] + (Math.random() - 0.5) * variance;
        return [lat, lng];
    },

    generatePlaceDescription(type) {
        const descriptions = {
            cafe: 'A cozy spot to restore your energy and meet fellow travelers',
            park: 'A peaceful oasis in the urban jungle, perfect for leveling up',
            restaurant: 'Delicious food to boost your stats and share stories',
            gym: 'Train here to increase your strength and stamina',
            library: 'Gain knowledge and wisdom from ancient tomes',
            shop: 'Find rare items and useful gear for your journey'
        };
        return descriptions[type] || 'An interesting location to explore';
    },

    generateTags(type) {
        const tagSets = {
            cafe: ['Coffee', 'WiFi', 'Cozy', 'Social'],
            park: ['Nature', 'Relaxing', 'Outdoor', 'Peaceful'],
            restaurant: ['Food', 'Social', 'Tasty', 'Popular'],
            gym: ['Fitness', 'Active', 'Health', 'Training'],
            library: ['Books', 'Quiet', 'Study', 'Knowledge'],
            shop: ['Shopping', 'Retail', 'Deals', 'Items'],
            user: ['Gaming', 'Exploring', 'Social', 'Adventure']
        };
        const tags = tagSets[type] || ['Discover', 'Explore'];
        return tags.slice(0, 2 + Math.floor(Math.random() * 2));
    }
};
