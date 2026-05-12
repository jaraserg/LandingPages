import { CONFIG } from './config.js';
import { Utils } from './utils.js';
import { GameState } from './state.js';
import { MapManager } from './map.js';
import { UIManager } from './ui.js';
import { EntityFactory } from './entities.js';

class RPGApp {
    constructor() {
        this.state = new GameState();
        this.mapManager = new MapManager();
        // Initialize UI after DOM Content Loaded (handled in init)
        this.uiManager = null;
    }

    init() {
        this.uiManager = new UIManager(this.state);

        // Initialize Map
        const map = this.mapManager.initialize('map', this.state.player.position);

        // Initialize Player
        this.state.player.marker = this.mapManager.createPlayerMarker(this.state.player.position);

        // Subscribe UI to State changes
        this.state.subscribe(() => {
            this.uiManager.update();
        });

        // Populate World
        this.populateWorld();

        // Setup Event Listeners
        this.setupEvents();

        // Initial UI Update
        this.uiManager.update();

        this.uiManager.showNotification('Welcome to City Explorer!', 'Click anywhere on the map to start your journey', 'success');
    }

    populateWorld() {
        // Generate Places
        for (let i = 0; i < CONFIG.PLACE_COUNT; i++) {
            const place = EntityFactory.createPlace(i, this.state.player.position);

            // Create marker and add to map
            place.marker = this.mapManager.addPlaceMarker(place, (p) => this.handlePlaceDiscovery(p));

            this.state.places.push(place);
        }

        // Generate Users
        for (let i = 0; i < CONFIG.USER_COUNT; i++) {
            const user = EntityFactory.createUser(i, this.state.player.position);

            // Create marker and add to map
            user.marker = this.mapManager.addUserMarker(user, (u) => this.handleUserDiscovery(u));

            this.state.users.push(user);
        }
    }

    setupEvents() {
        // Map Click -> Move Player
        this.mapManager.map.on('click', (e) => {
            this.movePlayer(e.latlng);
        });

        // Custom Event for "Connect" button in User Popup
        window.addEventListener('connect-user', (e) => {
            this.connectWithUser(e.detail.userId);
        });

        // Focus Entity Event (from Feed click)
        document.addEventListener('focus-entity', (e) => {
            this.mapManager.focusEntity(e.detail.position, e.detail.marker);
        });
    }

    movePlayer(newPosition) {
        const oldPosition = this.state.player.position;
        const distanceVal = Utils.calculateDistance(oldPosition, [newPosition.lat, newPosition.lng]);

        // Update State
        this.state.player.stats.distanceTraveled += distanceVal;
        this.state.updatePlayerPosition(newPosition.lat, newPosition.lng);

        // Update Map
        this.mapManager.updatePlayerPosition(newPosition);

        // Check Discoveries
        this.checkDiscoveries();
    }

    checkDiscoveries() {
        // Check places
        this.state.places.forEach(place => {
            const distance = Utils.calculateDistance(this.state.player.position, place.position);
            if (distance < CONFIG.DISCOVERY_RADIUS) {
                this.handlePlaceDiscovery(place);
            }
        });

        // Check users
        this.state.users.forEach(user => {
            const distance = Utils.calculateDistance(this.state.player.position, user.position);
            if (distance < CONFIG.DISCOVERY_RADIUS) {
                this.handleUserDiscovery(user);
            }
        });
    }

    handlePlaceDiscovery(place) {
        if (this.state.discoverPlace(place.id)) {
            this.uiManager.showNotification('New Place Discovered!', `You found ${place.name}`, 'success');
            const dist = Utils.calculateDistance(this.state.player.position, place.position);
            this.uiManager.addToDiscoveryFeed(place, 'place', dist);
        }
    }

    handleUserDiscovery(user) {
        if (this.state.discoverUser(user.id)) {
            this.uiManager.showNotification('New Explorer Nearby!', `You encountered ${user.name}`, 'success');
            const dist = Utils.calculateDistance(this.state.player.position, user.position);
            this.uiManager.addToDiscoveryFeed(user, 'user', dist);
        }
    }

    connectWithUser(userId) {
        const user = this.state.users.find(u => u.id === userId);
        if (user) {
            this.state.addStat('connections', 1);
            this.uiManager.showNotification('Connection Made!', `You are now connected with ${user.name}`, 'success');
        }
    }
}

// Start the App
document.addEventListener('DOMContentLoaded', () => {
    const app = new RPGApp();
    app.init();
});
