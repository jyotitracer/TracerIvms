import { ref } from 'vue';

import { getGoogleMapKey } from '@/services/userstate';
import storage from '@/services/storagefile';

let googleMapsPromise = null;

const googleMapKey = ref('');

export async function loadGoogleMaps() {
  // Prevent re-initialization or multiple promises
  if (window.google && window.google.maps) {
    console.log('✅ Google Maps already available');
    return window.google.maps;
  }

  if (googleMapsPromise) {
    // Script load already in progress
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise(async (resolve, reject) => {
    try {
      // Retrieve key dynamically
          const existingKey = await getGoogleMapKey.value;

    if (existingKey && existingKey.trim() !== '') {
      googleMapKey.value = existingKey;
    }else{
      googleMapKey.value = await storage.get('GoogleMapKey');
    }

    console.log("googleMapKey.value",googleMapKey.value);

      if (!googleMapKey.value) {
        console.error('❌ No Google Maps API key found!');
        return;
      }

      // If script tag already exists but google is not yet defined
      if (document.getElementById('google-maps-script')) {
        console.log('ℹ️ Google Maps script already loading...');
        const interval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(interval);
            resolve(window.google.maps);
          }
        }, 200);
        return;
      }

      // Inject script dynamically
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapKey.value}&libraries=geometry,marker,places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google && window.google.maps) {
          console.log('✅ Google Maps loaded successfully');
          resolve(window.google.maps);
        } else {
          reject(new Error('Google Maps API failed to initialize after load'));
        }
      };

      script.onerror = () => {
        console.error('❌ Failed to load Google Maps script');
        reject(new Error('Failed to load Google Maps script'));
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error('🔥 Error during Google Maps loading:', error);
      reject(error);
    }
  });

  return googleMapsPromise;
}


