// storage.js
import { Preferences } from '@capacitor/preferences';

const STORAGE_PREFIX = 'Ivms_myStorage_'; // Use a unique prefix to identify your storage keys

const storage =
 {

    async set(key1, value) {
        await Preferences.set({
            key: `${STORAGE_PREFIX}${key1}`,
            value: JSON.stringify(value)
        });
    },

    async get(key1) {
        const item = await Preferences.get({ key: `${STORAGE_PREFIX}${key1}` });

        return JSON.parse(item.value);
    },

    async remove(key1) {
        await Preferences.remove({ key: `${STORAGE_PREFIX}${key1}` });
    },

    async clear() {
        const { keys } = await Preferences.keys(); // Get all keys in Preferences
        const keysToRemove = keys.filter((key) => key.startsWith(STORAGE_PREFIX)); // Filter keys with the prefix
        for (const key of keysToRemove) {
            console.log(key);
          await Preferences.remove({ key });
        }   
     }
};

export default storage;
