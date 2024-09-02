const puppeteer = require('puppeteer');

(async () => {
  const mobileNumber = '9935643687';
  const password = '080542';

  const browser = await puppeteer.launch({ headless: false }); // Set headless: false to see the browser actions
  const page = await browser.newPage();

  try {
    await page.goto('http://122.252.242.93/userportal/pages/usermedia/curaj/app/campus/ui/index.html', { waitUntil: 'networkidle2' });

    await page.waitForSelector('a');
    await page.evaluate(() => {
      const campusLoginButton = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === 'Campus User Login');
      if (campusLoginButton) {
        campusLoginButton.click();
      }
    });

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    await page.evaluate(() => {
      const existingUserLoginButton = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === 'Existing User Login');
      if (existingUserLoginButton) {
        existingUserLoginButton.click();
      }
    });

    await page.waitForSelector('input[placeholder="Enter your mobile number"]');

    await page.type('input[placeholder="Enter your mobile number"]', mobileNumber);
    await page.type('input[placeholder="Enter your password"]', password);

    await page.evaluate(() => {
      const submitInput = document.querySelector('input[type="submit"][value="Continue"]');
      if (submitInput) {
        submitInput.click();
      }
    });

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    console.log('Successfully logged in!');

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
})();
