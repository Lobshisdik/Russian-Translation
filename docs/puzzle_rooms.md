# Map Puzzle System — Puzzle Room Design Reference

A catalogue of puzzle rooms for the **MapPuzzleSystem** plugin, organized from simple warm-ups through interlocking dungeons, preceded by a substantial section on general 2D dungeon design theory.

Every puzzle element is configured **directly on the event itself** using special comments in the event's page. No plugin commands are required in the map's autorun setup; the plugin scans every event's page comments at map load and registers them automatically. Each puzzle lists the comment text to paste into the relevant event, along with which event should receive it.

---

# Part I — General Theory of 2D Dungeon Design

Before reaching for specific mechanics, it helps to internalize the craft of dungeon design as its own discipline. A dungeon is not a collection of puzzles connected by corridors — it is an orchestrated experience whose pacing, teaching, layout, and payoff are as important as any single clever lock. The following principles apply to any 2D dungeon regardless of engine or genre, but are phrased with top-down grid-based games (like RPG Maker MZ) in mind.

## 1. The Dungeon as a Teaching Instrument

A well-designed dungeon teaches the player everything they need to beat it, without any text tutorials, by the sequencing of its rooms. The canonical pattern — sometimes called the "four-beat introduction" — is: **introduce, develop, twist, combine**. The first room introduces a mechanic in its purest form, stripped of all complication. The second room presents the same mechanic with one added layer of complication — a second object, a time constraint, a failure condition. The third room presents a twist that challenges the player's naive mental model, forcing them to reconsider what the mechanic actually does. The fourth room combines the mechanic with an earlier, already-taught mechanic, rewarding the player for remembering both.

If a dungeon is built this way, the player feels smart. If it skips a beat — introducing a mechanic in its "twist" form without ever showing the clean version — the player feels confused and stupid, and confusion is not difficulty; it is failure of design. The player should always be able to trace, in hindsight, how the dungeon taught them everything they needed to know.

## 2. The Locked Door and the Key

Every 2D dungeon, at its core, reduces to an extended metaphor: the Locked Door and the Key. The player encounters an obstacle (the door). They search for or earn the means to overcome it (the key). They return to the door and unlock it. Everything else — combat, lore, character development — is secondary to this core loop.

The elegance of a dungeon is proportional to how inventively the designer interprets "door" and "key." A door can be a literal door, a chasm, a locked cabinet, a guardian enemy, a puzzle, an environmental hazard, a NPC demand, or a closed pathway in the geometry. A key can be a literal key, an item, a spell, a realization, a number, a memorized pattern, a completed side-objective, an unlocked ability, or a changed world-state. When the same dungeon chains together several door-and-key pairs — and especially when the keys for later doors are earned by passing through earlier doors — the player experiences a feeling of controlled progression that is the single most reliable source of dungeon satisfaction.

A classic advanced pattern is the "soft key" — a door that opens not through a held item but through a state change the player has caused elsewhere in the dungeon. A lever in Room 3 opens a gate in Room 7. The player remembers the lever's existence, backtracks, pulls it, returns. This is the same structure as a literal key, but experienced entirely through spatial memory. Soft keys are what turn a dungeon from a linear tunnel into a place the player inhabits.

## 3. The Map as a Narrative

The physical layout of a dungeon communicates narrative before any dialog does. A dungeon whose rooms branch and rejoin tells the player "you are free to explore." A dungeon whose rooms form a single linear chain tells the player "you are on a journey with a direction." A dungeon built around a central hub with spoke rooms tells the player "you have a home base; go out, come back, repeat." A dungeon that loops back on itself from a later point to an earlier one (a "shortcut unlock") tells the player "you have mastered this place." Each layout pattern has emotional weight and should be chosen deliberately.

**The hub-and-spoke layout** is perhaps the most flexible and welcoming for medium-length dungeons. The hub is a memorable room with obvious visual markers (a statue, a fountain, a pit in the centre). Three to five spokes branch off, each a self-contained mini-puzzle sequence. Solving each spoke returns the player to the hub with one more piece of the overall puzzle. The hub itself is usually the site of the master lock — a gate requiring all spokes completed. This layout is famous because it lets the player choose their order, gives every session a clear return point, and makes the sense of completion very tangible.

**The spiral layout** draws the player inward toward a central chamber through progressively harder challenges. Each room introduces a new complication; each room is slightly closer to the centre. The final chamber is the emotional and literal core. This layout is superb for boss dungeons where the climax is a specific confrontation.

**The fractal layout** is a single large area subdivided into progressively smaller nested puzzles. The outermost puzzle has inner puzzles, which have inner-inner puzzles. The player's journey is always downward (or inward) in complexity. This layout works for dungeons themed around archaeology, mystery, or descent.

**The ladder layout** is a vertical stack of floors, each floor gating the next. This is excellent when the dungeon has a natural vertical theme (a tower, a well, a cathedral). Each floor resets expectations somewhat; traveling up or down between floors punctuates the experience.

**The metroidvania layout** is a sprawling interconnected world where early rooms have obstacles the player cannot initially pass but can return to after acquiring new abilities elsewhere. The sense of the dungeon expanding over time as previously-inaccessible areas open is unique to this layout and is profoundly rewarding when executed well, but demands meticulous planning of ability-gates.

Mixing layouts within a single dungeon is fine and often excellent — a hub with a spiral spoke, for instance.

## 4. Pacing and Rhythm

A dungeon has a rhythm. Puzzles, combat, exploration, lore, rest, and peril should alternate. A dungeon that is thirty minutes of back-to-back puzzle rooms becomes exhausting; so does thirty minutes of back-to-back combat. The ideal is a varied sequence where each room offers a different flavour than the last.

One practical framework is the **rest-tension cycle**. After a challenging room, give the player a low-stakes room — a corridor with lore text, a save point, a small combat with recoverable enemies, a short exploration reward like a chest. After two or three low-stakes rooms, build toward another peak. The player should feel small exhalations between small inhalations of pressure. A dungeon that only inhales suffocates; a dungeon that only exhales bores.

**Difficulty should climb in a staircase, not a ramp.** Each successive peak should be slightly higher than the last, but with valleys between them. Charting a dungeon's rooms on a difficulty-over-time graph should produce a jagged ascending line. The final room should be the hardest; the penultimate room should not be. If the player exits a dungeon having just solved its hardest puzzle with no denouement, the experience ends too abruptly.

## 5. The Principle of Minimum Necessary Elements

Every dungeon should contain the minimum number of mechanics necessary to achieve its design intent. If a dungeon uses torches, pressure plates, rocks, ice, keys, levers, shadow clones, beam reflectors, counterweights, and magnetic objects, it is almost certainly overstuffed. Three to five mechanics per dungeon is usually plenty. The first dungeon of a game should feature two. The final dungeon should feature five at most, and should mostly combine mechanics already introduced in earlier dungeons rather than introducing fresh ones.

This principle extends to individual rooms. A room that combines three mechanics should combine them *meaningfully* — each mechanic should matter to the solution. A room with a torch, a rock, and a lever where only the lever matters is a cluttered room; the torch and rock should be removed, or (better) the room should be redesigned so all three matter.

## 6. Telegraphing, Affordance, and Visual Language

The player must be able to tell, at a glance, what things do. A pushable rock should look different from a decorative rock. A pressure plate should look lower than the surrounding floor, or should have a distinct pattern or colour. A locked door should look locked — chains, glowing runes, a heavy bolt. A torch should look flammable. A breakable wall should have cracks.

This is **affordance**: the visual property of an object that suggests how it can be used. Great dungeon design relies heavily on consistent affordances within a game — once the player learns that glowing blue tiles are ice, every subsequent glowing blue tile anywhere in the game should be ice. Never break an affordance the player has learned, even once; it is a form of betrayal that damages all future puzzles.

**Telegraphing** is affordance's cousin: it is the designer's hint to the player that a specific mechanic is about to become important. If a room contains a single pressure plate and a single rock, the telegraph is that the rock goes on the plate. If a room contains three plates and one rock, the telegraph is ambiguous, which may be intentional (a puzzle of choice) or a design flaw.

Telegraphing should be honest. If a room contains a pressure plate, the player will infer that a plate is important; if the plate turns out to be a red herring, the player feels cheated. Red herrings are a legitimate design tool but must be used sparingly and only in deliberately deceptive puzzles like The Absent Architect (Section 4.3) where the whole point is the deception.

## 7. Reset Mechanics as a Design Tool

Any puzzle where the player can brick the room into an unsolvable state must have a reset mechanism. Sokoban rooms, ice puzzles, rooms with limited-push rocks, water-fill puzzles, and most timed rooms all fall into this category. A reset shrine nearby — or an undo shrine, or both — is not a concession to the player; it is part of the puzzle's contract. Without it, the player must save-scum or reload, breaking immersion.

The reset itself teaches. A prominent reset obelisk signals "mistakes are expected here" and frees the player to experiment. A hidden reset suggests "you shouldn't need this, but it's here for emergencies." The visual prominence of the reset should match the expected difficulty of the puzzle.

For interlocking multi-room puzzles, consider a global reset that resets all rooms at once, alongside per-room resets. A player who has partially solved three rooms in the wrong order benefits enormously from being able to re-plan from scratch.

## 8. Difficulty, Friction, and Frustration

Difficulty is the gap between the challenge's actual complexity and the player's current mental model. A difficult puzzle exercises the model. Friction is anything that slows the player down without exercising the model — waiting for a door animation to finish, walking slowly through a long corridor, mashing buttons through dialog. Friction is the enemy of difficulty; it masks the real challenge with tedium.

Frustration emerges when the player has solved the puzzle mentally but cannot execute the solution due to friction. A clever ice-sokoban solved in ten seconds of thinking but requiring twenty minutes of careful step-by-step execution because the player keeps mis-stepping on a narrow corridor is frustrating, not difficult. Execution challenges have their place, but they should be telegraphed as such, and should not be combined with fresh cognitive challenges. Don't ask the player to think *and* to dexterously time their movements at the same time, unless your entire game is about that.

## 9. The Aha Moment

Every good puzzle has a moment of realization — the "aha" — where the player suddenly sees how it works. This moment is the puzzle's reward. Design toward it. A puzzle without an aha moment is busywork; a puzzle with multiple aha moments (a "twist" puzzle where the player thinks they've got it, acts on that belief, and then realizes a deeper layer) is exceptional.

Aha moments usually come from one of three sources: **recombination** (realizing two familiar mechanics work together in a novel way), **reframing** (realizing the puzzle is not what it seemed), or **recognition** (realizing a visual or audio clue in the environment encodes the answer).

A puzzle can be made more rewarding by deliberately engineering a "false aha" — a moment where the player thinks they have the solution, acts on it, and finds it wrong. The second, real aha then carries far more weight. Use this sparingly; overused, it breeds distrust.

## 10. Spatial Memory and Landmarks

Players navigate dungeons by memory of space, not by minimap or text. A dungeon full of identical corridors with identical rooms is disorienting and unwelcoming. Distinctive landmarks — a room with a fountain, a corridor with a mural, an alcove with a unique statue — give the player mental anchors to navigate by. "I remember the fountain room had two exits; I've been west, so I should go east next time."

Landmarks should be memorable, distinctive, and placed at decision points (intersections, forks, rooms with multiple exits). They should not all be in the same visual register — mixing a fountain, a bloodstained altar, and a whimsical butterfly garden within one dungeon creates stronger landmarks than three similar statues.

A dungeon that the player can mentally map after one pass is a well-designed dungeon. A dungeon that requires the player to keep pulling up a map screen or marking it externally is poorly laid out.

## 11. Dead Ends, Rewards, and Exploration

Optional dead ends with small rewards are vital to a dungeon's feel. A corridor that leads nowhere but contains a chest with a minor item tells the player "exploration is rewarded here." If every corridor leads to a mandatory puzzle, the player stops exploring because there's no reward for doing so.

The ratio of optional-to-mandatory content in a dungeon should be roughly 15–25%. Too little, and exploration feels futile; too much, and the dungeon feels padded. Optional dead ends should not contain critical story items or mandatory abilities — they are bonuses, not required checkpoints.

## 12. Environmental Storytelling

A dungeon tells its story through its environment. A flooded library tells of a librarian's long-ago tragedy. A series of cells with scratched tallies on the walls tells of prisoners. A throne room with broken weapons scattered around tells of a battle. The player absorbs this without reading any text, and it deepens the sense of place.

Puzzle elements can participate in environmental storytelling. A locked door that requires the player to find three fragments of a star-shaped key, scattered across the dungeon's three themed sections, is thematically richer than a locked door that requires pulling three levers. The fragments are a story element; the levers are not.

Don't over-write. A sign that says "The ancient mages sealed this chamber to protect the forbidden artifact" is weaker than an empty chamber with a broken seal on the door and clear footprints leading out of it. The player's imagination does the work; trust it.

## 13. The Final Room

The final room of a dungeon should be thematically and mechanically climactic. It should synthesize mechanics introduced throughout the dungeon into a single grand challenge. If the dungeon introduced torches in Room 3, ice in Room 7, and magnetism in Room 12, the final room should use all three. The player, upon solving it, should feel that everything they learned was preparation for this moment.

After the final puzzle, provide a denouement — a short corridor, an opened chamber, a brief cutscene — before dumping the player into the next area. A sudden cut from "hardest puzzle of the dungeon" to "next dungeon entrance" is disorienting. Let the player breathe and register the victory.

## 14. Rhythm of Revelation in Multi-Dungeon Games

