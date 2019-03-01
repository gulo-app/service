//ramiLevy
const request   =   require('request');
const cheerio   =   require('cheerio');

const fetch = async (url) => {
  return new Promise((resolve, reject) => {
    request(url, function(err, resp, body){
        if(err) return reject(err);
        return resolve(body);
    });
  })
}
const getRootMenu = async() => {
  const rootURL  = `https://m.rami-levy.co.il`;
  const rootPage = `${rootURL}/default.asp?catid=%7B3E31AB88-2BB0-11D7-92D3-0080AD76B634%7D`;
  let rootHTML = await fetch(rootPage);
  const $ = cheerio.load(rootHTML);
  let menu = [];
  $('ul.product_menu').find('li.level1').each((i, rootLI) => {
    let title = $(rootLI).children().first().text();
    let links = [];
    $(rootLI).find('a[href*="catid"]').each((i, link) => {
      links.push($(link).attr('href'));
    })
    menu.push({title, links});
  });
  return menu;
}

const ramiLevyCrawler = async () => {
  let menu = await getRootMenu();
  return menu;
}

ramiLevyCrawler();
module.exports = ramiLevyCrawler;
