var saveFile;

load()

function getPrestigeUpgradeEffect(num) {
  let x;
  switch (num) {
    case 1:
      return saveFile.prestige.upgrades[0].times(PU1Each())
      break; 
    case 2:
      return saveFile.prestige.upgrades[1].div(5).add(1)
      break;
    case 3:
      return saveFile.prestige.upgrades[2].add(getPrestigeUpgradeEffect(9)).add(1).pow(0.05)
      break;
    case 4:
      return OmegaNum.pow(1.1, saveFile.prestige.upgrades[3])
      break;
    case 5:
      return OmegaNum.pow(1.5, saveFile.prestige.upgrades[4])
      break;
    case 6: 
      return OmegaNum.mul(0.2, saveFile.prestige.upgrades[5].sqrt()).plus(1)
      break;
    case 7:
      return saveFile.hadrons.hadrons.plus(1).log10().plus(1).pow(saveFile.prestige.upgrades[6].sqrt()).sqrt()
      break;
    case 8:
      return saveFile.hadrons.boosters.plus(1).plus(1).pow(saveFile.prestige.upgrades[7].sqrt()).sqrt()
      break;
    case 9:
      x = saveFile.prestige.upgrades[8]
      if (x.gte(5)) x = x.cbrt().times(ExpantaNum.pow(5, 2/3)).div(2).plus(2.5)
      return saveFile.quarks.colors[0].plus(1).log10().plus(1).pow(x.sqrt()).sub(1)
      break;
    case 10:
      x = saveFile.prestige.upgrades[9]
      if (x.gte(5)) x = x.cbrt().times(ExpantaNum.pow(5, 2/3)).div(2).plus(2.5)
      return saveFile.quarks.colors[1].plus(1).log10().plus(1).pow(x.pow(0.2))
      break;
    case 11:
      x = saveFile.prestige.upgrades[10]
      if (x.gte(5)) x = x.cbrt().times(ExpantaNum.pow(5, 2/3)).div(2).plus(2.5)
      return saveFile.quarks.colors[2].plus(1).logBase(200).plus(1).pow(x.div(10))
      break;
    case 12: 
      x = saveFile.prestige.upgrades[11]
      if (x.gte(5)) x = x.cbrt().times(ExpantaNum.pow(5, 2/3)).div(2).plus(2.5)
      return saveFile.quarks.gluon.plus(1).log10().plus(1).log10().div(25).times(x)
      break;
  }
}

function getPrestigeUpgradeDesc(num) {
  let eff = getPrestigeUpgradeEffect(num);
  switch(num) {
    case 1:
      return "-"+format(eff)
      break;
    case 2:
      return "x"+format(eff)
      break;
    case 3:
      return "^"+format(eff)
      break;
    case 4:
      return "x"+format(eff)
      break;
    case 5:
      return "x"+format(eff)
      break;
    case 6: 
      return "^"+format(eff)
      break;
    case 7:
      return "x"+format(eff)
      break;
    case 8:
      return "x"+format(eff)
      break;
    case 9:
      return "+"+format(eff)
      break;
    case 10:
      return "x"+format(eff)
      break;
    case 11:
      return "^"+format(eff)
      break;
    case 12:
      return "+"+format(eff)
      break;
  }
}

function unlockQuarks() {
  if (saveFile.quarks.unlocked) return;
  if (saveFile.prestige.depth.lt(8)) return;
  saveFile.quarks.unlocked = true;
}

function getQuarkMult(num) {
  let eff = new OmegaNum(1)
  if(num>0) eff = eff.add(saveFile.quarks.colors[num-1].add(1).log10().pow(2))
  else if(num==0) eff = eff.add(saveFile.quarks.colors[2].add(1).log10().pow(2))
  eff = eff.pow(getBoosterPower())
  eff = eff.root(1 + (num/0.05))
  eff = eff.mul(getPrestigeUpgradeEffect(4))
  return eff.div(10)
}

