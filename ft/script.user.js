// ==UserScript==
// @name         Auto Play
// @namespace    https://faptitans.com/
// @version      1.0
// @description  Automate the game play.
// @author       Anonymous
// @match        https://faptitans.com/
// @match        https://nutaku.faptitans.com/?tempId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faptitans.com
// @grant        none
// ==/UserScript==

window.FtConfig = {
  isOnBuyingHeroes: false,
  isOnBuyingAbilities: false,
  isOnActivatingAbilities: false,
  isLockAutoBuy: false,
  rebornAtMax: 350,
  rebornAtMin: 200,
  buyingMultiplierMin: 25,
  buyingMultiplierMax: 100,
  startingGoldBonus: 1000,
  startingDpsBonus: 500,
  isAutoPlay: false,
  isAutoReborn: false,
  isAutoClosePopup: false,
  gameSkills: [
    {
      id: 1,
      hotKeyCode: 49,
      name: "Swift hand",
      icon: "__caf2/rc/skill-icon01.png",
    },
    {
      id: 2,
      hotKeyCode: 50,
      name: "Ancestors Force",
      icon: "__1730/rc/skill-icon02.png",
    },
    {
      id: 3,
      hotKeyCode: 51,
      name: "Philosopher Stone",
      icon: "__913e/rc/skill-icon03.png",
    },
    {
      id: 4,
      hotKeyCode: 52,
      name: "Goldminer",
      icon: "__2f68/rc/skill-icon04.png",
    },
    {
      id: 5,
      hotKeyCode: 53,
      name: "Guild Master Power",
    },
    {
      id: 6,
      hotKeyCode: 54,
      name: "Master Attack",
      icon: "__12d7/rc/skill-icon06.png",
    },
    {
      id: 7,
      hotKeyCode: 55,
      name: "Blessing",
      icon: "__0e8f/rc/skill-icon07.png",
    },
  ],
};

function findModuleKeyByExports(modules, predicateFunc) {
  return Object.keys(modules).find((k) => predicateFunc(modules[k].exports));
}

function registerSymbols(appWindow) {
  if (appWindow._G) return; // already registered
  const id = (appWindow["_t"] = new Date().getTime());
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
      window.FtConfig.GameManager = appWindow._G;

      appWindow._U = appWindow._G.getUser();
      window.FtConfig.UserManager = appWindow._U;

      moduleKey = findModuleKeyByExports(
        modules,
        (exports) =>
          exports.prototype && exports.prototype.add && exports.prototype.gte
      );
      appWindow._N = require(moduleKey);
      window.FtConfig.NumberManager = appWindow._N;
    },
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function continueOnError() {
  let continueButton = document.querySelector(
    "#dialogContainer .btn-simple-gold.btn-ok"
  );

  if (continueButton) {
    continueButton.click();
    if (window.top != window) {
      window.parent.postMessage("FAPTITANS.ERROR", "*");
    }
  }
}

function closePopup() {
  let closeButton = document.querySelector("#popupContainer .btn-close-x");

  if (closeButton) {
    closeButton.click();
  }

  let closeButton2 = document.querySelector(
    "#popupContainer .mn-pop-btn-close-x"
  );

  if (closeButton2) {
    closeButton2.click();
  }
}

function buyHeroCards() {
  if (window.FtConfig.isLockAutoBuy) return;

  window.FtConfig.isOnBuyingHeroes = true;

  // Get the hero card button
  let heroCardButtons = document.querySelectorAll(
    ".left-panel .hero-card .color-btn.green"
  );

  for (let i = 0; i < heroCardButtons.length; i++) {
    // if the button is not disabled
    if (!heroCardButtons[i].classList.contains("disabled")) {
      sleep(200).then(() => {
        if (window.FtConfig.isLockAutoBuy) return;
        heroCardButtons[i].click();
      });
    }
  }

  window.FtConfig.isOnBuyingHeroes = false;
}

function buyHeroAbilities() {
  if (window.FtConfig.isLockAutoBuy) return;

  window.FtConfig.isOnBuyingAbilities = true;

  // Get the hero ability button
  let heroAbilityButtons = document.querySelectorAll(
    ".left-panel .hero-card .hero-abil-icon"
  );

  for (let i = 0; i < heroAbilityButtons.length; i++) {
    // if the button is not disabled
    if (!heroAbilityButtons[i].classList.contains("disable")) {
      sleep(200).then(() => {
        if (window.FtConfig.isLockAutoBuy) return;
        // We click the image inside the button
        heroAbilityButtons[i].querySelector(".icon").click();
      });
    }
  }

  window.FtConfig.isOnBuyingAbilities = false;
}

