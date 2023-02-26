const fs = require('fs');
const puppeteer = require('puppeteer');

async function runPuppeteer() {
  /* 1. Launch a browser, 2. declare page var, 3. add URL to go to */
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.vacle.org/');

  /* Create a screenshot */
  // await page.screenshot({ path: 'kwd.png', fullPage: true });

  /* Create a PDF of the page */
  // await page.pdf({ path: 'kwd.pdf', format: 'A4' });

  /* Get the entire HTML page content */
  const html = await page.content();

  /* Target specific elements */
  const title = await page.evaluate(() => document.title);

  /* Get all the text */
  const text = await page.evaluate(() => document.body.innerText);
  // const text = await page.evaluate(() => document.body.textContent);

  /* Get all the links */
  const links = await page.evaluate(() => Array.from(document.querySelectorAll('a'), (item) => item.href));

  /* Get all his courses */
  const courses = await page.evaluate(() => Array.from(document.querySelectorAll('#courses .card'), (item) => ({
    title: item.querySelector('.card-body h3').innerText,
    level: item.querySelector('.card-body .level').innerText,
    url: item.querySelector('.card-footer a').href,
    promo: item.querySelector('.card-footer .promo-code .promo').innerText
  })));

  /* Alternate for above using $eval() */
  // const courses2 = await page.$$eval('#courses .card', (items) =>
  //   items.map((item) => ({
  //     title: item.querySelector('.card-body h3').innerText,
  //     level: item.querySelector('.card-body .level').innerText,
  //     url: item.querySelector('.card-footer a').href,
  //     promo: item.querySelector('.card-footer .promo-code .promo').innerText,
  //   }))
  // );

  // console.log(courses);

  /* Write data to a JSON file */
  // fs.writeFile('courses.json', JSON.stringify(courses2), (err) => {
  //   if (err) throw err;
  //   console.log('File saved');
  // });

  // fs.writeFile('innerText.md', JSON.stringify(text), (err) => {
  //   if (err) throw err;
  //   console.log('File saved');
  // });

  // fs.writeFile('html.md', JSON.stringify(html), (err) => {
  //   if (err) throw err;
  //   console.log('File saved');
  // });

  await browser.close();
}

runPuppeteer();