# node-chrome-runner

A small library to run Chrome

Example usage within node:

```
var chrome_runner = require('./build/tools/chrome-runner');
var c1 = chrome_runner.runChrome({
  path: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
  args:['--user-data-dir=tmp/foo'],
  processOptions:{stdio: 'inherit'}
});
```
