import { test, expect } from '@playwright/test';

import EndpointWriter from '../../src/controllers/endpoint_writer.mjs';

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
  const dependencyTree2 = {
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

  await expect(() => new EndpointWriter(dependencyTree2)).not.toThrow();
});

test('Bad dependency trees do throw1', async () => {
  const dependencyTree0 = {};
  await expect(() => new EndpointWriter(dependencyTree0)).toThrow();
});

test('Bad dependency trees do throw2', async () => {
  const dependencyTree1 = {
    tableName: 'employee',
    dependencies: [],
  };
  
  await expect(() => new EndpointWriter(dependencyTree1)).toThrow();
});

test('Bad dependency trees do throw3', async () => {

  const dependencyTree2 = {
    tableName: 'employee',
    resolver: () => {
      return {
        employee_id: 1,
        name: 'Marcos'
      }
    },
  };

  await expect(() => new EndpointWriter(dependencyTree2)).toThrow();
});

test('Bad dependency trees do throw4', async () => {

  const dependencyTree3 = {
    resolver: () => {
      return {
        employee_id: 1,
        name: 'Marcos'
      }
    },
    dependencies: [],
  };

  await expect(() => new EndpointWriter(dependencyTree3)).toThrow();
});

test('Bad dependency trees do throw5', async () => {
  const dependencyTree4 = {
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

  await expect(() => new EndpointWriter(dependencyTree4)).toThrow();
});

test('Bad dependency trees do throw6', async () => {
  const dependencyTree5 = {
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
  await expect(() => new EndpointWriter(dependencyTree5)).toThrow();
});

test('Bad dependency trees do throw7', async () => {
  const dependencyTree6 = {
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

  await expect(() => new EndpointWriter(dependencyTree6)).toThrow();
});
