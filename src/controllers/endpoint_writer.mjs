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

import { type } from "os";

/**
 * @desc Write to the outputTables/ directory.
 */
export default class EndpointWriter {
  /** @const @private */
  #dependencyTree = undefined;

  /**
   * @param {object} dependencyTree each node representing a table.
   */
  constructor(dependencyTree) {
    if (!this.#isValidDependencyTree(dependencyTree)) {
      throw Error('Invalid dependency tree, check the documentation');
    }
    this.#dependencyTree = dependencyTree;
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

  write() {

  }
}
