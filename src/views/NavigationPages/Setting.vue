
<!-- This Page is menu Setting Page. -->

<template>
  
    <ion-content>
      <ion-list>
        <ion-item  @click="navigateTo('1')">
          <ion-label>Vehicle Status Color</ion-label>
          <ion-icon slot="end" :icon="chevronForwardOutline" style="color: blue;"></ion-icon>
        </ion-item>
        <ion-item  @click="navigateTo('2')">
          <ion-label>Event Notification</ion-label>
          <ion-icon slot="end" :icon="chevronForwardOutline" style="color: blue;"></ion-icon>
        </ion-item>
        <ion-item  @click="navigateTo('3')">
          <ion-label>Select Homescreen</ion-label>
          <ion-icon slot="end" :icon="chevronForwardOutline" style="color: blue;"></ion-icon>
        </ion-item>
        <ion-item  @click="navigateTo('4')">
          <ion-label>About</ion-label>
          <ion-icon slot="end" :icon="chevronForwardOutline" style="color: blue;"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, useBackButton } from '@ionic/vue';
import { chevronForwardOutline } from 'ionicons/icons';
import router from '@/router/index'; // Assuming your router file is named router.js
import { onMounted } from 'vue';
import {  selectedPage } from '@/services/userstate'; // Import the global state


export default {
  name: 'SettingsPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    chevronForwardOutline
  },
  setup() {
    const navigateTo = (pageName) => {
    // Navigate to the selected page
    console.log("Navigating to", pageName);
    if(pageName==='1')
    {
      router.push('/vehstatus');
    }else if(pageName==='2')
    {
      router.push('/eventnoti');

    }else  if(pageName==='3')
    {
      router.push('/sethome');

    }else if(pageName==='4')
    {
      router.push('/about');

    }
    // Use router navigation here to navigate to the page
  };

  onMounted(()=>{
    useBackButton(9999, async () => {
           const title='';
            const pageid='';
            const path='';
            selectedPage.value = { title, pageid,path }; // Update the shared state

            router.replace('/today');
            });
  });

    return {
      chevronForwardOutline,
      navigateTo

    };
  }
};
</script>

<style scoped>


ion-icon {
  color: var(--ion-color-medium);
}
</style>

