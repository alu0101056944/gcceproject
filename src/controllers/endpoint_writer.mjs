/**
 * @author Marcos Barrios
 * @since 05_01_2024
 * @description Owns the persistent ids file and allows multiple record sources
 *    to be merged into an endpoint array while keeping the ids unique.
 *
 * The idea is to allow table functions to have as parameter other tables. To
 *  do that a dependency tree must be passed. Each node represents a table and
 *  it is an object with "resolver", "tableName" and "dependencies" properties.
 *
 * The return value of the dependencies are available to the parents. Each
 *   is available as parameter in the same order. A last parameter will be added
 *   representing the latest persistent id for the table, so the name of the node
 *   must be a valid registered table's name.
 * 
 * Dependency tree examples:
 *
 * const someTree = {
 *   tableName: 'employee',
 *   resolver: () => {
 *     return {
 *       employee_id: 1,
 *       name: 'Marcos'
 *     }
 *   },
 *   dependencies: [],
 * }
 * 
 * const someOtherTree = {
 *   tableName: 'project',
 *   resolver: (toolTable, latestId) => {
 *     return {
 *       employee_id: latestId + 1,
 *       name: toolTable.name,
 *       downloads: 4323,
 *     }
 *   },
 *   dependencies: [
 *     {
 *       tableName: 'tool',
 *       resolver: () => {
 *         return {
 *           tool_id: 1,
 *           name: 'gatsby',
 *           searches: 17
 *         }
 *       },
 *       dependencies: []
 *     }
 *   ]
 * }
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

/**
 * @desc Write to the outputTables/ directory.
 */
export default class EndpointWriter {
  /** @const @private */
  #dependencyTree = undefined;
  #tables = undefined;

  /**
   * @param {object} dependencyTree each node representing a table.
   */
  constructor(dependencyTree) {
    this.#validateTableNames(dependencyTree);
    if (!this.#isValidDependencyTree(dependencyTree, [])) {
      throw Error('Invalid dependency tree, check the documentation');
    }
    this.#dependencyTree = dependencyTree;
    this.#tables = {};
  }

  #validateTableNames(dependencyNode) {
    const validateTableNamesRecursive = (dependencyNode, tableNameSet) => {
      if (tableNameSet.has(dependencyNode.tableName)) {
        throw new Error('There are duplicate table names in the dependency tree');
      }
      tableNameSet.add(dependencyNode.tableName);
      if (dependencyNode.dependencies.length > 0) {
        for (const child of dependencyNode.dependencies) {
          validateTableNamesRecursive(child, tableNameSet);
        }
      }
    };
    validateTableNamesRecursive(dependencyNode, new Set());
  }

  #isValidDependencyTree(dependencyNode) {
    const isValidNode = (node) => {
      const allKey = Object.keys(node);
      const hasValidKeys =
          allKey.includes('tableName') &&
          allKey.includes('resolver') &&
          allKey.includes('dependencies');
      if (!hasValidKeys) {
        return false;
      }
      if (typeof node.resolver !== 'function') {
        return false;
      }
      if (!Array.isArray(node.dependencies)) {
        return false;
      }
      if (typeof node.tableName !== 'string') {
        return false
      }
      if (node.tableName.length === 0) {
        return false;
      }
      return true;
    }

    if (isValidNode(dependencyNode)) {
      if (dependencyNode.dependencies.length === 0) {
        return true;
      } else {
        let amountOfValidChildren = 0;
        for (const child of dependencyNode.dependencies) {
          if (this.#isValidDependencyTree(child)) {
            ++amountOfValidChildren;
          }
        }
        return amountOfValidChildren === dependencyNode.dependencies.length;
      }
    }
    return false;
  }

  async write() {
    const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
    const dimensionToId = JSON.parse(FILE_CONTENT);

    dimensionToId.employee = 20;

    const TO_JSON = JSON.stringify(dimensionToId, null, 2);
    await writeFile('./src/persistent_ids.json', TO_JSON);

    const solve = async (node) => {
      if (node.dependencies.length === 0) {
        const table = await node.resolver();
        this.#tables[node.tableName] = table;
      } else {
        const args = [];
        for (const child of node.dependencies) {
          const allRecord = await solve(child);
          args.push(allRecord);
        }
        const table = await node.resolver(...args);
        this.#tables[node.tableName] = table;
      }
    };
  }
}
