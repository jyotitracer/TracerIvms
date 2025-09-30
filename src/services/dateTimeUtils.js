// src/utils/dateTimeUtils.js

export const checkTimeDifference = (providedDate) => {

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
  
      return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    };
  
    // Get current date and time
    const currentDateTime = new Date();
    const formattedCurrentDateTime = formatDate(currentDateTime);
  
    // Define specific date and time
    const specificDateTime = new Date(providedDate);
    const formattedSpecificDateTime = formatDate(specificDateTime);
  
    // Convert formatted strings back to Date objects
    const current = new Date(formattedCurrentDateTime);
    const specific = new Date(formattedSpecificDateTime);

  
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = current - specific;
  
    // Convert milliseconds to minutes
    const differenceInMinutes = Math.floor(
      differenceInMilliseconds / (1000 * 60)
    );
  
    // Check if the difference is more than or less than 15 minutes
    let message;
    let ismindoneornot=false;
    if (differenceInMinutes > 15) {
      message = `Difference is more than 15 minutes: ${differenceInMinutes} minutes.`;
      ismindoneornot=true;
    } else if (differenceInMinutes < -15) {
      message = `Difference is less than 15 minutes: ${Math.abs(
        differenceInMinutes
      )} minutes ago.`;
      ismindoneornot=false;
    } else {
      message = `Difference is within 15 minutes: ${differenceInMinutes} minutes.`;
      ismindoneornot=false;
    }
    console.log("message",message);

    return ismindoneornot;
  };


  export const fetchCurrentDate = () => {
     // Get current date and time
     const currentDateTime = new Date();
     const formattedCurrentDateTime = formatDate(currentDateTime);
   
  }