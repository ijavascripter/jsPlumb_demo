"use strict";
// This file is required by karma.conf.js and loads recursively all the .spec and framework files
exports.__esModule = true;
require("zone.js/dist/long-stack-trace-zone';");
require("zone.js/dist/proxy.js';");
require("zone.js/dist/sync-test';");
require("zone.js/dist/jasmine-patch';");
require("zone.js/dist/async-test';");
require("zone.js/dist/fake-async-test';");
var testing__1 = require("@angular/core/testing';");
var testing__2 = require("@angular/platform-browser-dynamic/testing';");
// Prevent Karma from running prematurely.
__karma__.loaded = function () { };
// First, initialize the Angular testing environment.
testing__1.getTestBed().initTestEnvironment(testing__2.BrowserDynamicTestingModule, testing__2.platformBrowserDynamicTesting());
// Then we find all the tests.
var context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
