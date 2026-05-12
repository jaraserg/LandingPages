import { CONFIG } from './config.js';

export class GameState {
    constructor() {
        this.player = {
            name: 'Explorer001',
            level: 1,
            position: [...CONFIG.DEFAULT_POSITION], // Copy to avoid reference issues
            marker: null,
            stats: {
                placesDiscovered: 0,
                connections: 0,
                distanceTraveled: 0,
                achievements: 0,
                quests: 3
            }
        };
        this.places = [];
        this.users = [];
        this.discoveredPlaces = new Set();
        this.discoveredUsers = new Set();

        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this));
    }

    updatePlayerPosition(newLat, newLng) {
        this.player.position = [newLat, newLng];
        this.notify();
    }

    addStat(statName, value) {
        if (this.player.stats[statName] !== undefined) {
            this.player.stats[statName] += value;
            this.notify();
        }
    }

    discoverPlace(placeId) {
        if (!this.discoveredPlaces.has(placeId)) {
            this.discoveredPlaces.add(placeId);
            this.player.stats.placesDiscovered++;
            this.notify();
            return true;
        }
        return false;
    }

    discoverUser(userId) {
        if (!this.discoveredUsers.has(userId)) {
            this.discoveredUsers.add(userId);
            this.notify();
            return true;
        }
        return false;
    }
}
