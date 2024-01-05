import { test, expect } from '@playwright/test';

import EndpointWriter from '../../src/controllers/endpoint_writer.mjs';

import { readFile, writeFile } from 'fs/promises';

test('Valid dependency trees do not throw', async () => {
  const dependencyTree = {
    tableName: 'employee',
    resolver: () => {
      return {
        employee_id: 1,
        name: 'Marcos'
      }
    },
    dependencies: [],
  };
  
  await expect(() => new EndpointWriter(dependencyTree)).not.toThrow();
});

test('Valid dependency trees do not throw2', async () => {
  const dependencyTree = {
    tableName: 'project',
    resolver: (toolTable, latestId) => {
      return {
        employee_id: latestId + 1,
        name: toolTable.name,
        downloads: 4323,
      }
    },
    dependencies: [
      {
        tableName: 'tool',
        resolver: () => {
          return {
            tool_id: 1,
            name: 'gatsby',
            searches: 17
          }
        },
        dependencies: []
      }
    ]
  }

  await expect(() => new EndpointWriter(dependencyTree)).not.toThrow();
});

test('Bad dependency trees do throw1', async () => {
  const dependencyTree = {};
  await expect(() => new EndpointWriter(dependencyTree)).toThrow();
});

test('Bad dependency trees do throw2', async () => {
  const dependencyTree = {
    tableName: 'employee',
    dependencies: [],
  };
  
  await expect(() => new EndpointWriter(dependencyTree)).toThrow();
});

test('Bad dependency trees do throw3', async () => {

  const dependencyTree = {
    tableName: 'employee',
    resolver: () => {
      return {
        employee_id: 1,
        name: 'Marcos'
      }
    },
  };

  await expect(() => new EndpointWriter(dependencyTree)).toThrow();
});

test('Bad dependency trees do throw4', async () => {

  const dependencyTree = {
    resolver: () => {
      return {
        employee_id: 1,
        name: 'Marcos'
      }
    },
    dependencies: [],
  };

  await expect(() => new EndpointWriter(dependencyTree)).toThrow();
});

test('Bad dependency trees do throw5', async () => {
  const dependencyTree = {
    tableName: 'project',
    resolver: (toolTable, latestId) => {
      return {
        employee_id: latestId + 1,
        name: toolTable.name,
        downloads: 4323,
      }
    },
    dependencies: [
      {
        resolver: () => {
          return {
            tool_id: 1,
            name: 'gatsby',
            searches: 17
          }
        },
        dependencies: []
      }
    ]
  }

  await expect(() => new EndpointWriter(dependencyTree)).toThrow();
});

test('Bad dependency trees do throw6', async () => {
  const dependencyTree = {
    tableName: 'project',
    resolver: (toolTable, latestId) => {
      return {
        employee_id: latestId + 1,
        name: toolTable.name,
        downloads: 4323,
      }
    },
    dependencies: [
      {
        tableName: 'tool',
        dependencies: []
      }
    ]
  }
  await expect(() => new EndpointWriter(dependencyTree)).toThrow();
});

test('Bad dependency trees do throw7', async () => {
  const dependencyTree = {
    tableName: 'project',
    resolver: (toolTable, latestId) => {
      return {
        employee_id: latestId + 1,
        name: toolTable.name,
        downloads: 4323,
      }
    },
    dependencies: [
      {
        tableName: 'tool',
        resolver: () => {
          return {
            tool_id: 1,
            name: 'gatsby',
            searches: 17
          }
        },
      }
    ]
  }

  await expect(() => new EndpointWriter(dependencyTree)).toThrow();
});

test('Dependency tree with duplicated table names results in error', async () => {
  const dependencyTree = {
    tableName: 'project',
    resolver: (toolTable, latestId) => {
      return {
        employee_id: latestId + 1,
        name: toolTable.name,
        downloads: 4323,
      }
    },
    dependencies: [
      {
        tableName: 'project',
        resolver: () => {
          return {
            tool_id: 1,
            name: 'gatsby',
            searches: 17
          }
        },
      }
    ]
  }
  await expect(() => new EndpointWriter(dependencyTree)).toThrow();
});

