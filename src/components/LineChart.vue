<template>
  <div>
    <div class="chart-container">
      <!-- Use the ref directive to link lineChartRef to this canvas -->
      <canvas ref="lineChartRef"></canvas>
    </div>
    <ion-row class="row-with-icon">
      <ion-col size="12">
        <span style="margin: 10px;">{{ fromdate }}</span>
        <span style="padding: 10px;">X-axis: Time, Y-axis: Fuel (ltrs)</span>
      </ion-col>
    </ion-row>
  </div>
</template>

<script>
import { onMounted, onUnmounted, watch, ref, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { IonCol, IonRow } from '@ionic/vue';

// Register necessary Chart.js components
Chart.register(...registerables);

export default {
  name: 'LineChart',
  components: {
    IonCol,
    IonRow,
  },
  props: {
    labels: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    minFuel: {
      type: String,
      required: true,
    },
    maxFuel: {
      type: String,
      required: true,
    },
    fuelUnit: {
      type: String,
      required: true,
    },
    FromDate:{
      type:String,
      required:true,
    },
  },
   setup(props) {
    const chart = ref(null);
    const lineChartRef = ref(null);
    let fromdate;

    fromdate=props.FromDate;

    const createChart = () => {
      const canvas = lineChartRef.value;
      if (!canvas) {
        console.error('Canvas element is not yet available');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }


      // Destroy the existing chart if it exists
      if (chart.value) {
        chart.value.destroy();
        console.log('Existing chart destroyed');
      }

      // Create a new chart instance
      chart.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: props.labels,
          datasets: [
            {
             // label: `Fuel Chart (${props.fuelUnit})`,
              data: props.data,
              borderColor: 'red',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              fill: true,
              pointRadius: 0,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time',
              },
             
            },
            y: {
              title: {
                display: true,
               // text: `Fuel (${props.fuelUnit})`,
              },
              beginAtZero: false,
              min: parseFloat(props.minFuel),
              max: parseFloat(props.maxFuel),
              ticks: {
              stepSize: Math.ceil(parseFloat(props.maxFuel) / 4), // Dynamic step size
            },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
            display: false, // Disable the legend
          },
         
        },
        },
      });
    };

    onMounted(() => {
      createChart();
    });

    onUnmounted(() => {
      // Destroy the chart when the component is unmounted
      if (chart.value) {
        chart.value.destroy();
      }
    });

    // Watch for changes in labels and update the chart
    watch(
      () => props.labels,
      (newLabels, oldLabels) => {
        if (chart.value && newLabels !== oldLabels) {
          chart.value.data.labels = newLabels;
          chart.value.update();
        }
      }
    );

    // Watch for changes in data and update the chart
    watch(
      () => props.data,
      (newData, oldData) => {
        if (chart.value && newData !== oldData) {
          chart.value.data.datasets[0].data = newData;
          chart.value.update();
        }
      }
    );

    return {
      lineChartRef,
      chart,fromdate,
    };
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>
