/*:
 * @target MZ
 * @plugindesc Map Puzzle System — Sokoban rocks, ice, pressure plates, crystal switches, torches,
 * arrows, crackable walls, levers/gates, conveyors, warp pads, timed tiles, color tiles,
 * light beams, clones, magnetic objects, counterweights, water fill, and more.
 * @author esoteric-heavy-industries
 *
 * ─── PUSH / SOKOBAN ──────────────────────────────────────────────────────────
 * @command setPushable
 * @text Set Pushable Rock/Box
 * @desc Mark an event as a pushable object. Player walks into it to push.
 * Self-setup: <puzzle:pushable maxPushes=0 group="room1">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg maxPushes
 * @type number @min 0 @default 0 @text Max Pushes (0 = unlimited)
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command setPit
 * @text Set Pit / Hole (event)
 * @desc Event-based pit. Pushables landing here fill it and both disappear.
 * Self-setup: <puzzle:pit group="room1">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command setPitRegion
 * @text Set Pit Region
 * @desc Region ID behaves as a pit: player takes damage and returns to last safe tile.
 * Self-setup (map setup event): <puzzle:regionPit id=6 damage=0>
 * @arg regionId
 * @type number @min 1 @max 255 @text Region ID
 * @arg damage
 * @type number @min 0 @default 0 @text HP damage (0 = no damage, just warp back)
 *
 * @command clearPitRegion
 * @text Clear Pit Region
 * @arg regionId
 * @type number @min 1 @max 255 @text Region ID
 *
 * @command setPuzzleGoal
 * @text Set Goal Event
 * @desc Marks an event as a completion condition for its group. Puzzle is solved when all
 * goal events in the group have Self Switch A ON. Place alongside another puzzle tag.
 * Self-setup: <puzzle:goal>  (group inferred from co-registered puzzle tag on same event)
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command checkPuzzleSolved
 * @text Check Puzzle Solved
 * @desc Sets a switch when all goal events in the group have Self Switch A ON. Plays Fanfare1 when solved.
 * Self-setup (auto-check + switch): <puzzle:solveCheck group="room1" switch=10>
 * @arg puzzleId
 * @type string @text Puzzle Group ID
 * @arg switchId
 * @type switch @text Switch to Set on Solved
 *
 * @command resetPuzzle
 * @text Reset Puzzle
 * @desc Restores all pushable/lever/torch/clone events in a group to initial state.
 * Self-setup (interact to reset): <puzzle:resetShrine group="room1">
 * @arg puzzleId
 * @type string @text Puzzle Group ID
 *
 * @command undoStep
 * @text Undo Last Push
 * @desc Reverts the last pushed rock/box move (up to 20 moves back).
 * Self-setup (interact to undo): <puzzle:undoShrine>
 *
 * ─── PLATES & GATES ──────────────────────────────────────────────────────────
 * @command setPressurePlate
 * @text Set Pressure Plate
 * @desc Activates a switch while a pushable (or player) stands on this event's tile.
 * Self-setup: <puzzle:plate switch=11 requireObject=true group="plate1">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg switchId
 * @type switch @text Switch to Activate
 * @arg requireObject
 * @type boolean @default false @text Require Object (not player)
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command setTimedPlate
 * @text Set Timed Pressure Plate
 * @desc Plate must be held for N seconds before it fires. Resets if left early.
 * Self-setup: <puzzle:timedPlate switch=22 holdSeconds=3 requireObject=false group="timed1">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg switchId
 * @type switch @text Switch to Activate
 * @arg holdSeconds
 * @type number @min 1 @default 3 @text Seconds to Hold
 * @arg requireObject
 * @type boolean @default false @text Require Object (not player)
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command setLever
 * @text Set Lever
 * @desc Interactable event that toggles on/off when the player presses Action.
 * Self-setup: <puzzle:lever group="lv1">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command setGate
 * @text Set Gate
 * @desc Barrier that opens when lever logic resolves to true.
 * Self-setup: <puzzle:gate levers="1,2" logic=AND group="gate2a">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg leverIds
 * @type string @text Lever Event IDs (comma-separated)
 * @arg logicMode
 * @type select @text Logic Mode
 * @option AND @value AND
 * @option OR @value OR
 * @option XOR @value XOR
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * ─── ICE / FLOOR ─────────────────────────────────────────────────────────────
 * @command setIceRegion
 * @text Set Ice Region
 * @desc Region ID tiles behave as ice: player and rocks slide until hitting a wall.
 * Self-setup (map setup event): <puzzle:regionIce id=5>
 * @arg regionId
 * @type number @min 1 @max 255 @text Region ID
 *
 * @command clearIceRegion
 * @text Clear Ice Region
 * @arg regionId
 * @type number @min 1 @max 255 @text Region ID
 *
 * @command setArrowTile
 * @text Set Arrow Tile
 * @desc Player is forced one step in a direction when stepping on this event.
 * Self-setup: <puzzle:arrow dir=right>
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg direction
 * @type select @text Direction
 * @option Up @value up
 * @option Down @value down
 * @option Left @value left
 * @option Right @value right
 *
 * @command setConveyorRegion
 * @text Set Conveyor Region
 * @desc Region that pushes player/objects each N steps.
 * Self-setup (map setup event): <puzzle:regionConveyor id=7 dir=right speed=1>
 * @arg regionId
 * @type number @min 1 @max 255 @text Region ID
 * @arg direction
 * @type select @text Direction
 * @option Up @value up
 * @option Down @value down
 * @option Left @value left
 * @option Right @value right
 * @arg speed
 * @type number @min 1 @default 1 @text Steps between pushes (1 = every step)
 *
 * @command clearConveyorRegion
 * @text Clear Conveyor Region
 * @arg regionId
 * @type number @min 1 @max 255 @text Region ID
 *
 * ─── CRYSTAL SWITCHES ────────────────────────────────────────────────────────
 * @command setCrystalSwitch
 * @text Set Crystal Switch
 * @desc Flips all crystal blocks in a group when interacted with.
 * Self-setup: <puzzle:crystalSwitch group="red">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg groupId
 * @type string @text Crystal Group ID
 *
 * @command setCrystalBlock
 * @text Set Crystal Block
 * @desc Alternates between solid/passable when its crystal switch is hit.
 * Event pages: page 1 = solid sprite, page 2 (Self A=ON) = open sprite.
 * Self-setup: <puzzle:crystalBlock group="red" start=solid>
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg groupId
 * @type string @text Crystal Group ID
 * @arg startState
 * @type select @text Starting State
 * @option Solid @value solid
 * @option Open @value open
 *
 * @command flipCrystalGroup
 * @text Flip Crystal Group (manual)
 * @arg groupId
 * @type string @text Crystal Group ID
 *
 * ─── TORCHES ─────────────────────────────────────────────────────────────────
 * @command setTorch
 * @text Set Torch
 * @desc Torch that can be lit/extinguished. Event page 2 (Self A=ON) = lit sprite.
 * Self-setup: <puzzle:torch lit=false spread=true timer=0 group="torches1">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg lit
 * @type boolean @default false @text Starts Lit
 * @arg spreadFire
 * @type boolean @default true @text Spreads fire to orthogonal torches
 * @arg timerSeconds
 * @type number @min 0 @default 0 @text Auto-extinguish after N seconds (0=never)
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command lightTorch
 * @text Light Torch
 * @arg eventId
 * @type number @min 1 @text Event ID
 *
 * @command checkAllTorches
 * @text Check All Torches Lit
 * @desc Sets a switch when every torch in the group is lit.
 * Self-setup (persistent auto-check on any event): <puzzle:torchCheck group="torches1" switch=13>
 * @arg puzzleId
 * @type string @text Puzzle Group ID
 * @arg switchId
 * @type switch @text Switch to Set
 *
 * ─── COLOR TILES / LIGHTS-OUT ────────────────────────────────────────────────
 * @command setColorTile
 * @text Set Color Tile
 * @desc Tile cycles through states when stepped on. Uses Self Switches A+B for 4 states.
 * Event pages: p1=A:off B:off, p2=A:on B:off, p3=A:off B:on, p4=A:on B:on.
 * Self-setup: <puzzle:colorTile states=2 group="lightsout">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg numColors
 * @type number @min 2 @max 4 @default 2 @text Number of states (2-4)
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command setLightsOut
 * @text Set Lights-Out Toggle
 * @desc When this tile is toggled, it also toggles its neighbor tiles.
 * Self-setup: <puzzle:lightsOutLink neighbors="5,7,11,13">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg neighborIds
 * @type string @text Neighbor Event IDs (comma-separated)
 *
 * @command checkColorGoal
 * @text Check Color Goal
 * @desc Sets a switch when all color tiles in the group are on the target state.
 * Self-setup (persistent auto-check on any event): <puzzle:colorCheck group="lightsout" target=0 switch=44>
 * @arg puzzleId
 * @type string @text Puzzle Group ID
 * @arg targetState
 * @type number @min 0 @max 3 @default 0 @text Target State Index
 * @arg switchId
 * @type switch @text Switch to Set
 *
 * ─── DOORS & LOCKS ───────────────────────────────────────────────────────────
 * @command setColorDoor
 * @text Set Color Door
 * @desc Door that opens when player interacts with correct key item in inventory.
 * Self-setup: <puzzle:colorDoor item=7 consume=true group="door1">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg keyItemId
 * @type item @text Required Key Item
 * @arg consumeKey
 * @type boolean @default true @text Consume key on use
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command setComboLock
 * @text Set Combo Lock
 * @desc Interactable that fires a switch when a variable equals the target value.
 * Self-setup: <puzzle:comboLock variable=10 target=1331 switch=44>
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg variableId
 * @type variable @text Variable to Check
 * @arg targetValue
 * @type number @text Correct Value
 * @arg switchId
 * @type switch @text Switch to Set on Correct
 *
 * ─── WARP & OBSTACLES ────────────────────────────────────────────────────────
 * @command setWarpTile
 * @text Set Warp Tile
 * @desc Warps player to targetX,targetY on the same map when stepped on.
 * Self-setup: <puzzle:warp x=12 y=4>
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg targetX
 * @type number @min 0 @text Target X
 * @arg targetY
 * @type number @min 0 @text Target Y
 *
 * @command setCrackableWall
 * @text Set Crackable Wall
 * @desc Wall destroyed when player interacts holding the required item.
 * Self-setup: <puzzle:crackable item=7 consume=false group="wall1">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg requireItemId
 * @type item @text Required Item
 * @arg consumeItem
 * @type boolean @default true @text Consume item on use
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * ─── TIMED TILES ─────────────────────────────────────────────────────────────
 * @command setTimedTile
 * @text Set Timed Tile (Disappearing)
 * @desc Tile erases N steps after the player first steps on it.
 * Self-setup: <puzzle:timedTile steps=3 group="decay1">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg disappearSteps
 * @type number @min 1 @default 3 @text Steps Until Disappear
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command setBlinkPlatform
 * @text Set Blinking Platform
 * @desc Platform blinks on/off on a frame timer.
 * Self-setup: <puzzle:blinkPlatform on=60 off=40>
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg onFrames
 * @type number @min 1 @default 60 @text Frames Visible
 * @arg offFrames
 * @type number @min 1 @default 40 @text Frames Hidden
 *
 * ─── ENVIRONMENT ─────────────────────────────────────────────────────────────
 * @command setEyeStatue
 * @text Set Eye Statue
 * @desc Statue fires a switch when player is in its line-of-sight cone.
 * Self-setup: <puzzle:eyeStatue range=6 switch=40>
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg visionRange
 * @type number @min 1 @default 4 @text Vision Range (tiles)
 * @arg switchId
 * @type switch @text Switch (ON while player seen)
 *
 * @command setStateTile
 * @text Set State Tile (Season/Time)
 * @desc Event passability changes based on a variable value (Oracle of Seasons style).
 * Self-setup: <puzzle:stateTile variable=20 passable="1,3">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg stateVariableId
 * @type variable @text State Variable
 * @arg passableStates
 * @type string @default "" @text Passable when variable = these values (comma-separated, empty=always)
 *
 * ─── MAGNETIC OBJECTS ────────────────────────────────────────────────────────
 * @command setMagnetic
 * @text Set Magnetic Object
 * @desc Marks an event as magnetic. Pair with a magnetConsole event to move it.
 * Self-setup: <puzzle:magnetic>
 * @arg eventId
 * @type number @min 1 @text Event ID
 *
 * @command activateMagnet
 * @text Activate Magnet
 * @desc Slides all magnetic objects within range toward (attract) or away (repel) from player.
 * Self-setup (console event that triggers on interact): <puzzle:magnetConsole polarity=attract range=5 steps=3>
 * @arg polarity
 * @type select @text Polarity
 * @option Attract (pull toward player) @value attract
 * @option Repel (push away from player) @value repel
 * @arg range
 * @type number @min 1 @default 5 @text Max range to affect
 * @arg steps
 * @type number @min 1 @default 1 @text Tiles to slide per activation
 *
 * ─── COUNTERWEIGHT ───────────────────────────────────────────────────────────
 * @command setCounterweight
 * @text Set Counterweight Pair
 * @desc Standing on event A makes event B passable (rises). Linked like a scale.
 * Self-setup (place on event A): <puzzle:counterweightA partner=2>
 * @arg eventIdA
 * @type number @min 1 @text Platform Event ID (stand here)
 * @arg eventIdB
 * @type number @min 1 @text Gate Event ID (rises when A is pressed)
 *
 * ─── LIGHT BEAM ──────────────────────────────────────────────────────────────
 * @command setBeamEmitter
 * @text Set Beam Emitter
 * @desc Event emits a beam in a direction. Recalculated every frame.
 * Self-setup: <puzzle:beamEmitter dir=right>
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg direction
 * @type select @text Direction
 * @option Up @value up
 * @option Down @value down
 * @option Left @value left
 * @option Right @value right
 *
 * @command setMirror
 * @text Set Mirror
 * @desc Reflective event. Interact to toggle between / and \ orientation.
 * Self-setup: <puzzle:mirror orientation=slash>
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg orientation
 * @type select @text Starting Orientation
 * @option Slash  (/ deflects right→up, left→down) @value slash
 * @option Backslash (\ deflects right→down, left→up) @value backslash
 *
 * @command setBeamReceiver
 * @text Set Beam Receiver
 * @desc Sets a switch when a beam hits this event.
 * Self-setup: <puzzle:beamReceiver switch=21>
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg switchId
 * @type switch @text Switch to Set when Hit
 *
 * @command checkInBeamPath
 * @text Check In Beam Path
 * @desc Sets a switch based on whether an event is currently in an active beam path.
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg switchId
 * @type switch @text Switch to Set
 *
 * ─── CLONE / SHADOW ──────────────────────────────────────────────────────────
 * @command setClone
 * @text Set Clone / Shadow
 * @desc Event mirrors player movement. invertX/invertY flips the axis.
 * Self-setup: <puzzle:clone invertX=true invertY=false group="clone1">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg invertX
 * @type boolean @default false @text Invert X (move opposite horizontal)
 * @arg invertY
 * @type boolean @default false @text Invert Y (move opposite vertical)
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command stopClone
 * @text Stop Clone
 * @desc Removes clone tracking from an event.
 * @arg eventId
 * @type number @min 1 @text Event ID
 *
 * ─── WATER FILL ──────────────────────────────────────────────────────────────
 * @command setWaterSource
 * @text Set Water Source
 * @desc Event that emits water when activated. Use activateSwitch to tie activation to a switch.
 * Self-setup: <puzzle:waterSource active=false activateSwitch=50>
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg active
 * @type boolean @default true @text Starts Active
 *
 * @command activateWaterSource
 * @text Activate / Deactivate Water Source
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg active
 * @type boolean @default true @text Active
 *
 * @command setWaterChannel
 * @text Set Water Channel
 * @desc Event that can be filled by adjacent water. Sets a switch when filled.
 * Event page 2 (Self A=ON) = filled/wet sprite.
 * Self-setup: <puzzle:waterChannel switch=0 group="water1">
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg switchId
 * @type switch @default 0 @text Switch to Set When Filled (0 = none)
 * @arg puzzleId
 * @type string @default "" @text Puzzle Group ID
 *
 * @command setWaterDrain
 * @text Set Water Drain
 * @desc Event that blocks water propagation (acts as a sink).
 * Self-setup: <puzzle:waterDrain>
 * @arg eventId
 * @type number @min 1 @text Event ID
 *
 * @command checkWaterReached
 * @text Check Water Reached Event
 * @desc Sets a switch if the given channel event is currently filled.
 * Self-setup (persistent auto-check on any event): <puzzle:waterCheck switch=61>
 * @arg eventId
 * @type number @min 1 @text Event ID
 * @arg switchId
 * @type switch @text Switch to Set
 *
 */

