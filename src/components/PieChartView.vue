<template>
  <div id="chart-container">
    <canvas ref="pieChartRef"></canvas>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import Constants from "@/common/constants"; // Ensure this path is correct
import storage from "@/services/storagefile";


// Register all the necessary Chart.js components
Chart.register(...registerables);



export default defineComponent({
  name: 'PieChartView',
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
   setup(props) {
    const pieChartRef = ref(null);
    let chartInstance = null;
  


     // Set the colors from constants or directly in your code
    const createChart = async () => {

      const movingStoredColor = await storage.get('movingcolor');
                const stoppedStoredColor = await storage.get('stoppedcolor');
                const offlineStoredColor = await storage.get('offlinecolor');

                 const movingColor =  movingStoredColor || Constants.Veh_color.Key_Active_Color;
                 const stoppedColor = stoppedStoredColor || Constants.Veh_color.key_Stopped_Color;
                 const offlineColor = offlineStoredColor || Constants.Veh_color.Key_Offline_Color;


      if (pieChartRef.value) {
        const ctx = pieChartRef.value.getContext('2d');

        // Destroy the chart instance if it already exists to avoid memory leaks
        if (chartInstance) {
          chartInstance.destroy();
        }

        // Calculate the total values for the chart center
        const total = (props.data.moving || 0) + (props.data.stopped || 0) + (props.data.offline || 0);

        // Create a new Chart.js instance
        chartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Active', 'Stopped', 'Offline'],
            datasets: [{
              backgroundColor: [movingColor, stoppedColor, offlineColor],
              data: [props.data.moving, props.data.stopped, props.data.offline],
              borderWidth: 0, // Remove white space by setting borderWidth to 0

            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%', // Customize the doughnut's cutout
            plugins: {
              legend: {
                display: false, // Hide the default legend
              },
              datalabels: {
              display: false, // Disable the data labels in the segments
            },
              tooltip: {
                // callbacks: {
                //   label: (context) => {
                //     let label = context.label || '';
                //     if (label) {
                //       label += ': ';
                //     }
                //     if (context.raw !== null) {
                //       label += context.raw;
                //     }
                //     return label;
                //   },
                // },
              },
            },
          },
          plugins: [{
            // Custom plugin to display total value in the center
            id: 'centerText',
            beforeDraw(chart) {
              const { width, height, ctx } = chart;
              const fontSize = (height / 150).toFixed(2);

              // Setup font and alignment
              ctx.restore();
              ctx.font = `${fontSize}em sans-serif`;
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#000';

              // Draw the total in the center of the chart
              const text = total.toString();
              const textX = Math.round((width - ctx.measureText(text).width) / 2);
              const textY = height / 2;
              ctx.fillText(text, textX, textY);
              ctx.save();
            },
            datalabels: {
      display: false // Hide data labels
    },

          }],
        });
      }
    };

    onMounted(() => {
      nextTick(createChart); // Ensure the DOM is ready before rendering the chart
    });

    watch(
      () => props.data, // Watch for changes in the `data` prop
      () => {
        if (chartInstance) {
          chartInstance.destroy(); // Destroy the old chart before updating
        }
        nextTick(createChart); // Re-create the chart after data changes
      }
    );

    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy(); // Cleanup the chart instance on component unmount
      }
    });

    return {
      pieChartRef,
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

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
