window.FtConfig = {
  isOnBuyingHeroes: false,
  isOnBuyingAbilities: false,
  isOnActivatingAbilities: false,
  isLockAutoBuy: false,
  rebornAtMax: 350,
  rebornAtMin: 200,
  buyingMultiplierMin: 25,
  buyingMultiplierMax: 200,
  startingGoldBonus: 1000,
  startingDpsBonus: 500,
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
  window.FtConfig.isOnBuyingHeroes = true;
  // Get the hero card button
  let heroCardButtons = document.querySelectorAll(
    ".left-panel .hero-card .color-btn.green"
  );
  for (let i = 0; i < heroCardButtons.length; i++) {
    // if the button is not disabled
    if (!heroCardButtons[i].classList.contains("disabled")) {
      sleep(200).then(() => {
        // click it
        heroCardButtons[i].click();
      });
    }
  }
  window.FtConfig.isOnBuyingHeroes = false;
}

function buyHeroAbilities() {
  window.FtConfig.isOnBuyingAbilities = true;
  // Get the hero ability button
  let heroAbilityButtons = document.querySelectorAll(
    ".left-panel .hero-card .hero-abil-icon"
  );
  for (let i = 0; i < heroAbilityButtons.length; i++) {
    // if the button is not disabled
    if (!heroAbilityButtons[i].classList.contains("disable")) {
      sleep(200).then(() => {
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
      !heroAbilityButtons[i].classList.contains("disable") &&
      !heroAbilityButtons[i].classList.contains("in-progress")
    ) {
      availableAbilities.push(heroAbilityButtons[i]);
    }
  }

  if (availableAbilities.length > 0) {
    window.FtConfig.isLockAutoBuy = true;
    // Wait for all abilities to be activated
    sleep(availableAbilities.length * 500 + 2000).then(() => {
      window.FtConfig.isOnActivatingAbilities = false;
      window.FtConfig.isLockAutoBuy = false;
    });

    availableAbilities.forEach((ability, index) => {
      sleep(index * 500).then(() => {
        ability
          .querySelector(".icon")
          .dispatchEvent(new Event("click", { bubbles: true }));
      });
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
      if (window._U !== undefined) {
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

function StartApp() {
  window.addEventListener("keypress", function (e) {
    if (e.key === "q" || e.key === "Q") {
      window.FtConfig.isLockAutoBuy = !window.FtConfig.isLockAutoBuy;
    }

    if (e.key === "a" || e.key === "A") {
      if (window.FtConfig.AutoPlayInterval) {
        clearInterval(window.FtConfig.AutoPlayInterval);
      } else {
        window.FtConfig.AutoPlayInterval = setInterval(function () {
          continueOnError();
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
      if (window.FtConfig.AutoRebornInterval) {
        clearInterval(window.FtConfig.AutoRebornInterval);
      } else {
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
      window._U.get("multipliers").add("DPS", { value: new window._N(100) });
    }

    if (e.key === "D") {
      window._U.get("multipliers").add("DPS", { value: new window._N(1000) });
    }

    if (e.key === "f") {
      window._U.get("multipliers").add("DPS", { value: new window._N(-100) });
    }

    if (e.key === "F") {
      window._U.get("multipliers").add("DPS", { value: new window._N(-1000) });
    }

    if (e.key === "g") {
      window._U.get("multipliers").add("gold", { value: new window._N(100) });
    }

    if (e.key === "G") {
      window._U.get("multipliers").add("gold", { value: new window._N(1000) });
    }

    if (e.key === "h") {
      window._U.get("multipliers").add("gold", { value: new window._N(-100) });
    }

    if (e.key === "H") {
      window._U.get("multipliers").add("gold", { value: new window._N(-1000) });
    }
  });
}
