/*:
 * @target MZ
 * @plugindesc Adds a minimal compass HUD to the top-right of the screen,
 * which points to events named "NextFloor" and "PrevFloor".
 * @author Omni-Lex
 * @help This plugin adds a compass HUD to the game screen. The compass will
 * automatically show or hide based on the presence of specific events on the
 * current map.
 *
 * To use, simply name an event on your map "NextFloor" and another "PrevFloor".
 * The compass hands will automatically appear and point in the direction of
 * these events.
 *
 * If an event is not found, its corresponding hand will be hidden. If neither
 * event is found, the entire compass will be hidden.
 *
 * @param Compass X Offset
 * @desc The horizontal offset from the right edge of the screen.
 * @type number
 * @default 20
 *
 * @param Compass Y
 * @desc The y-coordinate of the compass on the screen.
 * @type number
 * @default 20
 *
 * @param Compass Size
 * @desc The radius of the compass.
 * @type number
 * @default 30
 *
 * @param NextFloor Hand Color
 * @desc The color of the hand pointing to the "NextFloor" event.
 * @type string
 * @default #FFD700
 *
 * @param PrevFloor Hand Color
 * @desc The color of the hand pointing to the "PrevFloor" event.
 * @type string
 * @default #FF0000
 */

// Define the plugin parameters from the Plugin Manager.
var Imported = Imported || {};
Imported.CompassHUD = true;

var parameters = PluginManager.parameters("CompassHUD");
var compassXOffset = Number(parameters["Compass X Offset"] || 20);
var compassY = Number(parameters["Compass Y"] || 20);
var compassSize = Number(parameters["Compass Size"] || 30);
var nextFloorColor = String(parameters["NextFloor Hand Color"] || "#FFD700");
var prevFloorColor = String(parameters["PrevFloor Hand Color"] || "#FF0000");

// =========================================================================
// Create the Sprite_Compass class to handle the compass drawing and updates.
// =========================================================================
function Sprite_Compass() {
    this.initialize(...arguments);
}

Sprite_Compass.prototype = Object.create(Sprite.prototype);
Sprite_Compass.prototype.constructor = Sprite_Compass;

Sprite_Compass.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    // Create a bitmap large enough for the compass and hands
    this.bitmap = new Bitmap(compassSize * 2 + 10, compassSize * 2 + 10);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    // Set the x position to the top-right corner, using Graphics.width
    this.x = Graphics.width - compassXOffset - (this.width / 2);
    this.y = compassY + (this.height / 2);
    this._nextFloorEvent = null;
    this._prevFloorEvent = null;
    this.visible = false;
    this._framesWaited = 0; // Frame counter for the delay
    this._eventsFound = false; // Flag to indicate if events have been searched for
};

// Main update loop for the compass.
Sprite_Compass.prototype.update = function() {
    Sprite.prototype.update.call(this);

    // Wait for 60 frames (approx. 1 second) before checking for events
    if (!this._eventsFound) {
        this._framesWaited++;
        if (this._framesWaited >= 60) {
            this.findTargetEvents();
            this._eventsFound = true;
        }
    }

    // Only update visibility and redraw if the initial event search has completed
    if (this._eventsFound) {
        this.updateVisibility();
        this.redrawCompass();
    }
};

// Find the target events (NextFloor and PrevFloor) on the current map.
Sprite_Compass.prototype.findTargetEvents = function() {
    $gameMap.events().forEach(event => {
        if (event.event().name === "NextFloor") {
            this._nextFloorEvent = event;
        }
        if (event.event().name === "PrevFloor") {
            this._prevFloorEvent = event;
        }
    });
};

// Check if the compass should be visible.
Sprite_Compass.prototype.updateVisibility = function() {
    this.visible = !!this._nextFloorEvent || !!this._prevFloorEvent;
};

// Redraw the entire compass.
Sprite_Compass.prototype.redrawCompass = function() {
    this.bitmap.clear();
    
    if (this.visible) {
        // Draw the compass base
        this.drawCompassBase();
        
        // Draw the hands
        if (this._nextFloorEvent) {
            this.drawHand(this._nextFloorEvent, nextFloorColor, "NextFloor");
        }
        if (this._prevFloorEvent) {
            this.drawHand(this._prevFloorEvent, prevFloorColor, "PrevFloor");
        }
    }
};

// Draws the static compass circle with a simple, translucent base.
Sprite_Compass.prototype.drawCompassBase = function() {
    var radius = compassSize;
    var centerX = this.bitmap.width / 2;
    var centerY = this.bitmap.height / 2;
    
    // Draw a translucent background circle
    this.bitmap.drawCircle(centerX, centerY, radius, "rgba(0, 0, 0, 0.4)");
    
    // Draw a central dot
    this.bitmap.drawCircle(centerX, centerY, 3, "rgba(255, 255, 255, 0.6)");
};

// Draws a single hand pointing to a target event with improved graphics.
Sprite_Compass.prototype.drawHand = function(targetEvent, color, type) {
    var playerX = $gamePlayer.x;
    var playerY = $gamePlayer.y;
    var targetX = targetEvent.x;
    var targetY = targetEvent.y;

    // Calculate the angle between the player and the target event.
    var deltaX = targetX - playerX;
    var deltaY = targetY - playerY;
    var angle = Math.atan2(deltaY, deltaX);
    
    // Adjust the rotation so the needle points to the target.
    var rotation = angle + Math.PI / 2;
    
    var radius = compassSize - 5;
    var centerX = this.bitmap.width / 2;
    var centerY = this.bitmap.height / 2;

    var ctx = this.bitmap.context;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    
    // Draw the arrowhead-like hand
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(-4, -radius + 8);
    ctx.lineTo(4, -radius + 8);
    ctx.closePath();
    
    ctx.fillStyle = color;
    ctx.fill();

    // Draw a small line extending from the base of the compass to the arrowhead
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(0, -radius + 8);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.restore();
};

// =========================================================================
// Override Scene_Map to add the compass sprite to the scene.
// =========================================================================
var _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    _Scene_Map_createDisplayObjects.call(this);
    this.createCompassSprite();
};

Scene_Map.prototype.createCompassSprite = function() {
    this._compassSprite = new Sprite_Compass();
    this.addChild(this._compassSprite);
};

// Override Scene_Map's update to update the compass sprite.
var _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    if (this._compassSprite) {
        this._compassSprite.update();
    }
};
