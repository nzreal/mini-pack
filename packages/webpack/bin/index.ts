#!/usr/bin/env node

import Compiler from '../libs/Compiler';

const run = () => {
  try {
    const compiler = new Compiler();
    compiler.run();
  } catch (e) {
    console.error('build error: ', e);
  }
};

run();
