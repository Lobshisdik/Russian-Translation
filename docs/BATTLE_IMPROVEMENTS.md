# Battle System Improvement Proposals

Current stack: **IndividualBattleTurns** (AGI-based, action-after-input) + **BattleSystemEnhanced** (persistent HP, event spawns, health protection, danger warnings, biome/time filtering, reward popup).

What's absent: momentum, escalation, risk/reward tension, combos, player skill expression. All proposals below are additive — none break the existing systems.

---

## Proposal A: Hit Streak / Combo Counter

**Concept:** Track consecutive hits landed by the party without taking damage. Display a counter over the battle status. Multipliers kick in at thresholds.

**How it works:**
- A `_hitStreak` counter increments every time a party member deals damage.
- Counter resets when any party member takes damage (not blocked by health protection).
- Thresholds:
  - 3 hits → 1.1× damage
  - 6 hits → 1.25× damage
  - 10 hits → 1.5× damage
  - 15+ hits → 1.75× damage (caps here)
- Streak is displayed as a small animated label on-screen (e.g., `HIT × 10!`).
- At battle end, streak level multiplies EXP and gold rewards in the popup.
  - Max streak bonus: 1.75× gold/EXP.

**Reward integration:** The existing `_battleRewards` object gets a final multiplier applied before `createRewardsPopup()` is called.

**Synergy:** Enemies who deal AoE or have high-speed multi-hit attacks become more strategically threatening — they reset your streak. Tanky enemies that survive many hits are still rewarding.

**Implementation notes:**
- Hook into `Game_Action.prototype.apply` to detect successful hits.
- Hook into `Game_Battler.prototype.gainHp` (when negative) to detect incoming damage.
- Reset on `BattleManager.startBattle`.

---

## Proposal B: Kill Chain / Bounty Escalator (Map-Level)

**Concept:** Track how many enemy events have been defeated in a short real-time window on the overworld. Rewards escalate the faster you clear enemies.

**How it works:**
- A `_killChain` counter and `_killChainTimer` are stored in `$gameSystem`.
- Each time an "Enemy" event is defeated (battle result = victory), increment `_killChain` and reset `_killChainTimer` to 5 minutes (300 seconds).
- The timer counts down in real time. If it hits zero, `_killChain` resets to 0.
- Kill chain reward multiplier:
  - 1–2 kills → 1.0× (baseline)
  - 3–5 kills → 1.15×
  - 6–10 kills → 1.3×
  - 11–15 kills → 1.5×
  - 16+ kills → 1.75×
- A HUD element (top-left corner, small) shows the current chain count: `⚔ ×8`.
- High kill chains also raise Variable 66 (bounty) by a small amount per kill tier.

**Synergy with existing systems:**
- Fast travel breaking the chain is a natural soft penalty for teleporting away mid-grind.
- Ties into CrimeSystem — killing lots of enemies rapidly makes you "notorious."
- Danger warning (enemy 13+ levels above party) can optionally display "HIGH RISK – chain maintained."

**Chain breakers:**
- Escaping from any battle.
- Resting / sleeping.
- Fast traveling.
- Time passing past the window.

---

## Proposal C: Flow State / Momentum Meter

**Concept:** A shared party meter that fills through aggressive, skilled play and unlocks a party-wide "Flow State" buff when full.

**Meter fills when:**
- Landing a critical hit (+15%)
- Defeating an enemy (+20%)
- Using a skill (not Attack) (+5%)
- Enemy misses the party (+10%)
- Health protection triggering (+5% — surviving a lethal hit should feel empowering)

**Meter drains when:**
- Any party member takes more than 25% of their max HP in one hit (−20%)
- A party member is inflicted with a status effect (−10%)
- Turn is passed (−5%)

**Flow State (meter at 100%):**
- Automatically activates: party-wide State applied (e.g., State ID configured in plugin params).
- Could grant: +20% damage, +15% AGI (action sooner in next round), 10% chance of extra action.
- State lasts 3 turns then meter resets to 0%.
- Visual: Screen briefly flashes/glows, "FLOW STATE!" text over the battle scene.

**Implementation:** A `_flowMeter` (0–100) lives on `BattleManager`. Hook into `applyItemUserEffect`, `gainHp`, status application.

---

## Proposal D: Desperation Mode (Low-HP Empowerment)

**Concept:** When an actor drops below 25% HP, they enter a "Desperation" state that makes them more dangerous — but also more fragile.

