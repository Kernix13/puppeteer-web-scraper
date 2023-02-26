# Web Scraping With Puppeteer

From video by Brad Traversy [Intro To Web Scraping With Puppeteer](https://youtu.be/S67gyqnYHmI), his [GitHub repo](https://github.com/bradtraversy/courses-scrape), and [Puppeteer Getting Started docs](https://pptr.dev/#getting-started).

Puppeteer Methods:

- `launch()`, `newPage()`, `goto()`, `screenshot()`, `pdf()`, `content()`, `evaluate()`, `$$eval()`, `type()`, `close()`, `waitForSelector()`, `click()`

## Install and Setup

- Run `npm init -y` then `npm i puppeteer`
- Create the entry-point file `index.js` or any name you like
- Edit the script in `package.json`: `"start": "node index"`
- Then run `npm start` to run `index.js`
- `require` puppeteer in `index.js`
- All the methods shown are asynchronous so create an `async` Function

Steps:

1. Open the browser using the method `launch()`
1. Use the method `newPage()` to create a new Page object
1. Then use the `goto()` method to go to a specific page: `await page.goto('URL');`
1. At the bottom of the Fx remember to close the browser with the method `close()`

### Simple Examples

**SCREENSHOT**:

- Use the method `screenshot()` - you need to pass in an object with a key of `path` which is the folder directory and filename - then run `npm start`
- That will set the image to a specific size which is not the whole page - to get the whole page, add another property to the object of `fullPage` set to `true`

**PDF**:

- Similar to above but 1) change the file extension from `.png` to `.pdf` and replace `fullPage` with `format` and select the size for the pages, e.g. `'A4'`
- **NOTE**: Cookies notice at the bottom of every page, some styles are there, others are not like background image, and it's mobile view - COOL!

```js
/* Create a screenshot */
await page.screenshot({ path: 'kwd.png', fullPage: true });

/* Create a PDF of the page */
await page.pdf({ path: 'kwd.pdf', format: 'A4' });
```

## Targeting the content

- Grab all the HTML using the `content()` method
- To target specific elements use the `evaluate()` method which is a high order Fx so pass it a CB Fx to get access to the `document` object
- For all the links on a page, you need to use `querySelectorAll` which returns a _nodelist_ which is like an array in that it is iterable, but it does not have array methods
- So wrap it in `Array.from()` method - `Array.from()` takes in a 2nd param which is a Fx

```js
/* Get the entire HTML page content */
const html = await page.content();

/* Target specific elements */
const title = await page.evaluate(() => document.title);

/* Get all the text */
const text = await page.evaluate(() => document.body.innerText);

/* Get all the links */
const links = await page.evaluate(() =>
  Array.from(document.querySelectorAll('a'), item => item.href)
);
```

- To get deepely nested content you need to be more specific - for `querySelectorAll` you need to look at the structure of the website in order to scrape it - we need to know what to put in the selector and return an obj
- For the object he used parens `()` around it or else it would be interpreted as a code block

> ABSOLUTELY CRUCIAL TO REMEMBER USING `({})` FOR THE `Array.from` CALLBACK

Alternate syntax for above without using `Array.from()`:

- Use the `$$eval()` and add the IDs/classes inside it - so that insteead of Array.from() and querySelectorAll() - and it takes a 2nd param, a cb Fx - then use `.map()` - parens around the curly braces in map to return an object

```js
/* Get all his courses */
const courses = await page.evaluate(() =>
  Array.from(document.querySelectorAll('#courses .card'), item => ({
    title: item.querySelector('.card-body h3').innerText,
    level: item.querySelector('.card-body .level').innerText,
    url: item.querySelector('.card-footer a').href,
    promo: item.querySelector('.card-footer .promo-code .promo').innerText,
  }))
);

/* Alternate for above using $eval() */
const courses2 = await page.$$eval('#courses .card', items =>
  items.map(item => ({
    title: item.querySelector('.card-body h3').innerText,
    level: item.querySelector('.card-body .level').innerText,
    url: item.querySelector('.card-footer a').href,
    promo: item.querySelector('.card-footer .promo-code .promo').innerText,
  }))
);
```

### File System

- Install the `fs` file-system `Node.js` package to write the values to a file

```js
const fs = require('fs');

/* Write data to a JSON file */
fs.writeFile('courses.json', JSON.stringify(courses2), err => {
  if (err) throw err;
  console.log('File saved');
});
```

## innerText vs textContent

- `textContent` gets the content of all elements, including `<script>` and `<style>` elements. In contrast, `innerText` only shows "human-readable" elements
- `textContent` returns every element in the node. In contrast, `innerText` is aware of styling and won't return the text of "hidden" elements
- `innerText` triggers a reflow to ensure up-to-date computed styles. Reflows can be computationally expensive, and thus should be avoided when possible
- Both `textContent` and `innerText` remove child nodes when altered

`page.content()` gets all the source code - would getting `innerHTML` for the `body` tag be better?
