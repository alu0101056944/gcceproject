'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import getInfo from '../../../src/controllers/scraper_use_cases/get_repository_info.mjs';

test('Can get a version number', async () => {
  test.setTimeout(7200000);
  const allRepoInfo = [
    "facebook/react",
    "vuejs/vue",
    "thedaviddias/front-end-checklist",
    "vitejs/vite",
    "ionic-team/ionic-framework",
    "dypsilon/frontend-dev-bookmarks",
    "LeCoupa/awesome-cheatsheets",
    "xitu/gold-miner",
    "StanGirard/quivr",
    "ascoders/weekly",
    "GitHubDaily/githubdaily",
    "expo/expo",
    "haizlin/fe-interview",
    "iview/iview",
    "vueComponent/ant-design-vue",
    "NaiboWang/easyspider",
    "mouredev/hello-python",
    "nhn/tui.editor",
    "thedaviddias/front-end-performance-checklist",
    "baidu/amis",
    "tiangolo/full-stack-fastapi-postgresql",
    "marko-js/marko",
    "mdbootstrap/tw-elements",
    "tachyons-css/tachyons",
    "nhn/tui.calendar",
    "cs01/gdbgui",
    "mdbootstrap/material-design-for-bootstrap",
    "helloqingfeng/awsome-front-end-learning-resource",
    "marmelab/gremlins.js",
    "moklick/frontend-stuff",
    "NG-ZORRO/ng-zorro-antd",
    "Stability-AI/stablestudio",
    "bencodezen/vue-enterprise-boilerplate",
    "phodal/growth-ebook",
    "Tencent/hippy",
    "CorentinTh/it-tools",
    "andrew--r/frontend-case-studies",
    "marionettejs/backbone.marionette",
    "HospitalRun/hospitalrun-frontend",
    "zeroclipboard/zeroclipboard",
  ];
  const nameToAmount = await getInfo(allRepoInfo);

  // temporal test to fix it getting stuck for some reason. Fixed it.
  const VERSION = Object.values(nameToAmount)?.[0].version;
  await expect(VERSION).not.toBeUndefined();
  await expect(VERSION).not.toBeNaN();
});
