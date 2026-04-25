//=============================================================================
// RPG Maker MZ - Individual Turn Battle System - Version 1.1
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Implements a battle system where your action takes place straight after your input.
 * @author Fomar0153
 *
 * @param Battle Turn Order Formula
 * @type string
 * @desc This is a calculation that determines the initial battle order.
 * @default this.agi + Math.randomInt(this.agi / 2)
 *
 * @param Use Party Command Window
 * @type boolean
 * @desc If you hit cancel on the Actor Command Window, show the Party Command Window instead of skipping the turn.
 * @default true
 *
 * @param Add Pass to Party Command Window
 * @type boolean
 * @desc If you are using thr party command window, would you like the pass option added to it?
 * @default true
 *
 * @param Pass Command Name
 * @type string
 * @desc This is the text displayed for the pass command.
 * @default Pass
 *
 * @help Fomar0153_IndividualTurnBattleSystem.js
 * Some examples of the Battle Turn Order Formula:
 * this.agi
 * The battle order will strictly be in order of agility.
 * this.agi + Math.randomInt(this.agi / 2)
 * This will bias the turn order to the fastest combatants but allow for some deviation.
 *
 * Version 1.0 -> 1.1
 * Bug fixes! Specifically to do with restrictions on status effects.
 */

var Fomar = Fomar || {};
Fomar.ITBS = {};

Fomar.ITBS.parameters = PluginManager.parameters('Fomar0153_IndividualTurnBattleSystem');

Fomar.ITBS.battleAgi = Fomar.ITBS.parameters["Battle Turn Order Formula"] || "this.agi";
Fomar.ITBS.partyCommand = (Fomar.ITBS.parameters["Use Party Command Window"] == "true");
Fomar.ITBS.passCommand = (Fomar.ITBS.parameters["Add Pass to Party Command Window"] == "true");
Fomar.ITBS.passText = Fomar.ITBS.parameters["Pass Command Name"] || "Pass";

(() => {

  BattleManager.isTpb = function() {
    return true;
  };

  Fomar.ITBS.BattleManager_initMembers = BattleManager.initMembers;
  BattleManager.initMembers = function() {
    Fomar.ITBS.BattleManager_initMembers.call(this);
    this._battlers = [];
  };

  Fomar.ITBS.BattleManager_startBattle = BattleManager.startBattle;
  BattleManager.startBattle = function() {
    Fomar.ITBS.BattleManager_startBattle.call(this);
    this._battlers = [];
    $gameParty.aliveMembers().concat($gameTroop.aliveMembers()).forEach((member) => {
      this._battlers.push(member);
    });
    this._battlers.sort(function(a, b) {
      return b._battleAgi - a._battleAgi
    });
    // On the first turn, party members always act before enemies
    const partyFirst = this._battlers.filter(b => b.isActor());
    const enemyFirst = this._battlers.filter(b => !b.isActor());
    this._battlers = partyFirst.concat(enemyFirst);
  };

  BattleManager.updateTurn = function(timeActive) {
    $gameParty.requestMotionRefresh();
    if (!this._subject && !this._currentActor) {
      this.updateTpb();
    }
    if (this._subject) {
      this.processTurn();
    }
  };

  BattleManager.updateTpb = function() {
    $gameParty.members().concat($gameTroop.members()).forEach((member) => {
      if (!member.isAlive()) {
        this._battlers.remove(member);
      } else {
        if (!this._battlers.includes(member)) {
          this._battlers.push(member);
        }
      }
    });
    if (this._battlers[0]) {
      this._battlers[0].onTurnEnd();
      if (this._battlers[0].isActor()) {
        if (this._battlers[0].canMove()) {
          if (this._battlers[0].canInput()) {
            this._inputting = true;
            this._currentActor = this._battlers[0];
            this._currentActor.makeActions();
            this.startActorInput();
          } else {
            this._subject = this._battlers[0];
            this._subject.makeActions();
          }
        }
      } else {
        this._subject = this._battlers[0];
        this._subject.makeActions();
        $gameTroop.increaseTurn();
      }
      this._battlers.remove(this._battlers[0]);
    }
  };

  BattleManager.updateTpbInput = function() {
    // done elsewhere now
  };

  BattleManager.finishActorInput = function() {
    if (this._currentActor) {
      this._subject = this._currentActor;
      this._inputting = false;
    }
  };

  BattleManager.changeCurrentActor = function(forward) {
      this._currentActor = null;
  };

  Fomar.ITBS.Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
  Game_Battler.prototype.onBattleStart = function(advantageous) {
    Fomar.ITBS.Game_Battler_onBattleStart.call(this);
    this._battleAgi = eval(Fomar.ITBS.battleAgi);
    if (advantageous) {
      this._battleAgi *= 2;
    }
  };

  Game_Battler.prototype.canInput = function() {
    return Game_BattlerBase.prototype.canInput.call(this);
  };

  Game_Battler.prototype.applyTpbPenalty = function() {
    // surely failing to escape is penalty enough?
  };

  Window_StatusBase.prototype.placeTimeGauge = function(actor, x, y) {
    // no time bar, thanks
  };

  Window_PartyCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.fight, "fight");
    if (Fomar.ITBS.passCommand) {
      this.addCommand(Fomar.ITBS.passText, "pass");
    }
    this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
  };

  Fomar.ITBS.Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
  Scene_Battle.prototype.createPartyCommandWindow = function() {
    Fomar.ITBS.Scene_Battle_createPartyCommandWindow.call(this);
    this._partyCommandWindow.setHandler("pass", this.commandPass.bind(this));
  };

  Scene_Battle.prototype.startPartyCommandSelection = function() {
    this._statusWindow.show();
    this._statusWindow.open();
    this._actorCommandWindow.close();
    this._partyCommandWindow.setup();
  };

  Scene_Battle.prototype.commandCancel = function() {
    if (Fomar.ITBS.partyCommand) {
      this.startPartyCommandSelection();
    } else {
      this.selectPreviousCommand();
    }
  };

  Scene_Battle.prototype.commandFight = function() {
    this._partyCommandWindow.close();
    this._actorCommandWindow.open();
    this._actorCommandWindow.activate();
  };

  Scene_Battle.prototype.commandPass = function() {
    this.selectNextCommand();
  };

  Scene_Battle.prototype.commandEscape = function() {
    BattleManager.processEscape();
    this.selectNextCommand();
  };

})();
