/* Get the basis for stuff. */

function get(get) {
  return document.getElementById(get)
}

function getSaveFile() {
  return {
    size: new OmegaNum(1),
    lastTick: Date.now(),
    autosave: true,
    tab: "main",
    prestige: {
      points: new OmegaNum(0),
      spent: new OmegaNum(0),
      depth: new OmegaNum(0),
      unlockedUpgrades: false,
      upgrades: [new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0),new OmegaNum(0)]
    },
    quarks: {
      unlocked: false,
      colors: [new OmegaNum(0),new OmegaNum(0),new OmegaNum(0)],
      gluon: new OmegaNum(1)
    },
    hadrons: {
      unlocked: false,
      hadrons: new OmegaNum(0),
      boosters: new OmegaNum(0)
    }
  }
}

function transformToON(obj) {
  obj.size = new OmegaNum(obj.size)
  obj.prestige.points = new OmegaNum(obj.prestige.points)
  obj.prestige.depth = new OmegaNum(obj.prestige.depth)
  obj.prestige.spent = new OmegaNum(obj.prestige.spent)
  for (i in obj.prestige.upgrades) {
    obj.prestige.upgrades[i] = new OmegaNum(obj.prestige.upgrades[i])
  }
  if (obj.quarks) {
    for (i in obj.quarks.colors) {
      obj.quarks.colors[i] = new OmegaNum(obj.quarks.colors[i])
    }
    obj.quarks.gluon = new OmegaNum(obj.quarks.gluon)
  }
  if (obj.hadrons) {
    obj.hadrons.hadrons = new OmegaNum(obj.hadrons.hadrons)
    obj.hadrons.boosters = new OmegaNum(obj.hadrons.boosters)
  }
  return obj
}

function checkForVars() { // put new variables here whenever defined
  if (saveFile.prestige.unlockedUpgrades === undefined) saveFile.prestige.unlockedUpgrades = false;
  if (saveFile.tab === undefined) saveFile.tab = "main"
  if (saveFile.prestige.upgrades[3]===undefined || saveFile.prestige.upgrades[4]===undefined || saveFile.prestige.upgrades[5]===undefined) {
    saveFile.prestige.upgrades[3] = new OmegaNum(0)
    saveFile.prestige.upgrades[4] = new OmegaNum(0)
    saveFile.prestige.upgrades[5] = new OmegaNum(0)
  }
  if (saveFile.prestige.upgrades[6]===undefined || saveFile.prestige.upgrades[7]===undefined || saveFile.prestige.upgrades[8]===undefined) {
    saveFile.prestige.upgrades[6] = new OmegaNum(0)
    saveFile.prestige.upgrades[7] = new OmegaNum(0)
    saveFile.prestige.upgrades[8] = new OmegaNum(0)
  }
  if (saveFile.prestige.upgrades[9]===undefined || saveFile.prestige.upgrades[10]===undefined || saveFile.prestige.upgrades[11]===undefined) {
    saveFile.prestige.upgrades[9] = new OmegaNum(0)
    saveFile.prestige.upgrades[10] = new OmegaNum(0)
    saveFile.prestige.upgrades[11] = new OmegaNum(0)
  }
  if (saveFile.prestige.spent===undefined) {
    alert("Because your save is older, you should hard reset in order to fix an issue with respeccing prestige upgrades properly.")
    saveFile.prestige.spent = new OmegaNum(0);
  }
  if (saveFile.quarks === undefined) {
    saveFile.quarks = {};
    saveFile.quarks.unlocked = false;
    saveFile.quarks["colors"] = [];
    for (let i = 0; i < 2; i++) {
      saveFile.quarks.colors[i] = new OmegaNum(0)
    }
    saveFile.quarks.gluon = new OmegaNum(0)
  } else {
    if (saveFile.quarks.gluon===undefined || saveFile.quarks.gluon.isNaN()) saveFile.quarks.gluon = new OmegaNum(0);
  }
  if(saveFile.hadrons === undefined) {
    saveFile.hadrons = {};
    saveFile.hadrons.unlocked = false;
    saveFile.hadrons.hadrons = new OmegaNum(0);
    saveFile.hadrons.boosters = new OmegaNum(0);
  }
  if (saveFile.autosave === undefined) saveFile.autosave = true;
}

function meterFormat(number) {
  let numbah = new OmegaNum(number)
  if (numbah.lt(0.001)) return 0;
  if (numbah.sqrt().lt(9.461e15)) {
    return numbah.sqrt().toStringWithDecimalPlaces(3) + " m"
  } else {
    return numbah.sqrt().div(9.461e15).toStringWithDecimalPlaces(3) + " ly"
  }
}

function format(number) {
  let numbah = new OmegaNum(number)
  if (numbah.lt(0.001)) return 0;
  return numbah.toStringWithDecimalPlaces(3)
}

function load() {
  saveFile = getSaveFile()
  if(localStorage.getItem('universeExpandSave') !== undefined) saveFile = transformToON(JSON.parse(localStorage.getItem('universeExpandSave')));
  checkForVars()
}

function save() {
  localStorage.setItem('universeExpandSave', JSON.stringify(saveFile));
}

function hardReset() {
  if (!confirm("Are you sure you want to reset everything? You won't be able to undo this!")) return;
  saveFile = getSaveFile();
  save();
}

function toggleAutosave() {
  saveFile.autosave = !saveFile.autosave
}

function exportSave() {
  let str = btoa(JSON.stringify(saveFile))
  
  const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
  el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
}

function importSave() {
  let sav = prompt("Paste your save data here")
  if (sav=="" || sav===undefined || sav===null) return
  let storedSave = JSON.stringify(saveFile)
  try {
    saveFile = transformToON(JSON.parse(atob(sav)))
    save();
    load();
  } catch(e) {
    saveFile = transformToON(JSON.parse(storedSave))
  }
}

function showTab(name) {
  saveFile.tab = name
}