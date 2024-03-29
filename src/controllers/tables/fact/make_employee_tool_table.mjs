/**
 * @author Marcos Barrios
 * @since 03_11_2023
 * @description Make employee_tool table.
 *
 */

'use strict';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export default async function makeEmployeeToolTable(toolTable) {
  const table = [];

  for (let i = 1; i <= 20; i++) {
    for (const toolRecord of toolTable) {
      table.push({
        employee_id: i,
        tool_id: toolRecord.tool_id,
        years_of_experience: getRandomInt(0, 10),
      });
    }
  }

  return table;
}