function getGluonGain() {
  var gluonGain = new OmegaNum(0);
  for (var i in saveFile.quarks.colors) {
      gluonGain = gluonGain.add(saveFile.quarks.colors[i].add(1).log10().div(i+1/3).pow(2))
  }
  gluonGain = gluonGain.mul(getPrestigeUpgradeEffect(5))
  gluonGain = gluonGain.mul(getPrestigeUpgradeEffect(7))
  return gluonGain;
}

function getGluonEff() {
  let eff = saveFile.quarks.gluon.plus(1).logBase(2).cbrt().plus(1)
  eff = eff.times(getPrestigeUpgradeEffect(10))
  eff = eff.pow(getPrestigeUpgradeEffect(6))
  eff = eff.pow(getBoosterPower())
  return eff;
}

function getHadronPow() {
  let eff = saveFile.hadrons.hadrons.add(1).logBase(15).cbrt().plus(1)
  return eff;
}

function unlockHadrons() {
    if (saveFile.quarks.gluon.lt(10000)) return;
    saveFile.hadrons.unlocked = true
}

function getHadronGain() {
  var hadronGain = new OmegaNum(0);
  hadronGain = hadronGain.add(saveFile.quarks.gluon.add(1).pow(0.01))
  hadronGain = hadronGain.mul(saveFile.prestige.depth.div(4))
  hadronGain = hadronGain.mul(getPrestigeUpgradeEffect(7))
  hadronGain = hadronGain.pow(getPrestigeUpgradeEffect(11))
  return hadronGain;
}

function getBoosterCost() {
  let cost = new OmegaNum(125)
  cost = cost.pow(saveFile.hadrons.boosters.add(1).sqrt())
  return cost;
}

function getBoosterPower() {
  let pow = saveFile.hadrons.boosters.add(1)
  pow = pow.pow(0.5)
  return pow
}

function buyBooster() {
  if (saveFile.hadrons.hadrons.lt(getBoosterCost())) return;
  saveFile.hadrons.hadrons = saveFile.hadrons.hadrons.sub(getBoosterCost())
  saveFile.hadrons.boosters = saveFile.hadrons.boosters.plus(1)
}

function updateHadrons(diff) {
  get("hadrontabbtn").style.display = saveFile.hadrons.unlocked?"inline-block":"none"
  get("prestUpgrs7").style.display = saveFile.hadrons.unlocked?"inline-block":"none"
  get("prestUpgrs8").style.display = saveFile.hadrons.unlocked?"inline-block":"none"
  get("prestUpgrs9").style.display = saveFile.hadrons.unlocked?"inline-block":"none"
  get("prestUpgrs10").style.display = saveFile.hadrons.boosters.gt(1)?"inline-block":"none"
  get("prestUpgrs11").style.display = saveFile.hadrons.boosters.gt(1)?"inline-block":"none"
  get("prestUpgrs12").style.display = saveFile.hadrons.boosters.gt(1)?"inline-block":"none"
  get("unlockHadrons").style.display = (saveFile.hadrons.unlocked||!saveFile.quarks.unlocked)?"none":"inline-block"
  get("hadronAmt").textContent = format(saveFile.hadrons.hadrons)
  get("hadronPower").textContent = format(getHadronPow())
  get("boosterAmt").textContent = format(saveFile.hadrons.boosters)
  get("boosterCost").textContent = format(getBoosterCost())
  get("boosterPower").textContent = format(getBoosterPower())
  if(saveFile.hadrons.unlocked) saveFile.hadrons.hadrons = saveFile.hadrons.hadrons.add(getHadronGain().mul(diff))
}

