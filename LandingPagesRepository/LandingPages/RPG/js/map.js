import { CONFIG } from './config.js';

export class MapManager {
    constructor() {
        this.map = null;
        this.playerMarker = null;
        this.markers = new Map(); // Store markers by ID
    }

    initialize(elementId, centerPosition) {
        this.map = L.map(elementId, {
            center: centerPosition,
            zoom: CONFIG.DEFAULT_ZOOM,
            zoomControl: true,
            attributionControl: true
        });

        L.tileLayer(CONFIG.TILE_LAYER_URL, {
            attribution: CONFIG.TILE_LAYER_ATTRIBUTION,
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(this.map);

        return this.map;
    }

    createPlayerMarker(position) {
        const icon = L.divIcon({
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

        this.playerMarker = L.marker(position, {
            icon: icon,
            draggable: false
        }).addTo(this.map);

        this.playerMarker.bindPopup(`
      <div class="popup-title">You are here!</div>
      <div class="popup-info">Click anywhere to move</div>
    `);

        return this.playerMarker;
    }

    updatePlayerPosition(position) {
        if (this.playerMarker) {
            this.playerMarker.setLatLng(position);
            this.map.panTo(position, {
                animate: true,
                duration: 0.5
            });
        }
    }

    addPlaceMarker(place, onClickCallback) {
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

        const marker = L.marker(place.position, { icon: markerIcon }).addTo(this.map);

        marker.bindPopup(`
      <div class="popup-title">${place.icon} ${place.name}</div>
      <div class="popup-info">${place.description}</div>
      <div style="margin-top: 8px;">
        ${place.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
      </div>
    `);

        marker.on('click', () => {
            if (onClickCallback) onClickCallback(place);
        });

        this.markers.set(place.id, marker);
        return marker;
    }

    addUserMarker(user, onClickCallback, onConnectCallback) {
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

        const marker = L.marker(user.position, { icon: markerIcon }).addTo(this.map);

        // We need to attach the connect function to the window or handle it via event delegation because
        // the popup HTML is inserted as a string.
        // A cleaner way is to use DOM elements for popups, but Leaflet strings are easier.
        // We'll use a custom event dispatch from the global scope for the button.

        marker.bindPopup(`
      <div class="popup-title">👤 ${user.name}</div>
      <div class="popup-info">Level ${user.level} Explorer</div>
      <div class="popup-info">${user.bio}</div>
      <div style="margin-top: 8px;">
        ${user.interests.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
      </div>
      <button class="btn btn-primary" style="margin-top: 8px; width: 100%; font-size: 0.75rem; padding: 0.5rem;" onclick="window.dispatchEvent(new CustomEvent('connect-user', { detail: { userId: '${user.id}' } }))">
        Connect
      </button>
    `);

        marker.on('click', () => {
            if (onClickCallback) onClickCallback(user);
        });

        this.markers.set(user.id, marker);
        return marker;
    }

    focusEntity(position, marker) {
        this.map.setView(position, 16, { animate: true });
        if (marker) marker.openPopup();
    }
}