**How it works:**
- When `actor.hpRate() < 0.25`, automatically apply a "Desperation" state (State ID via plugin param).
- State grants: +30% ATK/MAT, +20% AGI.
- State penalty: −20% DEF/MDF (they're fighting recklessly).
- State auto-removes when HP rises above 25% (healed out of it).
- Health protection triggering (from BattleSystemEnhanced) counts as entering Desperation automatically.

**"Last Stand" synergy:**
- If an actor is in Desperation AND it's their turn, they get a special 4th command: "Last Stand" — a powerful guaranteed-crit skill that costs 50% of current HP to use.
- No MP cost. No skill requirement. Always available in Desperation.

**Visual:** Actor sprite flashes red while in Desperation. A small burning icon appears on their status panel.

**Why it's fun:** It transforms near-death from a "heal immediately" panic into a real decision — push the advantage for massive damage, or retreat and lose the power boost?

---

## Proposal E: Counter-Window / Parry System

**Concept:** When an enemy is about to strike, a narrow window opens where players can input a "Guard" command to reduce or negate damage.

**How it works:**
- After an enemy's `applyItemUserEffect` begins but before HP change is applied, if the target is a player actor:
  - A brief window (1.5 seconds) shows a "GUARD!" prompt in the battle HUD.
  - If the player presses a configured key (e.g., Shift/X) within the window:
    - **Good Timing:** Damage reduced by 40%, actor gains 10 TP.
    - **Perfect Timing (last 0.3s):** Damage reduced by 100% (full parry), actor gains 25 TP and gets a bonus "Counter" action next.
    - **No Input:** Full damage applies normally.
- Only works against physical attacks (Element 1 = Physical). Magic attacks bypass it.

**Synergy with IndividualBattleTurns:**
- Since each turn fires immediately after input, the parry window fits naturally between enemy action start and damage resolution.

**Why it adds depth without complexity:**
- Doesn't change the core turn system.
- Rewards player attention without being mandatory.
- TP gained from parrying funds special skills.

---

## Proposal F: Status Effect Combo Reactions

**Concept:** Applying certain status effects in sequence on the same enemy triggers a "Reaction" — an automatic bonus effect.

**Reaction table (examples):**

| First Status | Second Status | Reaction | Effect |
|---|---|---|---|
| Burn / Fire | Wet / Water | Steam Burst | AoE damage to all enemies, removes both statuses |
| Freeze / Ice | Any Physical hit | Shatter | +150% damage on that hit, stun 1 turn |
| Poison | Bleed | Corruption | Doubled DoT, removes both and applies "Corroded" |
| Paralysis | Sleep | Deep Freeze | Enemy skips 2 turns instead of 1 |
| Blind | Confusion | Frenzy | Enemy randomly attacks allies AND party |
| Oil/Petro | Fire/Burn | Explosion | Massive AoE to enemy side, removes both |

**Implementation:**
- Hook into `Game_Battler.prototype.addNewState`.
- Check `_states` array for the "first" status already present.
- If reaction condition met, call reaction handler.
- Show "REACTION: Steam Burst!" text in battle log.

**Why it's great here:**
- The game already has Oil (Petro) as an element — Oil+Fire combo is an obvious and satisfying reaction.
- Rewards teams that mix damage types and status effects.
- Adds strategic depth without requiring UI changes.

---

## Proposal G: Escalating Battle Rewards ("Press On" System)

**Concept:** After defeating all enemies, if the map still has surviving enemy events, the player is offered a choice: take rewards now, or "press on" for a bonus multiplier.

**How it works:**
- After each victory, before the reward popup appears, check `$gameMap.events()` for remaining "Enemy" events.
- If any remain, show a choice window:
  - **"Claim Rewards"** → Show popup normally (1× rewards).
  - **"Press On"** → Skip popup, keep a `_pressOnStack` counter (+1). Party does NOT recover HP between fights.
- Each "Press On" adds +0.25× to reward multiplier (cap at 3×, i.e., 9 consecutive fights).
- If the party wins the next fight, multiplier carries over.
- If the party escapes or dies while pressing on, multiplier resets and no bonus rewards from the stack.

**Risk:**
- No HP/MP recovery between "Press On" fights (short of items).
- Health protection was already used — it doesn't refresh between press-on fights.
- The escalating danger is real.

**Reward:**
- At final victory (or when "Claim Rewards" is chosen), popup shows the multiplied totals.
- Possibly unlock a "Chain Hunter" achievement or feed the Kill Chain counter (Proposal B).

---

## Proposal H: Turn-Order Manipulation ("Speed Breaks")

**Concept:** Expand the existing AGI-based turn order to allow active manipulation — speed up allies, slow enemies, steal turns.

**New mechanics layered onto IndividualBattleTurns:**

1. **Slow Debuff** — Reduces enemy's `_battleAgi` each time it's applied. Enemy moves to later in the queue.
2. **Haste Buff** — Increases ally `_battleAgi`. They get to act sooner in the next sort cycle.
3. **Turn Steal** — A skill that, on hit, moves the enemy's next turn to after the entire party has acted. (Implemented by temporarily removing enemy from `_battlers` and re-inserting at the bottom.)
4. **Interrupt** — A skill that, when the next enemy action would trigger, lets an actor act first (priority flag). Similar to Interrupt from FF12.
5. **Pass with Intent** — Expand the current "Pass" command: passing stores a `_passingActor`. When the same actor's turn comes again (they've lapped the queue), they act twice in a row. Risk: if hit during the skip window, the stacked action is lost.

**Visual feedback:** A small turn-order queue display (left side of screen, 5 icons showing upcoming actors/enemies) makes the order legible.

---

## Summary Table

| Proposal | Complexity | Fun Factor | Fits Current Systems |
|---|---|---|---|
| A: Hit Streak Combos | Low | High | Yes — hooks into damage resolution |
| B: Kill Chain (map-level) | Low | High | Yes — uses reward popup + bounty var |
| C: Flow State Meter | Medium | High | Yes — supplements health protection |
| D: Desperation Mode | Low | Very High | Yes — extends health protection concept |
| E: Counter/Parry Window | High | Very High | Needs careful timing code |
| F: Status Combo Reactions | Medium | High | Yes — Oil/Fire is already in the game |
| G: Press On Escalation | Medium | High | Yes — extends reward popup logic |
| H: Turn-Order Manipulation | Medium | High | Yes — builds on IndividualBattleTurns |

**Recommended starting point:** Proposals **A + D** together — low complexity, immediate gameplay feel improvement, and they naturally complement each other (Desperation rewards aggression, combos reward not getting hit).

**Second phase:** Add **F (Status Reactions)** since Oil is already an element in the game — the Petro+Fire → Explosion combo is obvious and satisfying with zero new UI work.
