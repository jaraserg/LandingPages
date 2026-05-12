import { CONFIG } from './config.js';

export class UIManager {
    constructor(state) {
        this.state = state;
        this.elements = {
            places: document.getElementById('stat-places'),
            connections: document.getElementById('stat-connections'),
            level: document.getElementById('stat-level'),
            quests: document.getElementById('stat-quests'),
            playerName: document.getElementById('player-name'),
            playerLevel: document.getElementById('player-level'),
            profilePlaces: document.getElementById('profile-places'),
            profileConnections: document.getElementById('profile-connections'),
            profileDistance: document.getElementById('profile-distance'),
            profileAchievements: document.getElementById('profile-achievements'),
            playerAvatar: document.getElementById('player-avatar'),
            discoveryFeed: document.getElementById('discovery-feed'),
            profilePanel: document.getElementById('profile-panel'),
            discoveryPanel: document.getElementById('discovery-panel')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Panel toggles
        document.getElementById('btn-profile').addEventListener('click', () => {
            this.elements.profilePanel.classList.toggle('hidden');
        });

        document.getElementById('close-profile').addEventListener('click', () => {
            this.elements.profilePanel.classList.add('hidden');
        });

        document.getElementById('close-discovery').addEventListener('click', () => {
            this.elements.discoveryPanel.classList.toggle('hidden');
        });

        // Action buttons
        document.getElementById('btn-connections').addEventListener('click', () => {
            this.showNotification('Connections', `You have ${this.state.player.stats.connections} friends`, 'success');
        });

        document.getElementById('btn-quests').addEventListener('click', () => {
            this.showNotification('Active Quests', 'Discover 5 new places • Meet 3 explorers • Travel 1km', 'success');
        });

        document.getElementById('btn-settings').addEventListener('click', () => {
            this.showNotification('Settings', 'Customize your explorer experience', 'success');
        });
    }

    update() {
        const stats = this.state.player.stats;

        // Top Bar
        this.elements.places.textContent = stats.placesDiscovered;
        this.elements.connections.textContent = stats.connections;
        this.elements.level.textContent = this.state.player.level;
        this.elements.quests.textContent = stats.quests;

        // Profile Panel
        this.elements.playerName.textContent = this.state.player.name;
        this.elements.playerLevel.textContent = `Level ${this.state.player.level} Wanderer`;
        this.elements.profilePlaces.textContent = stats.placesDiscovered;
        this.elements.profileConnections.textContent = stats.connections;
        this.elements.profileDistance.textContent = `${stats.distanceTraveled.toFixed(1)} km`;
        this.elements.profileAchievements.textContent = stats.achievements;

        const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${this.state.player.name}`;
        this.elements.playerAvatar.src = avatarUrl;
    }

    addToDiscoveryFeed(item, type, distance) {
        const discoveryItem = document.createElement('div');
        discoveryItem.className = 'discovery-item';
        discoveryItem.style.animation = 'fadeIn 0.3s ease-out';

        if (type === 'place') {
            discoveryItem.innerHTML = `
        <div class="discovery-header">
          <div class="discovery-avatar" style="background: ${item.color}; display: flex; align-items: center; justify-content: center; font-size: 24px;">
            ${item.icon}
          </div>
          <div class="discovery-info">
            <div class="discovery-name">${item.name}</div>
            <div class="discovery-meta">
              <span class="discovery-distance">📍 ${(distance * 1000).toFixed(0)}m away</span>
            </div>
          </div>
        </div>
        <div class="discovery-description">${item.description}</div>
        <div class="discovery-tags">
          ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      `;
        } else {
            discoveryItem.innerHTML = `
        <div class="discovery-header">
          <img src="${item.avatar}" alt="${item.name}" class="discovery-avatar">
          <div class="discovery-info">
            <div class="discovery-name">${item.name}</div>
            <div class="discovery-meta">
              Level ${item.level} Explorer
              <span class="discovery-distance">📍 ${(distance * 1000).toFixed(0)}m away</span>
            </div>
          </div>
        </div>
        <div class="discovery-description">${item.bio}</div>
        <div class="discovery-tags">
          ${item.interests.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      `;
        }

        // Note: We'd need to emit an event to center map, but for now we'll skip the click handler 
        // or handle it in main app by passing a callback if needed.
        // For simplicity, we can dispatch a custom event.
        discoveryItem.onclick = () => {
            const event = new CustomEvent('focus-entity', { detail: { position: item.position, marker: item.marker } });
            document.dispatchEvent(event);
        };

        this.elements.discoveryFeed.insertBefore(discoveryItem, this.elements.discoveryFeed.firstChild);
    }

    showNotification(title, message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}
