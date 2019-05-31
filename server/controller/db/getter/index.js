const conn                        =   require('../../../db/connection');
const {ParamsError, AuthError}    =   require('../../../config/errors');

const categories = async () => {
  return await conn.sql(`SELECT category_id as id, category_name as name FROM categories`);
}
const capacity_units = async () => {
  return await conn.sql(`SELECT capacity_unit_id as id, unit_name as name FROM capacity_units`);
}
const brands = async () => {
  return await conn.sql(`SELECT brand_id as id, brand_name as name FROM brands`);
}

module.exports = {
  categories,
  capacity_units,
  brands
}
