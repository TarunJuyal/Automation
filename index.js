const puppeteer = require('puppeteer');
require("dotenv").config();

const toSearch=process.argv.slice(2).join(" ");

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://www.imdb.com/',{waitUntil:'networkidle2'});

  await page.waitForSelector(".kPnwgD a",{visible:true});
  await page.click(".kPnwgD a",{delay:100});

  await Promise.all([
      await page.waitForNavigation({waitUntil:"networkidle2"}),
      await page.click(".auth-sprite.imdb-logo",{delay:100}),
  ]);

  await page.waitForSelector("input[type='email']",{visible:true});
  await page.type("input[type='email']",process.env.email,{delay:100});
  await page.waitForSelector("input[type='password']",{visible:true});
  await page.type("input[type='password']",process.env.password,{delay:100});
  await page.waitForSelector("input[type='submit']",{visible:true});
  await page.click("input[type='submit']",{delay:100});

  await page.waitForSelector("input[name='q']",{visible:true})
  await page.type("input[name='q']",toSearch,{delay:100});

  await page.waitForSelector("button[id='suggestion-search-button']",{visible:true});
  await page.type("button[id='suggestion-search-button']",toSearch,{delay:100});

  await page.waitForSelector("tr[class='findResult odd']:first-child",{visible:true});
  await page.click("tr[class='findResult odd']:first-child td[class='result_text'] a",{delay:100});

  await page.waitForSelector("div[class='titleBar']",{visible:true});
  let data = await page.evaluate(()=>{

    let title=document.querySelector("div[class='title_wrapper'] > h1").innerText;
    let rating=document.querySelector("span[itemprop='ratingValue']").innerText;
    let ratingCount=document.querySelector("span[itemprop='ratingCount']").innerText;
    let releaseDate=document.querySelector("a[title='See more release dates']").innerText;
    let time=document.querySelector("time").innerText;

    return{
      title,
      rating,
      ratingCount,
      time,
      releaseDate
    }
  });

  console.log(data);

  await browser.close();
  
})();