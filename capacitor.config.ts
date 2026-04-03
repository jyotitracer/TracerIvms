import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
   appId: 'in.co.tracer.tracerobdv2',
  appName: 'Tracer imprint v2',
  webDir: 'dist',
 plugins: {
  StatusBar: {
    overlaysWebView: true,
    backgroundColor: "transparent",
    style: "LIGHT"
  },
  // edge-to-edge 

  // Add or update the Keyboard section
    Keyboard: {
      resize: 'native', // <-- THIS IS THE KEY!
      resizeOnFullScreen: true,
    },
   
}
  // android: {
  //   googleServicesFile: 'google-services.json', // Ensure this matches the file in android/app
  // },
  // plugins : {
  
  //   "PushNotifications": {
  //     "presentationOptions": ["badge", "sound", "alert"]
  //   }
  // }
};

export default config;
