"use strict";
exports.__esModule = true;
var core__1 = require("@angular/core';");
var platform_browser_dynamic__1 = require("@angular/platform-browser-dynamic';");
var app_module__1 = require("./app/app.module';");
var environment__1 = require("./environments/environment';");
if (environment__1.environment.production) {
    core__1.enableProdMode();
}
platform_browser_dynamic__1.platformBrowserDynamic().bootstrapModule(app_module__1.AppModule)["catch"](function (err) { return console.log(err); });
