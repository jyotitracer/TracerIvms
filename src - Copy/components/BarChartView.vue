<template>
  <div class="chart-scroll-wrapper">
    <canvas ref="barChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import Constants from "@/common/constants";
import storage from "@/services/storagefile";


// Register Chart.js components
Chart.register(...registerables);

 
export default {
  name: 'BarChartView',
  props: {
    data: Object, // Data passed to configure the chart
  },
   setup(props) {

    const barChart = ref(null);

    // Initialize chart when component is mounted
    onMounted(async () => {
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
  const stepSize = Math.ceil(maxValue / 4.5);


  const movingStoredColor = await storage.get('movingcolor');
  const stoppedStoredColor = await storage.get('stoppedcolor');
  const offlineStoredColor = await storage.get('offlinecolor');

  const moving_color =  movingStoredColor || Constants.Veh_color.Key_Active_Color;
  const stopped_color = stoppedStoredColor || Constants.Veh_color.key_Stopped_Color;
  const offline_color = offlineStoredColor || Constants.Veh_color.Key_Offline_Color;

  await nextTick();

  if (barChart.value) {

    // ✅ KEY FIX: Give each date 45px of canvas space so labels never overlap
    // The wrapper div scrolls horizontally to show all dates
    const BAR_WIDTH = 45;
    const canvasWidth = Math.max(labels.length * BAR_WIDTH, 300);
    barChart.value.width  = canvasWidth;
    barChart.value.height = 150;
    barChart.value.style.width  = canvasWidth + 'px';
    barChart.value.style.height = '150px';

    new Chart(barChart.value, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Active',
            data: activeData,
            backgroundColor: moving_color,
          },
          {
            label: 'Stopped',
            data: stoppedData,
            backgroundColor: stopped_color,
          },
          {
            label: 'Offline',
            data: offlineData,
            backgroundColor: offline_color,
          },
        ],
      },
      options: {
        responsive: false,          // ✅ false = respect the explicit canvas width we set
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: false,
            },
            ticks: {
              autoSkip: false,    // ✅ Show every label — canvas is wide enough
              maxRotation: 45,    // ✅ Rotate if still tight
              minRotation: 0,
              font: { size: 10 },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Vehicle Count',
            },
            beginAtZero: true,
            max: stepSize * 5,
            ticks: {
              stepSize: stepSize,
            },
          },
        },
        plugins: {
          datalabels: {
            display: true,
            color: '#000',
            anchor: 'end',
            align: 'top',
            formatter: (value) => {
              return value > 0 ? value : '';
            },
            font: {
              size: 8,
              weight: 'normal',
            },
            offset: 1,
          },
          zoom: {
            pan:  { enabled: false },
            zoom: {
              wheel:  { enabled: false },
              drag:   { enabled: false },
              pinch:  { enabled: false },
              mode: 'x',
            },
          },
          legend: {
            display: false,
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
/* ✅ Scrollable wrapper — swipe left/right to see all dates */
.chart-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch; /* smooth scroll on iOS */
  padding-bottom: 4px;
}
</style>
