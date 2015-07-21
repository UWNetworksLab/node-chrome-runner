/// <reference path='../../third_party/typings/node/node.d.ts' />

// Platform independnet way to run the Chrome binary using node.

import path = require('path');
import childProcess = require('child_process');
import fs = require('fs');

export var chromePaths = {
  windowsXp:
      path.join(process.env['HOMEPATH'],
        'Local Settings\\Application Data\\Google\\Chrome\\Application\\chrome.exe'),
  windowsVista:
      path.join(process.env['USERPROFILE'],
        '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'),
  macSystem: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
  macUser: path.join(process.env['HOME'], '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome)',
  macCanarySystem: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
  macCanaryUser: path.join(process.env['HOME'], '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary',
  linuxSystem: '/usr/bin/google-chrome',
  linuxCanarySystem '/usr/bin/google-chrome-canary'
}

// Utility function to give list of operating system paths that may contain the
// chrome binary.
// See: https://code.google.com/p/selenium/wiki/ChromeDriver
export function osChromePaths() :string[] {
  if (/^win/.test(process.platform)) {
    // Windows
    return [chromePaths.windowsXp, chromePaths.windowsVista];
  } else if (process.platform === "darwin") {
    // Mac
    return [chromePaths.macUser, chromePaths.macSystem];
  } else {
    // Some variant of linux.
    return [chromePaths.linuxSystem];
  }
}

// Utility function to pick the first path in the list that exists in the
// filesystem.
function pickFirstExistingPath(paths:string[]) : string {
  for(var i = 0; i < paths.length; ++i) {
    if (fs.existsSync(paths[i])) return paths[i];
  };
  return null;
}

export interface NodeChildProcessOptions
  { cwd?: string; stdio?: any; custom?: any; env?: any; detached?: boolean; };

// Run the chrome binary.
export function runChrome(
    config:{ path?:string;
             args?:string[];
             processOptions?:NodeChildProcessOptions;
    } = {}) : { chosenChromePath :string;
                childProcess :childProcess.ChildProcess } {
  var chromePaths :string[] = config.path ? [config.path] : osChromePaths();
  var chosenChromePath :string = pickFirstExistingPath(chromePaths);

  if (!chosenChromePath) {
    throw new Error('Cannot find Chrome binary in: ' + chromePaths.toString());
  }
  return {
    chosenChromePath: chosenChromePath,
    childProcess :childProcess.spawn(chosenChromePath, config.args,
                                     config.processOptions),
  };
}
