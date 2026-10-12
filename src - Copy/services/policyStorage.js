// storage.js
import { Preferences } from '@capacitor/preferences';
const STORAGE_PREFIX = 'Ivms_policy_'; // Use a unique prefix to identify your storage keys

const poli_storage =
 {

    async set(key1, value) {
        await Preferences.set({
          key:`${STORAGE_PREFIX}${key1}`,
          value: JSON.stringify(value)
        });
    },

    async get(key1) {
        const item = await Preferences.get({ key:`${STORAGE_PREFIX}${key1}` });

        return item.value ? JSON.parse(item.value) : null; // Return null if no value is found
    },

    async remove(key1) {
        await Preferences.remove({ key:`${STORAGE_PREFIX}${key1}` });
    },

};

export default poli_storage;