function updateQuarks(diff) {
  get("unlockQuarks").style.display = (saveFile.quarks.unlocked||!saveFile.prestige.unlockedUpgrades)?"none":"inline-block"
  get("quarktabbtn").style.display = saveFile.quarks.unlocked?"inline-block":"none"
  get("prestUpgrs4").style.display = saveFile.quarks.unlocked?"inline-block":"none"
  get("prestUpgrs5").style.display = saveFile.quarks.unlocked?"inline-block":"none"
  get("prestUpgrs6").style.display = saveFile.quarks.unlocked?"inline-block":"none"
  for (var i in saveFile.quarks.colors) {
    if (saveFile.quarks.unlocked) {
      saveFile.quarks.colors[i] = saveFile.quarks.colors[i].add(OmegaNum.mul(diff, getQuarkMult(i)))
    }
  }
  saveFile.quarks.gluon = saveFile.quarks.gluon.add(getGluonGain().mul(diff))
  get("quarksRed").textContent = format(saveFile.quarks.colors[0])
  get("quarksBlue").textContent = format(saveFile.quarks.colors[1])
  get("quarksGreen").textContent = format(saveFile.quarks.colors[2])
  get("quarksRedMult").textContent = format(saveFile.quarks.colors[0].add(1).log10().pow(2).pow(getBoosterPower()))
  get("quarksBlueMult").textContent = format(saveFile.quarks.colors[1].add(1).log10().pow(2).root(1.05).pow(getBoosterPower()))
  get("quarksGreenMult").textContent = format(saveFile.quarks.colors[2].add(1).log10().pow(2).root(1.1).pow(getBoosterPower()))
  get("gluonLength").textContent = meterFormat(saveFile.quarks.gluon)
  get("gluonPower").textContent = format(getGluonEff())
}

function getSubbedPrestigeDepths() {
  let d = new OmegaNum(0);
  d = d.plus(getPrestigeUpgradeEffect(1));
  return d;
}

function getPrestigeEff() {
  let eff = saveFile.prestige.depth.plus(1).cbrt();
  eff = eff.pow(getPrestigeUpgradeEffect(3));
  return eff
}

function getGrowthSpeed() {
  let speed = getPrestigeEff(); 
  if (saveFile.quarks.unlocked) speed = speed.times(getGluonEff())
  
  // Leave till the end
  if (speed.gte(getUniverseSlowdownStart())) speed = speed.pow(OmegaNum.pow(getUniverseSlowdownPower(), -1))
  return speed;
}

function respecPrestUpgs() {
  let s = false
  saveFile.prestige.upgrades.map(a => s = (s || OmegaNum.gte(a, 1)))
  if (!s) return;
  if (!confirm("Are you sure you want to reset your Prestige Upgrades?")) return
  saveFile.prestige.upgrades = getSaveFile().prestige.upgrades
  saveFile.prestige.points = saveFile.prestige.points.plus(saveFile.prestige.spent)
  saveFile.prestige.spent = new OmegaNum(0);
}

function getPrestigeGoal() {
  return new OmegaNum(1.1).pow(saveFile.prestige.depth.sub(getSubbedPrestigeDepths()).div(3).add(1).pow(3).plus(1))
}

function PU1Each() {
  let eff = new OmegaNum(0.1);
  eff = eff.plus(getPrestigeUpgradeEffect(12))
  return eff;
}

function updatePrestige() {
  get("PU1each").textContent = format(PU1Each())
  get("prestigeGoal").innerHTML = meterFormat(getPrestigeGoal())
  get("prestigeDepth").innerHTML = format(saveFile.prestige.depth.add(1))
  get("prestigeDiv").style.display = saveFile.prestige.depth.gt(0)?"inline-block":"none"
  get("prestigeDepths").textContent = format(saveFile.prestige.depth)
  get("prestigeEff").textContent = format(getPrestigeEff())
  get("prestigePoints").textContent = format(saveFile.prestige.points)
  get("unlockPrestUpgrs").style.display = (saveFile.prestige.unlockedUpgrades||saveFile.prestige.depth.eq(0))?"none":"inline-block"
  get("prestigeUpgrs").style.display = saveFile.prestige.unlockedUpgrades?"inline-block":"none"
  for (let i=1;i<=12;i++) {
    get("prestUpgrs"+i+"Cost").textContent = format(getPrestUpgrCost(i))
    get("prestUpgrs"+i+"Desc").textContent= getPrestigeUpgradeDesc(i)
    get("prestUpgrs"+i+"Lvl").textContent= format(saveFile.prestige.upgrades[i-1])
  }
}

