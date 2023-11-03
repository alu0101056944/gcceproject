
/**
 * @author Marcos Barrios
 * @since 03_11_2023
 * @description Make employee_tool table.
 *
 */

'use strict';

// import { inspect } from 'util';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * @param {number} amountOfTools
 */
export default async function makeTable(amountOfTools) {
  const table = [];

  for (let i = 1; i <= 20; i++) {
    for (let j = 1; j <= amountOfTools; j++) {
      table.push({
        employee_id: i,
        tool_id: j,
        years_of_experience: getRandomInt(1, 10),
      });
    }
  }

  return table;
}
  
// makeTable(8).then((data) => console.log(inspect(data)));
