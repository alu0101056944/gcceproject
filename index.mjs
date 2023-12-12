/**
 * @author Marcos Barrios
 * @since 12_12_2023
 * @desc Insert all tables and also add entry to date table.
 */

import insertAllTables from "./src/controllers/insert_all_tables.mjs";

async function main() {
  await insertAllTables();
}

main();
