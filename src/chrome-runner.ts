/// <reference path='../../third_party/typings/node/node.d.ts' />

// Platform independnet way to run the Chrome binary using node.

import path = require('path');
import childProcess = require('child_process');
import fs = require('fs');

export interface PlatformPaths {
  windowsXp      ?: string[];
  windowsVista   ?: string[];
  macSystem      ?: string[];
  macUser        ?: string[];
  linuxSystem    ?: string[];
  [other:string] : string[];
}

var chromeStablePaths :PlatformPaths = {
  windowsXp:
      [path.join(process.env['HOMEPATH'] || '',
        'Local Settings\\Application Data\\Google\\Chrome\\Application\\chrome.exe')],
  windowsVista:
      [path.join(process.env['USERPROFILE'] || '',
        '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe')],
  macSystem: ['/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'],
  macUser: [path.join(process.env['HOME'] || '', '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome')],
  linuxSystem: ['/usr/bin/google-chrome',
                '/usr/local/bin/google-chrome',
                '/opt/bin/google-chrome'],
}

var chromeCanaryPaths :PlatformPaths = {
  windowsXp:
      [path.join(process.env['HOMEPATH'] || '',
        'Local Settings\\Application Data\\Google\\Chrome\ SxS\\Application\\chrome.exe')],
  windowsVista:
      [path.join(process.env['USERPROFILE'] || '',
        '\\AppData\\Local\\Google\\Chrome\ SxS\\Application\\chrome.exe')],
  macSystem: ['/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'],
  macUser: [path.join(process.env['HOME'] || '', '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary')],
  linuxSystem: ['/usr/bin/google-chrome-unstable',
                '/usr/local/bin/google-chrome-unstable',
                '/opt/bin/google-chrome-unstable']
}

export var chromePaths = {
  stable: chromeStablePaths,
  canary: chromeCanaryPaths
};

// Utility function to pick the first path for chrome that exists in the
// filesystem (searches in order, lexographically first of version specified,
// and then for that version for each platform path). Returns null if no path
// if found.
export function pickFirstPath(chromePathsForVersions:PlatformPaths[])
    : string {
  for(var i = 0; i < chromePathsForVersions.length; ++i) {
    var chromePaths = chromePathsForVersions[i];
    for (var pathName in chromePaths) {
      var paths = chromePaths[pathName];
      for (var j = 0; j < paths.length; j++) {
        var path = paths[j];
        if (fs.existsSync(path)) return path;
      }
    }
  }

  return null;
}

export interface NodeChildProcessOptions
  { cwd?: string; stdio?: any; custom?: any; env?: any; detached?: boolean; };

// Run the chrome binary.
export function runChrome(
    config:{ path     ?:string;
             versions ?:PlatformPaths[];
             args     ?:string[];
             processOptions?:NodeChildProcessOptions;
    } = {}) : { path :string;
                childProcess :childProcess.ChildProcess } {

  var chromePathsForVersions :PlatformPaths[] =
      config.path ? [{ other: [config.path] }]
                  : config.versions
                    || [chromePaths.stable, chromePaths.canary];
  var chosenChromePath = pickFirstPath(chromePathsForVersions);

  if (!chosenChromePath) {
    throw new Error('Cannot find Chrome binary in: ' + JSON.stringify(chromePathsForVersions));
  }
  return {
    path: chosenChromePath,
    childProcess :childProcess.spawn(chosenChromePath, config.args,
                                     config.processOptions),
  };
}
