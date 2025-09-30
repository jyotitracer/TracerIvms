<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Event Notification</ion-title>
      </ion-toolbar>
    </ion-header>


    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>   


    <ion-content>
      <div class="search-toggle-container">
        <ion-searchbar 
          v-model="searchQuery" 
          placeholder="Search Events"
        ></ion-searchbar>
        <ion-toggle 
          @ionChange="toggleAllItems" 
          :checked="allToggled"
        ></ion-toggle>
      </div>

      <ion-list>
        <ion-item 
          v-for="(page, index) in filteredItems" 
          :key="index"
        >
          <ion-toggle 
            justify="space-between" 
            v-model="page.checked" 
            @ionChange="updateToggleStatus(page)"
          >
            {{ page.eventname }}
          </ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import useNetwork from '@/services/networkService'; // Import the network service

import { defineComponent, onMounted, ref, computed } from 'vue';
import { 
  IonButtons, 
  IonBackButton, 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonItem, 
  IonList, 
  IonToggle, 
  IonSearchbar, 
  loadingController 
} from '@ionic/vue';
import { fetchData } from "@/services/ApiService";
import storage from "@/services/storagefile";
import Constants from "@/common/constants";
import { Network } from '@capacitor/network';
import { showToast } from '@/services/toast'; // Import the toast utility function

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonItem,
    IonList,
    IonToggle,
    IonSearchbar,
    loadingController
  },

  setup() {
    const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

    const selectedItems = ref([]);
    const searchQuery = ref('');
    const allToggled = ref(false);

    // Function to call API and fetch event data
    const CallAPIForData = () => {
  loadingController.create({
    message: "Loading...",
    backdropDismiss: true // Makes the loading controller cancelable

  }).then(loading => {
    loading.present();

    const params = { action: "0" };

    // Make the API call using fetchData
    fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Event_List, params)
      .then((response) => {
        const responsejson = response.data;

        if (response.status === 200) {
          const arrData = responsejson.arr_data;

          if (arrData && arrData.length > 0) {
            return storage.get('eventItems')
              .then((storedItems) => {
                // Check if the count matches
                if (storedItems && storedItems.length === arrData.length) {
                  selectedItems.value = storedItems;
                } else {
                  selectedItems.value = arrData.map(data => ({
                    eventid: data.event_id,
                    eventname: data.event_name,
                    checked: data.status===1,
                  }));

                  // Save the new data to storage
                  return storage.set('eventItems', selectedItems.value);
                }
              })
              .then(() => {
                checkAllToggled();  // Call the checkAllToggled function after data is loaded
              });
          }
        } else if (response.status === 401) {
          console.error("Unauthorized:", responsejson.message);
        } else {
          console.error("Empty response data");
        }
      })
      .catch((error) => {
        console.error("Error:", error);  // Handle any errors during API call or storage operations
      })
      .finally(() => {
        loading.dismiss();  // Dismiss the loading spinner once the operation completes
      });

  }).catch((error) => {
    console.error("Error creating loading controller:", error);
  });
};



    // Filtered items based on search query
    const filteredItems = computed(() =>
      selectedItems.value.filter(item => 
        item.eventname.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    // Update the toggle status of an item
    const updateToggleStatus = async (page) => {
      const index = selectedItems.value.findIndex(item => item.eventid === page.eventid);
      if (index !== -1) {
        selectedItems.value[index].checked = page.checked;
        await storage.set('eventItems', selectedItems.value);
        checkAllToggled();
      }
    };

    // Check if all items are toggled
    const checkAllToggled = () => {
      allToggled.value = selectedItems.value.every(item => item.checked);
    };

    // On mounted, check network status and fetch data
    onMounted(async () => {
      initNetworkListener();

      const status = await Network.getStatus();
      if (status.connected) {
        const storedItems = await storage.get('eventItems');

        // Check if the count matches
        if (storedItems) {
          selectedItems.value = storedItems;
        }
        CallAPIForData();
      } else {
        showToast();
      }
    });

    return {
      selectedItems,
      searchQuery,
      allToggled,
      filteredItems,
      updateToggleStatus,
      isConnected, showReconnectedMessage, initNetworkListener

    }
  },

  methods: {
    async toggleAllItems(event) {
      const isChecked = event.detail.checked;
      this.allToggled = isChecked;
      this.selectedItems.forEach(item => {
        item.checked = isChecked;
      });
      await storage.set('eventItems', this.selectedItems);
    },

    goBack() {
      this.$router.back();
    }
  }
});
</script>

<style scoped>
.search-toggle-container {
  display: flex;
  align-items: center;
}

ion-searchbar {
  flex: 1;
}

ion-item {
  margin-left: 6px;
}

.network-status-bar {
  background-color: red;
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 14px;
}


.network-status-bar.connected {
  background-color: green;
}

</style>