(() => {
    'use strict';

    const PLUGIN_NAME = 'MapPuzzleSystem';

    // =========================================================================
    // Storage
    // =========================================================================

    function puzzleData() {
        if (!$gameSystem._puzzleData) {
            $gameSystem._puzzleData = {
                // Push / Sokoban
                pushables:        {},  // id → { maxPushes, pushCount, puzzleId, initialX, initialY }
                pits:             {},  // id → { filled, puzzleId }
                pitRegions:       {},  // regionId → { damage }
                undoStack:        [],
                // Goal / solve system
                goalEvents:       {},  // id → { puzzleId } — Self Switch A = ON means active
                solvedGroups:     {},  // groupId → true — currently solved (all goals active)
                _skipNextReset:   false, // set by warp tiles so teleport doesn't reset puzzles
                // Plates & gates
                plates:           {},  // id → { switchId, requireObject, puzzleId, active }
                timedPlates:      {},  // id → { switchId, holdSeconds, requireObject, puzzleId, heldFrames, armed }
                levers:           {},  // id → { state, puzzleId }
                gates:            {},  // id → { leverIds[], logicMode, puzzleId, open }
                // Floor
                iceRegions:       [],
                arrowTiles:       {},  // id → { direction }
                conveyors:        {},  // regionId → { direction, speed }
                conveyorCounter:  0,
                // Crystal switches
                crystalSwitches:  {},  // id → { groupId }
                crystalBlocks:    {},  // id → { groupId, state }
                // Torches
                torches:          {},  // id → { lit, spreadFire, timerSeconds, puzzleId, timer }
                // Color tiles / Lights-Out
                colorTiles:       {},  // id → { numColors, currentState, puzzleId }
                lightsOutLinks:   {},  // id → neighborIds[]
                // Doors & locks
                colorDoors:       {},  // id → { keyItemId, consumeKey, puzzleId }
                comboLocks:       {},  // id → { variableId, targetValue, switchId }
                // Warp / obstacles
                warpTiles:        {},  // id → { targetX, targetY }
                crackableWalls:   {},  // id → { requireItemId, consumeItem, puzzleId }
                // Timed tiles
                timedTiles:       {},  // id → { disappearSteps, stepCount, triggered, puzzleId }
                blinkPlatforms:   {},  // id → { onFrames, offFrames, frameCount, visible }
                // Environment
                eyeStatues:       {},  // id → { visionRange, switchId }
                stateTiles:       {},  // id → { stateVariableId, passableStates[] }
                // Magnetic
                magneticObjects:  {},  // id → {}
                // Counterweights
                counterweights:   {},  // idA → { partnerEventId }
                // Beam
                beamEmitters:     {},  // id → { direction }
                mirrors:          {},  // id → { orientation: 'slash'|'backslash' }
                beamReceivers:    {},  // id → { switchId, active }
                beamPath:         [],  // [{x,y}] current frame path
                // Clone / shadow
                clones:           {},  // id → { invertX, invertY, puzzleId, initialX, initialY }
                // Water fill
                waterSources:     {},  // id → { active }
                waterChannels:    {},  // id → { filled, switchId, puzzleId }
                waterDrains:      {},  // id → {}
                // Safe position for pit region recovery
                lastSafeX:        0,
                lastSafeY:        0,
                // Self-setup: persistent auto-checks
                solveChecks:            {},  // id → { puzzleId, switchId }
                torchChecks:            {},  // id → { puzzleId, switchId }
                colorChecks:            {},  // id → { puzzleId, targetState, switchId }
                waterChecks:            {},  // id → { switchId }
                waterSourceActivations: {},  // id → { switchId } (activate source when switch ON)
                // Self-setup: interactive / shrine types
                resetShrines:           {},  // id → { puzzleId }
                undoShrines:            {},  // id → true
                variableLevers:         {},  // id → { variableId, increment }
                magnetConsoles:         {},  // id → { polarity, range, steps }
                reflectionPools:        {},  // id → { swapWithId }
                keyGrants:              {},  // id → { itemId, quantity }
            };
        }
        return $gameSystem._puzzleData;
    }

    // =========================================================================
    // =========================================================================
    // Debug logging
    // =========================================================================

    function puzzleLog(...args) { console.log('[Puzzle]', ...args); }

    function evLabel(id) {
        const pd = puzzleData();
        const fmt = (type, group) =>
            group ? `"${type} ev${id}" of group "${group}"` : `"${type} ev${id}"`;
        /* eslint-disable no-multi-spaces */
        if (pd.pushables[id])       return fmt('pushable',       pd.pushables[id].puzzleId);
        if (pd.pits[id])            return fmt('pit',            pd.pits[id].puzzleId);
        if (pd.goalEvents[id])      return fmt('goal',           pd.goalEvents[id].puzzleId);
        if (pd.solveChecks[id])     return fmt('solveCheck',     pd.solveChecks[id].puzzleId);
        if (pd.plates[id])          return fmt('plate',          pd.plates[id].puzzleId);
        if (pd.timedPlates[id])     return fmt('timedPlate',     pd.timedPlates[id].puzzleId);
        if (pd.levers[id])          return fmt('lever',          pd.levers[id].puzzleId);
        if (pd.gates[id])           return fmt('gate',           pd.gates[id].puzzleId);
        if (pd.crystalSwitches[id]) return fmt('crystalSwitch',  pd.crystalSwitches[id].groupId);
        if (pd.crystalBlocks[id])   return fmt('crystalBlock',   pd.crystalBlocks[id].groupId);
        if (pd.torches[id])         return fmt('torch',          pd.torches[id].puzzleId);
        if (pd.torchChecks[id])     return fmt('torchCheck',     pd.torchChecks[id].puzzleId);
        if (pd.colorTiles[id])      return fmt('colorTile',      pd.colorTiles[id].puzzleId);
        if (pd.colorChecks[id])     return fmt('colorCheck',     pd.colorChecks[id].puzzleId);
        if (pd.colorDoors[id])      return fmt('colorDoor',      pd.colorDoors[id].puzzleId);
        if (pd.crackableWalls[id])  return fmt('crackable',      pd.crackableWalls[id].puzzleId);
        if (pd.timedTiles[id])      return fmt('timedTile',      pd.timedTiles[id].puzzleId);
        if (pd.clones[id])          return fmt('clone',          pd.clones[id].puzzleId);
        if (pd.waterChannels[id])   return fmt('waterChannel',   pd.waterChannels[id].puzzleId);
        if (pd.resetShrines[id])    return fmt('resetShrine',    pd.resetShrines[id].puzzleId);
        if (pd.arrowTiles[id])      return fmt('arrow',          pd.arrowTiles[id].direction);
        if (pd.warpTiles[id])       return fmt('warp',           `(${pd.warpTiles[id].targetX},${pd.warpTiles[id].targetY})`);
        if (pd.blinkPlatforms[id])  return fmt('blinkPlatform',  '');
        if (pd.eyeStatues[id])      return fmt('eyeStatue',      '');
        if (pd.magneticObjects[id]) return fmt('magnetic',       '');
        if (pd.magnetConsoles[id])  return fmt('magnetConsole',  pd.magnetConsoles[id].polarity);
        if (pd.mirrors[id])         return fmt('mirror',         pd.mirrors[id].orientation);
        if (pd.beamEmitters[id])    return fmt('beamEmitter',    pd.beamEmitters[id].direction);
        if (pd.beamReceivers[id])   return fmt('beamReceiver',   '');
        if (pd.waterSources[id])    return fmt('waterSource',    '');
        if (pd.waterDrains[id])     return fmt('waterDrain',     '');
        if (pd.waterChecks[id])     return fmt('waterCheck',     '');
        if (pd.undoShrines[id])     return fmt('undoShrine',     '');
        if (pd.variableLevers[id])  return fmt('variableLever',  '');
        if (pd.reflectionPools[id]) return fmt('reflectionPool', '');
        if (pd.keyGrants[id])       return fmt('keyGrant',       '');
        if (pd.comboLocks[id])      return fmt('comboLock',      '');
        if (pd.stateTiles[id])      return fmt('stateTile',      '');
        if (pd.counterweights[id])  return fmt('counterweightA', '');
        /* eslint-enable no-multi-spaces */
        return `ev${id}`;
    }

    // =========================================================================
    // Direction utilities
    // =========================================================================

    const DIR_STR  = { 2:'down', 4:'left', 6:'right', 8:'up' };
    const DIR_MAP  = { up:8, down:2, left:4, right:6 };
    const DIR_D    = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] };
    const MZ_DELTA = { 2:[0,1], 4:[-1,0], 6:[1,0], 8:[0,-1] };

    function mzDir(s) { return (typeof s === 'string') ? DIR_MAP[s] : s; }
    function strDir(d) { return (typeof d === 'string') ? d : DIR_STR[d]; }
    function delta(d) {
        return (typeof d === 'string') ? (DIR_D[d] || [0,0]) : (MZ_DELTA[d] || [0,0]);
    }

    // Beam reflection tables
    const REFLECT_SLASH  = { right:'up',   left:'down',  up:'right', down:'left'  };
    const REFLECT_BSLASH = { right:'down', left:'up',    up:'left',  down:'right' };

    // =========================================================================
    // Shared utilities
    // =========================================================================

    function getEvent(id) { return $gameMap.event(id); }

    function eventsAt(x, y, excludeId) {
        return $gameMap.events().filter(e =>
            e.x === x && e.y === y && e.eventId() !== excludeId && !e._erased
        );
    }

    function canPassTile(x, y) {
        return $gameMap.isPassable(x,y,2) || $gameMap.isPassable(x,y,4) ||
               $gameMap.isPassable(x,y,6) || $gameMap.isPassable(x,y,8);
    }

    const PUSHABLE_BLOCKED_TERRAIN = [4, 7];

    function blockedForPushable(x, y, excludeId, dx, dy) {
        if (!$gameMap.isValid(x, y)) return true;
        // Mirror Game_Character.canPass: check source-tile exit AND destination-tile entry.
        const d  = dx === 1 ? 6 : dx === -1 ? 4 : dy === 1 ? 2 : 8;
        const rd = 10 - d; // reverse direction (MZ convention)
        if (!$gameMap.isPassable(x - dx, y - dy, d))  return true; // source can't exit
        if (!$gameMap.isPassable(x, y, rd))            return true; // dest can't be entered
        if (PUSHABLE_BLOCKED_TERRAIN.includes($gameMap.terrainTag(x, y))) return true;
        return eventsAt(x, y, excludeId).some(e => {
            if (e._priorityType === 0) return false; // below characters — never blocks pushables
            if (puzzleData().pits[e.eventId()]) return false;
            return !e.isThrough();
        });
    }

    function isIceTile(x, y) {
        return puzzleData().iceRegions.includes($gameMap.regionId(x, y));
    }

    function setSelfSwitch(eventId, key, value) {
        $gameSelfSwitches.setValue([$gameMap.mapId(), eventId, key], value);
        const ev = getEvent(eventId);
        // Skip refresh during map transitions: $dataMap may already be the new map
        // and this event ID won't exist there, crashing event.page().
        if (ev && $dataMap && $dataMap.events && $dataMap.events[eventId]) ev.refresh();
    }

    // =========================================================================
    // Plugin commands — registration
    // =========================================================================

    const CMDS = {

        // ── Push / pits ──────────────────────────────────────────────────────
        setPushable(a) {
            const id = +a.eventId, ev = getEvent(id);
            if (!ev) return;
            puzzleData().pushables[id] = {
                maxPushes: +a.maxPushes || 0, pushCount: 0,
                puzzleId: a.puzzleId || '', initialX: ev.x, initialY: ev.y,
            };
            ev.setThrough(false);
        },
        setPit(a) {
            puzzleData().pits[+a.eventId] = { filled: false, puzzleId: a.puzzleId || '' };
        },
        setPitRegion(a) {
            puzzleData().pitRegions[+a.regionId] = { damage: +a.damage || 0 };
        },
        clearPitRegion(a) {
            delete puzzleData().pitRegions[+a.regionId];
        },
        setPuzzleGoal(a) {
            puzzleData().goalEvents[+a.eventId] = { puzzleId: a.puzzleId || '' };
        },
        checkPuzzleSolved(a) {
            const solved = isGroupSolved(a.puzzleId);
            $gameSwitches.setValue(+a.switchId, solved);
            if (solved) AudioManager.playSe({ name: 'Fanfare1', volume: 90, pitch: 100, pan: 0 });
        },
        resetPuzzle(a)       { resetPuzzle(a.puzzleId); },
        undoStep()           { undoLastPush(); },

        // ── Plates & gates ───────────────────────────────────────────────────
        setPressurePlate(a) {
            puzzleData().plates[+a.eventId] = {
                switchId: +a.switchId, requireObject: a.requireObject === 'true',
                puzzleId: a.puzzleId || '', active: false,
            };
        },
        setTimedPlate(a) {
            puzzleData().timedPlates[+a.eventId] = {
                switchId: +a.switchId, holdSeconds: +a.holdSeconds || 3,
                requireObject: a.requireObject === 'true',
                puzzleId: a.puzzleId || '', heldFrames: 0, armed: false,
            };
        },
        setLever(a) {
            puzzleData().levers[+a.eventId] = { state: false, puzzleId: a.puzzleId || '' };
        },
        setGate(a) {
            const id = +a.eventId, ev = getEvent(id);
            const leverIds = a.leverIds.split(',').map(x => +x.trim()).filter(Boolean);
            puzzleData().gates[id] = {
                leverIds, logicMode: a.logicMode || 'AND',
                puzzleId: a.puzzleId || '', open: false,
            };
            if (ev) ev.setThrough(false);
        },

        // ── Floor ────────────────────────────────────────────────────────────
        setIceRegion(a) {
            const r = +a.regionId, pd = puzzleData();
            if (!pd.iceRegions.includes(r)) pd.iceRegions.push(r);
        },
        clearIceRegion(a) {
            const pd = puzzleData();
            pd.iceRegions = pd.iceRegions.filter(x => x !== +a.regionId);
        },
        setArrowTile(a) {
            puzzleData().arrowTiles[+a.eventId] = { direction: a.direction };
        },
        setConveyorRegion(a) {
            puzzleData().conveyors[+a.regionId] = { direction: a.direction, speed: +a.speed || 1 };
        },
        clearConveyorRegion(a) {
            delete puzzleData().conveyors[+a.regionId];
        },

        // ── Crystal ──────────────────────────────────────────────────────────
        setCrystalSwitch(a) {
            puzzleData().crystalSwitches[+a.eventId] = { groupId: a.groupId };
        },
        setCrystalBlock(a) {
            const id = +a.eventId, state = a.startState || 'solid', ev = getEvent(id);
            puzzleData().crystalBlocks[id] = { groupId: a.groupId, state };
            if (ev) {
                ev.setThrough(state === 'open');
                setSelfSwitch(id, 'A', state === 'open');
            }
        },
        flipCrystalGroup(a) { flipCrystalGroup(a.groupId); },

        // ── Torches ──────────────────────────────────────────────────────────
        setTorch(a) {
            const id = +a.eventId;
            puzzleData().torches[id] = {
                lit: a.lit === 'true', spreadFire: a.spreadFire !== 'false',
                timerSeconds: +a.timerSeconds || 0, puzzleId: a.puzzleId || '', timer: 0,
            };
            applyTorchVisual(id);
        },
        lightTorch(a)      { lightTorch(+a.eventId); },
        checkAllTorches(a) { checkAllTorches(a.puzzleId, +a.switchId); },

        // ── Color tiles / Lights-Out ─────────────────────────────────────────
        setColorTile(a) {
            puzzleData().colorTiles[+a.eventId] = {
                numColors: Math.min(4, Math.max(2, +a.numColors || 2)),
                currentState: 0, puzzleId: a.puzzleId || '',
            };
        },
        setLightsOut(a) {
            const neighbors = a.neighborIds.split(',').map(x => +x.trim()).filter(Boolean);
            puzzleData().lightsOutLinks[+a.eventId] = neighbors;
        },
        checkColorGoal(a) { checkColorGoal(a.puzzleId, +a.targetState, +a.switchId); },

        // ── Doors & locks ────────────────────────────────────────────────────
        setColorDoor(a) {
            const id = +a.eventId, ev = getEvent(id);
            puzzleData().colorDoors[id] = {
                keyItemId: +a.keyItemId, consumeKey: a.consumeKey !== 'false',
                puzzleId: a.puzzleId || '',
            };
            if (ev) ev.setThrough(false);
        },
        setComboLock(a) {
            puzzleData().comboLocks[+a.eventId] = {
                variableId: +a.variableId, targetValue: +a.targetValue, switchId: +a.switchId,
            };
        },

        // ── Warp / obstacles ─────────────────────────────────────────────────
        setWarpTile(a) {
            puzzleData().warpTiles[+a.eventId] = { targetX: +a.targetX, targetY: +a.targetY };
        },
        setCrackableWall(a) {
            const id = +a.eventId, ev = getEvent(id);
            puzzleData().crackableWalls[id] = {
                requireItemId: +a.requireItemId, consumeItem: a.consumeItem !== 'false',
                puzzleId: a.puzzleId || '',
            };
            if (ev) ev.setThrough(false);
        },

        // ── Timed tiles ──────────────────────────────────────────────────────
        setTimedTile(a) {
            puzzleData().timedTiles[+a.eventId] = {
                disappearSteps: +a.disappearSteps || 3, stepCount: 0,
                triggered: false, puzzleId: a.puzzleId || '',
            };
        },
        setBlinkPlatform(a) {
            puzzleData().blinkPlatforms[+a.eventId] = {
                onFrames: +a.onFrames || 60, offFrames: +a.offFrames || 40,
                frameCount: 0, visible: true,
            };
        },

        // ── Environment ──────────────────────────────────────────────────────
        setEyeStatue(a) {
            puzzleData().eyeStatues[+a.eventId] = {
                visionRange: +a.visionRange || 4, switchId: +a.switchId,
            };
        },
        setStateTile(a) {
            const passable = a.passableStates
                ? a.passableStates.split(',').map(x => +x.trim()) : [];
            puzzleData().stateTiles[+a.eventId] = {
                stateVariableId: +a.stateVariableId, passableStates: passable,
            };
        },

        // ── Magnetic ─────────────────────────────────────────────────────────
        setMagnetic(a) {
            puzzleData().magneticObjects[+a.eventId] = {};
        },
        activateMagnet(a) {
            activateMagnet(a.polarity, +a.range || 5, +a.steps || 1);
        },

        // ── Counterweight ────────────────────────────────────────────────────
        setCounterweight(a) {
            const evB = getEvent(+a.eventIdB);
            puzzleData().counterweights[+a.eventIdA] = { partnerEventId: +a.eventIdB };
            if (evB) evB.setThrough(false);
        },

        // ── Beam ─────────────────────────────────────────────────────────────
        setBeamEmitter(a) {
            puzzleData().beamEmitters[+a.eventId] = { direction: a.direction };
        },
        setMirror(a) {
            puzzleData().mirrors[+a.eventId] = { orientation: a.orientation || 'slash' };
        },
        setBeamReceiver(a) {
            puzzleData().beamReceivers[+a.eventId] = { switchId: +a.switchId, active: false };
        },
        checkInBeamPath(a) {
            const ev = getEvent(+a.eventId);
            if (!ev) return;
            const inPath = puzzleData().beamPath.some(t => t.x === ev.x && t.y === ev.y);
            $gameSwitches.setValue(+a.switchId, inPath);
        },

        // ── Clone ────────────────────────────────────────────────────────────
        setClone(a) {
            const id = +a.eventId, ev = getEvent(id);
            puzzleData().clones[id] = {
                invertX: a.invertX === 'true', invertY: a.invertY === 'true',
                puzzleId: a.puzzleId || '',
                initialX: ev ? ev.x : 0, initialY: ev ? ev.y : 0,
            };
        },
        stopClone(a) { delete puzzleData().clones[+a.eventId]; },

        // ── Water ────────────────────────────────────────────────────────────
        setWaterSource(a) {
            puzzleData().waterSources[+a.eventId] = { active: a.active !== 'false' };
        },
        activateWaterSource(a) {
            const src = puzzleData().waterSources[+a.eventId];
            if (src) { src.active = a.active !== 'false'; propagateWater(); }
        },
        setWaterChannel(a) {
            puzzleData().waterChannels[+a.eventId] = {
                filled: false, switchId: +a.switchId || 0, puzzleId: a.puzzleId || '',
            };
        },
        setWaterDrain(a) {
            puzzleData().waterDrains[+a.eventId] = {};
        },
        checkWaterReached(a) {
            const ch = puzzleData().waterChannels[+a.eventId];
            $gameSwitches.setValue(+a.switchId, !!(ch && ch.filled));
        },
    };

    for (const [cmd, fn] of Object.entries(CMDS)) {
        PluginManager.registerCommand(PLUGIN_NAME, cmd, fn);
    }

    // =========================================================================
    // Self-Setup Comment Parser
    // =========================================================================

    function parsePuzzleTag(text) {
        const m = text.trim().match(/^<puzzle:(\w+)([\s\S]*)>$/);
        if (!m) return null;
        const attrs = {};
        const re = /(\w+)=(?:"([^"]*)"|(\S+))/g;
        let match;
        while ((match = re.exec(m[2])) !== null)
            attrs[match[1]] = match[2] !== undefined ? match[2] : match[3];
        return { type: m[1], attrs };
    }

    function resolveEventGroup(id) {
        const pd = puzzleData();
        for (const map of [pd.pushables, pd.plates, pd.timedPlates, pd.levers, pd.gates,
                           pd.torches, pd.colorTiles, pd.crackableWalls, pd.clones,
                           pd.waterChannels, pd.resetShrines, pd.solveChecks, pd.torchChecks]) {
            if (map[id] && map[id].puzzleId) return map[id].puzzleId;
        }
        if (pd.crystalSwitches[id]) return pd.crystalSwitches[id].groupId || '';
        if (pd.crystalBlocks[id])   return pd.crystalBlocks[id].groupId || '';
        return '';
    }

    function applyPuzzleSetup(eventId, type, attrs) {
        const pd = puzzleData();
        const a  = attrs;
        const id = eventId;
        switch (type) {
            case 'pushable':
                CMDS.setPushable({ eventId: id, maxPushes: a.maxPushes || 0, puzzleId: a.group || '' });
                break;
            case 'pit':
                CMDS.setPit({ eventId: id, puzzleId: a.group || '' });
                break;
            case 'goal':
                // group may be explicit or inferred from co-registered puzzle tag
                pd.goalEvents[id] = { puzzleId: a.group || resolveEventGroup(id) };
                break;
            case 'solveCheck':
                pd.solveChecks[id] = { puzzleId: a.group || '', switchId: +(a.switch || 0) };
                break;
            case 'resetShrine':
                pd.resetShrines[id] = { puzzleId: a.group || '' };
                break;
            case 'undoShrine':
                pd.undoShrines[id] = true;
                break;
            case 'plate':
                CMDS.setPressurePlate({ eventId: id, switchId: a.switch || 0,
                    requireObject: a.requireObject || 'false', puzzleId: a.group || '' });
                break;
            case 'timedPlate':
                CMDS.setTimedPlate({ eventId: id, switchId: a.switch || 0,
                    holdSeconds: a.holdSeconds || 3, requireObject: a.requireObject || 'false',
                    puzzleId: a.group || '' });
                break;
            case 'lever':
                CMDS.setLever({ eventId: id, puzzleId: a.group || '' });
                break;
            case 'gate':
                CMDS.setGate({ eventId: id, leverIds: a.levers || '',
                    logicMode: a.logic || 'AND', puzzleId: a.group || '' });
                break;
            case 'arrow':
                CMDS.setArrowTile({ eventId: id, direction: a.dir || 'right' });
                break;
            case 'torch':
                CMDS.setTorch({ eventId: id, lit: a.lit || 'false',
                    spreadFire: a.spread !== undefined ? a.spread : 'true',
                    timerSeconds: a.timer || 0, puzzleId: a.group || '' });
                break;
            case 'torchCheck':
                pd.torchChecks[id] = { puzzleId: a.group || '', switchId: +(a.switch || 0) };
                break;
            case 'crystalSwitch':
                CMDS.setCrystalSwitch({ eventId: id, groupId: a.group || '' });
                break;
            case 'crystalBlock':
                CMDS.setCrystalBlock({ eventId: id, groupId: a.group || '', startState: a.start || 'solid' });
                break;
            case 'colorTile':
                CMDS.setColorTile({ eventId: id, numColors: a.states || 2, puzzleId: a.group || '' });
                break;
            case 'colorCheck':
                pd.colorChecks[id] = { puzzleId: a.group || '', targetState: +(a.target || 0),
                    switchId: +(a.switch || 0) };
                break;
            case 'lightsOutLink':
                CMDS.setLightsOut({ eventId: id, neighborIds: a.neighbors || '' });
                break;
            case 'colorDoor':
                CMDS.setColorDoor({ eventId: id, keyItemId: a.item || 1,
                    consumeKey: a.consume !== undefined ? a.consume : 'true', puzzleId: a.group || '' });
                break;
            case 'comboLock':
                CMDS.setComboLock({ eventId: id, variableId: a.variable || 0,
                    targetValue: a.target || 0, switchId: a.switch || 0 });
                break;
            case 'variableLever':
                pd.variableLevers[id] = { variableId: +(a.variable || 0), increment: +(a.increment || 1) };
                break;
            case 'warp':
                CMDS.setWarpTile({ eventId: id, targetX: a.x || 0, targetY: a.y || 0 });
                break;
            case 'reflectionPool':
                pd.reflectionPools[id] = { swapWithId: +(a.swapWith || 0) };
                break;
            case 'crackable':
                CMDS.setCrackableWall({ eventId: id, requireItemId: a.item || 1,
                    consumeItem: a.consume !== undefined ? a.consume : 'false', puzzleId: a.group || '' });
                break;
            case 'timedTile':
                CMDS.setTimedTile({ eventId: id, disappearSteps: a.steps || 3, puzzleId: a.group || '' });
                break;
            case 'blinkPlatform':
                CMDS.setBlinkPlatform({ eventId: id, onFrames: a.on || 60, offFrames: a.off || 40 });
                break;
            case 'eyeStatue':
                CMDS.setEyeStatue({ eventId: id, visionRange: a.range || 4, switchId: a.switch || 0 });
                break;
            case 'stateTile':
                CMDS.setStateTile({ eventId: id, stateVariableId: a.variable || 0,
                    passableStates: a.passable || '' });
                break;
            case 'magnetic':
                CMDS.setMagnetic({ eventId: id });
                break;
            case 'magnetConsole':
                pd.magnetConsoles[id] = { polarity: a.polarity || 'attract',
                    range: +(a.range || 5), steps: +(a.steps || 1) };
                break;
            case 'counterweightA':
                CMDS.setCounterweight({ eventIdA: id, eventIdB: a.partner || 0 });
                break;
            case 'beamEmitter':
                CMDS.setBeamEmitter({ eventId: id, direction: a.dir || 'right' });
                break;
            case 'mirror':
                CMDS.setMirror({ eventId: id, orientation: a.orientation || 'slash' });
                break;
            case 'beamReceiver':
                CMDS.setBeamReceiver({ eventId: id, switchId: a.switch || 0 });
                break;
            case 'clone':
                CMDS.setClone({ eventId: id, invertX: a.invertX || 'false',
                    invertY: a.invertY || 'false', puzzleId: a.group || '' });
                break;
            case 'waterSource': {
                const activateSw = +(a.activateSwitch || 0);
                CMDS.setWaterSource({ eventId: id, active: a.active || 'false' });
                if (activateSw) pd.waterSourceActivations[id] = { switchId: activateSw };
                break;
            }
            case 'waterChannel':
                CMDS.setWaterChannel({ eventId: id, switchId: a.switch || 0, puzzleId: a.group || '' });
                break;
            case 'waterDrain':
                CMDS.setWaterDrain({ eventId: id });
                break;
            case 'waterCheck':
                pd.waterChecks[id] = { switchId: +(a.switch || 0) };
                break;
            case 'regionIce':
                CMDS.setIceRegion({ regionId: a.id || 1 });
                break;
            case 'regionPit':
                CMDS.setPitRegion({ regionId: a.id || 1, damage: a.damage || 0 });
                break;
            case 'regionConveyor':
                CMDS.setConveyorRegion({ regionId: a.id || 1, direction: a.dir || 'right', speed: a.speed || 1 });
                break;
            case 'keyGrant':
                pd.keyGrants[id] = { itemId: +(a.item || 0), quantity: +(a.quantity || 1) };
                break;
        }
    }

    function scanEventPuzzleComments(event) {
        const page = event.page && event.page();
        if (!page || !page.list) return;
        const id = event.eventId();
        const allTags = [];
        for (const cmd of page.list) {
            if (cmd.code !== 108 && cmd.code !== 408) continue;
            const parsed = parsePuzzleTag(cmd.parameters[0] || '');
            if (parsed) allTags.push(parsed);
        }
        // Process goal tags last so resolveEventGroup finds co-registered elements
        const sorted = [...allTags.filter(t => t.type !== 'goal'), ...allTags.filter(t => t.type === 'goal')];
        let found = false;
        for (const parsed of sorted) {
            applyPuzzleSetup(id, parsed.type, parsed.attrs);
            puzzleLog(`setup ${evLabel(id)} at (${event.x},${event.y})`, parsed.attrs);
            found = true;
        }
        if (!found && page.list.some(c => c.code === 108 || c.code === 408)) {
            const comments = page.list.filter(c => c.code === 108 || c.code === 408).map(c => c.parameters[0]);
            puzzleLog(`ev${id} has comments but no <puzzle:> tag:`, comments);
        }
    }

    // Mid-game page changes (self-switch toggles, conditional branches) —
    // only runs when the event is already in $gameMap._events (i.e. not during
    // initial construction, which is handled by the Game_Map.setup hook below).
    const _setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
        _setupPage.call(this);
        if ($gameSystem && $gameMap.event(this._eventId) === this) {
            scanEventPuzzleComments(this);
        }
    };

    // =========================================================================
    // Crystal switch logic
    // =========================================================================

    function flipCrystalGroup(groupId) {
        puzzleLog(`crystalGroup flip: ${groupId}`);
        const pd = puzzleData();
        for (const [id, block] of Object.entries(pd.crystalBlocks)) {
            if (block.groupId !== groupId) continue;
            block.state = block.state === 'solid' ? 'open' : 'solid';
            puzzleLog(`  ${evLabel(+id)} → ${block.state}`);
            const ev = getEvent(+id);
            if (ev) {
                ev.setThrough(block.state === 'open');
                setSelfSwitch(+id, 'A', block.state === 'open');
            }
        }
    }

    // =========================================================================
    // Torch logic
    // =========================================================================

    function applyTorchVisual(id) {
        setSelfSwitch(id, 'A', !!(puzzleData().torches[id] && puzzleData().torches[id].lit));
    }

    function lightTorch(id) {
        const t = puzzleData().torches[id];
        if (!t || t.lit) return;
        puzzleLog(`lit ${evLabel(id)}`);
        t.lit = true; t.timer = 0;
        applyTorchVisual(id);
        if (t.spreadFire) spreadFire(id);
    }

    function extinguishTorch(id) {
        const t = puzzleData().torches[id];
        if (!t) return;
        t.lit = false; t.timer = 0;
        applyTorchVisual(id);
    }

    function spreadFire(srcId) {
        const src = getEvent(srcId);
        if (!src) return;
        for (const [id, t] of Object.entries(puzzleData().torches)) {
            if (+id === srcId || t.lit) continue;
            const te = getEvent(+id);
            if (te && Math.abs(te.x - src.x) + Math.abs(te.y - src.y) === 1) lightTorch(+id);
        }
    }

    function checkAllTorches(puzzleId, switchId) {
        const ids = Object.keys(puzzleData().torches)
            .filter(id => puzzleData().torches[id].puzzleId === puzzleId);
        if (!ids.length) return;
        $gameSwitches.setValue(switchId, ids.every(id => puzzleData().torches[id].lit));
    }

    function updateTorchTimers() {
        for (const [id, t] of Object.entries(puzzleData().torches)) {
            if (!t.lit || t.timerSeconds <= 0) continue;
            if (++t.timer >= t.timerSeconds * 60) extinguishTorch(+id);
        }
    }

    // =========================================================================
    // Pressure plates
    // =========================================================================

    function updatePressurePlates() {
        const pd = puzzleData();
        const px = $gamePlayer.x, py = $gamePlayer.y;
        for (const [id, plate] of Object.entries(pd.plates)) {
            const ev = getEvent(+id);
            if (!ev) continue;
            const objOn = Object.keys(pd.pushables).some(pid => {
                const pe = getEvent(+pid);
                return pe && pe.x === ev.x && pe.y === ev.y;
            });
            const active = plate.requireObject ? objOn : (objOn || (px === ev.x && py === ev.y));
            if (active !== plate.active) {
                plate.active = active;
                $gameSwitches.setValue(plate.switchId, active);
                setSelfSwitch(+id, 'A', active);
            }
        }
    }

    function updateTimedPlates() {
        const pd = puzzleData();
        const px = $gamePlayer.x, py = $gamePlayer.y;
        for (const [id, plate] of Object.entries(pd.timedPlates)) {
            const ev = getEvent(+id);
            if (!ev) continue;
            const objOn = Object.keys(pd.pushables).some(pid => {
                const pe = getEvent(+pid); return pe && pe.x === ev.x && pe.y === ev.y;
            });
            const occupied = plate.requireObject ? objOn : (objOn || (px === ev.x && py === ev.y));
            if (occupied) {
                plate.heldFrames++;
                if (!plate.armed && plate.heldFrames >= plate.holdSeconds * 60) {
                    plate.armed = true;
                    $gameSwitches.setValue(plate.switchId, true);
                    setSelfSwitch(+id, 'A', true);
                }
            } else {
                if (plate.armed) {
                    plate.armed = false;
                    $gameSwitches.setValue(plate.switchId, false);
                    setSelfSwitch(+id, 'A', false);
                }
                plate.heldFrames = 0;
            }
        }
    }

    // =========================================================================
    // Gates
    // =========================================================================

    function updateGates() {
        const pd = puzzleData();
        for (const [id, gate] of Object.entries(pd.gates)) {
            const states = gate.leverIds.map(lid => !!(pd.levers[lid] && pd.levers[lid].state));
            let open = gate.logicMode === 'AND' ? states.every(Boolean)
                     : gate.logicMode === 'OR'  ? states.some(Boolean)
                     : states.filter(Boolean).length % 2 === 1;
            if (open !== gate.open) {
                gate.open = open;
                const ev = getEvent(+id);
                if (ev) { ev.setThrough(open); ev.setOpacity(open ? 80 : 255); }
            }
        }
    }

    // =========================================================================
    // Push logic (Sokoban)
    // =========================================================================

    function tryPush(pushedId, dx, dy) {
        const pd   = puzzleData();
        const info = pd.pushables[pushedId];
        if (!info) { puzzleLog(`push ev${pushedId}: not registered as pushable`); return false; }
        if (info.maxPushes > 0 && info.pushCount >= info.maxPushes) { puzzleLog(`push ${evLabel(pushedId)}: max pushes reached`); return false; }
        const ev = getEvent(pushedId);
        if (!ev) return false;

        let nx = ev.x + dx, ny = ev.y + dy;

        // Slide on ice
        if (isIceTile(nx, ny)) {
            while (!blockedForPushable(nx + dx, ny + dy, pushedId, dx, dy) && isIceTile(nx + dx, ny + dy)) {
                nx += dx; ny += dy;
            }
        }

        if (blockedForPushable(nx, ny, pushedId, dx, dy)) { puzzleLog(`push ${evLabel(pushedId)}: blocked at (${nx},${ny})`); return false; }

        // Pit check
        const pitId = pitAt(nx, ny);
        if (pitId !== null) {
            pd.pits[pitId].filled = true;
            ev.erase();
            const pitEv = getEvent(pitId);
            if (pitEv) pitEv.erase();
            propagateWater();
            return true;
        }

        pd.undoStack.push({ eventId: pushedId, fromX: ev.x, fromY: ev.y, toX: nx, toY: ny });
        if (pd.undoStack.length > 20) pd.undoStack.shift();

        puzzleLog(`pushed ${evLabel(pushedId)}: (${ev.x},${ev.y}) → (${nx},${ny})`);
        ev.locate(nx, ny);
        info.pushCount++;
        updatePressurePlates();
        propagateWater();
        return true;
    }

    function pitAt(x, y) {
        for (const [id, pit] of Object.entries(puzzleData().pits)) {
            if (pit.filled) continue;
            const ev = getEvent(+id);
            if (ev && ev.x === x && ev.y === y) return +id;
        }
        return null;
    }

    // =========================================================================
    // Ice sliding
    // =========================================================================

    let _sliding = false;
    function slideStep(dx, dy) {
        if (_sliding) return;
        const p  = $gamePlayer;
        const d  = mzDir(dx === -1 ? 'left' : dx === 1 ? 'right' : dy === -1 ? 'up' : 'down');
        const nx = p.x + dx, ny = p.y + dy;
        if (!isIceTile(nx, ny)) return;
        if (!$gameMap.isPassable(p.x, p.y, d)) return;
        if (eventsAt(nx, ny, -1).some(e => !e.isThrough())) return;
        _sliding = true;
        p.moveStraight(d);
        _sliding = false;
    }

    // =========================================================================
    // Color tiles / Lights-Out
    // =========================================================================

    function cycleColorTile(id) {
        const ct = puzzleData().colorTiles[id];
        if (!ct) return;
        ct.currentState = (ct.currentState + 1) % ct.numColors;
        const s = ct.currentState;
        setSelfSwitch(id, 'A', (s & 1) !== 0);
        setSelfSwitch(id, 'B', (s & 2) !== 0);
        // Lights-Out: also toggle neighbors
        const neighbors = puzzleData().lightsOutLinks[id];
        if (neighbors) neighbors.forEach(nid => cycleColorTile(nid));
    }

    function checkColorGoal(puzzleId, targetState, switchId) {
        const ids = Object.keys(puzzleData().colorTiles)
            .filter(id => puzzleData().colorTiles[id].puzzleId === puzzleId);
        if (!ids.length) return;
        $gameSwitches.setValue(switchId, ids.every(id => puzzleData().colorTiles[id].currentState === targetState));
    }

    // =========================================================================
    // Magnetic objects
    // =========================================================================

    function activateMagnet(polarity, range, steps) {
        const pd = puzzleData();
        const px = $gamePlayer.x, py = $gamePlayer.y;
        for (const id of Object.keys(pd.magneticObjects)) {
            const ev = getEvent(+id);
            if (!ev) continue;
            const adx = ev.x - px, ady = ev.y - py;
            const dist = Math.abs(adx) + Math.abs(ady);
            if (dist === 0 || dist > range) continue;
            // Axis with greatest separation
            let mdx = 0, mdy = 0;
            if (Math.abs(adx) >= Math.abs(ady)) mdx = adx > 0 ? 1 : -1;
            else                                  mdy = ady > 0 ? 1 : -1;
            if (polarity === 'attract') { mdx = -mdx; mdy = -mdy; }
            for (let i = 0; i < steps; i++) {
                if (blockedForPushable(ev.x + mdx, ev.y + mdy, +id, mdx, mdy)) break;
                pd.undoStack.push({ eventId: +id, fromX: ev.x, fromY: ev.y, toX: ev.x + mdx, toY: ev.y + mdy });
                ev.locate(ev.x + mdx, ev.y + mdy);
            }
        }
        updatePressurePlates();
    }

    // =========================================================================
    // Counterweights
    // =========================================================================

    function updateCounterweights() {
        const pd = puzzleData();
        const px = $gamePlayer.x, py = $gamePlayer.y;
        for (const [idA, cw] of Object.entries(pd.counterweights)) {
            const evA = getEvent(+idA), evB = getEvent(cw.partnerEventId);
            if (!evA || !evB) continue;
            const pressed = (px === evA.x && py === evA.y);
            evB.setThrough(pressed);
            evB.setOpacity(pressed ? 100 : 255);
        }
    }

    // =========================================================================
    // Light beam
    // =========================================================================

    function calculateBeam() {
        const pd  = puzzleData();
        // Clear previous receivers
        for (const [id, recv] of Object.entries(pd.beamReceivers)) {
            if (recv.active) {
                recv.active = false;
                $gameSwitches.setValue(recv.switchId, false);
            }
        }
        pd.beamPath = [];

        for (const [emId, emitter] of Object.entries(pd.beamEmitters)) {
            const emEv = getEvent(+emId);
            if (!emEv) continue;
            let x = emEv.x, y = emEv.y, dir = emitter.direction, steps = 0;

            while (steps++ < 128) {
                const [dx, dy] = delta(dir);
                x += dx; y += dy;
                if (!$gameMap.isValid(x, y)) break;
                pd.beamPath.push({ x, y });

                // Mirror?
                const mirrorEv = Object.keys(pd.mirrors).find(mid => {
                    const me = getEvent(+mid); return me && me.x === x && me.y === y;
                });
                if (mirrorEv !== undefined) {
                    const ori = pd.mirrors[mirrorEv].orientation;
                    dir = (ori === 'slash') ? REFLECT_SLASH[dir] : REFLECT_BSLASH[dir];
                    continue;
                }

                // Receiver?
                const recvEv = Object.keys(pd.beamReceivers).find(rid => {
                    const re = getEvent(+rid); return re && re.x === x && re.y === y;
                });
                if (recvEv !== undefined) {
                    pd.beamReceivers[recvEv].active = true;
                    $gameSwitches.setValue(pd.beamReceivers[recvEv].switchId, true);
                    break;
                }

                // Blocked by wall or solid event?
                if (!canPassTile(x, y)) break;
                if (eventsAt(x, y, -1).some(e => !e.isThrough() && !pd.mirrors[e.eventId()])) break;
            }
        }
    }

    // =========================================================================
    // Clone / shadow
    // =========================================================================

    function moveClones(dx, dy) {
        for (const [id, clone] of Object.entries(puzzleData().clones)) {
            const ev = getEvent(+id);
            if (!ev) continue;
            const cdx = clone.invertX ? -dx : dx;
            const cdy = clone.invertY ? -dy : dy;
            if (cdx === 0 && cdy === 0) continue;
            const nx = ev.x + cdx, ny = ev.y + cdy;
            if (!blockedForPushable(nx, ny, +id, cdx, cdy)) ev.locate(nx, ny);
        }
    }

    // =========================================================================
    // Water fill (BFS)
    // =========================================================================

    function propagateWater() {
        const pd = puzzleData();
        // Reset all channels
        for (const id of Object.keys(pd.waterChannels)) {
            if (pd.waterChannels[id].filled) {
                pd.waterChannels[id].filled = false;
                if (pd.waterChannels[id].switchId)
                    $gameSwitches.setValue(pd.waterChannels[id].switchId, false);
                setSelfSwitch(+id, 'A', false);
            }
        }

        // BFS from active sources
        const visited = new Set();
        const queue   = [];
        for (const [id, src] of Object.entries(pd.waterSources)) {
            if (!src.active) continue;
            const ev = getEvent(+id);
            if (ev) queue.push({ x: ev.x, y: ev.y });
        }

        while (queue.length) {
            const { x, y } = queue.shift();
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            visited.add(key);

            // Drain = stop
            const isDrain = Object.keys(pd.waterDrains).some(id => {
                const ev = getEvent(+id); return ev && ev.x === x && ev.y === y;
            });
            if (isDrain) continue;

            // Fill channel event here
            for (const [id, ch] of Object.entries(pd.waterChannels)) {
                const ev = getEvent(+id);
                if (!ev || ev.x !== x || ev.y !== y || ch.filled) continue;
                ch.filled = true;
                if (ch.switchId) $gameSwitches.setValue(ch.switchId, true);
                setSelfSwitch(+id, 'A', true);
                // Spread to orthogonal tiles
                for (const [ddx, ddy] of [[0,1],[0,-1],[1,0],[-1,0]])
                    queue.push({ x: x + ddx, y: y + ddy });
            }
        }
    }

    // =========================================================================
    // Puzzle solved / reset / undo
    // =========================================================================

    function checkPuzzleSolved(puzzleId, switchId) {
        const solved = isGroupSolved(puzzleId);
        if (solved !== $gameSwitches.value(switchId))
            puzzleLog(`solveCheck [${puzzleId}] → ${solved} (sw${switchId})`);
        $gameSwitches.setValue(switchId, solved);
    }

    function resetPuzzle(puzzleId) {
        puzzleLog(`resetPuzzle: ${puzzleId}`);
        const pd = puzzleData();
        for (const [id, info] of Object.entries(pd.pushables)) {
            if (info.puzzleId !== puzzleId) continue;
            const ev = getEvent(+id);
            if (ev) ev.locate(info.initialX, info.initialY);
            info.pushCount = 0;
        }
        for (const [,lev] of Object.entries(pd.levers))
            if (lev.puzzleId === puzzleId) lev.state = false;
        updateGates();
        for (const [id, t] of Object.entries(pd.torches)) {
            if (t.puzzleId === puzzleId) { t.lit = false; t.timer = 0; applyTorchVisual(+id); }
        }
        for (const [id, ct] of Object.entries(pd.colorTiles)) {
            if (ct.puzzleId !== puzzleId) continue;
            ct.currentState = 0;
            setSelfSwitch(+id, 'A', false); setSelfSwitch(+id, 'B', false);
        }
        for (const [id, clone] of Object.entries(pd.clones)) {
            if (clone.puzzleId !== puzzleId) continue;
            const ev = getEvent(+id);
            if (ev) ev.locate(clone.initialX, clone.initialY);
        }
        // Clear goal event Self Switches so group registers as unsolved
        for (const [id, ge] of Object.entries(pd.goalEvents)) {
            if (ge.puzzleId === puzzleId) setSelfSwitch(+id, 'A', false);
        }
        pd.solvedGroups[puzzleId] = false;
        pd.undoStack = [];
        updatePressurePlates();
        propagateWater();
    }

    function undoLastPush() {
        const stack = puzzleData().undoStack;
        if (!stack.length) return;
        const last = stack.pop();
        puzzleLog(`undo ${evLabel(last.eventId)}: (${last.toX},${last.toY}) → (${last.fromX},${last.fromY})`);
        const ev   = getEvent(last.eventId);
        if (ev) ev.locate(last.fromX, last.fromY);
        updatePressurePlates();
        propagateWater();
    }

    // =========================================================================
    // Goal / solve system
    // =========================================================================

    function isGroupSolved(groupId) {
        const pd = puzzleData();
        const goalIds = Object.entries(pd.goalEvents)
            .filter(([, g]) => g.puzzleId === groupId).map(([id]) => +id);
        if (!goalIds.length) return false;
        return goalIds.every(id => $gameSelfSwitches.value([$gameMap.mapId(), id, 'A']));
    }

    function updateGroupSolveState() {
        const pd = puzzleData();
        const groups = [...new Set(Object.values(pd.goalEvents).map(g => g.puzzleId))].filter(Boolean);
        for (const groupId of groups) {
            const wasSolved = !!pd.solvedGroups[groupId];
            const nowSolved = isGroupSolved(groupId);
            if (!wasSolved && nowSolved) {
                pd.solvedGroups[groupId] = true;
                AudioManager.playMe({ name: 'Fanfare1', volume: 90, pitch: 100, pan: 0 });
                puzzleLog(`group "${groupId}" SOLVED`);
                // Honour any solveCheck switch registered for this group
                for (const chk of Object.values(pd.solveChecks)) {
                    if (chk.puzzleId === groupId) $gameSwitches.setValue(chk.switchId, true);
                }
            } else if (wasSolved && !nowSolved) {
                pd.solvedGroups[groupId] = false;
                puzzleLog(`group "${groupId}" broken — will reset on next transfer`);
            }
        }
    }

    function resetUnsolvedGroups() {
        const pd = puzzleData();
        const groups = [...new Set(Object.values(pd.goalEvents).map(g => g.puzzleId))].filter(Boolean);
        for (const groupId of groups) {
            if (!pd.solvedGroups[groupId]) {
                puzzleLog(`transfer reset: group "${groupId}"`);
                resetPuzzle(groupId);
            }
        }
    }

    // =========================================================================
    // Auto-checks (self-setup persistent watchers)
    // =========================================================================

    function updateAutoChecks() {
        const pd = puzzleData();
        for (const chk of Object.values(pd.solveChecks))
            checkPuzzleSolved(chk.puzzleId, chk.switchId);
        for (const chk of Object.values(pd.torchChecks))
            checkAllTorches(chk.puzzleId, chk.switchId);
        for (const chk of Object.values(pd.colorChecks))
            checkColorGoal(chk.puzzleId, chk.targetState, chk.switchId);
        for (const [id, chk] of Object.entries(pd.waterChecks)) {
            const ch = pd.waterChannels[id];
            $gameSwitches.setValue(chk.switchId, !!(ch && ch.filled));
        }
        for (const [id, wsa] of Object.entries(pd.waterSourceActivations)) {
            const src = pd.waterSources[id];
            if (!src) continue;
            const active = $gameSwitches.value(wsa.switchId);
            if (src.active !== active) { src.active = active; propagateWater(); }
        }
    }

    // =========================================================================
    // Eye statues
    // =========================================================================

    function updateEyeStatues() {
        const pd = puzzleData();
        const px = $gamePlayer.x, py = $gamePlayer.y;
        for (const [id, statue] of Object.entries(pd.eyeStatues)) {
            const ev = getEvent(+id);
            if (!ev) continue;
            const [ddx, ddy] = MZ_DELTA[ev.direction()] || [0, 1];
            let seen = false;
            for (let s = 1; s <= statue.visionRange; s++) {
                const cx = ev.x + ddx * s, cy = ev.y + ddy * s;
                if (!$gameMap.isValid(cx, cy)) break;
                if (cx === px && cy === py) { seen = true; break; }
                if (eventsAt(cx, cy, +id).some(e => !e.isThrough())) break;
            }
            $gameSwitches.setValue(statue.switchId, seen);
        }
    }

    // =========================================================================
    // Blink platforms
    // =========================================================================

    function updateBlinkPlatforms() {
        for (const [id, bp] of Object.entries(puzzleData().blinkPlatforms)) {
            const ev = getEvent(+id);
            if (!ev) continue;
            if (++bp.frameCount >= (bp.visible ? bp.onFrames : bp.offFrames)) {
                bp.visible = !bp.visible;
                bp.frameCount = 0;
                ev.setOpacity(bp.visible ? 255 : 0);
                ev.setThrough(!bp.visible);
            }
        }
    }

    // =========================================================================
    // State tiles
    // =========================================================================

    function updateStateTiles() {
        for (const [id, st] of Object.entries(puzzleData().stateTiles)) {
            const ev  = getEvent(+id);
            if (!ev) continue;
            const val = $gameVariables.value(st.stateVariableId);
            ev.setThrough(st.passableStates.length === 0 || st.passableStates.includes(val));
        }
    }

    // =========================================================================
    // Pit region recovery
    // =========================================================================

    function checkPitRegion(x, y) {
        const pd     = puzzleData();
        const region = $gameMap.regionId(x, y);
        const pit    = pd.pitRegions[region];
        if (!pit) return false;
        if (pit.damage > 0) $gameParty.members().forEach(m => m.gainHp(-pit.damage));
        $gamePlayer.locate(pd.lastSafeX, pd.lastSafeY);
        return true;
    }

    // =========================================================================
    // Game_Player hooks
    // =========================================================================

    const _moveStraight = Game_Player.prototype.moveStraight;
    Game_Player.prototype.moveStraight = function(d) {
        const [dx, dy] = MZ_DELTA[d] || [0, 0];
        const nx = this.x + dx, ny = this.y + dy;
        const pd = puzzleData();

        // Try to push
        const pushable = $gameMap.events().find(e =>
            e.x === nx && e.y === ny && pd.pushables[e.eventId()] && !e._erased);
        if (pushable) {
            puzzleLog(`move into ${evLabel(pushable.eventId())} at (${nx},${ny})`);
            tryPush(pushable.eventId(), dx, dy);
        }

        _moveStraight.call(this, d);
        moveClones(dx, dy);
    };

    const _increaseSteps = Game_Player.prototype.increaseSteps;
    Game_Player.prototype.increaseSteps = function() {
        _increaseSteps.call(this);
        const pd = puzzleData();
        const x  = this.x, y = this.y;

        // Track last safe position (non-pit region)
        if (!pd.pitRegions[$gameMap.regionId(x, y)]) {
            pd.lastSafeX = x; pd.lastSafeY = y;
        }

        // Timed tiles
        for (const [id, tt] of Object.entries(pd.timedTiles)) {
            const ev = getEvent(+id);
            if (!ev) continue;
            if (ev.x === x && ev.y === y && !tt.triggered) { tt.triggered = true; tt.stepCount = 0; }
            if (tt.triggered && ++tt.stepCount >= tt.disappearSteps) {
                ev.erase(); delete pd.timedTiles[id];
            }
        }

        // Color tile step
        for (const [id, ct] of Object.entries(pd.colorTiles)) {
            const ev = getEvent(+id);
            if (ev && ev.x === x && ev.y === y) cycleColorTile(+id);
        }

        // Key grants
        for (const [id, kg] of Object.entries(pd.keyGrants)) {
            const ev = getEvent(+id);
            if (!ev || ev.x !== x || ev.y !== y) continue;
            if ($dataItems[kg.itemId]) $gameParty.gainItem($dataItems[kg.itemId], kg.quantity);
            ev.erase();
            delete pd.keyGrants[id];
            break;
        }
    };

    const _update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _update.call(this, sceneActive);
        if (!sceneActive || this.isMoving()) return;

        const pd = puzzleData();
        const x  = this.x, y = this.y;

        // Pit region
        if (checkPitRegion(x, y)) return;

        // Ice slide
        if (isIceTile(x, y)) {
            const [dx, dy] = MZ_DELTA[this.direction()] || [0, 0];
            slideStep(dx, dy);
        }

        // Arrow tiles
        for (const [id, arrow] of Object.entries(pd.arrowTiles)) {
            const ev = getEvent(+id);
            if (!ev || ev.x !== x || ev.y !== y) continue;
            const d = mzDir(arrow.direction);
            this.setDirection(d);
            this.moveStraight(d);
            break;
        }

        // Conveyor regions
        const region = $gameMap.regionId(x, y);
        if (pd.conveyors[region]) {
            const conv = pd.conveyors[region];
            if (++pd.conveyorCounter >= conv.speed) {
                pd.conveyorCounter = 0;
                this.moveStraight(mzDir(conv.direction));
            }
        } else {
            pd.conveyorCounter = 0;
        }

        // Warp tiles — flag so the transfer doesn't trigger a puzzle reset
        for (const [id, warp] of Object.entries(pd.warpTiles)) {
            const ev = getEvent(+id);
            if (!ev || ev.x !== x || ev.y !== y) continue;
            pd._skipNextReset = true;
            $gamePlayer.reserveTransfer($gameMap.mapId(), warp.targetX, warp.targetY, this.direction(), 0);
            break;
        }

        updatePressurePlates();
        updateCounterweights();
        updateEyeStatues();
    };

    // Action button (interact): levers, crystal switches, crackable walls, mirrors, combo locks, doors, torches
    const _checkEventTriggerThere = Game_Player.prototype.checkEventTriggerThere;
    Game_Player.prototype.checkEventTriggerThere = function(triggers) {
        _checkEventTriggerThere.call(this, triggers);
        if (!triggers.includes(0)) return;

        const pd = puzzleData();
        const [dx, dy] = MZ_DELTA[this.direction()] || [0, 0];
        const fx = this.x + dx, fy = this.y + dy;

        for (const ev of eventsAt(fx, fy, -1)) {
            const id = ev.eventId();
            puzzleLog(`interact ${evLabel(id)} at (${fx},${fy})`);

            if (pd.levers[id]) {
                pd.levers[id].state = !pd.levers[id].state;
                puzzleLog(`  ${evLabel(id)} → ${pd.levers[id].state}`);
                setSelfSwitch(id, 'A', pd.levers[id].state);
                ev.setOpacity(pd.levers[id].state ? 255 : 150);
                updateGates(); return;
            }
            if (pd.crystalSwitches[id]) {
                flipCrystalGroup(pd.crystalSwitches[id].groupId); return;
            }
            if (pd.mirrors[id]) {
                pd.mirrors[id].orientation = pd.mirrors[id].orientation === 'slash' ? 'backslash' : 'slash';
                setSelfSwitch(id, 'A', pd.mirrors[id].orientation === 'backslash');
                calculateBeam(); return;
            }
            if (pd.crackableWalls[id]) {
                const cw = pd.crackableWalls[id];
                if ($gameParty.hasItem($dataItems[cw.requireItemId])) {
                    if (cw.consumeItem) $gameParty.loseItem($dataItems[cw.requireItemId], 1);
                    ev.erase(); delete pd.crackableWalls[id];
                }
                return;
            }
            if (pd.colorDoors[id]) {
                const door = pd.colorDoors[id];
                if ($gameParty.hasItem($dataItems[door.keyItemId])) {
                    if (door.consumeKey) $gameParty.loseItem($dataItems[door.keyItemId], 1);
                    ev.erase(); delete pd.colorDoors[id];
                }
                return;
            }
            if (pd.comboLocks[id]) {
                const lock = pd.comboLocks[id];
                if ($gameVariables.value(lock.variableId) === lock.targetValue) {
                    $gameSwitches.setValue(lock.switchId, true);
                }
                return;
            }
            if (pd.torches[id] && !pd.torches[id].lit) {
                lightTorch(id); return;
            }
            if (pd.resetShrines[id]) {
                resetPuzzle(pd.resetShrines[id].puzzleId); return;
            }
            if (pd.undoShrines[id]) {
                undoLastPush(); return;
            }
            if (pd.variableLevers[id]) {
                const vl = pd.variableLevers[id];
                $gameVariables.setValue(vl.variableId, $gameVariables.value(vl.variableId) + vl.increment);
                return;
            }
            if (pd.magnetConsoles[id]) {
                const mc = pd.magnetConsoles[id];
                activateMagnet(mc.polarity, mc.range, mc.steps); return;
            }
            if (pd.reflectionPools[id]) {
                const rp = pd.reflectionPools[id];
                const evB = getEvent(rp.swapWithId);
                if (evB) {
                    const ax = ev.x, ay = ev.y;
                    ev.locate(evB.x, evB.y);
                    evB.locate(ax, ay);
                }
                return;
            }
        }
    };

    // =========================================================================
    // Scene_Map frame update
    // =========================================================================

    const _sceneMapUpdate = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _sceneMapUpdate.call(this);
        if (!$gameSystem._puzzleData) return;
        updateBlinkPlatforms();
        updateStateTiles();
        updateTorchTimers();
        updateTimedPlates();
        calculateBeam();
        updateAutoChecks();
        updateGroupSolveState();
    };

    // =========================================================================
    // Map change: reset volatile per-map state
    // =========================================================================

    const _gameMapSetup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _gameMapSetup.call(this, mapId);
        if (!$gameSystem) return;
        // Scan first — puzzleData() is created here if it doesn't exist yet.
        for (const ev of this.events()) scanEventPuzzleComments(ev);
        if (!$gameSystem._puzzleData) return;
        const pd = $gameSystem._puzzleData;
        pd.conveyorCounter = 0;
        for (const bp of Object.values(pd.blinkPlatforms)) {
            bp.frameCount = 0; bp.visible = true;
        }
        pd.beamPath = [];
        pd.lastSafeX = $gamePlayer.x;
        pd.lastSafeY = $gamePlayer.y;
    };

    // =========================================================================
    // Teleport: reset unsolved puzzle groups on any event transfer
    // =========================================================================

    const _performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        if (this.isTransferring() && $gameSystem._puzzleData) {
            const pd = $gameSystem._puzzleData;
            if (!pd._skipNextReset) resetUnsolvedGroups();
            pd._skipNextReset = false;
        }
        _performTransfer.call(this);
    };

})();
