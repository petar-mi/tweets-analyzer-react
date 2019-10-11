const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless:false });

    const page = await browser.newPage();
    await page.goto('https://twitter.com/nitropolit');

    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await page.waitFor(2000);
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await page.waitFor(2000);
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    //await page.goto('https://twitter.com/login');
    //await page.waitForSelector('.category', { timeout: 1000 });

    // await page.$eval('.js-username-field.email-input.js-initial-focus', e => { 
    //   console.log(e);
    //   return e.value = "dragor67361551"})
    // await page.$eval('.js-password-field', e => e.value = "snjufk1l128")
    // await page.click('.submit.EdgeButton.EdgeButton--primary.EdgeButtom--medium')

    // wait till page load
    //await page.waitForNavigation()

    const body = await page.evaluate(() => {
      return document.querySelector('body').innerHTML;
    });
    //console.log(body);

    //await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
