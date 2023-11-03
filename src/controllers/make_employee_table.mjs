/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make employee table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

export default async function makeEmployeeTable() {
  const records = [
      {
        employee_id: 1,
        name: 'John Smith',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 2,
        name: 'Sarah Johnson',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 3,
        name: 'Michael Williams',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 4,
        name: 'Emily Davis',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 5,
        name: 'David Anderson',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 6,
        name: 'Jennifer Brown',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 7,
        name: 'Jessica Taylor',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 8,
        name: 'Robert Martin',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 9,
        name: 'Susan Harris',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 10,
        name:  'Christopher Lee',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 11,
        name:  'Mary White',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 12,
        name:  'Daniel Turner',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 13,
        name:  'Karen Martinez',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 14,
        name:  'William Clark',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 15,
        name:  'Lisa Young',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 16,
        name:  'Joseph Rodriguez',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 17,
        name:  'Patricia Hall',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 18,
        name:  'Richard Jackson',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 19,
        name:  'Linda Lewis',
        title: 'Software Engineer',
        department: 'IT'
      },
      {
        employee_id: 20,
        name:  'Thomas Moore',
        title: 'Software Engineer',
        department: 'IT'
      }
  ];

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.employee = 20;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return records;
}
