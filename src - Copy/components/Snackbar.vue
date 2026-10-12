<!-- src/components/Snackbar.vue -->
<template>
  <!-- IonToast component to display a toast message -->
  <ion-toast 
    :message="message" 
    :is-open="show" 
    @didDismiss="dismissToast">
  </ion-toast>
</template>

<script>
import { ref } from 'vue'; // Import ref for reactive state management
import { IonToast } from '@ionic/vue'; // Import IonToast from Ionic framework

export default {
  components: {
    IonToast, // Register the IonToast component
  },
  setup() {
    // Reactive references for toast message and visibility
    const message = ref(''); // Holds the toast message
    const show = ref(false); // Controls the visibility of the toast

    // Function to show the toast with a given message
    const showToast = (msg) => {
      message.value = msg;
      show.value = true;
    };

    // Function to dismiss the toast
    const dismissToast = () => {
      show.value = false;
    };

    return {
      message, // Bind message to template
      show, // Bind show to template
      showToast, // Expose showToast function
      dismissToast, // Expose dismissToast function
    };
  },
};
</script>
