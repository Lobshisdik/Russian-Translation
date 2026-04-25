/*:
 * @target MZ
 * @plugindesc If only 1 actor and 1 enemy are alive, skip all menus and auto-attack the enemy. 🎯🥋
 * @author OmniLex
 */

(() => {
  const _BattleManager_startInput = BattleManager.startInput;
  BattleManager.startInput = function() {
    const aliveActors = this.allBattleMembers().filter(actor => actor.isAlive());
    const aliveEnemies = this._enemies.aliveMembers();

    if (aliveActors.length === 1 && aliveEnemies.length === 1) {
      const actor = aliveActors[0];
      actor.clearActions();
      const action = new Game_Action(actor);
      action.setAttack(); // Default attack
      action.setTarget(0); // Only one enemy
      actor.setAction(0, action);
      this._subject = actor;
      this.startTurn(); // Skip input phase, go straight to action
    } else {
      _BattleManager_startInput.call(this);
    }
  };

  // Prevent the actor command window from showing in this case
  const _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
  Scene_Battle.prototype.startActorCommandSelection = function() {
    const aliveActors = BattleManager.allBattleMembers().filter(actor => actor.isAlive());
    const aliveEnemies = BattleManager.opponentsUnit().aliveMembers();

    if (aliveActors.length === 1 && aliveEnemies.length === 1) {
      // Do nothing: skip actor command window entirely
      return;
    }

    _Scene_Battle_startActorCommandSelection.call(this);
  };
})();
