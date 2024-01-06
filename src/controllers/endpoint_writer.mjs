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
 * There is also a useTable node.
 * 
 * See endpoint_writer spec for more examples.
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

/**
 * @desc Write to the outputTables/ directory.
 */
export default class EndpointWriter {
  /** @const @private */
  #allDependencyTree = undefined;
  #tableNameToTable = undefined;
  #nodeTypes = undefined;
  #enableFileWrite = undefined;

  /**
   * @param {object} allDependencyTree an array of dependency trees in which each
   *    node represents a table.
   */
  constructor(allDependencyTree, enableFileWrite = true) {
    if (!Array.isArray(allDependencyTree)) {
      throw new Error('EndpointWriter constructor axpected an array as arg.');
    }
    this.#nodeTypes = {
      tableNode: {
        tableName: function isValidString(name) {
          if (typeof name === 'string' && name.length > 0) {
            return true;
          }
          return false;
        },
        resolver: 'function',
        dependencies: Array.isArray,
      },
      reuseTableNode: {
        useTable: function isValidString(name) {
          if (typeof name === 'string' && name.length > 0) {
            return true;
          }
          return false;
        },
      }
    };
    for (const dependencyTree of allDependencyTree) {
      this.#throwIfInvalidDependencyTree(dependencyTree);
    }
    this.#allDependencyTree = allDependencyTree;
    this.#tableNameToTable = {};
    this.#enableFileWrite = enableFileWrite;
  }

  #throwIfInvalidDependencyTree(dependencyNode) {
    const throwIfInvalidNode = (node) => {
      const allNodeTypeMatch =
          Object.values(this.#nodeTypes)
          .filter(propertyNameToTypeDescriptor => {
            const allKeyOfType = Object.keys(propertyNameToTypeDescriptor);
            const allKeyOfNode = Object.keys(node);
            const hasAllKey =
                allKeyOfType.every(key => allKeyOfNode.includes(key));

            const isProperlyTyped =
                Object.entries(propertyNameToTypeDescriptor)
                .filter(([propertyName, typeDescriptor]) => {
                  if (typeof typeDescriptor === 'string') {
                    return typeof node[propertyName] === typeof typeDescriptor;
                  } else if (typeof typeDescriptor === 'function') {
                    return typeDescriptor(node[propertyName]);
                  } else {
                    throw new Error('Invalid type for property of node type, ' +
                        'something is wrong in the node type definitions.');
                  }
                });

            return hasAllKey && isProperlyTyped;
          });
      if (allNodeTypeMatch.length === 0) {
        throw new Error('There is a node in the dependency tree that doesn\'t ' +
            'match any node type exactly.');
      }
      if (allNodeTypeMatch.length > 1) {
        throw new Error('There is a node in the dependency tree whose' +
            ' definition matches more than one node type. It must match' +
            ' only one.');
      }
    }

    if (dependencyNode.dependencies.length === 0) {
      throwIfInvalidNode(dependencyNode);
    } else {
      for (const child of dependencyNode.dependencies) {
        throwIfInvalidNode(child);
      }
    }
  }

  async parse() {
    const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
    const tableNameToId = JSON.parse(FILE_CONTENT);
    for (const key of Object.keys(tableNameToId)) {
      if (key !== 'date') {
        tableNameToId[key] ??= 0;
      }
    }

    const tableNameToTableMerged = {};

    const appendToTableFile = async (tableName, table) => {
      const FILE_PATH = `outputTables/${tableName}Table.json`;

      let fileContent = '[]';
      try {
        fileContent = await readFile(FILE_PATH, 'utf8');
        if (fileContent.length === 0) {
          fileContent = '[]';
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(
            'Could not read output ' + tableName + ' table, continuing by' +
            ' assuming that the table is empty.');
        } else {
          throw error;
        }
      }

      const oldTable = JSON.parse(fileContent);
      if (!Array.isArray(oldTable)) {
        throw new Error('Expected output table root to be an array.');
      }
      for (let i = 0; i < table.length; i++) {
        oldTable.push(table[i]);
      }

      await writeFile(FILE_PATH, JSON.stringify(oldTable, null, 2));
    }

    const merge = (tableName, table) => {
      if (!tableNameToTableMerged[tableName]) {
        tableNameToTableMerged[tableName] = table;
      } else {
        tableNameToTableMerged[tableName] =
            tableNameToTableMerged[tableName].concat(table);
      }
    }

    const solve = async (node) => {
      if (node.useTable) {
        if (!tableNameToTableMerged[node.useTable]) {
          throw new Error('Bad dependency tree execution sequence; attempted ' +
              'to get a table that has not been created yet through a useTable' +
              ' node. Dependency trees are solved in FIFO order array wise and' +
              ' preorder traversal tree wise.');
        }
        return tableNameToTableMerged[node.useTable];
      } else if (node.tableName) {
        const LATEST_ID = tableNameToId[node.tableName];
        if (node.dependencies.length === 0) {
          const table = await node.resolver(LATEST_ID);
          merge(node.tableName, table);
          tableNameToId[node.tableName] += table.length;
          if (this.#enableFileWrite) {
            await appendToTableFile(node.tableName, table);
          }
          return table;
        } else {
          const args = [];
          for (const child of node.dependencies) {
            const allRecord = await solve(child);
            args.push(allRecord);
          }
          const table = await node.resolver(...args, LATEST_ID);
          merge(node.tableName, table);
          tableNameToId[node.tableName] += table.length;
          if (this.#enableFileWrite) {
            await appendToTableFile(node.tableName, table);
          }
          return table;
        }
      }
      throw new Error('Traversed a node whose logic has not been programmed ' +
          ' at Endpoint_writer parse()\'s solve function. Something is off.');
    };

    for (let i = 0; i < this.#allDependencyTree.length; i++) {
      await (solve(this.#allDependencyTree[i]));
    }
    this.#tableNameToTable = tableNameToTableMerged;

    if (this.#enableFileWrite) {
      const TO_JSON = JSON.stringify(tableNameToId, null, 2);
      await writeFile('./src/persistent_ids.json', TO_JSON);
      console.log('EndpointWriter sucessful src/persistent_ids.json write.');
    }
  }

  getTable(tableName) {
    if (!this.#tableNameToTable[tableName]) {
      throw new Error('Tried to getTable a table that is not stored.');
    }
    return this.#tableNameToTable[tableName];
  }
}
