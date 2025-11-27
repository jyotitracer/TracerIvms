<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="#" @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Set Layer</ion-title>
      </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">

    <!-- Radio Buttons for Map Types -->
    <div class="radio-group">
      <label>
        <input type="radio" value="roadmap" v-model="selectedMapType" />
        NORMAL
      </label>
      <label>
        <input type="radio" value="satellite" v-model="selectedMapType" />
        SATELLITE
      </label>
      <label>
        <input type="radio" value="hybrid" v-model="selectedMapType" />
        HYBRID
      </label>
      <label>
        <input type="radio" value="terrain" v-model="selectedMapType" />
        TERRAIN
      </label>
    </div>

   
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
    import { IonButtons,IonBackButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
    import { defineComponent, onMounted } from 'vue';
    import { ref ,watch} from "vue";
    import storage from "@/services/storagefile";


    export default defineComponent({
      components: {
        IonContent,
        IonHeader,
        IonPage,
        IonTitle,
        IonToolbar,
        IonButtons,
        IonBackButton
      },
       setup(){
        const selectedMapType = ref('roadmap');


              // Watch for changes in selectedMapType and save it to localStorage
              watch(selectedMapType, async (newType) => {
                await storage.set('mapType', newType);
              });

            

                  onMounted(async () => {
                            selectedMapType.value=await storage.get('mapType') ;

                  });


              return {
                selectedMapType,
              };
      },
      methods:
      {
                async goBack()
                {
                       // Navigate back to the previous page
                    this.$router.back();
                }
      },
    });
  </script>


<style scoped>
/* Container for the radio group */
.radio-group {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
}

/* Label styling */
label {
  margin-bottom: 10px;
  font-size: 16px;
}

/* Optional: Customize radio button appearance */
input[type="radio"] {
  margin-right: 10px;
}

.selected-type {
  margin-top: 20px;
  font-weight: bold;
  font-size: 18px;
}
</style>