import { intervalCallback1Min,intervalRunning1Min } from '@/views/NavigationPages/MapPage.vue'; // adjust path as needed
import { onMounted } from 'vue';


let intervalIdMap = null;
const MapIntervalRefresh = () => 
    {
      console.log("Interval will Start For Map!",intervalRunning1Min.value);

        if (!intervalRunning1Min.value) {
          intervalIdMap = setInterval(intervalCallback1Min, 60000); // Call every 1 minute (60,000 milliseconds)
          intervalRunning1Min.value = true;
        }
    };

    const stopInterval1Min = () => 
    {
        console.log("Interval will Stop For Map!",intervalRunning1Min.value);
        if (intervalRunning1Min.value) {
          clearInterval(intervalIdMap);
          intervalRunning1Min.value = false;
        }
    };

  
  
    export{MapIntervalRefresh,stopInterval1Min,intervalRunning1Min};
   
  