test('Dependency tree without duplicated table names doesn\'t throw', async () => {
  const dependencyTree = {
    tableName: 'project',
    resolver: (toolTable, latestId) => {
      return {
        employee_id: latestId + 1,
        name: toolTable.name,
        downloads: 4323,
      }
    },
    dependencies: [
      {
        tableName: 'tool',
        resolver: () => {
          return {
            tool_id: 1,
            name: 'gatsby',
            searches: 17
          }
        },
        dependencies: [],
      }
    ]
  };
  await expect(() => new EndpointWriter(dependencyTree)).not.toThrow();
});

test('write() properly changes persistent ids1', async () => {
  const dependencyTree = {
    tableName: 'project',
    resolver: (toolTable, latestId) => {
      return [
        {
          employee_id: latestId + 1,
          name: toolTable.name,
          downloads: 4323,
        }
      ];
    },
    dependencies: [
      {
        tableName: 'tool',
        resolver: (latestId) => {
          return [
            {
              tool_id: 1,
              name: 'gatsby',
              searches: 17
            }
          ];
        },
        dependencies: [],
      }
    ]
  };
  const SAVE_FILE = await readFile('./src/persistent_ids.json', 'utf-8');
  const saveFile = JSON.parse(SAVE_FILE);
  const writer = new EndpointWriter(dependencyTree);
  await writer.write();
  const NEW_CONTENT = await readFile('./src/persistent_ids.json', 'utf-8');
  const newContent = JSON.parse(NEW_CONTENT);
  await writeFile('./src/persistent_ids.json', SAVE_FILE);
  await expect(newContent.tool - saveFile.tool).toBe(1);
});

test('write() properly changes persistent ids2', async () => {
  const dependencyTree = {
    tableName: 'project',
    resolver: (toolTable, latestId) => {
      return [{
        employee_id: latestId + 1,
        name: toolTable.name,
        downloads: 4323,
      }]
    },
    dependencies: [
      {
        tableName: 'tool',
        resolver: (latestId) => {
          return [{
            tool_id: 1,
            name: 'gatsby',
            searches: 17
          }]
        },
        dependencies: [],
      }
    ]
  };
  const SAVE_FILE = await readFile('./src/persistent_ids.json', 'utf-8');
  const saveFile = JSON.parse(SAVE_FILE);
  const writer = new EndpointWriter(dependencyTree);
  await writer.write();
  const NEW_CONTENT = await readFile('./src/persistent_ids.json', 'utf-8');
  const newContent = JSON.parse(NEW_CONTENT);
  await writeFile('./src/persistent_ids.json', SAVE_FILE);
  await expect(newContent.project - saveFile.project).toBe(1);
});

test('Dependency tree is solved correctly1', async () => {
  const dependencyTree = {
    tableName: 'project',
    resolver: (toolTable, latestId) => {
      return [{
        employee_id: latestId + 1,
        name: toolTable.name,
        downloads: 4323,
      }];
    },
    dependencies: [
      {
        tableName: 'tool',
        resolver: (latestId) => {
          return [{
            tool_id: 1,
            name: 'gatsby',
            searches: 17
          }];
        },
        dependencies: [],
      }
    ]
  };
  const writer = new EndpointWriter(dependencyTree);
  await writer.write();
  const toolTable = writer.getTable('tool');
  await expect(toolTable[0].searches).toBe(17);
});

test('Dependency tree is solved correctly2', async () => {
  const dependencyTree = {
    tableName: 'project',
    resolver: (toolTable, latestId) => {
      return [{
        employee_id: latestId + 1,
        name: toolTable.name,
        downloads: 4323,
      }]
    },
    dependencies: [
      {
        tableName: 'tool',
        resolver: (latestId) => {
          return [{
            tool_id: 1,
            name: 'gatsby',
            searches: 17
          }]
        },
        dependencies: [],
      }
    ]
  };
  const writer = new EndpointWriter(dependencyTree);
  await writer.write();
  const projectTable = writer.getTable('project');
  await expect(projectTable[0].downloads).toBe(4323);
});