function activateHeroAbilities() {
  window.FtConfig.isOnActivatingAbilities = true;

  let availableAbilities = [];

  // Get the hero ability button
  let heroAbilityButtons = document.querySelectorAll(".left-panel .skills-pic");

  for (let i = 0; i < heroAbilityButtons.length; i++) {
    // if the button is not idle and not disabled
    if (
      !heroAbilityButtons[i].classList.contains("idle") &&
      !heroAbilityButtons[i].classList.contains("disabled") &&
      !heroAbilityButtons[i].classList.contains("in-progress")
    ) {
      availableAbilities.push(heroAbilityButtons[i]);
    }
  }

  if (availableAbilities.length > 0) {
    window.FtConfig.isLockAutoBuy = true;

    availableAbilities.forEach((ability, index) => {
      sleep(index * 500).then(() => {
        ability
          .querySelector(".icon")
          .dispatchEvent(new Event("click", { bubbles: true }));
      });
    });

    let waitingTime = availableAbilities.length * 500 + 1000;
    // Wait for all abilities to be activated
    sleep(waitingTime).then(() => {
      console.log(`Wait for all abilities to be activated in ${waitingTime}ms`);
      window.FtConfig.isOnActivatingAbilities = false;
      window.FtConfig.isLockAutoBuy = false;
    });
  } else {
    window.FtConfig.isOnActivatingAbilities = false;
    window.FtConfig.isLockAutoBuy = false;
  }
}

function getCurrentBossLevel() {
  let bossLevel = document.querySelector(".boss-lvl .text");
  if (bossLevel == null || bossLevel === undefined) {
    return 0;
  }
  return parseInt(bossLevel.textContent);
}

function setMultipleBuyAmount(amount) {
  let multipleBuyAmount = document.querySelectorAll(
    ".heroes-list-all-box .x2-btn-all-box .x2-btn"
  );

  if (multipleBuyAmount == null || multipleBuyAmount === undefined) {
    return;
  }

  for (let i = 0; i < multipleBuyAmount.length; i++) {
    let buttonText = multipleBuyAmount[i].querySelector(".x2-btn-text");

    if (buttonText == null || buttonText === undefined) {
      continue;
    }

    if (buttonText.textContent == "x" + amount) {
      multipleBuyAmount[i].dispatchEvent(
        new Event("mousedown", { bubbles: true })
      );
      return;
    }
  }
}

function rebornHero() {
  let rebornButton = document.querySelector(
    '.quest-box .icon[src*="/rc/ic-abil-reborn.png"]'
  );

  if (rebornButton == null || rebornButton === undefined) {
    return;
  }

  // We need to close the popup first if it's open
  if (document.querySelector("#popupContainer")) {
    closePopup();
    sleep(1000).then(() => {
      rebornHero();
    });
    return;
  }

  // If we have reborn button
  if (rebornButton) {
    sleep(500).then(() => {
      if (window._U === undefined) {
        registerSymbols(window);
      }
      window._U.reborn();

      // Wait for 1 second
      sleep(1000).then(() => {
        // find the reward button
        let rewardButton = document.querySelector(
          "#popupContainer .btn-simple-green.btn-ok"
        );

        // If we have reward button
        if (rewardButton) {
          // Click it
          rewardButton.click();

          sleep(1000).then(() => {
            setMultipleBuyAmount(100);
          });
        }
      });
    });
  }
}

function doReborn() {
  let returnToBoss = document.querySelector(".back-boss-box .color-btn");

  if (returnToBoss) {
    returnToBoss.dispatchEvent(new Event("click", { bubbles: true }));
  }

  if (getCurrentBossLevel() > window.FtConfig.rebornAtMax) {
    rebornHero();
  } else if (getCurrentBossLevel() >= window.FtConfig.rebornAtMin) {
    setMultipleBuyAmount(window.FtConfig.buyingMultiplierMin);
  } else {
    setMultipleBuyAmount(window.FtConfig.buyingMultiplierMax);
  }
}

