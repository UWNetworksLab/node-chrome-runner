# node-chrome-runner

A small library to run Chrome.

## Building the library

```
./setup install  # install npm and third_party tools/libraries
gulp dist # build the library
```

## Usage

```
# Load with a relative path from the root of the node-chrome-runner repo...
var chrome_runner = require('./build/dist/node-chrome-runner/chrome-runner');

# Load if it is in your npm path (e.g. if it's in your package dependencies).
var chrome_runner = require('node-chrome-runner');

# Start chrome; returns the child process as `c1.childProcess`...
var c = chrome_runner.runChrome();

# Console log the path used to start chrome...
console.log(c.path);

# Run chrome with a custom path, and argument to make chrome start
# with user directory `tmp/foo` on Mac...
var c = chrome_runner.runChrome({
  versions: [chrome_runner.chromePaths.canary],
  args:['--user-data-dir=tmp/foo'],
  processOptions:{stdio: 'inherit'}
});

# Run chrome with a custom path, and argument to make chrome start
# with user directory `tmp/foo` on Mac...
var c = chrome_runner.runChrome({
  path: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
  args:['--user-data-dir=tmp/foo'],
  processOptions:{stdio: 'inherit'}
});

# or use platform found version, but set the user-data dir...
var c = chrome_runner.runChrome({
  args:['--user-data-dir=tmp/foo'],
  processOptions:{stdio: 'inherit'}
});

# Send a close signal to the started chrome.
c.childProcess.kill();
```
