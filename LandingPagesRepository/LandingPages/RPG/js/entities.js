import { Utils } from './utils.js';
import { CONFIG } from './config.js';

export class EntityFactory {
    static createPlace(id, centerPosition) {
        const placeType = Utils.getRandomElement(CONFIG.PLACE_TYPES);
        const names = CONFIG.PLACE_NAMES[placeType.type];
        const name = Utils.getRandomElement(names);
        const position = Utils.getRandomPosition(centerPosition);

        return {
            id: `place-${id}`,
            name: name,
            type: placeType.type,
            icon: placeType.icon,
            color: placeType.color,
            position: position,
            description: Utils.generatePlaceDescription(placeType.type),
            tags: Utils.generateTags(placeType.type),
            marker: null
        };
    }

    static createUser(id, centerPosition) {
        const name = CONFIG.USER_NAMES[id % CONFIG.USER_NAMES.length];
        const position = Utils.getRandomPosition(centerPosition, 0.015);

        return {
            id: `user-${id}`,
            name: name,
            level: Math.floor(Math.random() * 10) + 1,
            position: position,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            bio: 'Fellow explorer on a quest to discover the city',
            interests: Utils.generateTags('user'),
            marker: null
        };
    }
}
