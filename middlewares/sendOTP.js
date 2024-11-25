const axios = require('axios');


exports.sendOTP = async (phoneNumber, testMessage) => {
  try {
    const apiUrl = 'http://125.16.147.178/VoicenSMS/webresources/CreateSMSCampaignGet';

    const params = {
      ukey: 'jdNDcyZKb1sfIkOeGCPO2V6qD',  
      msisdn: phoneNumber,              
      language: 0,                       
      credittype: 2,                  
      senderid: 'GOMRKT',                
      templateid: 0,                     
      message: `Your OTP is ${testMessage} Team Go2Market`,  
      filetype: 2                        
    };

    const response = await axios.get(apiUrl, { params });
    

    console.log('Response from SMS API:', response.data);

  } catch (error) {
    
    console.error('Error occurred while sending SMS:', error.response ? error.response.data : error.message);
  }
};


