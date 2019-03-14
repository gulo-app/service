const path                =       require('path');
const FILE_PATH           =       path.join(__dirname, '../../../crawler/products/output/output.json');
const InventoryCrawler    =       require(`${process.env.PWD}/db/classes/Inventory/InventoryCrawler`);


const fillProducts = async () => {
    const inventoryCrawler = new InventoryCrawler();
    await inventoryCrawler.fillCrawlProductsFromFile(FILE_PATH);
}
module.exports = fillProducts;
