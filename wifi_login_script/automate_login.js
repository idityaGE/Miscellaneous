import axios from 'axios';

const encodedParams = new URLSearchParams();
encodedParams.set('username', '9935643687');
encodedParams.set('password', '080542');
encodedParams.set('phone', '0');
encodedParams.set('type', '2');
encodedParams.set('jsonresponse', '1');
encodedParams.set('checkbox', 'check');

const options = {
  method: 'POST',
  url: 'http://122.252.242.93/userportal/newlogin.do',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    Accept: '*/*',
    'Accept-Language': 'en-US,en;q=0.9,en-IN;q=0.8',
    Connection: 'keep-alive',
    Cookie: 'JSESSIONID=C3F23561B1B1A539DBE731649A7E4574',
    Origin: 'http://122.252.242.93',
    Referer: 'http://122.252.242.93/userportal/pages/usermedia/curaj/app/campus/ui/login.html',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
    'X-Requested-With': 'XMLHttpRequest'
  },
  data: encodedParams,
};

async function makeRequest() {
  try {
    const { data } = await axios.request(options);
    console.log(data);

    // Check the response and take action based on it
    if (data.errorMessage === 'success_net' && data.errorKey === 'success') {
      console.log('Login successful!');
    } else {
      console.error('Login failed, response was:', data);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Execute the function
makeRequest();