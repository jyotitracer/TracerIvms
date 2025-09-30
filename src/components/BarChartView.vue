<template>
  <ion-content>
    <canvas ref="barChart"></canvas>
  </ion-content>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { IonContent } from '@ionic/vue';
import Constants from "@/common/constants";
import storage from "@/services/storagefile";


// Register Chart.js components
Chart.register(...registerables);

 
export default {
  name: 'BarChartView',
  components: { IonContent },
  props: {
    data: Object, // Data passed to configure the chart
  },
   setup(props) {
    // Set colors from constants

    const barChart = ref(null);
     // Check if data exists in storage
 
    // Initialize chart when component is mounted
    onMounted(async () => {
  // Log the passed data for debugging
  console.log("Data:", props.data[0]);

  const labels = [];
  const activeData = [];
  const stoppedData = [];
  const offlineData = [];

  // Iterate over response data
  for (const [date, counts] of Object.entries(props.data[0])) {
    labels.push(date.slice(-2)); // Extract the day from the date
    activeData.push(Math.max(0, parseInt(counts.act_cnt, 10)));
    stoppedData.push(Math.max(0, parseInt(counts.stopped_cnt, 10)));
    offlineData.push(Math.max(0, parseInt(counts.oflne_cnt, 10)));
  }

  // Determine maximum value to configure chart steps
  const maxValue = Math.max(...activeData, ...stoppedData, ...offlineData);
  const stepSize = Math.ceil(maxValue / 4.5); // Define step size for 6 intervals


  const movingStoredColor = await storage.get('movingcolor');
  const stoppedStoredColor = await storage.get('stoppedcolor');
  const offlineStoredColor = await storage.get('offlinecolor');


   const moving_color =  movingStoredColor || Constants.Veh_color.Key_Active_Color;
   const idle_color =  Constants.Veh_color.Key_Idle_Color;
   const stopped_color = stoppedStoredColor || Constants.Veh_color.key_Stopped_Color;
   const offline_color = offlineStoredColor || Constants.Veh_color.Key_Offline_Color;


  // If the chart is ready, render the chart
  if (barChart.value) {
  

    new Chart(barChart.value, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Active',
            data: activeData,  // Dynamic data for 'Active'
            backgroundColor: moving_color,
          },
          {
            label: 'Stopped',
            data: stoppedData,  // Dynamic data for 'Stopped'
            backgroundColor: stopped_color,
          },
          {
            label: 'Offline',
            data: offlineData,  // Dynamic data for 'Offline'
            backgroundColor: offline_color,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow chart to be responsive
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date (scroll to see more data)',
            },
            ticks: {
              autoSkip: false, // Disable auto-skipping of ticks
            },
            min: 0, // Start displaying from the first label (index 0)
            max: 6, // Show up to the 7th label (index 6)
          },
          y: {
            title: {
              display: true,
              text: 'Vehicle Count',
            },
            beginAtZero: false,
            max: stepSize * 5, // Ensure the max is a multiple of the step size
            ticks: {
              stepSize: stepSize, // Dynamic step size
            },
          },
        },
        plugins: {
          datalabels: {
            display: true, // Display the labels
            color: '#000', // Label color
            anchor: 'end', // Position of the label
            align: 'top', // Position of the label
            formatter: (value) => {
              return value > 0 ? value : '0'; // Display only positive values
            },
            font: {
              size: 8, // Set font size to small (adjust as needed)
              weight: 'normal', // Set font weight to normal
            },
            offset: 1, // Adjust this value to move labels up or down
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x', // Enable horizontal panning
            },
            zoom: {
              wheel: {
                enabled: true, // Enable zooming with the mouse wheel
              },
              drag: {
                enabled: true, // Enable zooming by dragging
              },
              pinch: {
                enabled: true, // Enable pinch zooming on touch devices
              },
              mode: 'x', // Enable zooming in the x direction only
            },
          },
          legend: {
            display: false, // Disable the legend
          },
        },
      },
    });
  }
});


    return { barChart };
  },
};
</script>

<style scoped>
/* Scoped styles for your chart component */
</style>
