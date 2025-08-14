import axios from "axios";

export const phonePeAuthorizations = async () => {
  const requestHeaders = {
    "Content-Type": "application/x-www-form-urlencoded"
  };

  const requestBodyJson = {
    "client_version": "1",
    "grant_type": "client_credentials",
    "client_id": `${process.env.PHONEPE_CLIENT_ID}`,
    "client_secret": `${process.env.PHONEPE_CLIENT_SECRET}`
  };

  const requestBody = new URLSearchParams(requestBodyJson).toString();

  const options = {
    method: 'POST',
    url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
    headers: requestHeaders,
    data: requestBody
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
