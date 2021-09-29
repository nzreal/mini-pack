#!/usr/bin/env node

import CoreWebpack from '../libs/coreWebpack';

const run = () => {
  try {
    new CoreWebpack();
  } catch (e) {
    console.error('build error: ', e);
  }
};

run();