function doClosePopup() {
  if (document.querySelector(".m-popup")) {
    closePopup();
    return;
  }
}

function StartApp() {
  console.log("Registering hotkeys");

  window.addEventListener("keypress", function (e) {
    if (
      window._G === undefined ||
      window._U === undefined ||
      window._N === undefined
    ) {
      registerSymbols(window);
    }

    if (e.key === "q" || e.key === "Q") {
      window.FtConfig.isLockAutoBuy = !window.FtConfig.isLockAutoBuy;
      console.log("Toggling auto buy mode: " + window.FtConfig.isLockAutoBuy);
    }

    if (e.key === "w" || e.key === "W") {
      if (
        window.FtConfig.AutoClosePopupInterval &&
        window.FtConfig.isAutoClosePopup
      ) {
        console.log("Stopping auto close popup, press W to start again.");
        window.FtConfig.isAutoClosePopup = false;
        clearInterval(window.FtConfig.AutoClosePopupInterval);
      } else {
        console.log("Starting auto close popup, press W to stop.");
        window.FtConfig.isAutoClosePopup = true;
        window.FtConfig.AutoClosePopupInterval = setInterval(function () {
          doClosePopup();
        }, 1000);
      }
    }

    if (e.key === "a" || e.key === "A") {
      if (window.FtConfig.AutoPlayInterval && window.FtConfig.isAutoPlay) {
        console.log("Stopping auto play, press A to start again.");
        window.FtConfig.isAutoPlay = false;
        clearInterval(window.FtConfig.AutoPlayInterval);
      } else {
        console.log("Starting auto play, press A to stop.");
        window.FtConfig.isAutoPlay = true;
        window.FtConfig.AutoPlayInterval = setInterval(function () {
          if (!window.DEBUG) continueOnError();
          if (
            !window.FtConfig.isOnActivatingAbilities &&
            !window.FtConfig.isLockAutoBuy
          ) {
            if (!window.FtConfig.isOnBuyingAbilities) {
              buyHeroAbilities();
            }

            if (!window.FtConfig.isOnBuyingHeroes) {
              buyHeroCards();
            }

            activateHeroAbilities();
          }
        }, 1000);
      }
    }

    if (e.key === "s" || e.key === "S") {
      if (window.FtConfig.AutoRebornInterval && window.FtConfig.isAutoReborn) {
        console.log("Stopping auto reborn, press S to start again.");
        window.FtConfig.isAutoReborn = false;
        clearInterval(window.FtConfig.AutoRebornInterval);
      } else {
        console.log("Starting auto reborn, press S to stop.");

        window.FtConfig.isAutoReborn = true;

        let returnToBoss = document.querySelector(".back-boss-box .color-btn");

        if (returnToBoss) {
          returnToBoss.dispatchEvent(new Event("click", { bubbles: true }));
        }

        setMultipleBuyAmount(window.FtConfig.buyingMultiplierMax);

        window.FtConfig.AutoRebornInterval = setInterval(function () {
          doReborn();
        }, 30000);
      }
    }

    if (e.key === "d") {
      console.log("Adding 100x DPS");
      window._U.get("multipliers").add("DPS", { value: new window._N(100) });
    }

    if (e.key === "D") {
      console.log("Adding 1000x DPS");
      window._U.get("multipliers").add("DPS", { value: new window._N(1000) });
    }

    if (e.key === "f") {
      console.log("Removing 100x DPS");
      window._U.get("multipliers").add("DPS", { value: new window._N(-100) });
    }

    if (e.key === "F") {
      console.log("Removing 1000x DPS");
      window._U.get("multipliers").add("DPS", { value: new window._N(-1000) });
    }

    if (e.key === "g") {
      console.log("Adding 100x Gold");
      window._U.get("multipliers").add("gold", { value: new window._N(100) });
    }

    if (e.key === "G") {
      console.log("Adding 1000x Gold");
      window._U.get("multipliers").add("gold", { value: new window._N(1000) });
    }

    if (e.key === "h") {
      console.log("Removing 100x Gold");
      window._U.get("multipliers").add("gold", { value: new window._N(-100) });
    }

    if (e.key === "H") {
      console.log("Removing 1000x Gold");
      window._U.get("multipliers").add("gold", { value: new window._N(-1000) });
    }
  });
}

window.DEBUG = 0;
StartApp();
