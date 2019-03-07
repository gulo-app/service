//ramiLevy
const request   =   require('request');
const cheerio   =   require('cheerio');
const fs        =   require('fs');
const ROOT_URL  = `https://m.rami-levy.co.il`;
var products = [];
var menuIndex = 1;

const fetch = async (url) => {
  return new Promise((resolve, reject) => {
    request(url, function(err, resp, body){
        if(err) return reject(err);
        return resolve(body);
    });
  })
}
const getRootMenu = async() => {
  const rootPage = `${ROOT_URL}/default.asp?catid=%7B3E31AB88-2BB0-11D7-92D3-0080AD76B634%7D`;
  let rootHTML = await fetch(rootPage);
  const $ = await cheerio.load(rootHTML);
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


const scanProduct = async (productURL) => {
  let pageHTML  = await fetch(productURL);
  let $         = await cheerio.load(pageHTML);
  let barcode, product_name, brand_name, capacity, capacity_units_name;
  let product = {};

  $('.product_details').filter((i, wrapper) => {
    product_name  =   $(wrapper).find('h1').text();
    $(wrapper).find('.PropValueName').each((i, propObj) => {
      let propName  =   $(propObj).text();
      switch(propName){
        case "שם מותג:" :
          brand_name = $(propObj).next('.PropValue').text();
          break;
        case "תכולה:" :
          capacity = Number($(propObj).next('.PropValue').text());
          break;
        case "מידת תכולה:" :
          capacity_units_name = $(propObj).next('.PropValue').text();
          capacity_units_name = capacity_units_name.replace(/['"]/g,'');
          break;
      }
    });
    let prod_img    =   $(wrapper).find('img[id*="prod-pic"]').attr("src");
    if(prod_img.includes('no_image'))
      return false;

    barcode         =   prod_img.substr(prod_img.lastIndexOf('/')+1, prod_img.lastIndexOf('.')-prod_img.lastIndexOf('/')-1);
    product = {barcode, product_name, brand_name, capacity, capacity_units_name, menuIndex};
  });
  return product;
}

const scanMenuLinkProducts = async (linkURL) => {
  console.log(`\n------------- ${linkURL} --------------- \n`);
  let pageHTML = await fetch(linkURL);
  const $ = await cheerio.load(pageHTML);
  let productsLinks = [];
  $('h2.prodName').each((i, h2) => {
    let prodHref = ROOT_URL + '/' + $(h2).parent().attr('href');
    productsLinks.push(prodHref);
  });
  let counter = 1;
  for(const prodLink of productsLinks){
    try{
      let product = await scanProduct(prodLink);
      if(Object.keys(product).length === 0 || product.barcode===null || product.barcode===''){
        process.stdout.write(`x${counter++}x `);
        continue; //scanProdct returned empty object
      }

      products.push(product);
      process.stdout.write(`${counter++} `);
    }catch(e){
      console.log(e);
      continue;
    }
  }
  process.stdout.write('\n');
  return true;
}

const saveProductsToFile = async () => {
  console.log("try to save products.json");
  try{
    fs.writeFileSync(`${__dirname}/output/products.json`, JSON.stringify(products) , 'utf-8');
    console.log("products.json saved successfully");
    return true;
  } catch(e){
    console.log(e);
    return false;
  }
}

const ramiLevyCrawler = async () => {
  let menu = await getRootMenu();

  for(let subject of menu){
    console.log(`scan subject ${menuIndex}:`)
    if(menuIndex>0){
      for(let link of subject.links){
        try{
          await scanMenuLinkProducts(ROOT_URL + link);
        }catch(e){
          console.log(e);
        }
      }
    }
    menuIndex++;
  }

  await saveProductsToFile();
  console.log("finish");
  return true;
}

//ramiLevyCrawler();
module.exports = ramiLevyCrawler;
