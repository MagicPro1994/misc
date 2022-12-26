// bootstrap script
(function (window) {
    function findModuleKeyByExports(modules, predicateFunc) {
        return Object.keys(modules).find(k => predicateFunc(modules[k].exports));
    }
    const id = window['_t'] = (new Date()).getTime();
    window.webpackJsonp(
        [id],
        {
            0: function(module, exports, require) {
                var modulesKey = Object.keys(require).find(k => require[k]['0'] && require[k]['0'].exports);
                var modules = window['_' + id] = require[modulesKey];
                var moduleKey = findModuleKeyByExports(modules, exports => typeof exports.getUser == 'function' && !!exports.app);
                window._G = require(moduleKey);
                window._U = window._G.getUser();
                moduleKey = findModuleKeyByExports(modules, exports => exports.prototype && exports.prototype.add && exports.prototype.gte);
                window._N = require(moduleKey);
            }
        }
    );
})(window);