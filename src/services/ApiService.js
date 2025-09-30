
import axios from 'axios';
import storage from '@/services/storagefile';
import Constants from '@/common/constants';
import { ref } from 'vue';
import { showToast,showToastMessage } from '@/services/toast'; 


const results = [];
let globalToken = ''; // Define a global variable for the token
let Domain_Name='';

// Function to initialize the token with a promise
const initializeToken = () => {
  return storage.get('login_data')
    .then(data => {
      if (data !== null) {
        globalToken = data.token; // Update the global token variable
      }
    })
    .catch(error => {
      console.error('Error initializing token:', error);
      throw error;
    });
};

 const RetriveDomainName = () => {

  return storage.get('Domain_Name')
    .then(data => {
      if (data !== null) {
        Domain_Name = Constants.Url_Prefix+data+Constants.Url_Postfix; 
      }
    })
    .catch(error => {
      console.error('Error initializing token:', error);
      throw error;
    });
    
};
const ReqGetDoaminName = (postData) => {

  console.log(" request_API", Constants.First_API_URL+"\n"+ JSON.stringify(postData));
  
  return axios.post(Constants.First_API_URL, postData)
  .then(response => {
    if (response.status === 200) {
      console.log("response",response.data);
      return response;
  
    } else if (response.status === 204) {
      showToastMessage("Data Not Available");
      return response;

    }else {
      const message = response.data?.message || `Unexpected status code: ${response.status}`;
      showToastMessage(message);
      return response;
    }
  })
  .catch(error => {
    const message = error.response ? error.response.data.message : error.message;
    showToastMessage(message);
    console.error('Error fetching data:', error.response?.status + " " + error);
    throw error; // Rethrow the error to propagate it if needed
  });
};
// Login API using promises
const ReqLogin_withoutTok = (postData, controller, command) => {

    return RetriveDomainName()
    .then(() => {
        console.log(command + " request_API", Domain_Name + controller + "/" + command + JSON.stringify(postData));

       return axios.post(Domain_Name + controller + "/" + command, postData)
    })
  .then(response => {
    if (response.status === 200) {
      console.log("response", command + " " + response.data);
      return response;
    } else if (response.status === 204) {
      showToastMessage("Data Not Available");
      return response;

    }else {
      const message = response.data?.message || `Unexpected status code: ${response.status}`;
      showToastMessage(message);
      return response;
    }
  })
  .catch(error => {
    const message = error.response ? error.response.data.message : error.message;
    showToastMessage(message);
    console.error('Error fetching data:', error.response?.status + " " + error);
    throw error; // Rethrow the error to propagate it if needed
  });
};

const getPlaceApi = (query, googleApiKey) => {
  return axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${googleApiKey}`)
    .then(response => {
      console.log("Place Reponse", response.data);
      return response.data; // Return response.data for easier access
    })
    .catch(error => {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
      const message=error.response ? error.response.data.message : error.message;
      showToastMessage(message);

      throw error;
    });
};


// Function to fetch data from the API using promises
const fetchData = (controller, command, params) => {
  return initializeToken()
    .then(() => {
            console.log("tokenbyme",globalToken);
     return  RetriveDomainName()
     .then(() => {
      console.log(command + " request_API", Domain_Name + controller + "/" + command + JSON.stringify(params));
      
      return axios.post(Domain_Name + controller + "/" + command, params, {
        headers: {
          'Authorization': `Bearer ${globalToken}`, // Use the global token variable
        }
         });
      });
    })
    .then(response => {
      if (response.status === 200) {
        console.log("response", command + " " + response.data);
        return response;
      } else if (response.status === 204) {
        
        showToastMessage("Data Not Available");
        return response;

      }else {
        const message = response.data?.message || `Unexpected status code: ${response.status}`;
        showToastMessage(message);

        return response;
      }
    })
    .catch(error => {
      const message = error.response ? error.response.data.message : error.message;
      showToastMessage(message);
      console.error('Error fetching data:', error.response?.status + " " + error);
      throw error; // Rethrow the error to propagate it if needed
    });
};



export {Domain_Name, ReqGetDoaminName, ReqLogin_withoutTok, fetchData,getPlaceApi };
