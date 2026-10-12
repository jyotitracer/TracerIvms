import { ref } from 'vue';

export const username = ref('');


export const page = ref('');

export const selectedPage = ref({
    pagename: '',
    pageid: '',
    data:''
  });

  export const isFuelEnabled=ref(0);


//  let googleMapKey = null;
export const getGoogleMapKey = ref('');


// export function setGoogleMapKey(newKey) {
//   googleMapKey = newKey;
// }

// export function getGoogleMapKey() {
//   return googleMapKey;
// }

  
