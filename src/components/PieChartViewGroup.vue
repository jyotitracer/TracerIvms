<template>
  <div id="chart-container">
    <canvas ref="pieChartRef"></canvas>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import Constants from "@/common/constants";
import storage from "@/services/storagefile";


Chart.register(...registerables);




export default defineComponent({
  name: 'PieChartView',
  props: {
    data: {
      type: Array, // Updated to accept an array of objects
      required: true
    }
  },
   setup(props) {
    const pieChartRef = ref(null);
    let chartInstance;

    // Set the colors from constants or directly in your code
  // Check if data exists in storage
 


    const extractData = (label) => {
      const item = props.data.find(entry => entry.sts_lbl === label);
      return item ? item.sts_cnt : 0;
    };

    const createChart = async () => {


     
      const movingStoredColor = await storage.get('movingcolor');
const stoppedStoredColor = await storage.get('stoppedcolor');
const offlineStoredColor = await storage.get('offlinecolor');
const idleStoredColor = await storage.get('idlecolor');


                 const moving_color =  movingStoredColor || Constants.Veh_color.Key_Active_Color;
                 const idle_color =  idleStoredColor || Constants.Veh_color.Key_Idle_Color;
                 const stopped_color = stoppedStoredColor || Constants.Veh_color.key_Stopped_Color;
                 const offline_color = offlineStoredColor || Constants.Veh_color.Key_Offline_Color;


      if (pieChartRef.value) {
        const ctx = pieChartRef.value.getContext('2d');

        const movingCount = extractData('Moving');
        const idleCount = extractData('Idle');
        const stoppedCount = extractData('Stopped');
        const offlineCount = extractData('Offline');

        const total = movingCount + idleCount + stoppedCount + offlineCount;

        if (chartInstance) {
        chartInstance.destroy();
      }
      

        chartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Active', 'Idle', 'Stopped', 'Offline'],
            datasets: [
              {
                backgroundColor: [moving_color, idle_color, stopped_color, offline_color],
                data: [movingCount, idleCount, stoppedCount, offlineCount],
                borderWidth: 0, // Remove white space by setting borderWidth to 0

              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.raw !== null) {
                      label += context.raw;
                    }
                    return label;
                  }
                }
              },
              datalabels: {
                             display: false,
                           },

            }
          },
          plugins: [{
            id: 'centerText',
            beforeDraw: (chart) => {
              const width = chart.width;
              const height = chart.height;
              const ctx = chart.ctx;
              ctx.restore();
              const fontSize = (height / 150).toFixed(2);
              ctx.font = `${fontSize}em sans-serif`;
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#000';
              const text = total.toString();
              const textX = Math.round((width - ctx.measureText(text).width) / 2);
              const textY = height / 2;
              ctx.fillText(text, textX, textY);
              ctx.save();
            }
          }]
        });
      }
    };

    onMounted(() => {
      nextTick(createChart);
    });

    watch(() => props.data, () => {
      // if (chartInstance) {
      //   chartInstance.destroy();
      // }
      nextTick(createChart);
    });

    onBeforeUnmount(() => {
      // if (chartInstance) {
      //   chartInstance.destroy();
      // }
    });

    return {
      pieChartRef
    };
  }
});
</script>

<style scoped>
#chart-container {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  margin-right: 20px;
}
</style>