function getPrestUpgrCost(num, amt=saveFile.prestige.upgrades[num-1]) {
  if (amt.gte(10)) amt = OmegaNum.pow(amt, 2).times(10) // yay cost scaling
  let cost = new OmegaNum(1).mul(new OmegaNum(num).mul(new OmegaNum(amt).add(1).sqrt()));
  return cost.round();
}

function buyPrestUpgrs(num) {
  if(saveFile.prestige.points.lt(getPrestUpgrCost(num))) return;
  let cost = getPrestUpgrCost(num)
  saveFile.prestige.upgrades[num-1] = saveFile.prestige.upgrades[num-1].add(1)
  saveFile.prestige.points = saveFile.prestige.points.sub(cost)
  saveFile.prestige.spent = saveFile.prestige.spent.plus(cost)
}

function unlockPrestigeUpgrades() {
    if (saveFile.prestige.points.lt(10)) return;
    if (!confirm("Are you sure you want to unlock Prestige Upgrades? You won't be able to get back your Prestige Points immediately!")) return;
    saveFile.prestige.points = saveFile.prestige.points.sub(10)
    saveFile.prestige.unlockedUpgrades = true
}

function prestige() {
  if(saveFile.size.lt(getPrestigeGoal())) return;
  saveFile.prestige.points = saveFile.prestige.points.add(saveFile.prestige.depth.plus(1)) // depth is changed afterwards
  saveFile.prestige.depth = saveFile.prestige.depth.add(1)
  saveFile.size = new OmegaNum(1)
  saveFile.quarks.gluon = new OmegaNum(0)
}

function getUniverseSlowdownStart() {
  let me = new OmegaNum(2)
  
  me = me.mul(getPrestigeUpgradeEffect(2))
  if (saveFile.hadrons.unlocked) me = me.mul(getHadronPow())
  
  return me
}

function getUniverseSlowdownPower() {
  let pow = new OmegaNum(1.5)
  return pow;
}

function getCompactedStart() {
  let hi = new OmegaNum(10000)
  
  if (saveFile.hadrons.unlocked) hi = hi.mul(getHadronPow().pow(2))
  
  return hi
}

function getNewSize(diff) {
  let projected = saveFile.size.mul(OmegaNum.pow(OmegaNum.pow(1.01, getGrowthSpeed()), diff)); // x1.01/sec
  if (projected.lt(getCompactedStart())) return projected
  else return saveFile.size.plus(OmegaNum.mul(getGrowthSpeed(), diff/20)) // +0.05m/sec
}

function updateTabs() {
  let tabs = document.getElementsByClassName("tab")
  for (let i=0;i<tabs.length;i++) {
    let tab = tabs[i];
    tab.style.display = saveFile.tab==tab.id?"inline-block":"none"
  }
}

function loop() {
  var diff = (Date.now() - saveFile.lastTick) / 1000
  saveFile.size = getNewSize(diff)
  get("universeType").textContent = saveFile.size.gt(getCompactedStart())?"compacted ":""
  get("universeSize").textContent = meterFormat(saveFile.size)
  get("universeSlowDown").textContent = getGrowthSpeed().gte(getUniverseSlowdownStart())?("The growth of the universe has slowed down beyond the growth rate of x"+format(getUniverseSlowdownStart())+"/sec"):""
  get("autosave").textContent = "Autosave: "+(saveFile.autosave?"ON":"OFF")
  saveFile.lastTick = Date.now()
  updateTabs()
  updatePrestige()
  updateQuarks(diff)
  updateHadrons(diff)
}

setInterval(function() {loop()}, 20)
setInterval(function() {
  if (saveFile.autosave) save();
}, 200)