import { intervalCallback30s,intervalRunning } from '@/views/NavigationPages/Group.vue'; // adjust path as needed
import { onMounted } from 'vue';
  import router from '@/router/index'; // Assuming your router file is named router.js


let intervalIdGroup = null;

const GroupIntervalRefresh = () => 
    {
      console.log("Interval will Start for Group!",intervalRunning.value);

        if (!intervalRunning.value) {
          intervalIdGroup = setInterval(intervalCallback30s, 30000); // Call every 30 sec (1 min is 60,000 milliseconds)
          intervalRunning.value = true;
        }else{
          console.log("Interval");

        }

        
    };

    const stopInterval = () => 
    {
        console.log("Interval will Stop For Group!",intervalRunning.value);

        if (intervalRunning.value) {
          clearInterval(intervalIdGroup);
          intervalRunning.value = false;
        }
    };

  
  
    export{GroupIntervalRefresh,stopInterval,intervalRunning};
   
  