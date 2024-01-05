'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import fetchAllCommitAmount from '../../../src/controllers/scraper_use_cases/get_repository_commit_amount.mjs';

test('Fix; should not return an empty object.', async () => {
  test.setTimeout(7200000);
  const toolTable = [
    {
      name: "react",
      author_company: "facebook",
      specialization: "frontend",
      type: "ui",
      tool_id: 1,
    },
    {
      name: "vue",
      author_company: "vuejs",
      specialization: "frontend",
      type: "framework",
      tool_id: 2,
    },
    {
      name: "front-end-checklist",
      author_company: "thedaviddias",
      specialization: "frontend",
      type: null,
      tool_id: 3,
    },
    {
      name: "vite",
      author_company: "vitejs",
      specialization: "frontend",
      type: "build-tool",
      tool_id: 4,
    },
    {
      name: "frontend-dev-bookmarks",
      author_company: "dypsilon",
      specialization: "frontend",
      type: null,
      tool_id: 5,
    },
    {
      name: "awesome-cheatsheets",
      author_company: "LeCoupa",
      specialization: "frontend",
      type: "language",
      tool_id: 6,
    },
    {
      name: "gold-miner",
      author_company: "xitu",
      specialization: "frontend",
      type: null,
      tool_id: 7,
    },
    {
      name: "quivr",
      author_company: "StanGirard",
      specialization: "frontend",
      type: null,
      tool_id: 8,
    },
    {
      name: "weekly",
      author_company: "ascoders",
      specialization: "frontend",
      type: null,
      tool_id: 9,
    },
    {
      name: "githubdaily",
      author_company: "GitHubDaily",
      specialization: "frontend",
      type: null,
      tool_id: 10,
    },
    {
      name: "fe-interview",
      author_company: "haizlin",
      specialization: "frontend",
      type: null,
      tool_id: 11,
    },
    {
      name: "iview",
      author_company: "iview",
      specialization: "frontend",
      type: null,
      tool_id: 12,
    },
    {
      name: "easyspider",
      author_company: "NaiboWang",
      specialization: "frontend",
      type: null,
      tool_id: 13,
    },
    {
      name: "hello-python",
      author_company: "mouredev",
      specialization: "frontend",
      type: null,
      tool_id: 14,
    },
    {
      name: "tui.editor",
      author_company: "nhn",
      specialization: "frontend",
      type: "editor",
      tool_id: 15,
    },
    {
      name: "front-end-performance-checklist",
      author_company: "thedaviddias",
      specialization: "frontend",
      type: null,
      tool_id: 16,
    },
    {
      name: "amis",
      author_company: "baidu",
      specialization: "frontend",
      type: null,
      tool_id: 17,
    },
    {
      name: "full-stack-fastapi-postgresql",
      author_company: "tiangolo",
      specialization: "frontend",
      type: null,
      tool_id: 18,
    },
    {
      name: "marko",
      author_company: "marko-js",
      specialization: "frontend",
      type: null,
      tool_id: 19,
    },
    {
      name: "tachyons",
      author_company: "tachyons-css",
      specialization: "frontend",
      type: null,
      tool_id: 20,
    },
  ];
  const partialURLToCommitAmount = await fetchAllCommitAmount(toolTable);
  await expect(Object.keys(partialURLToCommitAmount).length)
      .toBe(toolTable.length);
});

test('Fix; should not return an empty object (2).', async () => {
  test.setTimeout(7200000);
  const toolTable = [
    {
      name: "react",
      author_company: "facebook",
      specialization: "frontend",
      type: "ui",
      tool_id: 1,
    },
    {
      name: "vue",
      author_company: "vuejs",
      specialization: "frontend",
      type: "framework",
      tool_id: 2,
    },
    {
      name: "front-end-checklist",
      author_company: "thedaviddias",
      specialization: "frontend",
      type: null,
      tool_id: 3,
    },
    {
      name: "vite",
      author_company: "vitejs",
      specialization: "frontend",
      type: "build-tool",
      tool_id: 4,
    },
    {
      name: "ionic-framework",
      author_company: "ionic-team",
      specialization: "frontend",
      type: "framework",
      tool_id: 5,
    },
    {
      name: "frontend-dev-bookmarks",
      author_company: "dypsilon",
      specialization: "frontend",
      type: null,
      tool_id: 6,
    },
    {
      name: "awesome-cheatsheets",
      author_company: "LeCoupa",
      specialization: "frontend",
      type: "language",
      tool_id: 7,
    },
    {
      name: "gold-miner",
      author_company: "xitu",
      specialization: "frontend",
      type: null,
      tool_id: 8,
    },
    {
      name: "quivr",
      author_company: "StanGirard",
      specialization: "frontend",
      type: null,
      tool_id: 9,
    },
    {
      name: "weekly",
      author_company: "ascoders",
      specialization: "frontend",
      type: null,
      tool_id: 10,
    },
    {
      name: "githubdaily",
      author_company: "GitHubDaily",
      specialization: "frontend",
      type: null,
      tool_id: 11,
    },
    {
      name: "expo",
      author_company: "expo",
      specialization: "frontend",
      type: "framework",
      tool_id: 12,
    },
    {
      name: "fe-interview",
      author_company: "haizlin",
      specialization: "frontend",
      type: null,
      tool_id: 13,
    },
    {
      name: "iview",
      author_company: "iview",
      specialization: "frontend",
      type: null,
      tool_id: 14,
    },
    {
      name: "ant-design-vue",
      author_company: "vueComponent",
      specialization: "frontend",
      type: "ui",
      tool_id: 15,
    },
    {
      name: "easyspider",
      author_company: "NaiboWang",
      specialization: "frontend",
      type: null,
      tool_id: 16,
    },
    {
      name: "hello-python",
      author_company: "mouredev",
      specialization: "frontend",
      type: null,
      tool_id: 17,
    },
    {
      name: "tui.editor",
      author_company: "nhn",
      specialization: "frontend",
      type: "editor",
      tool_id: 18,
    },
    {
      name: "front-end-performance-checklist",
      author_company: "thedaviddias",
      specialization: "frontend",
      type: null,
      tool_id: 19,
    },
    {
      name: "amis",
      author_company: "baidu",
      specialization: "frontend",
      type: null,
      tool_id: 20,
    },
  ];
  const partialURLToCommitAmount = await fetchAllCommitAmount(toolTable);
  await expect(Object.keys(partialURLToCommitAmount).length)
      .toBe(toolTable.length);
});

