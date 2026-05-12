// ============================================
// CITY EXPLORER - Application Logic
// RPG-Inspired Social Media Map App
// ============================================

// Global State
const state = {
  map: null,
  player: {
    name: 'Explorer001',
    level: 1,
    position: [40.7128, -74.0060], // Default: New York City
    marker: null,
    stats: {
      placesDiscovered: 0,
      connections: 0,
      distanceTraveled: 0,
      achievements: 0,
      quests: 3
    }
  },
  places: [],
  users: [],
  discoveredPlaces: new Set(),
  discoveredUsers: new Set()
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initializeMap();
  initializePlayer();
  populateWorld();
  setupEventListeners();
  updateUI();
  showNotification('Welcome to City Explorer!', 'Click anywhere on the map to start your journey', 'success');
});

// ============================================
// Map Initialization
// ============================================
function initializeMap() {
  // Initialize Leaflet map
  state.map = L.map('map', {
    center: state.player.position,
    zoom: 13,
    zoomControl: true,
    attributionControl: true
  });
  
  // Add OpenStreetMap tiles with dark theme
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(state.map);
  
  // Click to move player
  state.map.on('click', (e) => {
    movePlayer(e.latlng);
  });
}

// ============================================
// Player System
// ============================================
function initializePlayer() {
  // Create custom player icon
  const playerIcon = L.divIcon({
    className: 'player-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 4px 12px rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        transition: transform 0.3s ease;
        animation: marker-pulse 2s infinite;
      ">
        🚶
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
  
  // Add player marker to map
  state.player.marker = L.marker(state.player.position, {
    icon: playerIcon,
    draggable: false
  }).addTo(state.map);
  
  state.player.marker.bindPopup(`
    <div class="popup-title">You are here!</div>
    <div class="popup-info">Click anywhere to move</div>
  `);
}

function movePlayer(newPosition) {
  const oldPosition = state.player.position;
  state.player.position = [newPosition.lat, newPosition.lng];
  
  // Animate marker movement
  state.player.marker.setLatLng(newPosition);
  
  // Calculate distance traveled
  const distance = calculateDistance(oldPosition, state.player.position);
  state.player.stats.distanceTraveled += distance;
  
  // Pan map to new position
  state.map.panTo(newPosition, {
    animate: true,
    duration: 0.5
  });
  
  // Check for nearby discoveries
  checkDiscoveries();
  updateUI();
}

function calculateDistance(pos1, pos2) {
  const R = 6371; // Earth's radius in km
  const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
  const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ============================================
// World Population (Places & Users)
// ============================================
function populateWorld() {
  // Sample places around the starting position
  const placeTypes = [
    { type: 'cafe', icon: '☕', color: '#10b981' },
    { type: 'park', icon: '🌳', color: '#06b6d4' },
    { type: 'restaurant', icon: '🍽️', color: '#f59e0b' },
    { type: 'gym', icon: '💪', color: '#ec4899' },
    { type: 'library', icon: '📚', color: '#a855f7' },
    { type: 'shop', icon: '🛍️', color: '#ef4444' }
  ];
  
  const placeNames = {
    cafe: ['Pixel Brew', 'Cyber Cafe', 'Neon Coffee', 'Quest Espresso', 'Mana Beans'],
    park: ['Dragon Park', 'Crystal Gardens', 'Phoenix Plaza', 'Mystic Woods', 'Hero Square'],
    restaurant: ['The Hungry Knight', 'Wizard\'s Feast', 'Tavern 404', 'Epic Eats', 'Loot & Lunch'],
    gym: ['Power Up Fitness', 'Level Up Gym', 'Strength Quest', 'HP Recovery', 'Stamina Station'],
    library: ['Ancient Archives', 'Spell Library', 'Knowledge Keep', 'Lore Hall', 'Wisdom Tower'],
    shop: ['Item Shop', 'Potion Emporium', 'Gear Garage', 'Treasure Trove', 'Magic Mart']
  };
  
  // Generate random places
  for (let i = 0; i < 15; i++) {
    const placeType = placeTypes[Math.floor(Math.random() * placeTypes.length)];
    const names = placeNames[placeType.type];
    const name = names[Math.floor(Math.random() * names.length)];
    
    // Random position near player start
    const lat = state.player.position[0] + (Math.random() - 0.5) * 0.02;
    const lng = state.player.position[1] + (Math.random() - 0.5) * 0.02;
    
    const place = {
      id: `place-${i}`,
      name: name,
      type: placeType.type,
      icon: placeType.icon,
      color: placeType.color,
      position: [lat, lng],
      description: generatePlaceDescription(placeType.type),
      tags: generateTags(placeType.type),
      marker: null
    };
    
    state.places.push(place);
    addPlaceMarker(place);
  }
  
  // Generate nearby users
  const userNames = ['ShadowWalker', 'NeonKnight', 'CyberMage', 'PixelPioneer', 'QuestSeeker', 'DataDrifter', 'CodeCrusader', 'ByteBard'];
  
  for (let i = 0; i < 8; i++) {
    const lat = state.player.position[0] + (Math.random() - 0.5) * 0.015;
    const lng = state.player.position[1] + (Math.random() - 0.5) * 0.015;
    
    const user = {
      id: `user-${i}`,
      name: userNames[i],
      level: Math.floor(Math.random() * 10) + 1,
      position: [lat, lng],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userNames[i]}`,
      bio: 'Fellow explorer on a quest to discover the city',
      interests: generateTags('user'),
      marker: null
    };
    
    state.users.push(user);
    addUserMarker(user);
  }
}

function generatePlaceDescription(type) {
  const descriptions = {
    cafe: 'A cozy spot to restore your energy and meet fellow travelers',
    park: 'A peaceful oasis in the urban jungle, perfect for leveling up',
    restaurant: 'Delicious food to boost your stats and share stories',
    gym: 'Train here to increase your strength and stamina',
    library: 'Gain knowledge and wisdom from ancient tomes',
    shop: 'Find rare items and useful gear for your journey'
  };
  return descriptions[type] || 'An interesting location to explore';
}

function generateTags(type) {
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

// ============================================
// Map Markers
// ============================================
function addPlaceMarker(place) {
  const markerIcon = L.divIcon({
    className: 'place-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${place.color};
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        cursor: pointer;
        transition: transform 0.2s ease;
      " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
        ${place.icon}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
  
  place.marker = L.marker(place.position, {
    icon: markerIcon
  }).addTo(state.map);
  
  place.marker.bindPopup(`
    <div class="popup-title">${place.icon} ${place.name}</div>
    <div class="popup-info">${place.description}</div>
    <div style="margin-top: 8px;">
      ${place.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
    </div>
  `);
  
  place.marker.on('click', () => {
    discoverPlace(place);
  });
}

function addUserMarker(user) {
  const markerIcon = L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%);
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        cursor: pointer;
        transition: transform 0.2s ease;
      " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
        👤
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
  
  user.marker = L.marker(user.position, {
    icon: markerIcon
  }).addTo(state.map);
  
  user.marker.bindPopup(`
    <div class="popup-title">👤 ${user.name}</div>
    <div class="popup-info">Level ${user.level} Explorer</div>
    <div class="popup-info">${user.bio}</div>
    <div style="margin-top: 8px;">
      ${user.interests.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
    </div>
    <button class="btn btn-primary" style="margin-top: 8px; width: 100%; font-size: 0.75rem; padding: 0.5rem;" onclick="connectWithUser('${user.id}')">
      Connect
    </button>
  `);
  
  user.marker.on('click', () => {
    discoverUser(user);
  });
}

// ============================================
// Discovery System
// ============================================
function checkDiscoveries() {
  const discoveryRadius = 0.005; // ~500m
  
  // Check places
  state.places.forEach(place => {
    if (!state.discoveredPlaces.has(place.id)) {
      const distance = calculateDistance(state.player.position, place.position);
      if (distance < discoveryRadius) {
        discoverPlace(place);
      }
    }
  });
  
  // Check users
  state.users.forEach(user => {
    if (!state.discoveredUsers.has(user.id)) {
      const distance = calculateDistance(state.player.position, user.position);
      if (distance < discoveryRadius) {
        discoverUser(user);
      }
    }
  });
}

function discoverPlace(place) {
  if (!state.discoveredPlaces.has(place.id)) {
    state.discoveredPlaces.add(place.id);
    state.player.stats.placesDiscovered++;
    showNotification('New Place Discovered!', `You found ${place.name}`, 'success');
    addToDiscoveryFeed(place, 'place');
    updateUI();
  }
}

function discoverUser(user) {
  if (!state.discoveredUsers.has(user.id)) {
    state.discoveredUsers.add(user.id);
    showNotification('New Explorer Nearby!', `You encountered ${user.name}`, 'success');
    addToDiscoveryFeed(user, 'user');
    updateUI();
  }
}

function addToDiscoveryFeed(item, itemType) {
  const feed = document.getElementById('discovery-feed');
  const distance = calculateDistance(state.player.position, item.position);
  
  const discoveryItem = document.createElement('div');
  discoveryItem.className = 'discovery-item';
  discoveryItem.style.animation = 'fadeIn 0.3s ease-out';
  
  if (itemType === 'place') {
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
  
  discoveryItem.onclick = () => {
    state.map.setView(item.position, 16, { animate: true });
    item.marker.openPopup();
  };
  
  feed.insertBefore(discoveryItem, feed.firstChild);
}

// ============================================
// UI Updates
// ============================================
function updateUI() {
  // Update stats bar
  document.getElementById('stat-places').textContent = state.player.stats.placesDiscovered;
  document.getElementById('stat-connections').textContent = state.player.stats.connections;
  document.getElementById('stat-level').textContent = state.player.level;
  document.getElementById('stat-quests').textContent = state.player.stats.quests;
  
  // Update profile panel
  document.getElementById('player-name').textContent = state.player.name;
  document.getElementById('player-level').textContent = `Level ${state.player.level} Wanderer`;
  document.getElementById('profile-places').textContent = state.player.stats.placesDiscovered;
  document.getElementById('profile-connections').textContent = state.player.stats.connections;
  document.getElementById('profile-distance').textContent = `${state.player.stats.distanceTraveled.toFixed(1)} km`;
  document.getElementById('profile-achievements').textContent = state.player.stats.achievements;
  
  // Set player avatar
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${state.player.name}`;
  document.getElementById('player-avatar').src = avatarUrl;
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
  // Profile panel toggle
  document.getElementById('btn-profile').addEventListener('click', () => {
    document.getElementById('profile-panel').classList.toggle('hidden');
  });
  
  document.getElementById('close-profile').addEventListener('click', () => {
    document.getElementById('profile-panel').classList.add('hidden');
  });
  
  // Discovery panel toggle
  document.getElementById('close-discovery').addEventListener('click', () => {
    document.getElementById('discovery-panel').classList.toggle('hidden');
  });
  
  // Explore button - recenter on player
  document.getElementById('btn-explore').addEventListener('click', () => {
    state.map.setView(state.player.position, 15, { animate: true });
    showNotification('Exploring...', 'Move around to discover new places and people!', 'success');
  });
  
  // Connections button
  document.getElementById('btn-connections').addEventListener('click', () => {
    showNotification('Connections', `You have ${state.player.stats.connections} friends`, 'success');
  });
  
  // Quests button
  document.getElementById('btn-quests').addEventListener('click', () => {
    showNotification('Active Quests', 'Discover 5 new places • Meet 3 explorers • Travel 1km', 'success');
  });
  
  // Settings button
  document.getElementById('btn-settings').addEventListener('click', () => {
    showNotification('Settings', 'Customize your explorer experience', 'success');
  });
}

// ============================================
// Notifications
// ============================================
function showNotification(title, message, type = 'success') {
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

// ============================================
// Global Functions (for popup buttons)
// ============================================
window.connectWithUser = function(userId) {
  const user = state.users.find(u => u.id === userId);
  if (user) {
    state.player.stats.connections++;
    showNotification('Connection Made!', `You are now connected with ${user.name}`, 'success');
    updateUI();
  }
};