A game with many dungeons should plan the introduction of mechanics across all of them. Each dungeon should teach one or two new mechanics while reinforcing those taught previously. By the final dungeon, the player should have mastery over roughly a dozen to twenty mechanics total, and the final dungeon should recombine them in fresh ways without adding many new ones.

This is a game-design problem more than a dungeon-design problem, but it affects every individual dungeon's design. Know, before you start sketching any room, which mechanics this dungeon is responsible for teaching and which it can assume the player already knows.

## 15. Testing with Fresh Eyes

A puzzle that seems brilliant to the designer is often baffling or trivial to a fresh player. There is no substitute for watching someone else attempt a puzzle without help. Every dungeon should be playtested by at least two people who have not been involved in its design. Watch them, don't speak. Note where they get stuck, where they rush past, where they laugh, where they sigh. Their behaviour tells the truth about your dungeon; your intentions do not.

Specific things to watch for: moments of confusion (the solution isn't telegraphed enough), moments of boredom (the puzzle is too easy or too long), moments where they try something you didn't anticipate (you have an unintended solution — decide whether to preserve it as a hidden alternate solution or close it off), and moments of satisfaction (the aha landed).

## 16. On Difficulty Curves Across a Single Session

Most players will attempt a dungeon in one or two sessions. Design for the arc of a single sitting: a warm-up phase (ten to fifteen minutes of easy rooms), a build-up phase (fifteen to thirty minutes of medium rooms with increasing complexity), a peak phase (ten to twenty minutes of the hardest content), and a resolution phase (five to ten minutes of payoff and denouement). Total: roughly forty to eighty minutes for a medium-sized dungeon.

Save points should be placed after peak phases and before build-ups to the next peak. The player should never lose more than fifteen minutes of progress to a setback. Save scarcity is a design tool from the early-console era; modern players expect generosity.

---

# Part II — Self-Setup Comment Reference

Every comment begins with the tag `<puzzle:...>` on its own line inside the event page's Comment commands. Attributes are whitespace-separated `key=value` pairs. Multiple comments on the same event are allowed (for example, a magnetic object that is also pushable). The plugin re-scans on event refresh, so toggling self-switches to change pages can reconfigure behaviour mid-game.

```
<puzzle:pushable maxPushes=0 group="room1">
<puzzle:pit group="room1">
<puzzle:goal group="room1">
<puzzle:solveCheck group="room1" switch=10>
<puzzle:resetShrine group="room1">
<puzzle:undoShrine>
<puzzle:plate switch=11 requireObject=true group="plate1">
<puzzle:timedPlate switch=22 holdSeconds=3 requireObject=false group="timed1">
<puzzle:lever group="lv1">
<puzzle:gate levers="1,2" logic=AND group="gate2a">
<puzzle:arrow dir=right>
<puzzle:torch lit=false spread=true timer=0 group="torches1">
<puzzle:torchCheck group="torches1" switch=13>
<puzzle:crystalSwitch group="red">
<puzzle:crystalBlock group="red" start=solid>
<puzzle:colorTile states=2 group="lightsout">
<puzzle:colorCheck group="lightsout" target=0 switch=44>
<puzzle:lightsOutLink neighbors="5,7,11,13">
<puzzle:colorDoor item=7 consume=true group="door1">
<puzzle:comboLock variable=10 target=1331 switch=44>
<puzzle:variableLever variable=10 increment=1000>
<puzzle:warp x=12 y=4>
<puzzle:reflectionPool swapWith=99>
<puzzle:crackable item=7 consume=false group="wall1">
<puzzle:timedTile steps=3 group="decay1">
<puzzle:blinkPlatform on=60 off=40>
<puzzle:eyeStatue range=6 switch=40>
<puzzle:stateTile variable=20 passable="1,3">
<puzzle:magnetic>
<puzzle:magnetConsole polarity=attract range=5 steps=3>
<puzzle:counterweightA partner=2>
<puzzle:beamEmitter dir=right>
<puzzle:mirror orientation=slash>
<puzzle:beamReceiver switch=21>
<puzzle:clone invertX=true invertY=false group="clone1">
<puzzle:waterSource active=false activateSwitch=50>
<puzzle:waterChannel switch=0 group="water1">
<puzzle:waterDrain>
<puzzle:waterCheck switch=61>
<puzzle:regionIce id=5>
<puzzle:regionPit id=6 damage=0>
<puzzle:regionConveyor id=7 dir=right speed=1>
<puzzle:keyGrant item=8 quantity=1>
```

Region-based setups (`regionIce`, `regionPit`, `regionConveyor`) are typically placed on a single autorun "map setup" event that erases itself on first run. Everything else lives on the gameplay event it configures.

---

# Part III — Puzzle Catalogue

# 1. SIMPLE PUZZLES

These rooms introduce one mechanic at a time. Every room should be solvable on first encounter without instruction.

## 1.1 — The First Push

A small stone chamber, four tiles wider than it is tall. A single round boulder rests in the left quarter of the room. Further right, etched into the floor, is a shallow square indentation marked with a worn rune — the goal tile. The player spawns below the centre of the room with a clear line of sight to both the boulder and the rune. The exit door is set into the north wall, directly above the goal tile, and is held shut by an iron bar until the puzzle is solved. There are no other obstacles; the only possible interaction is to walk into the boulder from its left side and push it east across open floor until it slides into the rune's indentation. Because the room is perfectly flat and unobstructed, there is no way to fail this puzzle — the rock cannot be pushed anywhere that prevents the solution. This is pure vocabulary: the player learns that walking into a rock moves it, and that certain floor tiles accept rocks.

**Event setup**

- **Boulder:** `<puzzle:pushable group="r1-first">`
- **Goal rune:** `<puzzle:goal group="r1-first">`
- **Invisible solve-checker (parallel process):** `<puzzle:solveCheck group="r1-first" switch=10>`
- **Exit door:** conditional page that opens when Switch 10 is ON.

## 1.2 — Pressure Plate Hold

A narrow vertical antechamber. Against the west wall, halfway up the room, sits a mossy stone block. Directly above the block is a circular bronze pressure plate set into the floor — its surface is visibly lower than the surrounding tiles. The exit door is located in the far north-east corner and is held shut electrically; it will open only while the plate is depressed by a heavy object. The player cannot depress the plate themselves — the puzzle requires `requireObject=true`, teaching the player that their own weight is insufficient. The solution is to approach the block from below, push it one tile north onto the plate, and then walk around it to reach the door. As soon as the block rests on the plate, the door retracts with a mechanical hiss; if the player were to push the block further, the door would slam shut again. This establishes the rule that pressure plates are stateful and respond live to object presence.

**Event setup**

- **Stone block:** `<puzzle:pushable group="r2-plate">`
- **Pressure plate:** `<puzzle:plate switch=11 requireObject=true group="r2-plate">`
- **Door:** page 2 condition `Switch 11 ON` with a passable, open-sprite graphic.

## 1.3 — Lever and Gate

A long rectangular room with an iron portcullis bisecting it at the midpoint. On the near side of the portcullis, mounted on the west wall at shoulder height, is a wooden lever with a brass handle. The lever is currently in its down position and the gate is closed. The gate itself is a two-tile-tall row of vertical iron bars, impassable while closed, that retracts into the ceiling when triggered. The player spawns on the south side; the exit is directly north through the gate. Interacting with the lever toggles the gate between open and closed. Because the lever is a simple toggle with immediate effect, the player instantly confirms cause and effect — they can open the gate, close it again, re-open it — which is important for later rooms where levers have delayed or conditional effects.

**Event setup**

- **Lever:** `<puzzle:lever group="r3-lever">`
- **Gate:** `<puzzle:gate levers="1" logic=AND group="r3-lever">` (where `1` is the lever's event ID)

## 1.4 — Ice Slide

A large open chamber with a polished frozen lake occupying most of the floor. The ice is visually distinct — a pale blue tinted tileset with white speckles — and the unfrozen stone border around the edges is where the player walks normally. The goal tile is set inside the ice, nestled against the east wall three rows up from the southern shore. There is nothing to push and no objects in the room; the only puzzle element is the player's own movement. Stepping onto ice commits the player to sliding in the direction they entered from until they strike a wall or solid obstacle. Because the goal tile is flush against the east wall, the solution is to step onto the ice from anywhere in the goal's row and slide eastward; the player stops exactly on the goal. Entering from the wrong row causes the player to slide past the goal and bounce against a wall, requiring them to walk back around and try again. No penalty, no reset needed — the puzzle teaches the mechanic through cheap, forgiving failure.

**Event setup**

- **Map setup event (autorun-once):** `<puzzle:regionIce id=5>` (paint the frozen lake with region ID 5)
- **Goal tile:** `<puzzle:goal group="r4-ice">`
- **Solve checker:** `<puzzle:solveCheck group="r4-ice" switch=12>`

## 1.5 — Two Torches

A circular ritual chamber, stone-walled and lit only by a thin overhead light. Two iron torch sconces are mounted on opposing pillars in the east and west halves of the room, unlit. A stone altar sits at the north end, and the exit is a double-door behind the altar that remains locked until both torches burn. The player carries a flint source implicitly (interacting with a torch lights it). Solving the room means walking up to each torch, pressing Action, and watching the flame catch. Because the torches are far apart, `spread` does nothing here — both must be manually lit. As soon as the second flame ignites, the altar glows and the door unseals.

**Event setup**

- **Torch 1 and Torch 2:** `<puzzle:torch lit=false spread=true timer=0 group="r5-torches">`
- **Altar (invisible parallel event):** `<puzzle:torchCheck group="r5-torches" switch=13>`

## 1.6 — The Keyed Chest

A modest chamber with a locked wooden door on the north wall, its brass keyhole catching the light of a nearby sconce. A small chest sits on a table to the south-west. Opening the chest yields a brass key, the same colour as the keyhole. Walking to the door while carrying the key and pressing Action unlocks it, consumes the key (it is a one-use mechanical key), and opens the passage. This is the most elementary "Locked Door and Key" pattern in the entire game's vocabulary, and establishes the visual coupling between a key's colour and a door's colour — a coupling that later dungeons lean on heavily.

**Event setup**

- **Chest:** an ordinary event that grants the brass key item. Optional convenience: `<puzzle:keyGrant item=8 quantity=1>`
- **Door:** `<puzzle:colorDoor item=8 consume=true group="r6-keyed">`

## 1.7 — The Visible Lever Chain

A long corridor with three levers spaced evenly along the west wall, each clearly visible and labelled (sign posts reading A, B, C). At the north end, a triple-barred gate shows three iron bolts, one coloured red, one blue, one green. The bolts visibly retract one at a time as each lever is pulled in turn. There is no logic puzzle here — pull all three levers in any order, watch the bolts retract, exit. The purpose is to teach the player that gates can have multiple lever conditions and that the visual feedback on the gate will show their progress. Later rooms use this same visual language with harder logic conditions.

**Event setup**

- **Each lever:** `<puzzle:lever group="r7-chain">`
- **Gate:** `<puzzle:gate levers="1,2,3" logic=AND group="r7-chain">`

## 1.8 — A Single Torch in the Dark

An almost-pitch-black room; the player's sprite is barely visible. A single unlit torch stands in the centre. The exit is somewhere in the darkness — the player can perceive vague outlines of walls but nothing more. Lighting the torch illuminates the whole room in a bright circle, revealing the exit on the far side along with minor decorative details. This room teaches the player that torches do more than trip switches; they affect the player's ability to see, and the light has gameplay value. Later rooms use lighting mechanics more aggressively (navigating dark mazes via portable light sources).

**Event setup**

- **Torch:** `<puzzle:torch lit=false spread=false timer=0 group="r8-dark">`
- A tint-screen event on parallel process reads the torch's self-switch and increases screen brightness when the torch is lit.

## 1.9 — The Warp Pad

A small room with a glowing circle of runes on the floor in the south-east corner and another, identical circle in the north-west corner. Stepping onto the south-east circle warps the player to the north-west circle, from which an open doorway leads out. There is nothing to solve; the room simply introduces the concept of warp tiles. A signpost near the warp says "Arcane Passage" to reinforce the visual affordance.

**Event setup**

- **South-east warp pad:** `<puzzle:warp x=2 y=2>` (x,y being the north-west circle's coordinates)
- The north-west circle is purely decorative, or its own warp pad for return travel.

## 1.10 — The Cracked Wall

A short corridor dead-ending at a visibly crumbling wall. The player has a pickaxe from an earlier area. Interacting with the wall swings the pickaxe, shatters the masonry, and opens the passage. Nothing complicated; the room teaches that cracked walls can be broken with the right tool.

**Event setup**

- **Each cracked wall tile:** `<puzzle:crackable item=7 consume=false group="r10-crack">`

## 1.11 — The Lit-Path Floor

A room with a standard lever in the entrance and a set of glowing floor tiles that light up in a path across the room toward the exit — but only while the lever is in its "on" position. Pull the lever, the tiles light, the path is visible. Release the lever, the tiles dim. The path is safe to walk on in both states; the room is trivially solvable. Its purpose is to teach that state visualization on the floor is a thing that exists in this game's vocabulary, setting up later rooms where tile states matter functionally, not just visually.

**Event setup**

- **Lever:** `<puzzle:lever group="r11-lit">`
- **Glowing tiles:** each tile's page 2 condition is "Switch X ON" where X is the lever's switch; page 2 has a brighter graphic.

---

# 2. INTERMEDIATE PUZZLES

Two mechanics combined. The player is asked to plan one or two steps ahead, and for the first time can fail in ways that require a reset.

## 2.1 — The Sacrificial Bridge

A long horizontal corridor interrupted by a chasm: three adjacent pit tiles running north-to-south, completely blocking the eastern half of the room. Beyond the chasm, on a small safe island, sits the goal tile. On the western side, behind the player, are two identical boulders in a storage alcove — one north-west, one south-west. A narrow side-passage in the north wall loops around the chasm but is barred by crates the player cannot reach directly. The chasm cannot be crossed by walking; pushing a rock into a pit fills the pit and destroys both the rock and the hole. Since there are three pit tiles and only two rocks, the player must realise the pits are not meant to all be filled. The correct solution is to push one boulder south into the southmost pit, then walk up and around through the small north alcove, retrieve the second boulder from a different angle, and push it into the northmost pit — leaving the central pit unfilled. The two filled pits now act as stepping stones: the player walks onto the first filled tile, then diagonally (via the centre's unfilled pit edge) onto the second. The lesson is that rocks are consumable resources to be conserved and that geometry matters more than brute force.

**Event setup**

- **Both boulders:** `<puzzle:pushable group="r12-bridge">`
- **Each pit tile:** `<puzzle:pit group="r12-bridge">`
- **Goal:** `<puzzle:goal group="r12-bridge">`
- **Solve checker:** `<puzzle:solveCheck group="r12-bridge" switch=14>`
- **Reset shrine:** `<puzzle:resetShrine group="r12-bridge">`

## 2.2 — Twin Levers, Three Logics

A wide symmetrical hall with two levers mounted on the north wall, one east of centre and one west. Between them, centred on the wall, is a large double-door of reinforced timber. Three variants of this room exist, differing only in the gate's logic mode — they can be presented as three sequential tutorial rooms down a single hallway, each labelled with a stone tablet naming the operator.

The **AND** variant requires both levers to be pulled; the solution is trivial. The **OR** variant opens with either lever. The **XOR** variant is the interesting one: the door opens when exactly one lever is pulled, and closes again if both are. A player who pulls the first, sees the door open, then pulls the second "just to be sure" will watch the door slam shut. This teaches a subtle Boolean distinction and establishes the idea that doing more is not always better.

**Event setup (XOR version)**

- **Lever 1 and Lever 2:** `<puzzle:lever group="r13-xor">`
- **Gate:** `<puzzle:gate levers="1,2" logic=XOR group="r13-xor">`

## 2.3 — Crystal Lattice

A diamond-shaped chamber whose floor plan is dense with crystal blocks — tall, translucent pillars that block movement. The blocks come in two colours, red and blue. Red blocks are currently solid, blue blocks are currently insubstantial. A floating hexagonal crystal switch sits near the player's spawn in the south. Interacting with it flips every crystal in the group: solid reds become insubstantial, ghostly blues solidify. The path from south to north-east (where the goal lies) requires the player to walk through blue gaps, reach the switch, flip, walk through now-passable red gaps, and so on. A second crystal switch in the far corner ensures the player is never permanently boxed in by a poorly-timed flip.

**Event setup**

- **Each crystal switch:** `<puzzle:crystalSwitch group="lattice">`
- **Each red block:** `<puzzle:crystalBlock group="lattice" start=solid>`
- **Each blue block:** `<puzzle:crystalBlock group="lattice" start=open>`

## 2.4 — Flame Relay

A long gallery lined with torch sconces — eight in total, alternating on the north and south walls, spaced two tiles apart. The easternmost torch is already lit. All seven others are dark. The `spread=true` flag means a lit torch ignites any adjacent torch, but the torches are too far apart for direct spread — a tile of empty floor always sits between them. The solution is to push a mobile brazier (pushable + torch) from its storage alcove into positions between pairs of torches. When the brazier sits adjacent to a lit torch, the brazier catches fire; pushing the now-burning brazier adjacent to a dark torch ignites it. The player physically relays fire across the room. Pushing the brazier against a wall with no adjacent unlit torch is a soft-fail; a reset shrine helps.

**Event setup**

- **Each unlit torch:** `<puzzle:torch lit=false spread=true timer=0 group="r15-relay">`
- **Pre-lit torch:** `<puzzle:torch lit=true spread=true timer=0 group="r15-relay">`
- **Mobile brazier (two comments):** `<puzzle:pushable group="r15-relay">` and `<puzzle:torch lit=false spread=true timer=0 group="r15-relay">`
- **Solve checker:** `<puzzle:torchCheck group="r15-relay" switch=15>`
- **Reset shrine:** `<puzzle:resetShrine group="r15-relay">`

## 2.5 — The Coerced Path

A twisty L-shaped room tiled entirely with directional arrow floor panels. Stepping on an arrow forces the player one step in the arrow's direction, ignoring input until they land on a non-arrow tile. The tiles form a spiralling loop: entering from the south-west corner, the arrows sweep the player east, then north, then west, then south, back toward the entrance. The goal tile sits in the centre of the spiral. The solution is to find the single "break point" where two counter-directional arrows adjoin, cancelling momentum and letting the player walk onto a normal floor tile and into the spiral's hollow centre.

**Event setup**

- **Every arrow tile:** `<puzzle:arrow dir=right>` (or `up`, `down`, `left` per tile)
- **Goal and solve checker** as standard.

## 2.6 — The Pickaxe Gallery

A long gallery with three cracked walls spaced at intervals along its length. Each wall requires a pickaxe strike to shatter. Between walls are safe rest chambers with small rewards (minor healing items, lore tablets). The gallery itself has nothing else in it. This room teaches the pattern of using a tool repeatedly across a dungeon, not as a one-time gate but as a recurring interaction. It also models the rhythm of puzzle-reward-puzzle-reward that many dungeons use.

**Event setup**

- **Each cracked wall tile:** `<puzzle:crackable item=7 consume=false group="r17-gallery">`

## 2.7 — The Counterweight Bridge

A narrow canyon cutting the room in half, crossed by a mechanical bridge. On the south side of the canyon is a heavy pressure plate (`requireObject=true`). On the north side is a second platform, linked to the first by a counterweight mechanism — when the plate on the south is depressed by sufficient weight, the north platform *rises*, becoming passable (it was a pit). The player must push a boulder onto the south plate, then walk around through a longer route to reach the north side, where the now-raised platform lets them cross. This introduces counterweight logic — two linked events where one's state inverts the other's passability.

**Event setup**

- **Boulder:** `<puzzle:pushable group="r18-counter">`
- **South plate:** `<puzzle:plate switch=30 requireObject=true group="r18-counter">`
- **Counterweight platform link (on platform A, i.e. south plate):** `<puzzle:counterweightA partner=<north-platform-event-ID>>`
- The north platform has a standard event whose passability is driven by counterweight logic.

## 2.8 — The Color-Door Duo

A chamber containing two locked doors side by side — one red, one blue — and two chests in separate alcoves, one containing a red key and one a blue key. Beyond each door is a different treasure. The player must choose which door to open first, because the alcoves are arranged such that opening one door blocks access back to the other's alcove. A clever player can avoid the constraint by solving a small optional puzzle in the north of the room, unblocking a third path. This room teaches the player to read the map ahead and plan their key-spending, a preview of the Nested Keep dungeon introduced later.

**Event setup**

- **Red door:** `<puzzle:colorDoor item=8 consume=true group="r19-doors">`
- **Blue door:** `<puzzle:colorDoor item=9 consume=true group="r19-doors">`
- Chests: standard events that grant their respective keys.

## 2.9 — The Timed Disappear

A straight corridor whose floor is entirely made of timed tiles — each tile erases itself three steps after it is first stepped on. The corridor is six tiles long. A naive run (walk, walk, walk, walk, walk, walk) fails because the first tile vanishes as the player is on tile four, collapsing the path behind them, which matters when the corridor has a forced backtrack at the end (a wall that requires the player to return to hit a lever and then proceed). The solution is to move through the corridor in such a way that the tiles expire in an order that leaves a stable walking path. Usually this means pacing — advancing slowly so that tiles disappear behind the player, never ahead.

**Event setup**

- **Each timed tile:** `<puzzle:timedTile steps=3 group="r20-timed">`
- **Pits underneath:** `<puzzle:pit group="r20-timed">` on each, or a pit region.

## 2.10 — The Eye's Gaze

A square chamber with a single eye statue mounted on the north wall. Its gaze extends four tiles south in a cone. The exit is in the south wall, behind the player. A lever on the east wall, when pulled, opens the exit. But the lever is inside the statue's gaze cone. Stepping into the cone triggers an alarm — Switch 40 fires, an autorun event seals the room, a slow-moving enemy spawns. The player must approach the lever from outside the cone, which requires going the long way around via a narrow corridor on the west side. This room teaches the player to read gaze cones as areas to avoid.

**Event setup**

- **Eye statue:** `<puzzle:eyeStatue range=4 switch=40>`
- **Lever:** `<puzzle:lever group="r21-gaze">`
- **Exit:** `<puzzle:gate levers="<lever event ID>" logic=AND group="r21-gaze">`
- Trap trigger: parallel event watching Switch 40.

## 2.11 — The Ice Puzzle Proper

A square ice sheet with a single boulder and a single goal tile. The boulder is in the north-west; the goal is in the south-east. Pushing the boulder causes it to slide until it hits a wall or another object. The player must work out the push-sequence that routes the boulder across the ice, using walls and the edges of the sheet as stops. The goal is placed such that a single push from the right starting direction will slide the boulder onto it. Several "dead pushes" exist — push directions that slide the boulder into an unreachable corner, requiring a reset. This is the first room in the dungeon that will seriously punish impatience.

**Event setup**

- **Ice region:** `<puzzle:regionIce id=5>` (map setup event)
- **Boulder:** `<puzzle:pushable group="r22-ice">`
- **Goal:** `<puzzle:goal group="r22-ice">`
- **Solve checker and reset shrine:** standard.

## 2.12 — The Conveyor Room

A chamber whose floor is a continuously-moving conveyor region. Stepping on it pushes the player one tile east every step. The exit is in the east wall, directly in the conveyor's direction — trivial to reach, because the conveyor carries the player there. But a pressure plate on the east wall must be held to open the exit. The player needs to step onto the plate, but the conveyor immediately pushes them off. The solution is to push a rock onto the plate first; the rock also slides on the conveyor, so the player must time the push so the rock lands on the plate exactly at the edge where the conveyor ends. This teaches that conveyors affect objects too, not just the player.

**Event setup**

- **Conveyor region:** `<puzzle:regionConveyor id=7 dir=right speed=1>`
- **Boulder:** `<puzzle:pushable group="r23-conv">`
- **Plate:** `<puzzle:plate switch=41 requireObject=true group="r23-conv">`

## 2.13 — The First Beam

An unadorned hall with an emitter on the west wall firing a continuous beam east, a single mirror pedestal in the centre, and a receiver on the south wall. The beam currently passes over the receiver without hitting it. Rotating the mirror to `slash` deflects the beam downward into the receiver. A single interaction with the mirror solves the room. This is the pure introductory form of beam puzzles, before reflection sequences, moving mirrors, or obstructions appear.

**Event setup**

- **Emitter:** `<puzzle:beamEmitter dir=right>`
- **Mirror:** `<puzzle:mirror orientation=backslash>` (starting wrong, must rotate)
- **Receiver:** `<puzzle:beamReceiver switch=42>`

## 2.14 — Light-Then-Douse

A room with four torches arranged in a square pattern and a central pressure plate. The exit opens when exactly three of the four torches are lit. Lighting all four, or two, or one, or zero, fails. The lit-count condition forces the player to read the torch states carefully and resist the urge to light everything. A helpful mural on the wall reads "three flames to wake, four to silence" to hint at the condition.

**Event setup**

- **Each torch:** `<puzzle:torch lit=false spread=false timer=0 group="r25-three">`
- A custom check event reads the torches' self-switches and sets a switch when exactly three are ON. This requires a small common event or parallel-process conditional. The plugin's `torchCheck` only handles "all lit"; for "exactly N lit", a custom script call is needed. Alternatively, structure it as three separate puzzle groups ("first three") and leave the fourth un-grouped:

  Torches 1, 2, 3: `<puzzle:torch lit=false spread=false timer=0 group="r25-good">`
  Torch 4: `<puzzle:torch lit=false spread=false timer=0 group="r25-cursed">`
  `<puzzle:torchCheck group="r25-good" switch=43>`
  Parallel event checks that Switch 43 is ON AND the cursed torch's self-switch is OFF to open the exit.

## 2.15 — The Colour Cycle

A small room with a 3×3 grid of colour tiles. Stepping on a tile cycles its colour through three states. The goal is to leave all nine tiles in the same state (any state will do). Because stepping on a tile changes only that one tile, this puzzle is merely a counting exercise — the player counts tile states and steps on each wrong-coloured tile the right number of times to align them. The room is a gentle introduction before Lights-Out rooms (which toggle neighbours).

**Event setup**

- **Each tile:** `<puzzle:colorTile states=3 group="r26-cycle">`
- **Checker:** `<puzzle:colorCheck group="r26-cycle" target=0 switch=44>`
- Additional checkers for target=1 and target=2 with parallel-event OR logic let any uniform state win.

## 2.16 — Blink-Step

A small gauntlet of blinking platforms across a pit. Each platform cycles on 60 frames, off 40. The cycles are staggered so that the player must time their steps: wait on a solid platform, watch the next platform blink in, step quickly. Three platforms in a row, after which the exit is reached. The room rewards patience and observation. A faster alternative path exists (a detour via a crackable wall), giving the player a choice between execution challenge and resource expenditure.

**Event setup**

- **Each blinking platform:** `<puzzle:blinkPlatform on=60 off=40>`
- **Pit region:** `<puzzle:regionPit id=6 damage=0>`
- **Crackable wall alt-route:** `<puzzle:crackable item=7 consume=false group="r27-blink">`

## 2.17 — The Lever Chain

A winding corridor with levers placed at irregular intervals. The final gate requires all levers pulled in a specific order — pulling them out of order resets all of them. The order is not obvious; a clue is hidden in an earlier room (a sequence of paintings depicting scenes in chronological order, labelled with lever-sigil correspondences). The puzzle rewards players who explored earlier and remembered visual details.

**Event setup**

- **Each lever:** `<puzzle:lever group="r28-chain">`
- Order-tracking logic is implemented via a common event that compares lever-pull-order against a variable-stored target sequence. The plugin's `gate` doesn't enforce order by default; the order is checked by custom parallel events and the final switch fires when the sequence matches.

## 2.18 — The Water Channel Primer

A small chamber with a water source in one corner, a series of pre-laid water channels across the floor, and a water-check tile at the far end. Opening the source (via a lever) fills the channels, the water flows along the pre-laid path, and the check tile fires when water reaches it. A single drain event sits mid-path; the player must push a rock onto the drain to plug it before flipping the source. This teaches water-flow mechanics without asking the player to route the channels themselves.

**Event setup**

- **Source lever:** `<puzzle:lever group="r29-water-valve">`
- **Water source:** `<puzzle:waterSource active=false activateSwitch=50>` (where Switch 50 mirrors the lever)
- **Each channel tile:** `<puzzle:waterChannel switch=0 group="r29-water">`
- **Terminal channel:** `<puzzle:waterChannel switch=51 group="r29-water">`
- **Drain:** `<puzzle:waterDrain>` (with page 2 removing the drain when a boulder event occupies the tile)
- **Plug boulder:** `<puzzle:pushable group="r29-water">`

## 2.19 — Follow My Shadow

A simple room with a shadow clone that mimics the player's movement exactly (no inversion). A plate in the east part of the room must be pressed, along with a plate in the west part. The player walks to one plate, and the shadow — following them — walks toward the east but bumps into a wall and stops. The clone's mirroring is blocked by its own geometry, so the player must navigate around walls that the clone cannot cross. This is the first introduction to clone mechanics, without inversion complications.

**Event setup**

- **Clone:** `<puzzle:clone invertX=false invertY=false group="r30-shadow">`
- **Plates:** `<puzzle:plate switch=52 requireObject=false group="r30-shadow">` and `<puzzle:plate switch=53 requireObject=false group="r30-shadow">`
- **Exit:** requires both switches.

## 2.20 — The State Tile Intro

A room with a single variable (Variable 20) that alternates between 1 and 2 based on a lever pull. Half the room's floor tiles are passable in state 1; the other half in state 2. The player pulls the lever to toggle states, walking the accessible half each time. The goal is reachable only by switching states mid-journey, requiring them to stop midway, return to the lever, toggle, and continue. This teaches the player about world-state mechanics in a controlled setting.

**Event setup**

- **Lever:** `<puzzle:lever group="r31-state">` paired with a parallel event that toggles Variable 20 between 1 and 2 on state change.
- **State-1 tiles:** `<puzzle:stateTile variable=20 passable="1">`
- **State-2 tiles:** `<puzzle:stateTile variable=20 passable="2">`

## 2.21 — The Conveyor Escort

A long rectangular factory room. A continuously running conveyor belt spans the entire southern wall, moving west to east and terminating in a bottomless pit. A single pushable boulder rests at the western start of the belt. The northern half of the room is a walkable pathway for the player, but it is segmented by three consecutive iron gates. Beside the conveyor belt are three pressure plates, each wired to one of the gates. 

The puzzle is a timing and synchronization challenge. The player must push the boulder onto the conveyor belt, then immediately run along the northern path alongside it. As the boulder rolls over each pressure plate, it temporarily drops the corresponding gate. The player must slip through each gate exactly when the boulder depresses the plate. If the player runs too fast, they hit a closed gate; if they run too slow, the boulder passes the plate, the gate snaps shut, and the player is trapped and must use a reset shrine.

**Event setup**

- **Conveyor Region (autorun once):** `<puzzle:regionConveyor id=7 dir=right speed=1>`
- **Boulder:** `<puzzle:pushable group="r30-escort">`
- **Plates (on the conveyor path):** `<puzzle:plate switch=55 requireObject=true group="r30-escort">` (repeat with switches 56 and 57 for the other two plates)
- **Gates (on the player path):** `<puzzle:gate levers="55" logic=AND group="r30-escort">` (repeat for switches 56 and 57)
- **Reset Shrine (at the start):** `<puzzle:resetShrine group="r30-escort">`


## 2.8 — The Human Backstop

A small frozen chamber containing only a patch of ice, a pushable iron crate, and an eye-statue. The exit door is held shut as long as the eye-statue's gaze reaches the opposite wall. To open the door, the player must permanently block the statue's line of sight by placing the iron crate directly in the middle of the ice patch.

Because the floor is frictionless ice, pushing the crate causes it to slide uncontrollably until it slams into the far wall, completely bypassing the statue's gaze. There are no other blocks in the room to use as a backstop. The lateral leap requires the player to break standard puzzle-game conditioning: the player must act as the backstop. The solution is to push the crate, sprint around the perimeter of the ice on the safe walkway, step onto the ice in the exact center of the room, and let the sliding 500-pound iron crate slam directly into the player's character. The crate stops perfectly in the center, the gaze is blocked, and the door opens. 

**Event setup**

- **Ice Region:** `<puzzle:regionIce id=8>`
- **Eye Statue:** `<puzzle:eyeStatue range=12 switch=40>`
- **Iron Crate:** `<puzzle:pushable group="r28-backstop">`
- **Exit Gate:** `<puzzle:gate levers="40" invert=true group="r28-backstop">` (Gate opens when the switch is OFF / gaze is broken)

---

# 3. COMPLEX PUZZLES

Three or more mechanics. The player must plan, remember state, and deliberately use reset mechanics.

## 3.1 — The Frozen Warehouse

A large square chamber, three-quarters of its floor covered by a polished ice sheet. Heavy iron crates are scattered across the ice — four of them, each at a different position. Four target rune-tiles are set into the ice floor, each inscribed with a different sigil. Rocks and player alike slide on ice until they hit a wall or solid object; stopping on a target tile requires the target to be positioned such that a rock sliding from a specific direction will halt exactly on it. Two of the target tiles are flush against walls (easy stops); the other two are mid-ice and require a rock as a buffer — one crate must slide into the target from the far side and stop only when it hits a previously-placed crate. Solving the room requires working out the placement order: rocks that rely on other rocks as stopping points must be placed second. A reset shrine is essential, and an undo totem nearby saves the player from having to reset the entire room for a single miscalculated push.

**Event setup**

- **Map setup event:** `<puzzle:regionIce id=5>`
- **Each crate:** `<puzzle:pushable group="frozen-warehouse">`
- **Each target:** `<puzzle:goal group="frozen-warehouse">`
- **Solve checker:** `<puzzle:solveCheck group="frozen-warehouse" switch=60>`
- **Reset:** `<puzzle:resetShrine group="frozen-warehouse">`
- **Undo:** `<puzzle:undoShrine>`

## 3.2 — The Prism Gallery

A high-ceilinged hall with polished black marble walls. A crystal emitter mounted on the west wall fires a continuous red beam east. Three mirror pedestals stand in the floor at staggered positions — each can be rotated between `/` and `\` orientations. A receiver — a dark obsidian cradle — is mounted on the south wall near the south-east corner. The player must rotate each mirror so the beam ricochets off all three and strikes the receiver. The beam recalculates every frame, so a mirror rotation that misroutes the beam gives immediate feedback. One pedestal is placed inside a pit region, so the player cannot stand next to it — they must push a rock adjacent to the pit to reach the mirror across a gap. The rock adds a second layer beyond pure beam geometry.

**Event setup**

- **Emitter:** `<puzzle:beamEmitter dir=right>`
- **Mirrors:** `<puzzle:mirror orientation=slash>` (some start as `backslash`)
- **Receiver:** `<puzzle:beamReceiver switch=61>`
- **Pit region:** `<puzzle:regionPit id=6 damage=0>`
- **Rock:** `<puzzle:pushable group="prism">`

## 3.3 — The Pressure Escape

A small cloistered room dominated by a single bronze pressure plate. This plate requires three seconds of continuous hold before unlocking the exit. The exit is five tiles away and re-locks the moment the plate is vacated. The naive approach (stand, wait, run) fails: the door opens after three seconds but closes before the player can reach it. The lateral solution is that a stone block sits in an alcove to the west. Pushing it onto the plate creates permanent pressure; the plate fires after three seconds and stays fired. Alternatively the player can simply wait three seconds on the plate (the timer fires once, the switch latches ON), and the door stays open persistently. Either solution works.

**Event setup**

- **Plate:** `<puzzle:timedPlate switch=62 holdSeconds=3 requireObject=false group="r33-timed">`
- **Block:** `<puzzle:pushable group="r33-timed">`

## 3.4 — The Magnet Engine

A cavernous workshop filled with iron blocks and a control console on the east wall. The console has two knobs — "Attract" and "Repel" — firing pulses that affect magnetic objects in range. The centrepiece is a three-tile pit chasm running east-to-west, with a goal tile on the far side. Four iron blocks (magnetic + pushable) are arranged on the near side. Pushing the blocks manually sends them into the first pit. But firing an Attract pulse while standing east of the chasm slides all iron blocks three tiles toward the player, gliding them across pit tiles (the magnet-motion rule differs from push-motion). The player then activates Repel to fire a block back across, walks around via a secondary corridor unlocked by a torch sub-puzzle, and pushes the displaced block onto the goal from the west side.

**Event setup**

- **Each iron block:** `<puzzle:pushable group="magnet">` + `<puzzle:magnetic>`
- **Each pit:** `<puzzle:pit group="magnet">`
- **Goal:** `<puzzle:goal group="magnet">`
- **Solve checker:** `<puzzle:solveCheck group="magnet" switch=63>`
- **Console (two pages):**
  Page 1: `<puzzle:magnetConsole polarity=attract range=8 steps=3>`
  Page 2 (self-switch A): `<puzzle:magnetConsole polarity=repel range=8 steps=3>`

## 3.5 — The Mirror of the Self

A square chamber bisected vertically by a half-height wall. The east half mirrors the west half in geometry but contains a ghostly shadow-double. The shadow moves with horizontally inverted motion. The objective: land the shadow on a plate in the east half while the player stands on a separate plate in the west. Both plates must be held simultaneously. The two halves are not perfectly symmetrical — small obstructions mean the player cannot simply walk to their plate and assume the shadow walks to its plate. They must choreograph a path that accounts for both geometries simultaneously.

**Event setup**

- **Clone:** `<puzzle:clone invertX=true invertY=false group="r35-mirror">`
- **West plate:** `<puzzle:plate switch=64 requireObject=false group="r35-mirror">`
- **East plate:** `<puzzle:plate switch=65 requireObject=false group="r35-mirror">`
- **Reset:** `<puzzle:resetShrine group="r35-mirror">`

## 3.6 — The Aqueduct

A multi-tier stone room with an inactive water source at the north-west, branching channels across the floor, and a dry basin with a dormant flowering tree at the south-east. Between source and basin, obstacles block flow: a water-drain tile, a crystal block sitting in the channel, and a branching junction leading the wrong way. The player opens the valve (lever-wired to the source's activate switch), flips a crystal switch to make the blocking crystal insubstantial, and pushes a boulder onto the drain to plug it. Water flows, the basin fills, the tree blossoms.

**Event setup**

- **Valve lever:** `<puzzle:lever group="aqueduct-valve">`
- **Source:** `<puzzle:waterSource active=false activateSwitch=66>`
- **Channels:** `<puzzle:waterChannel switch=0 group="aqueduct">`
- **Terminal basin:** `<puzzle:waterChannel switch=67 group="aqueduct">`
- **Drain:** `<puzzle:waterDrain>` (page 2 cleared when boulder lands on it)
- **Crystal block:** `<puzzle:crystalBlock group="aq-crystal" start=solid>`
- **Crystal switch:** `<puzzle:crystalSwitch group="aq-crystal">`
- **Plug boulder:** `<puzzle:pushable group="aqueduct">`

## 3.7 — The Vanishing Path

A ten-tile-long corridor tiled entirely with timed floor panels — each erases three steps after first contact. Safe rest pads appear at intervals of three tiles, letting the player pause while tiles behind them expire. The corridor has branching dead-ends that tempt exploration. A wary player counts steps and commits; a careless one falls into the pit below.

**Event setup**

- **Each timed tile:** `<puzzle:timedTile steps=3 group="r37-decay">`
- **Pits beneath:** `<puzzle:pit group="r37-decay">` or pit region.

## 3.8 — The Hall of Lights-Out

A 5×5 grid of coloured floor panels. Each panel glows bright or dim; stepping on a panel toggles its own state and the states of its four orthogonal neighbours. The goal: leave every panel dim. The player enters from the south and must plan a walkable sequence. An observer pedestal outside the grid lets them study the pattern before committing. An antechamber has a 3×3 training version.

**Event setup**

- **Each tile:** `<puzzle:colorTile states=2 group="lights-out">` + `<puzzle:lightsOutLink neighbors="<N,S,E,W event IDs>">`
- **Checker:** `<puzzle:colorCheck group="lights-out" target=0 switch=68>`
- **Reset:** `<puzzle:resetShrine group="lights-out">`

## 3.9 — The Blinking Causeway

A long stone bridge with blinking platforms on staggered cycles, interspersed with permanently-decaying tiles. The player must time sprints across blinking gaps while avoiding wasted steps on the decay tiles. The final stretch is three blinking tiles in a row cycling on a common rhythm — the player must identify the instant all three are solid.

**Event setup**

- **Each blinking platform:** `<puzzle:blinkPlatform on=60 off=40>`
- **Each decay tile:** `<puzzle:timedTile steps=1 group="causeway">`
- **Chasm region:** `<puzzle:regionPit id=6 damage=0>`

## 3.10 — The Season Corridor

A long horizontal corridor whose floor tiles alternate between summer-only and winter-only states, governed by a season variable the player cycles via an item. The corridor appears impassable in any single state, but by cycling the season once halfway across and again near the end, the player walks across a mosaic of tiles that come and go under their feet. A side alcove contains a rock whose weight holds a pressure plate that toggles an auxiliary path, adding a second layer. A boulder must be pushed along the summer-passable tiles while the player maintains the correct season.

**Event setup**

- **Summer tiles:** `<puzzle:stateTile variable=20 passable="2">`
- **Winter tiles:** `<puzzle:stateTile variable=20 passable="4">`
- **Boulder:** `<puzzle:pushable group="r40-season">`
- **Plate:** `<puzzle:plate switch=69 requireObject=true group="r40-season">`

## 3.11 — The Rotating Prison

A circular chamber whose walls are divided into eight wedge-shaped sectors, each sector opening to a different corridor. The chamber rotates — driven by an event variable incrementing on a timer — so the corridor alignments change every twenty seconds. The player must enter, read the current rotation, and exit through the correct corridor within the window. The goal room is only aligned to a single exit wedge; three other exits lead to traps or dead-ends. A clock on the wall telegraphs the rotation phase.

**Event setup**

- Rotation driven by an autorun common event incrementing Variable 25 every 1200 frames.
- **Each wedge passage:** `<puzzle:stateTile variable=25 passable="<allowed phase values>">`
- Correct exit: the one whose passable state matches the current rotation of the goal room.

## 3.12 — The Torch Puzzle Tower

A tall vertical chamber with torches on four successive floors, each floor's torches feeding fire into the next via a vertical brazier chute. Fire spreads via `spread=true` but only between adjacent torches on the same floor; crossing floors requires the player to light a floor-specific chute-brazier. Lighting every torch on every floor opens the exit.

**Event setup**

- **Each torch and chute-brazier:** `<puzzle:torch lit=false spread=true timer=0 group="r42-tower">`
- **Checker:** `<puzzle:torchCheck group="r42-tower" switch=70>`

## 3.13 — The Combination Door

A door with a four-digit combination lock. The code is hidden somewhere in the current floor of the dungeon — on a bookshelf's book spines, a painting's dots, a mosaic's tile pattern. The player explores, deduces, returns, and enters the code via four levers (thousands, hundreds, tens, ones).

**Event setup**

- **Combo lock door:** `<puzzle:comboLock variable=10 target=5834 switch=71>`
- **Each lever:** `<puzzle:variableLever variable=10 increment=1000>` (varying for each)

## 3.14 — The Eye and the Clone

A chamber patrolled by two eye-statues whose gaze cones cover most of the floor. The player has a shadow clone with `invertX=true`. The player walks safely outside the cones, but the clone — mirroring inverted — walks *into* the cones on the other side. The puzzle requires the player to position the clone to *block* an eye's gaze, breaking its line-of-sight, so that a critical central tile becomes safe to traverse. The player then walks through the now-unblocked path and exits.

**Event setup**

- **Eye statues:** `<puzzle:eyeStatue range=5 switch=72>`
- **Clone:** `<puzzle:clone invertX=true invertY=false group="r44-eye-clone">`
- Alarm autorun triggers if Switch 72 fires.

## 3.15 — The Water Maze

A flat room whose floor is mostly water-channel tiles forming a branching maze. Water enters from the north via a source. Several branching points are gated by crystal blocks — flipping a crystal switch toggles which branches are open. The goal is a water-check tile at the far south whose switch opens the exit. The player must route water through the maze by flipping switches in the right order before opening the source (or opening/closing the source iteratively). A single drain tile blocks one particularly tempting wrong path.

**Event setup**

- **Source (activate via lever):** `<puzzle:waterSource active=false activateSwitch=73>`
- **Channels:** `<puzzle:waterChannel switch=0 group="r45-maze">`
- **Terminal:** `<puzzle:waterChannel switch=74 group="r45-maze">`
- **Crystal blocks (placed in channel tiles):** `<puzzle:crystalBlock group="maze-crystal" start=solid>` or `open`
- **Crystal switches:** `<puzzle:crystalSwitch group="maze-crystal">`
- **Drain:** `<puzzle:waterDrain>`

## 3.16 — The Stalker

A dim corridor with an eye-statue that slowly rotates. As its gaze sweeps, the player must hide behind pillars placed at intervals. Each pillar is a pushable rock — the player can push it to create new cover where none exists, but only at the cost of revealing themselves momentarily. The exit is at the far end. Several timed pressure plates along the way require the player to pause on them for two seconds each to disable auxiliary traps, adding to exposure risk.

**Event setup**

- **Eye statue (rotating via state variable):** `<puzzle:eyeStatue range=6 switch=75>`
- **Pillars:** `<puzzle:pushable group="r46-stalker">`
- **Timed plates:** `<puzzle:timedPlate switch=76 holdSeconds=2 requireObject=false group="r46-stalker">`

## 3.17 — The Counterweight Maze

A vertical chamber with three counterweight pairs. Each pair is a platform-plate link — standing on plate A raises platform B (making it passable), standing on plate B raises platform C, and plate C's partner is the exit door. The player must daisy-chain the pairs: push a rock onto plate A, climb onto now-raised platform B, walk across, push a second rock onto plate B, climb onto now-raised platform C, walk across, trigger plate C, exit.

**Event setup**

- **Each plate:** `<puzzle:plate switch=<N> requireObject=true group="r47-chain">`
- **Each counterweight link:** `<puzzle:counterweightA partner=<partner event ID>>` on the plate events (treating the plate as "event A").
- **Boulders:** `<puzzle:pushable group="r47-chain">`

## 3.18 — The Arrow Field

A wide open chamber scattered with arrow floor panels at irregular intervals, mixed with safe floor. Normal walking works on safe tiles; arrow tiles force the player in their direction. The room's geometry is designed such that a single "pure walking" path from entry to exit is impossible — the player must enter the arrow field deliberately, allow a forced slide to carry them past a wall they cannot otherwise cross, then resume normal walking. This teaches the player that arrow tiles can be tools, not just obstacles.

**Event setup**

- **Each arrow:** `<puzzle:arrow dir=...>`

## 3.19 — The Conveyor Assembly Line

A chamber with a T-shaped conveyor belt. The main belt runs east; a secondary belt feeds south into the main belt's path. The player must push a boulder onto the secondary belt, which carries it south to the main belt, which carries it east onto a goal tile. Timing matters — if the player pushes the boulder too late, it misses the junction. Multiple boulders are available but only one goal; the extras are wasted pushes. A reset shrine helps.

**Event setup**

- **Main conveyor region:** `<puzzle:regionConveyor id=7 dir=right speed=1>`
- **Secondary conveyor region:** `<puzzle:regionConveyor id=8 dir=down speed=1>`
- **Boulders:** `<puzzle:pushable group="r49-assembly">`
- **Goal:** `<puzzle:goal group="r49-assembly">`
- **Solve checker:** `<puzzle:solveCheck group="r49-assembly" switch=77>`

## 3.20 — The Torch and Water

A small room with four torches that must all be lit to open the exit, but a water source in one corner is slowly flooding the room. The water advances one tile per second through channels. If water reaches an unlit torch, the torch is permanently snuffed (represented by `timer` behaviour or custom event logic). The player must light all torches before the water reaches them, in an order that prioritizes the soon-to-be-flooded torches. A lever near the entrance can close the water source, but the lever is three tiles away from the player's spawn, and walking to it first costs precious seconds. The tradeoff: close the valve (wastes time, gains safety) or rush to light torches (saves time, risks losing the puzzle to water).

**Event setup**

- **Source lever:** `<puzzle:lever group="r50-valve">`
- **Source:** `<puzzle:waterSource active=true activateSwitch=78>` (defaults to active at room entry; lever controls deactivate switch)
- **Torches:** `<puzzle:torch lit=false spread=false timer=0 group="r50-torches">` — with a parallel event per torch watching for water-channel presence on its tile and dousing it.
- **Channels:** `<puzzle:waterChannel switch=0 group="r50-water">`
- **Torch check:** `<puzzle:torchCheck group="r50-torches" switch=79>`

## 3.21 — The Frost-Choked Aqueduct

A sprawling, icy chamber combining slide-mechanics with water routing. The floor is predominantly polished ice, meaning the player will slide in a straight line until hitting a wall or object. A dry water channel meanders through the room, occasionally blocked by crystal gates. A water source waits at the highest point, and a water-check tile sits by the exit door. 

The player must open the correct crystal gates to route the water. However, the crystal switches are marooned on tiny stone islands in the middle of the ice. To reach them, the player must use several pushable iron crates, sliding them across the ice to act as backstops. The player slides into the crate, stops mid-ice, and from there can walk onto the stone island to hit the switch. The challenge is multi-layered: the player must solve the water-maze mentally, determine which islands to access, and then solve the sokoban-ice puzzle to physically reach those switches before finally pulling the lever to release the water.

**Event setup**

- **Ice Region:** `<puzzle:regionIce id=5>`
- **Iron Crates:** `<puzzle:pushable group="r52-frost">`
- **Water Source (activated by a separate lever):** `<puzzle:waterSource active=false activateSwitch=80>`
- **Channels & Check:** `<puzzle:waterChannel switch=0 group="r52-frost">`, `<puzzle:waterCheck switch=81>`
- **Crystal Switches:** `<puzzle:crystalSwitch group="cyan">`
- **Crystal Blocks (acting as channel gates):** `<puzzle:crystalBlock group="cyan" start=solid>`

## 3.22 — The Bridge Paradox

A minimalist room consisting of a pressure plate at the entrance, a bottomless pit spanning the middle of the room, and an exit door at the far end. A single heavy boulder sits on the pressure plate, keeping the exit door open. 

To cross the pit, the player must push the boulder off the plate and roll it into the chasm, where it wedges perfectly to form a makeshift bridge. The player can now safely walk across the pit. However, because the boulder was removed from the pressure plate, the exit door is now firmly locked, leaving the player stranded on the far side of the pit. 

The lateral solution plays with spatial sequence and the Undo Shrine located near the locked exit. The player pushes the boulder into the pit, crosses the newly formed bridge, and walks right up to the locked door. Standing safely on the exit side of the room, the player touches the Undo Shrine. The boulder instantly teleports out of the pit and back onto its starting position on the pressure plate. The bridge disappears behind the player, but the exit door clicks open. The player has sacrificed their only way back in exchange for the way forward.

**Event setup**

- **Boulder:** `<puzzle:pushable group="r35-paradox">` (Map geometry acts as the pit to catch it)
- **Pressure Plate:** `<puzzle:plate switch=45 requireObject=true group="r35-paradox">`
- **Exit Gate:** `<puzzle:gate levers="45" logic=AND group="r35-paradox">`
- **Undo Shrine (placed at the exit):** `<puzzle:undoShrine>`
---

# 4. LATERAL-THINKING PUZZLES

The mechanics are familiar; the solutions are not.

## 4.1 — The Empty Room

A stone chamber with a single wooden lever on the west wall. Pulling it appears to do nothing. The walls are uniform, no exit visible. In fact, an eye-statue is carved into the north wall — stylized as decorative masonry rather than a puzzle element. Its gaze extends four tiles south in a narrow cone. Standing in the gaze fires a hidden switch, and a disguised door in the east wall slides open — but only while the player is in the cone. The player must also pull the lever, which toggles a secondary door further along. Both conditions must be met.

**Event setup**

- **Lever:** `<puzzle:lever group="r51-empty">`
- **"Decorative" eye statue:** `<puzzle:eyeStatue range=4 switch=80>`
- **Disguised door:** page 2 (Switch 80 ON) with open passage sprite.
- **Secondary door:** `<puzzle:gate levers="<lever event ID>" logic=AND group="r51-empty">`

## 4.2 — Don't Push Everything

Four boulders in a row, a single goal near the easternmost. Each boulder has `maxPushes=1`. Only one boulder needs to reach the goal; the rest are decoys. Pushing wrong boulders pins them in blocking positions. The lateral insight is to ignore the obvious path and push only the easternmost.

**Event setup**

- **Each boulder:** `<puzzle:pushable maxPushes=1 group="r52-minimal">`
- **Goal:** `<puzzle:goal group="r52-minimal">`
- **Solve checker and reset shrine** as standard.

## 4.3 — The Absent Architect

Two rooms, A and B, separated by a closed gate. Room A has a plate requiring an object; nothing else. Room B has a shadow clone with `invertY=true`. Walking north in Room B sends the clone south in Room A. But the clone starts in Room B. The reveal: a hidden warp pad in Room A, accessible only to non-player events, lets the clone teleport to Room A. The clone walks through the warp, then the player positions themselves in Room B to drive the clone onto the Room A plate.

**Event setup**

- **Plate:** `<puzzle:plate switch=81 requireObject=true group="r53-absent">`
- **Clone:** `<puzzle:clone invertX=false invertY=true group="r53-absent">`
- **Hidden warp:** `<puzzle:warp x=4 y=3>` (player-collides-wall, clone-passes trick)
- **Gate:** conditional on Switch 81.

## 4.4 — The Poisoned Flame

Four torches in a square, three to light, one to avoid. An inscription reads "Three burn bright, one must sleep." One torch has a faintly greenish tinge — the cursed one. Lighting the cursed torch triggers a trap that seals the room. The player must identify the visual cue and light only the safe three.

**Event setup**

- **Safe torches:** `<puzzle:torch lit=false spread=false timer=0 group="r54-good">`
- **Cursed torch:** `<puzzle:torch lit=false spread=false timer=0 group="r54-cursed">`
- **Safe checker:** `<puzzle:torchCheck group="r54-good" switch=82>`
- Trap parallel event watches the cursed torch's self-switch A.

## 4.5 — The Observed Code

A library chamber with a combo lock on the north wall. Four levers on the west wall increment a variable by 1000, 100, 10, and 1. The code is not stated. The clue is the decor: four groups of torches hanging from the ceiling in a 1-3-3-1 pattern. Code = **1331**.

**Event setup**

- **Combo lock:** `<puzzle:comboLock variable=10 target=1331 switch=83>`
- **Each lever:** `<puzzle:variableLever variable=10 increment=<place>>`

## 4.6 — The Beam That Isn't

A beam puzzle that appears ordinary — emitter, mirrors, receiver. No mirror configuration completes the beam. A rock blocks the final tile. The rock is pinned against a wall, un-pushable by hand. The lateral insight: the rock is magnetic. An Attract pulse slides it clear. The mirrors are red herrings (already correctly configured).

**Event setup**

- **Emitter:** `<puzzle:beamEmitter dir=right>`
- **Mirrors (pre-correct):** `<puzzle:mirror orientation=slash>`
- **Receiver:** `<puzzle:beamReceiver switch=84>`
- **Blocking rock:** `<puzzle:pushable group="r56-beam">` + `<puzzle:magnetic>`

## 4.7 — The Conveyor Trick

A corridor entirely covered by an eastward conveyor. The exit is west. Walking west is canceled out by the conveyor (net motion zero). Solutions: find a hidden west-pointing arrow tile that forces a westward step, or push a rock into the east wall to create a barrier the conveyor can't push past, then use the rock as a foothold. Deliberately obtuse; for optional side areas.

**Event setup**

- **Conveyor region:** `<puzzle:regionConveyor id=7 dir=right speed=1>`
- **Hidden west arrow:** `<puzzle:arrow dir=left>`
- **Rock:** `<puzzle:pushable group="r57-conv">`

## 4.8 — The Wrong Key

A room with three locked doors — red, blue, green — and three keys, also red, blue, green. The naive approach is to match them. But one door (the red one) leads to a bottomless pit; one (the blue one) leads to the exit; one (the green one) leads to a reward chamber with optional loot. A wall inscription hints at the order by describing colours of "safety" and "treasure". The player must read and interpret rather than assume.

**Event setup**

- **Doors:** `<puzzle:colorDoor item=<N> consume=true group="r58-wrong">`
- Key items are granted by chest events.
- The red door leads through an event to a pit region. The green leads to a bonus chamber. The blue leads onward.

## 4.9 — The Silent Torch

A room with five torches arranged around the perimeter, all currently lit. The exit is closed. No checker switches are visible. The lateral insight: the torches' `spread=true` is routing fire to a single cursed torch hidden in the ceiling — the cursed torch's self-switch fires when lit, and that switch seals the exit. The player must *extinguish* torches to break the spread chain, forcing the cursed torch to go out and release the exit. Since the plugin's core `lightTorch` exists but there's no direct extinguish command, the room provides a bucket-of-water item the player can use by interacting with a torch — this is implemented via a parallel event that clears the torch's lit flag.

**Event setup**

- **All torches:** `<puzzle:torch lit=true spread=true timer=0 group="r59-silent">`
- **Cursed ceiling torch:** `<puzzle:torch lit=true spread=true timer=0 group="r59-cursed">`
- The exit is sealed while the cursed torch is lit (parallel watches its self-switch).
- The bucket item triggers an event to extinguish the adjacent torch (clears its self-switch A).

## 4.10 — The Mirror's Trick

A beam puzzle where the emitter on the west fires east, a mirror in the middle deflects, and a receiver waits on the south. The mirror is the only one in the room. Rotating it doesn't change the outcome — neither `/` nor `\` routes the beam correctly; the geometry is wrong. The lateral insight: the mirror is *magnetic*. Firing an Attract pulse from a mag-wand slides the mirror one tile, putting it in a position where `/` orientation finally routes the beam. The player must recognize the mirror as a magnetic object (subtle visual cue: iron clamps on its base) and use the wand on it.

**Event setup**

- **Emitter:** `<puzzle:beamEmitter dir=right>`
- **Mirror:** `<puzzle:mirror orientation=slash>` + `<puzzle:magnetic>`
- **Receiver:** `<puzzle:beamReceiver switch=85>`
- **Mag-wand console or item** fires an Attract pulse.

## 4.11 — The Locked Lever

A room with a prominent lever on the west wall, behind an iron cage. The lever cannot be reached. A key item supposedly opens the cage, but no such key exists in the dungeon. The lateral insight: the lever is not the puzzle. The exit door is opened by a *different* trigger — an eye-statue gaze at the north wall that the player hasn't noticed because their attention is fixed on the obvious lever. Walking calmly into the gaze (previously perceived as a trap) actually opens the door. The caged lever is pure misdirection.

**Event setup**

- **Caged lever:** a visually obvious lever event with no puzzle comment — inert by design.
- **Eye statue:** `<puzzle:eyeStatue range=5 switch=86>`
- **Door:** page 2 on Switch 86 opens it.

## 4.12 — The Extra Step

A room with a simple boulder-to-goal puzzle. Obvious, tutorial-easy. But the goal tile is *next to* a second tile marked with a subtle flourish. Pushing the boulder onto the goal opens the exit. Pushing it instead onto the flourish tile — which is not marked as a goal in the plugin — triggers a hidden script call that reveals an optional reward chamber. The player who goes the extra step finds treasure; the player who solves the puzzle straight earns nothing extra. This teaches that careful observation of environmental detail yields optional rewards.

**Event setup**

- **Boulder:** `<puzzle:pushable group="r62-extra">`
- **Goal:** `<puzzle:goal group="r62-extra">`
- **Solve checker:** `<puzzle:solveCheck group="r62-extra" switch=87>`
- **Flourish tile:** an ordinary event whose page 2 triggers when a pushable stands on it; opens the reward chamber.

## 4.13 — The Reverse Clone

A room with a clone set to `invertX=true invertY=true` — fully mirrored in both axes. Most player movements cause the clone to move in the exact opposite direction. The puzzle asks the player to reach a corner of the room where the clone must simultaneously reach the diagonally-opposite corner. The lateral insight: for a fully-inverted clone, the player and clone are always moving the same relative distance from the room's centre. Any movement of the player away from centre moves the clone symmetrically. The player must find the centre-symmetric path — walking a path whose mirror-image is also a valid walk in the clone's space.

**Event setup**

- **Clone:** `<puzzle:clone invertX=true invertY=true group="r63-full-invert">`
- **Two plates** at diagonally-opposite corners: `<puzzle:plate switch=88 ...>` and `<puzzle:plate switch=89 ...>`
- Exit requires both.

## 4.14 — The Overheard Secret

A dungeon room whose NPC attendant speaks a number when the player interacts with them — but only if certain conditions are met (the player is carrying a specific item, or has the dungeon torch count above a threshold). The number is a combo lock code elsewhere. The lateral step: realize that this NPC's dialog is conditionally dynamic, and that you must return after fulfilling the condition to hear the number.

**Event setup**

- The NPC event has conditional branches: if item X is held, say "the code is 7241"; otherwise, say a generic greeting.
- **Combo lock:** `<puzzle:comboLock variable=30 target=7241 switch=90>`

## 4.15 — The Pit That Isn't

A pit that the player has been taught, by every prior room, is dangerous. The current room demands crossing the pit. There is no bridge-rock to sacrifice, no floating platform, no warp pad. The lateral insight: the pit is decorative. It is a normal pit-region tile, but without the `regionPit` comment — so it does nothing. The visual is identical to a real pit, but stepping onto it is safe. Trust has been abused; the player learns that visual affordances can lie when the designer wishes, and must occasionally test their assumptions.

**Event setup**

- No comment on the pit — intentionally. Visual tile only.
- (Use sparingly; once in a game is enough, and ideally flagged in advance by a cryptic NPC hint.)

## 4.16 — The Undo-Saboteur

A room designed to flip the player's assumptions about the game's safety nets. The exit is located at the far end of a long corridor. An eye-statue sits at the entrance, casting a gaze cone that covers the entire corridor width. A heavy iron block rests on a pressure plate nearby; this plate holds the exit gate open. If the block is moved, the exit door slams shut. 

The naive approach is to push the iron block into the corridor to use as a mobile shield against the eye-statue's gaze. The player pushes the block, hides behind it, and safely walks past the statue. However, because the block is no longer on the pressure plate, the player arrives at a securely locked exit door. 

The lateral insight relies on the Undo Shrine located conveniently right next to the locked exit door. The player uses the block as a shield to safely cross the room. Once standing safely at the end of the corridor, past the eye-statue's line of sight, the player interacts with the Undo Shrine. The block instantly teleports back to its starting position on the pressure plate. The exit door clicks open, and the player simply walks through. The mechanic designed to fix mistakes becomes the key to the solution.

**Event setup**

- **Eye Statue:** `<puzzle:eyeStatue range=10 switch=90>`
- **Iron Block:** `<puzzle:pushable group="r65-undo">`
- **Pressure Plate:** `<puzzle:plate switch=91 requireObject=true group="r65-undo">`
- **Exit Gate:** `<puzzle:gate levers="91" logic=AND group="r65-undo">`
- **Undo Shrine (placed at the end of the hall):** `<puzzle:undoShrine>`

## 4.17 — The Jammed Treadmill

A hazardous intersection of ice and machinery. The player must cross a large frozen floor to reach the exit on the east wall. However, the center column of the ice patch is a conveyor belt rushing rapidly to the south, terminating in a bottomless pit. Any player attempting to slide straight across the ice from west to east will hit the conveyor, lose their eastward momentum, and be violently thrown south into the pit.

The room provides a single pushable iron crate. The lateral solution requires the player to view the conveyor belt not just as a floor tile, but as a trap to be disabled. The player slides the crate from the north so that it lands on the conveyor belt. The belt carries the heavy crate south until it jams against a retaining wall at the very edge of the pit. Because the crate is now constantly being pushed against the wall, it remains permanently stationed on the conveyor belt tile. The player can now confidently slide eastward across the ice. They will slam into the jammed crate—which acts as a safe, solid backstop—completely bypassing the conveyor's deadly redirection, and can safely step off the ice to the exit.

**Event setup**

- **Ice Region:** `<puzzle:regionIce id=9>`
- **Conveyor (South):** `<puzzle:regionConveyor id=10 dir=down speed=2>`
- **Iron Crate:** `<puzzle:pushable group="r45-treadmill">`
---

# 5. INTERLOCKING COMPLEXES

Multi-room dungeons. Each room's solution affects others; mis-ordering creates partial dead states.

## 5.1 — The Tri-Spire Sanctum

Three chambers branch off a central hub. Each is a self-contained puzzle; completing each lights one of three runes on a sealed trapdoor in the hub. All three must be lit to descend.

**Central hub** — A circular room with four exits. The master trapdoor is in the floor, surrounded by three rune circles.

**Ice Spire (east)** — A tall chamber with a frozen column in the centre. Push three ice blocks onto three rune tiles, using the column as a stopping point for one of the tricky placements.

**Flame Spire (south)** — A torch web with `spread=true`. A mobile brazier must be positioned at the branching chain's central node to ignite all torches simultaneously.

**Gaze Spire (west)** — Three eye-statues with overlapping cones. Statues' cones rotate on a state-variable timer. The player reaches a central pedestal by moving only when gazes misalign.

**Event setup (highlights)**

```
# Ice Spire
<puzzle:regionIce id=5>
<puzzle:pushable group="spire-ice">          (on each block)
<puzzle:goal group="spire-ice">              (on each rune)
<puzzle:solveCheck group="spire-ice" switch=100>
<puzzle:resetShrine group="spire-ice">

# Flame Spire
<puzzle:torch lit=false spread=true timer=0 group="spire-flame">    (each torch)
<puzzle:torch lit=true spread=true timer=0 group="spire-flame">     (starter)
<puzzle:pushable group="spire-flame">                                (brazier)
<puzzle:torch lit=false spread=true timer=0 group="spire-flame">    (brazier also)
<puzzle:torchCheck group="spire-flame" switch=101>

# Gaze Spire
<puzzle:eyeStatue range=5 switch=102>       (each statue)
<puzzle:stateTile variable=20 passable="0,2">
<puzzle:comboLock variable=0 target=1 switch=103>

# Master trapdoor (hub)
<puzzle:gate levers="201,202,203" logic=AND group="tri-spire">
```

Proxy levers 201, 202, 203 are hidden events whose state mirrors Switches 100, 101, 103 via parallel processes.

## 5.2 — The Flooded Citadel

A four-floor vertical dungeon around a single hydraulic system. Water flows from a cistern on Floor 4 to a germination chamber on Floor 1. Each floor gates the next.

**Floor 4 (cistern)** — Valve lever opens a water source. Pipes are blocked by a crystal block, controlled by a crystal switch behind a plate-gated door. Push a rock onto the plate, open the door, flip the switch, pull the valve.

**Floor 3 (mirror gallery)** — Water arrives and branches. A drain absorbs one branch. Unplugging the drain requires a beam puzzle routed through three mirrors to a receiver.

**Floor 2 (magnetic docks)** — Water fills a basin with a cracked wall. A magnetic plug must be slid into the crack via a Repel pulse from the magnet-wand.

**Floor 1 (germination chamber)** — Water fills a basin, a seed blossoms into a vine reaching back to Floor 3's treasure room.

**Event setup (highlights)**

```
# Floor 4
<puzzle:pushable group="citadel-f4">
<puzzle:plate switch=110 requireObject=true group="citadel-f4">
<puzzle:gate levers="210" logic=AND group="citadel-f4">
<puzzle:crystalSwitch group="citadel-pipe">
<puzzle:crystalBlock group="citadel-pipe" start=solid>
<puzzle:lever group="citadel-valve">
<puzzle:waterSource active=false activateSwitch=111>

# Floor 3
<puzzle:waterChannel switch=0 group="citadel-water">
<puzzle:waterChannel switch=112 group="citadel-water">   (floor 3 wheel)
<puzzle:waterDrain>
<puzzle:beamEmitter dir=right>
<puzzle:mirror orientation=slash>
<puzzle:beamReceiver switch=113>

# Floor 2
<puzzle:waterChannel switch=114 group="citadel-water">
<puzzle:pushable group="citadel-f2">
<puzzle:magnetic>                                         (plug is pushable + magnetic)
<puzzle:magnetConsole polarity=repel range=6 steps=3>

# Floor 1
<puzzle:waterChannel switch=115 group="citadel-water">
```

## 5.3 — The Clockwork Archive

A large room with four concentric rings. Each ring contains a sub-puzzle; all interlock.

- **Ring 1** — Rock and plate; rock trapped behind a crystal block controlled by Ring 3.
- **Ring 2** — Beam and mirror; mirror pinned by magnetic blockade, freed by Ring 4's magnet console.
- **Ring 3** — Crystal switch; guarded by eye-statue whose gaze must be blocked by a clone from Ring 1.
- **Ring 4** — Magnet console (gated by Ring 1's plate) and combo lock (code from lit torch pattern across all rings).

The dependency loop is broken by the clone's ability to access Ring 3 via a hidden warp (player cannot). Clone walks to Ring 3, blocks statue gaze, player enters safely, flips switch, Ring 1 unlocks, etc. The dungeon is designed for trial-and-error with prominent reset obelisks.

**Event setup**

```
# Ring 1
<puzzle:pushable group="archive-r1">
<puzzle:plate switch=120 requireObject=true group="archive-r1">
<puzzle:crystalBlock group="archive-r3" start=solid>
<puzzle:torch lit=false spread=false timer=0 group="archive-r1-torch">

# Ring 2
<puzzle:beamEmitter dir=right>
<puzzle:mirror orientation=slash>
<puzzle:beamReceiver switch=121>
<puzzle:magnetic>                           (blockade)
<puzzle:torch lit=false spread=false timer=0 group="archive-r2-torch">

# Ring 3
<puzzle:crystalSwitch group="archive-r3">
<puzzle:eyeStatue range=5 switch=122>
<puzzle:clone invertX=true invertY=false group="archive-r1">
<puzzle:warp x=10 y=4>
<puzzle:torch lit=false spread=false timer=0 group="archive-r3-torch">

# Ring 4
<puzzle:gate levers="220" logic=AND group="archive-r4">
<puzzle:magnetConsole polarity=repel range=6 steps=2>
<puzzle:comboLock variable=30 target=2718 switch=123>

# Final exit
<puzzle:gate levers="221" logic=AND group="archive-final">

# Reset obelisks
<puzzle:resetShrine group="archive-r1">
<puzzle:resetShrine group="archive-r3">
<puzzle:resetShrine group="archive-r4">
```

## 5.4 — The Seasons Labyrinth

A sprawling dungeon with season-tile geography. Variable 20 holds the season (1=Spring, 2=Summer, 3=Autumn, 4=Winter). The seasonal compass cycles it. Four shrines, each season-specific, each inaccessible outside its season.

- **Spring Shrine** — Sokoban with saplings that only exist in Spring.
- **Summer Shrine** — Eye-statue gauntlet; statue is dormant in Winter but plaza is inaccessible.
- **Autumn Shrine** — Leaf-hidden plates; leaves obscure plate positions in Autumn.
- **Winter Shrine** — Ice sokoban requiring a vine grown briefly in Spring to block an ice slide.

Corridors also require specific seasons to traverse (a frozen-river-bridge in Winter, a summer-vine-ladder, etc.). Central pavilion requires all four seasonal runes to open.

**Event setup (highlights)**

```
# Season tiles
<puzzle:stateTile variable=20 passable="1">      (Spring-only)
<puzzle:stateTile variable=20 passable="4">      (Winter-only bridge)
<puzzle:stateTile variable=20 passable="2,3">    (summer+autumn passage)

# Spring sapling
<puzzle:pushable group="spring-shrine">
<puzzle:stateTile variable=20 passable="1">

# Summer statue
<puzzle:eyeStatue range=6 switch=130>

# Autumn plate
<puzzle:plate switch=131 requireObject=true group="autumn-shrine">
<puzzle:stateTile variable=20 passable="3">

# Winter ice
<puzzle:regionIce id=5>
<puzzle:pushable group="winter-shrine">
<puzzle:goal group="winter-shrine">
<puzzle:solveCheck group="winter-shrine" switch=133>

# Master gate
<puzzle:gate levers="301,302,303,304" logic=AND group="seasons-master">
```

## 5.5 — The Symphony of Pipes

An organ-hall dungeon with four massive pipe organs at cardinal walls and a conductor's pedestal in the centre. Each organ, when fully activated, raises its resonance value. The pedestal combo-lock opens the exit when the shared variable equals **3527** (N=3, E=5, S=2, W=7).

- **Organ North (bronze pipes / torches)** — Light all torches to set resonance to 3.
- **Organ East (crystal pipes / plates + crystal)** — Flip a crystal switch, then press three plates.
- **Organ South (stone pipes / beams)** — Route a beam through mirrors into three receivers sequentially.
- **Organ West (ice pipes / ice sokoban)** — Push ice blocks onto seven targets.

Interlocks: Organ North's fire-spread propagates into Organ East and ignites a flammable crystal if not first made insubstantial via East's crystal switch. Organ South's beam passes through Organ West's ice chamber and requires Organ West's blocks to deflect it around a pillar. Solving order: East → North → West → South.

**Event setup (highlights)**

```
# Organ North
<puzzle:torch lit=false spread=true timer=0 group="organ-N">
<puzzle:torchCheck group="organ-N" switch=140>

# Organ East
<puzzle:crystalSwitch group="organ-E">
<puzzle:crystalBlock group="organ-E" start=solid>
<puzzle:plate switch=141 requireObject=false group="organ-E">
<puzzle:plate switch=142 requireObject=false group="organ-E">
<puzzle:plate switch=143 requireObject=false group="organ-E">

# Organ South
<puzzle:beamEmitter dir=right>
<puzzle:mirror orientation=slash>
<puzzle:beamReceiver switch=144>
<puzzle:beamReceiver switch=145>
<puzzle:beamReceiver switch=146>

# Organ West
<puzzle:regionIce id=5>
<puzzle:pushable group="organ-W">
<puzzle:goal group="organ-W">
<puzzle:solveCheck group="organ-W" switch=147>

# Conductor's pedestal
<puzzle:comboLock variable=40 target=3527 switch=148>

# Final exit
<puzzle:gate levers="400" logic=AND group="symphony-final">
```

Parallel events convert each organ's completion switch into its resonance-contribution: +3000 for North, +500 for East, +20 for South, +7 for West.

## 5.6 — The Nested Keep

A multi-floor castle with thirteen colour-coded doors and eleven keys. Players must plan traversal order to avoid dead-ending with unspendable keys or unreachable rewards. The entrance hall branches to three wings (west, north, east), each with its own sub-tree. Keys collected in one wing often unlock doors in another, creating cross-wing dependency. A planning room in the ground floor shows the full door-key graph.

The final treasure vault is gold; only one gold key exists, hidden deep in the north wing behind four specific coloured doors. A notepad NPC lets the player track their progress.

**Event setup**

- **Each coloured door:** `<puzzle:colorDoor item=<colour-key-item-ID> consume=true group="nested-keep">`
- **Each key pickup:** an ordinary chest event granting a key item, or `<puzzle:keyGrant item=<N> quantity=1>`
- **Key sub-puzzles (chambers that gate keys):** standard mechanics — solve the puzzle, the key appears.
- **Final gold door:** `<puzzle:colorDoor item=<gold-key-ID> consume=true group="nested-keep-final">`
- **Reset shrine (entrance hall):** `<puzzle:resetShrine group="nested-keep">` with event-command to clear key items.

## 5.7 — The Mirror Dungeon

A labyrinth where every room is rendered twice — a "real" version and a "reflected" version on the same map, separated by impassable wall. The player occupies one version; a shadow-clone persists in the other with `invertX=true invertY=true`. Reflection pools swap which version the player controls.

The central chamber has a boulder in the real version and a goal in the reflected. Pushing the real boulder doesn't affect the reflected boulder — but pushing causes the clone (invert-mirrored) to push the reflected boulder toward the reflected goal. Since walls differ between versions, push paths that work in both simultaneously are rare and require careful planning.

The final chamber has three plates: one real, one reflected, one in a sub-room reachable only by a temporary three-second warp. Coordinating all three requires rapid role-swapping via reflection pools.

**Event setup (highlights)**

```
<puzzle:clone invertX=true invertY=true group="mirror-dungeon">
<puzzle:reflectionPool swapWith=<clone event ID>>     (each pool)
<puzzle:pushable group="mirror-dungeon">              (both boulders)
<puzzle:goal group="mirror-dungeon">                  (both goals)

# Final chamber
<puzzle:plate switch=150 requireObject=false group="mirror-final">
<puzzle:plate switch=151 requireObject=false group="mirror-final">
<puzzle:plate switch=152 requireObject=false group="mirror-final">
<puzzle:gate levers="500,501,502" logic=AND group="mirror-final">
<puzzle:warp x=<subroom X> y=<subroom Y>>             (temporary sub-room warp)
```

A parallel event returns the player from the sub-room after 180 frames (three seconds at 60fps).

## 5.8 — The Abyss of Reflected Time

A six-floor vertical dungeon where each floor exists in both a "present" and a "past" state, governed by a time variable (Variable 22: 1 = present, 2 = past). A wristwatch item, found on Floor 1, toggles the time. Certain rooms on each floor differ radically between the two states — a collapsed bridge in the present is a standing archway in the past; a grown forest in the past is charred ruins in the present. The player must oscillate between times strategically.

Each floor has a time-sensitive puzzle:

- **Floor 1** — A locked chest in the present is open in the past; steal the key from the past, return to present, unlock the chest (which now holds the next floor's key).
- **Floor 2** — A water basin flooded in the present is dry in the past; in the past, push a boulder into the dry basin, return to present, the boulder is now underwater and acts as a submerged stepping stone.
- **Floor 3** — Light torches in the past; the soot on the walls in the present reveals a hidden combination code.
- **Floor 4** — A shadow-clone from the past mirrors the player in the present; use the clone to solve a two-plate puzzle where one plate is in the past's geometry and one in the present's.
- **Floor 5** — A magnetic object stuck in a pit in the present was a magnetic object on solid ground in the past; fire an Attract pulse in the past to move it, return to present, the pit-bound object is now repositioned.
- **Floor 6 (boss)** — A gate with four rune-slots; each rune is earned by completing one of four optional cross-time riddles that span multiple previous floors.

**Event setup (highlights)**

```
# Time tiles (everywhere)
<puzzle:stateTile variable=22 passable="1">     (present-only tile)
<puzzle:stateTile variable=22 passable="2">     (past-only tile)

# Floor 1 chest
- Past chest: normal event, grants key.
- Present locked chest: <puzzle:colorDoor item=<key> consume=true group="abyss-f1">
<puzzle:stateTile variable=22 passable="1">     (visible only in present)

# Floor 2 boulder
<puzzle:pushable group="abyss-f2">
<puzzle:stateTile variable=22 passable="2">     (only pushable in past)

# Floor 3 torches
<puzzle:torch lit=false spread=false timer=0 group="abyss-f3">
<puzzle:torchCheck group="abyss-f3" switch=160>
<puzzle:comboLock variable=50 target=<observed-code> switch=161>

# Floor 4 clone
<puzzle:clone invertX=false invertY=false group="abyss-f4">
<puzzle:plate switch=162 requireObject=false group="abyss-f4">
<puzzle:plate switch=163 requireObject=false group="abyss-f4">

# Floor 5 magnetic
<puzzle:pushable group="abyss-f5">
<puzzle:magnetic>
<puzzle:stateTile variable=22 passable="2">
<puzzle:magnetConsole polarity=attract range=6 steps=3>

# Floor 6 gates
<puzzle:gate levers="600,601,602,603" logic=AND group="abyss-final">
```

Each of Switches 160–163 triggers a proxy lever. A global reset obelisk clears all time-sensitive progress.

## 5.9 — The Hexring Forge

A dungeon built as six interlocking hexagonal chambers arranged in a larger hexagon, with a central forge chamber at the centre. Each outer chamber contains a single-mechanic puzzle producing a heated ingot — the player must solve the puzzle to extract the ingot and carry it to the central forge. The forge requires all six ingots to craft the exit key.

The twist is that each ingot cools over time — about ninety seconds after pickup — and a cooled ingot is worthless and must be returned to its chamber's re-heater (a sub-puzzle requiring partial re-solving). Carrying multiple hot ingots at once risks losing them all to cooling if the player takes too long. The game thus demands fast routing: solve each chamber, grab the ingot, run to the forge, drop it in, run back. Players can solve chambers in any order.

The six outer chambers, each thematically distinct:

- **Iron chamber** — Sokoban on a heated floor; pushable blocks are actually heated ingots forged in place.
- **Copper chamber** — Beam puzzle where the final receiver is a furnace that produces an ingot.
- **Bronze chamber** — Torch relay; lighting all torches heats a central crucible.
- **Silver chamber** — Ice sokoban where the solved state melts a frozen silver deposit.
- **Gold chamber** — Water-fill puzzle where routing water to a terminal wheel powers a gold extractor.
- **Obsidian chamber** — Lights-out grid where the solved state triggers a volcanic vent.

**Event setup (representative)**

Each chamber uses mechanics from earlier sections, terminating in a common event that places an ingot item in the player's inventory with an attached timer (via an event variable that decrements). The forge accepts each ingot on contact.

```
# Forge
<puzzle:comboLock variable=60 target=63 switch=170>    (ingot-count, target 6*10+3 encoding)

# Sample chamber (iron)
<puzzle:pushable group="forge-iron">
<puzzle:goal group="forge-iron">
<puzzle:solveCheck group="forge-iron" switch=171>     (produces iron ingot on fire)
<puzzle:resetShrine group="forge-iron">
```

A common event triggered by Switch 171 grants the iron ingot and starts its cooling timer.

## 5.10 — The Living Library

A massive four-floor dungeon-as-library where books themselves are puzzle elements. Each floor is a wing — Fiction, History, Arcana, Forbidden — and each wing has a unique gameplay theme.

**Fiction wing (floor 1)** — Rooms that rearrange themselves based on story-variable state (like seasons but tied to progress in a meta-narrative). Pressing plates in specific rooms updates the narrative variable; the wing's geography reshapes around the player's choices.

**History wing (floor 2)** — Chronological. Rooms represent historical eras; the player must visit them in specific order, reading wall-plaques that provide combo-lock codes for later rooms. Out-of-order visits lock doors.

**Arcana wing (floor 3)** — Beam/mirror heavy. Magical sigils route beams between floors via vertical light-channels (a plugin extension via events). Solving Arcana requires the player to visit floors 1 and 2 first for mirror placement info.

**Forbidden wing (floor 4)** — All mechanics at once. A final gauntlet combining torches, ice, crystals, beams, water, and clones. Each room gates the next.

Central rotunda — A hub connecting all four wings with a locked grand exit requiring all four wing seals.

**Event setup (structural — full detail would fill a second document)**

- **Each wing's master seal:** fired by the wing's final solve-check switch.
- **Grand exit:** `<puzzle:gate levers="700,701,702,703" logic=AND group="library-final">`
- Mechanics in each wing use comments from earlier sections.
- Cross-wing dependencies are encoded via parallel events and state variables.

This dungeon is the capstone design — using essentially every puzzle mechanic and relying on the player's accumulated expertise across the entire game.

## 5.10 — The Chrono-Forge

A towering multi-floor complex built entirely around a time-shifting artifact. The player can toggle Variable 22 between `1` (The Past: Pristine) and `2` (The Present: Ruined). Changing time alters the passable state of tiles, the presence of objects, and the physical architecture of the floors.

**Floor 1 (The Broken Mirror)** — A beam emitter constantly fires in the Past, but its crucial deflection mirror is shattered in the Present. The player must manipulate pushable boulders in the Present (where they are rusted and light) to form a path, then shift to the Past to push the heavy, intact mirror along that path to catch the beam.
**Floor 2 (The Phantom Wall)** — A dense maze of `crackable` walls exists in the Present. In the Past, these are solid, indestructible iron vaults. The player must navigate as far as possible in the Past, locate spatial gaps, drop a rock on a plate to open a gate in the Past, and then shift to the Present to smash through the decayed masonry blocking the rest of the path.
**Floor 3 (The Ghost Basin)** — A `waterSource` activated in the Past fills a massive basin in the Present (it takes centuries for the drip to fill the room). The player must push wooden crates into the empty, dry basin in the Past. Shifting to the Present causes the basin to fill with water, raising the crates to the surface where they act as a floating bridge to the final door.

**Event setup (highlights)**

# Universal Time State
# Variable 22 = 1 (Past), Variable 22 = 2 (Present)

# Floor 1 — The Mirror
<puzzle:stateTile variable=22 passable="1"> (Intact floor, past only)
<puzzle:stateTile variable=22 passable="2"> (Shattered floor, present only)
<puzzle:mirror orientation=slash> (Page 1: Past graphic. Page 2: Present graphic, shattered)

# Floor 2 — The Walls
<puzzle:crackable item=7 consume=false group="chrono-f2"> (Present only, requires condition Variable 22 == 2)
<puzzle:pushable group="chrono-f2"> 
<puzzle:plate switch=180 requireObject=true group="chrono-f2">

# Floor 3 — The Basin
<puzzle:waterSource active=false activateSwitch=181> (Past only)
<puzzle:stateTile variable=22 passable="2"> (Water tiles, present only)
<puzzle:pushable group="chrono-f3"> (Wooden crates)

## 5.11 — The Reluctant Guardian

A tense, single-room puzzle about order of operations and safety nets. An eye-statue stands at the north end of the room, casting a gaze over the entire central floor. If the player steps into the gaze, the exit door snaps shut. Fortunately, a solid blue crystal block is resting directly in front of the statue's eye, safely blinding it and allowing the player to walk freely around the room. 

The problem: the exit door itself is also barricaded by a solid blue crystal block. A crystal switch sits in the center of the room. The naive player strikes the switch, successfully dissolving the crystal block at the door. However, this simultaneously dissolves the crystal block blinding the statue. The statue instantly spots the player in the center of the room, and the exit door slams shut anyway. 

The lateral leap requires the player to construct a replacement blindfold. The player must locate the room's single pushable iron crate and drag it across the room, wedging it directly behind the crystal block currently blinding the statue. Only after the statue has been physically blocked by the iron crate can the player strike the crystal switch. The blue blocks dissolve, opening the exit, but the iron crate remains behind to catch the statue's gaze, guaranteeing a safe escape.

**Event setup**

- **Eye Statue:** `<puzzle:eyeStatue range=10 switch=50>`
- **Exit Gate:** `<puzzle:gate levers="50" invert=true group="r52-guardian">` (Gate opens when gaze is broken)
- **Iron Crate:** `<puzzle:pushable group="r52-guardian">`
- **Crystal Switch:** `<puzzle:crystalSwitch group="blue">`
- **Crystal Blocks:** `<puzzle:crystalBlock group="blue" start=solid>`


# Appendix A — Self-Setup Comment Quick Reference

| Mechanic | Comment |
|---|---|
| Pushable rock/box | `<puzzle:pushable maxPushes=N group="X">` |
| Pit (event-based) | `<puzzle:pit group="X">` |
| Goal tile | `<puzzle:goal group="X">` |
| Solve checker | `<puzzle:solveCheck group="X" switch=N>` |
| Reset shrine | `<puzzle:resetShrine group="X">` |
| Undo shrine | `<puzzle:undoShrine>` |
| Pressure plate | `<puzzle:plate switch=N requireObject=bool group="X">` |
| Timed plate | `<puzzle:timedPlate switch=N holdSeconds=N requireObject=bool group="X">` |
| Lever | `<puzzle:lever group="X">` |
| Gate | `<puzzle:gate levers="1,2,..." logic=AND\|OR\|XOR group="X">` |
| Ice region | `<puzzle:regionIce id=N>` |
| Pit region | `<puzzle:regionPit id=N damage=N>` |
| Arrow tile | `<puzzle:arrow dir=up\|down\|left\|right>` |
| Conveyor region | `<puzzle:regionConveyor id=N dir=... speed=N>` |
| Crystal switch | `<puzzle:crystalSwitch group="X">` |
| Crystal block | `<puzzle:crystalBlock group="X" start=solid\|open>` |
| Torch | `<puzzle:torch lit=bool spread=bool timer=N group="X">` |
| Torch check | `<puzzle:torchCheck group="X" switch=N>` |
| Color tile | `<puzzle:colorTile states=N group="X">` |
| Color check | `<puzzle:colorCheck group="X" target=N switch=N>` |
| Lights-out link | `<puzzle:lightsOutLink neighbors="N,N,...">` |
| Color door | `<puzzle:colorDoor item=N consume=bool group="X">` |
| Variable lever | `<puzzle:variableLever variable=N increment=N>` |
| Combo lock | `<puzzle:comboLock variable=N target=N switch=N>` |
| Warp tile | `<puzzle:warp x=N y=N>` |
| Reflection pool | `<puzzle:reflectionPool swapWith=N>` |
| Crackable wall | `<puzzle:crackable item=N consume=bool group="X">` |
| Timed tile | `<puzzle:timedTile steps=N group="X">` |
| Blink platform | `<puzzle:blinkPlatform on=N off=N>` |
| Eye statue | `<puzzle:eyeStatue range=N switch=N>` |
| State tile | `<puzzle:stateTile variable=N passable="N,N,...">` |
| Magnetic object | `<puzzle:magnetic>` |
| Magnet console | `<puzzle:magnetConsole polarity=attract\|repel range=N steps=N>` |
| Counterweight A | `<puzzle:counterweightA partner=N>` |
| Beam emitter | `<puzzle:beamEmitter dir=...>` |
| Mirror | `<puzzle:mirror orientation=slash\|backslash>` |
| Beam receiver | `<puzzle:beamReceiver switch=N>` |
| Clone | `<puzzle:clone invertX=bool invertY=bool group="X">` |
| Water source | `<puzzle:waterSource active=bool activateSwitch=N>` |
| Water channel | `<puzzle:waterChannel switch=N group="X">` |
| Water drain | `<puzzle:waterDrain>` |
| Water check | `<puzzle:waterCheck switch=N>` |
| Key grant | `<puzzle:keyGrant item=N quantity=N>` |

---

# Appendix B — Design Principles in Practice

Rooms built with this system benefit from a few recurring habits.

**Always pair a reset with any brickable puzzle.** Every puzzle group ID should have at least one reset shrine in reachable proximity. Sokoban and ice rooms are save-corruption hazards without one.

**Stack comments freely on a single event.** `<puzzle:pushable>` with `<puzzle:magnetic>`, or `<puzzle:pushable>` with `<puzzle:torch>`, or `<puzzle:pushable>` with `<puzzle:clone>` — the plugin merges behaviours from all comments on the event, and this is where the richest lateral puzzles emerge. Layering identities on a single object is the most powerful tool in the system.

**Use proxy levers for interlocking gates.** When you want a gate to open based on multiple puzzle-completion switches, create hidden "proxy" lever events whose state is set by parallel events watching the target switches. The `<puzzle:gate>` AND/OR/XOR logic then combines them naturally. This scales to any number of sub-puzzles.

**Design state-variable worlds for transformation puzzles.** A single state variable (season, time-of-day, tide) combined with `<puzzle:stateTile>` across a whole map creates geography that feels alive. Rooms that transform as the variable changes produce strong "aha" moments.

**Respect fire-spread topology.** Torches with `spread=true` propagate across adjacency chains, sometimes further than intended. Plan these paths explicitly; unintended ignitions are a common source of bugs.

**Clone mechanics are the strongest lateral tool.** A clone that can access areas the player cannot — via hidden warps, through state-tile-blocked paths, or via inverted movement — enables puzzles no single-player design can produce. Use them sparingly for maximum impact; overused, they become formulaic.

**Telegraph reset prominence.** A big glowing obelisk in the centre of a room signals "this is a trial-and-error puzzle, experiment freely." A small discreet shrine in a corner signals "a reset is here for emergencies but you shouldn't need it." Match the reset's visibility to the expected difficulty.

**Layer puzzle identities to create your best rooms.** An iron block that is also a torch is a portable fire-delivery system. A pushable that is also magnetic can be moved across pits by pulse. A clone that is also a pressure-plate-activator enables remote triggering. The richest puzzles ask the player to recognize the second identity.

**Test with real people.** Design intuitions about difficulty are almost always wrong. Watch silently while two or three people who haven't seen the dungeon play through it. Their confusion, frustration, and delight is the true measure.

**Save sparingly, reset generously.** Old-school design wisdom said that scarcity of saves made games tense. Modern design wisdom says that tension comes from meaningful challenges, not from losing progress. Be generous with save points; be generous with resets. Players who trust that the game will not punish experimentation will experiment more, and will enjoy the puzzles more.

**Every dungeon should have a thesis.** Before designing any rooms, write one sentence describing what the dungeon is *about*. "A torch-focused dungeon that teaches fire-spread geometry." "An ice-and-magnetism dungeon about using external forces to move objects." "A time-travel dungeon about how past actions affect the present." If you cannot state a one-sentence thesis, the dungeon will lack coherence. Revisit and simplify until the thesis is clear.
