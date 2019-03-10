const request     =   require('request');
const cheerio     =   require('cheerio');
const fs          =   require('fs');
const path        =   require('path');
const ROOT_URL    =   `https://m.rami-levy.co.il`;
const TMP_FILE    =   {filename: 'tmp_products.json', get path(){return path.join(__dirname, './output', this.filename)}};
const OUTPUT      =   {filename: 'output.json', get path(){return path.join(__dirname, '../output', this.filename)}};
var   menuIndex   =   1;

const fetch = async (url) => {
  return new Promise((resolve, reject) => {
    request(url, function(err, resp, body){
        if(err) return reject(err);
        return resolve(body);
    });
  })
}
const initializeTmpFile = async () => {
  try{
    fs.writeFileSync(TMP_FILE.path, '', 'utf-8');
    console.log(`\n *** ${TMP_FILE.filename} initialized *** \n`);
  } catch(e){
    return false;
  }
}
const appendProductsToFile =  async (products) =>{
  try{
    let file_products =  fs.readFileSync(TMP_FILE.path, 'utf-8');
    file_products = !file_products ? [] : JSON.parse(file_products);

    file_products = file_products.concat(products);
    fs.writeFileSync(TMP_FILE.path, JSON.stringify(file_products), 'utf-8');
  } catch(e){
    console.log(e);
  }
}
const copyOutput = async () =>{
  try{
    fs.copyFile(TMP_FILE.path, OUTPUT.path, (err) => {
      if (err) throw err;
      console.log(`${TMP_FILE.filename} was copied to ${OUTPUT.path}`);
    });
  } catch(e){
    console.log(e);
  }
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
  let barcode, product_name, firm_name, brand_name, capacity, capacity_units_name;
  let product = {};

  $('.product_details').filter((i, wrapper) => {
    product_name  =   $(wrapper).find('h1').text();
    $(wrapper).find('.PropValueName').each((i, propObj) => {
      let propName  =   $(propObj).text();
      switch(propName){
        case "שם ספק:" :
          firm_name = $(propObj).next('.PropValue').text();
          break;
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

    barcode   =   prod_img.substr(prod_img.lastIndexOf('/')+1, prod_img.lastIndexOf('.')-prod_img.lastIndexOf('/')-1);
    firm_name =   !firm_name ? brand_name : firm_name;

    if(barcode.toString().length < 9)
      return false;
    else if (!firm_name)
      return false;


    if(!capacity_units_name){
      if(product_name.match(new RegExp(`[0-9]+ג`)) || product_name.match(new RegExp(`[0-9]+ גרם`)))
        capacity_units_name = 'גרם';

      if(!capacity_units_name)
        return false;
    }

    product = {barcode, product_name, firm_name, brand_name, capacity, capacity_units_name, menuIndex};
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

  let counter   = 1;
  let products  = [];
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
  return products;
}
const ramiLevyCrawler = async () => {
  let menu = await getRootMenu();
  await initializeTmpFile();

  for(let subject of menu){
    console.log(`scan subject ${menuIndex}:`)
    if(menuIndex>0 && menuIndex<30){
      for(let link of subject.links){
        try{
          let products = await scanMenuLinkProducts(ROOT_URL + link);
          await appendProductsToFile(products);
        }catch(e){
          console.log(e);
        }
      }
    }
    menuIndex++;
  }
  copyOutput();
  console.log("finish");
}

module.exports = ramiLevyCrawler;
