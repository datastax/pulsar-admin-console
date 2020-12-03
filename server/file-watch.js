'use strict';

/* eslint no-console: "error" */

const fs = require('fs');
const checkInterval = 10 * 1000; // 10 seconds

const exitOnFileChange = (fileName) => {
  fs.watchFile(fileName, {interval: checkInterval}, (curr, prev) => {
    if (curr.size === curr.blocks === 0) {
      // eslint-disable-next-line no-console
      console.log(`FATAL ERROR ${fileName} file has been removed`);
    }
    const changedAt = curr.birthtime;
    const createdAt = prev.birthtime;
    // eslint-disable-next-line no-console
    console.log(`${fileName} file created at ${createdAt} changed at ${changedAt}`);
    process.exit(2);
  });
};

module.exports = {
  exitOnFileChange
};
