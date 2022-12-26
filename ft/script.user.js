// ==UserScript==
// @name         Auto Play
// @namespace    https://faptitans.com/
// @version      1.0
// @description  Automate the game play.
// @author       Anonymous
// @require      https://magicpro1994.github.io/misc/ft/library.js
// @match        https://faptitans.com/
// @match        https://nutaku.faptitans.com/?tempId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faptitans.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  window.addEventListener("load", function () {
    StartApp();
  });
})();
