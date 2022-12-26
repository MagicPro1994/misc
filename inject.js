function registerSymbols(appWindow) {
  function findModuleKeyByExports(modules, predicateFunc) {
    return Object.keys(modules).find((k) => predicateFunc(modules[k].exports));
  }
  const id = (window["_t"] = new Date().getTime());
  appWindow.webpackJsonp([id], {
    0: function (module, exports, require) {
      var modulesKey = Object.keys(require).find(
        (k) => require[k]["0"] && require[k]["0"].exports
      );
      var modules = (appWindow["_" + id] = require[modulesKey]);
      var moduleKey = findModuleKeyByExports(
        modules,
        (exports) => typeof exports.getUser == "function" && !!exports.app
      );
      appWindow._G = require(moduleKey);
      appWindow._U = appWindow._G.getUser();
      moduleKey = findModuleKeyByExports(
        modules,
        (exports) =>
          exports.prototype && exports.prototype.add && exports.prototype.gte
      );
      appWindow._N = require(moduleKey);
    },
  });
}

window.addEventListener("load", function () {
    registerSymbols(window);
});
