const path                =       require('path');
const RAMI_LEVY_NEW       =       path.join(__dirname, './crawler-output/rami-levy/products.json');
const InventoryCrawler    =       require(`${process.env.PWD}/db/classes/Inventory/InventoryCrawler`);
const prices_crawler      =       require(`${process.env.PWD}/controller/db/prices_crawler`);

const fillProducts = async () => {
    const inventoryCrawler = new InventoryCrawler();

    await inventoryCrawler.fillCrawlProductsFromFile(RAMI_LEVY_NEW, 'Rami-Levy');
    // await inventoryCrawler.fillManualProducts();
    await prices_crawler.updatePrices();
    console.log("\n\n *** initialization finished! *** \n\n");
}
module.exports = fillProducts;
