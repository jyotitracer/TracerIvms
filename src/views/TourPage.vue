<template> 
  <ion-page>
    <div v-if="!isConnected" class="network-status-bar">
      No Network Connection
    </div>
    <div v-if="isConnected && showReconnectedMessage" class="network-status-bar connected">
      Connected to Network
    </div>

    <ion-content>
      <div class="swiper-container">
        <swiper
          :modules="[Pagination]"
          :slides-per-view="1"
          :space-between="10"
          pagination
          @swiper="onSwiper"
          @slideChange="onSlideChange"
          ref="swiperRef"
        >
          <!-- Dynamically generate Swiper slides based on fetched data -->
          <swiper-slide v-for="(slide, index) in slides" :key="index">
            <div class="slide-content">
              <img
                class="slide-image"
                :src="slide.imagelink"
                :alt="slide.headername"
              />
              <h2 class="slide-title">{{ slide.headername }}</h2>
              <p class="slide-description">{{ slide.description }}</p>
            </div>
          </swiper-slide>
        </swiper>

        <!-- Navigation and Pagination Container -->
        <div class="navigation-container">
          <ion-button
            v-if="!isLastSlide"
            class="custom-skip"
            @click="skip"
            fill="clear"
          >
            Skip
          </ion-button>
          <div class="pagination-container"></div>
          <ion-button
            class="custom-next"
            @click="next"
            fill="clear"
          >
            {{ nextButtonText }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IonButton, IonContent, IonPage, loadingController } from '@ionic/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import Constants from "@/common/constants";
import { fetchData } from "@/services/ApiService";
import { Network } from '@capacitor/network';
import useNetwork from '@/services/networkService'; // Import the network service
import { showToast ,showToastMessage} from '@/services/toast'; // Import the toast utility function


const { isConnected, showReconnectedMessage, initNetworkListener } = useNetwork(); // Use network service

// Reactive ref to store slides data
const slides = ref([]);
const swiperRef = ref(null);
const swiperInstance = ref(null);

const router = useRouter();
const route = useRoute();

const currentIndex = ref(0); // Track the current slide index
const pageid = route.params.pageid;

console.log("displayPage", pageid);

// Fetch slides data from API or hardcoded response
const fetchSlidesData = async () => {

  // const response = [
  //   {
  //     srno: '1',
  //     page_id: '2',
  //     headername: 'Welcome to Our App!',
  //     imagelink: 'https://via.placeholder.com/800x400',
  //     description: 'Discover amazing features with our app...',
  //   },
  //   {
  //     srno: '2',
  //     page_id: '2',
  //     headername: 'Welcome to Our App!',
  //     imagelink: 'https://via.placeholder.com/800x400',
  //     description: 'Discover amazing features with our app...',
  //   },
  //   {
  //     srno: '3',
  //     page_id: '2',
  //     headername: 'Welcome to Our App!',
  //     imagelink: 'https://via.placeholder.com/800x400',
  //     description: 'Discover amazing features with our app...',
  //   },
  // ];
  // slides.value = response;

  loadingController.create({ message: 'Loading...' })
        .then((loading) => {
          loading.present(); // Show loading spinner

          const params = {
            page_id: pageid,
          };

          fetchData(Constants.CONT.Mobile_Contro, Constants.CMD.Req_Take_Tour, params)
            .then((response) => {
              if (response.status === 200) {

                slides.value= response.data.map(item => ({
                ...item,  // Spread the original properties
              }));
                  
              } else if (response.status === 401) {
                showToastMessage( response.data.message);
              }
            })
            .catch((error) => {
              console.error('Error fetching vehicle status color:', error);
            })
            .finally(() => {
              loading.dismiss();
            });
        })
        .catch((error) => {
          console.error('Error creating loading spinner:', error);
        });
  
  
};

// Ensure Swiper instance is available when needed
onMounted(async () => {

  if (swiperRef.value && swiperRef.value.swiper) {
    swiperInstance.value = swiperRef.value.swiper;
  }
  
  return Network.getStatus().then((status) => {
                    if (status.connected) {
                      fetchSlidesData();
                    } else {
                      showToast();
                    }
                  });

  initNetworkListener();

});

// Reactively update swiperInstance when Swiper instance is created
watch(
  () => swiperRef.value?.swiper,
  (newSwiper) => {
    swiperInstance.value = newSwiper;
  },
  { immediate: true }
);

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
};

// Update the current slide index on slide change
const onSlideChange = () => {
  currentIndex.value = swiperInstance.value?.realIndex || 0;
};

// Compute if the current slide is the last one
const isLastSlide = computed(() => currentIndex.value === slides.value.length - 1);

// Compute the button text based on the current slide
const nextButtonText = computed(() => (isLastSlide.value ? 'Got It' : 'Next'));

// Navigate to menu or slide to next
const skip = () => {
  router.replace({ path: "/Menu" });
};

const next = () => {
  if (swiperInstance.value) {
    const isLastSlide = swiperInstance.value.realIndex === slides.value.length - 1;
    if (isLastSlide) {
      router.replace({ path: "/Menu" });
    } else {
      swiperInstance.value.slideNext();
    }
  }
};

</script>

<style scoped>
.swiper-container {
  position: relative;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: blue;
  color: #fff;
}

.slide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: 20px;
}

.slide-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.slide-image {
  width: 100%;
  max-width: 800px;
  height: 300px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.slide-description {
  font-size: 16px;
  color: #fff;
}

.navigation-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  position: absolute;
  bottom: 10px;
  z-index: 10;
}

.custom-skip,
.custom-next {
  padding: 10px 20px;
  color: #fff;
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
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
