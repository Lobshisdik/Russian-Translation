/*:
* @plugindesc v1.0 Creates an editable text window where players can input text with keyboard
* @author Omni-Lex
* @target MZ
* @url https://nocoldiz.itch.io/hypernet-explorer
*
* @param DefaultVariable
* @text Default Variable ID
* @desc The variable ID where text input will be saved by default
* @type variable
* @default 1
*
* @param DefaultMaxLength
* @text Default Max Characters
* @desc Maximum number of characters allowed by default
* @type number
* @min 1
* @default 30
*
* @param PlaceholderText
* @text Default Placeholder
* @desc Default placeholder text shown when no input is provided
* @type string
* @default Enter text here...
*
* @param BackgroundOpacity
* @text Window Background Opacity
* @desc Opacity of the window background (0-255)
* @type number
* @min 0
* @max 255
* @default 192
*
* @command openTextInput
* @text Open Text Input
* @desc Opens a text input window
*
* @arg variableId
* @text Variable ID
* @desc The variable ID where the input will be saved
* @type variable
* @default 1
*
* @arg maxLength
* @text Max Characters
* @desc Maximum number of characters allowed
* @type number
* @min 1
* @default 30
*
* @arg initialText
* @text Initial Text
* @desc Initial text to display (leave blank to use the value from the variable)
* @type string
* @default
*
* @arg placeholder
* @text Placeholder
* @desc Text to show when no input is provided
* @type string
* @default Enter text here...
*
* @arg backgroundImage
* @text Background Image
* @desc Background image from img/pictures/ folder (leave blank for default window)
* @type file
* @dir img/pictures/
* @default
*
* @help
* ==========================================================================
* Text Input Window Plugin
* ==========================================================================
* 
* This plugin creates a text input window where players can enter text using
* their keyboard. The text is saved to a game variable and restored when
* opening the input window again.
* 
* Plugin Commands:
* -----------------
* Open Text Input - Opens a text input window with customizable parameters
*   - Variable ID: The game variable where the text will be saved
*   - Max Characters: Maximum number of characters allowed
*   - Initial Text: Starting text (leave blank to use the variable's value)
*   - Placeholder: Text shown when no input is provided
*   - Background Image: Optional custom background from pictures folder
* 
* Script Calls:
* -------------
* TextInputManager.open(variableId, maxLength, initialText, placeholder, backgroundImage);
* 
* Example:
* TextInputManager.open(1, 20, "", "Enter your name...", "notebook");
* 
* Note: For the backgroundImage parameter, just provide the filename without
* path or extension. The image should be placed in the img/pictures/ folder.
* 
*/

(() => {
'use strict';

const pluginName = "TextInputWindow";
const parameters = PluginManager.parameters(pluginName);

const DEFAULT_VARIABLE = Number(parameters['DefaultVariable'] || 1);
const DEFAULT_MAX_LENGTH = Number(parameters['DefaultMaxLength'] || 30);
const DEFAULT_PLACEHOLDER = String(parameters['PlaceholderText'] || "Enter text here...");
const BACKGROUND_OPACITY = Number(parameters['BackgroundOpacity'] || 192);

//=============================================================================
// TextInputManager
//=============================================================================

window.TextInputManager = {
    open: function(variableId = DEFAULT_VARIABLE, maxLength = DEFAULT_MAX_LENGTH, 
                  initialText = "", placeholder = DEFAULT_PLACEHOLDER, backgroundImage = "") {
        SceneManager.push(Scene_TextInput);
        SceneManager._nextScene.prepare(variableId, maxLength, initialText, placeholder, backgroundImage);
    }
};

//=============================================================================
// Plugin Commands
//=============================================================================

PluginManager.registerCommand(pluginName, "openTextInput", args => {
    const variableId = Number(args.variableId || DEFAULT_VARIABLE);
    const maxLength = Number(args.maxLength || DEFAULT_MAX_LENGTH);
    const initialText = String(args.initialText || "");
    const placeholder = String(args.placeholder || DEFAULT_PLACEHOLDER);
    const backgroundImage = String(args.backgroundImage || "");
    
    TextInputManager.open(variableId, maxLength, initialText, placeholder, backgroundImage);
});

//=============================================================================
// Scene_TextInput
//=============================================================================

function Scene_TextInput() {
    this.initialize(...arguments);
}

Scene_TextInput.prototype = Object.create(Scene_MenuBase.prototype);
Scene_TextInput.prototype.constructor = Scene_TextInput;

Scene_TextInput.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_TextInput.prototype.prepare = function(variableId, maxLength, initialText, placeholder, backgroundImage) {
    this._variableId = variableId;
    this._maxLength = maxLength;
    this._initialText = initialText;
    this._placeholder = placeholder;
    this._backgroundImage = backgroundImage;
};

Scene_TextInput.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createTextInputWindow();
    this.createButtonsWindow();
    
    // Ensure text input window maintains focus
    this._textInputWindow.activate();
    this._buttonsWindow.deactivate();
};

Scene_TextInput.prototype.createTextInputWindow = function() {
    // If an initial text wasn't specified but there's a value in the variable, use that
    if (this._initialText === "" && $gameVariables.value(this._variableId)) {
        this._initialText = $gameVariables.value(this._variableId);
    }
    
    const rect = this.textInputWindowRect();
    this._textInputWindow = new Window_TextInput(rect);
    this._textInputWindow.setup(this._variableId, this._maxLength, this._initialText, this._placeholder);
    
    if (this._backgroundImage) {
        this._textInputWindow.setBackgroundImage(this._backgroundImage);
    }
    
    this.addWindow(this._textInputWindow);
};

Scene_TextInput.prototype.createButtonsWindow = function() {
    const rect = this.buttonsWindowRect();
    this._buttonsWindow = new Window_TextInputButtons(rect);
    this._buttonsWindow.setHandler("ok", this.onInputOk.bind(this));
    this._buttonsWindow.setHandler("cancel", this.onInputCancel.bind(this));
    this.addWindow(this._buttonsWindow);
};

Scene_TextInput.prototype.textInputWindowRect = function() {
    const wx = Math.floor(Graphics.boxWidth / 8);
    const wy = Math.floor(Graphics.boxHeight / 4);
    const ww = Math.floor(Graphics.boxWidth * 3 / 4);
    const wh = this.calcWindowHeight(3, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_TextInput.prototype.buttonsWindowRect = function() {
    const wx = Math.floor(Graphics.boxWidth / 4);
    const wy = this._textInputWindow.y + this._textInputWindow.height + 8;
    const ww = Math.floor(Graphics.boxWidth / 2);
    const wh = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_TextInput.prototype.onInputOk = function() {
    const text = this._textInputWindow.text();
    $gameVariables.setValue(this._variableId, text);
    this.popScene();
};

Scene_TextInput.prototype.onInputCancel = function() {
    this.popScene();
};

//=============================================================================
// Window_TextInput
//=============================================================================

function Window_TextInput() {
    this.initialize(...arguments);
}

Window_TextInput.prototype = Object.create(Window_Base.prototype);
Window_TextInput.prototype.constructor = Window_TextInput;

Window_TextInput.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._text = "";
    this._maxLength = 0;
    this._variableId = 0;
    this._placeholder = "";
    this._index = 0;
    this._cursorVisible = true;
    this._cursorTimer = 0;
    this._htmlInput = null;
    this._backgroundSprite = null;
    this.deactivate();
    this.backOpacity = BACKGROUND_OPACITY;
};

// Add method to check if mouse is on this window
Window_TextInput.prototype.isTouchedInsideFrame = function() {
    const touchPos = new Point(TouchInput.x, TouchInput.y);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.innerRect.contains(localPos.x, localPos.y);
};

Window_TextInput.prototype.setup = function(variableId, maxLength, initialText, placeholder) {
    this._variableId = variableId;
    this._maxLength = maxLength;
    this._text = initialText || "";
    this._placeholder = placeholder || "";
    this._index = this._text.length;
    this._cursorVisible = true;
    this._cursorTimer = 0;
    this.activate();
    this.refresh();
    this.createHtmlInput();
};

Window_TextInput.prototype.setBackgroundImage = function(imageName) {
    if (imageName) {
        if (!this._backgroundSprite) {
            this._backgroundSprite = new Sprite();
            this.addChildToBack(this._backgroundSprite);
        }
        this._backgroundSprite.bitmap = ImageManager.loadPicture(imageName);
        this._backgroundSprite.x = 0;
        this._backgroundSprite.y = 0;
        
        // Make the window background transparent
        this.opacity = 0;
    }
};

Window_TextInput.prototype.createHtmlInput = function() {
    if (this._htmlInput) {
        document.body.removeChild(this._htmlInput);
    }
    
    // Create an HTML input element
    const input = document.createElement("input");
    input.type = "text";
    input.value = this._text;
    input.maxLength = this._maxLength;
    input.placeholder = this._placeholder;
    
    // Style the input element
    input.style.position = "absolute";
    input.style.opacity = "0";  // Hide it but keep it functional
    input.style.zIndex = "-1";
    
    // Add input event listeners
    input.addEventListener("input", this.onHtmlInput.bind(this));
    input.addEventListener("keydown", this.onHtmlKeyDown.bind(this));
    
    // Add the input to the document
    document.body.appendChild(input);
    this._htmlInput = input;
    
    // Focus the input
    setTimeout(() => {
        this._htmlInput.focus();
    }, 10);
};

Window_TextInput.prototype.onHtmlInput = function(event) {
    if (this.active) {
        this._text = event.target.value.slice(0, this._maxLength);
        this._index = this._htmlInput.selectionStart;
        this.refresh();
    }
};

Window_TextInput.prototype.onHtmlKeyDown = function(event) {
    if (this.active) {
        if (event.key === "Enter") {
            this.onEnter();
        } else if (event.key === "Escape") {
            this.onEscape();
        } else if (event.key === "Backspace") {
            // Make sure backspace works properly
            if (this._index > 0) {
                // Remove the character before the cursor
                this._text = this._text.substring(0, this._index - 1) + this._text.substring(this._index);
                this._index--;
                this.refresh();
                
                // Update the HTML input value to match
                if (this._htmlInput) {
                    this._htmlInput.value = this._text;
                    this._htmlInput.selectionStart = this._index;
                    this._htmlInput.selectionEnd = this._index;
                }
            }
            
            // Prevent default to avoid double deletion
            event.preventDefault();
        }
    }
};

Window_TextInput.prototype.onEnter = function() {
    // When Enter is pressed, save the text and trigger the OK action
    const text = this.text();
    $gameVariables.setValue(this._variableId, text);
    
    // If buttons window exists, manually handle the OK action
    const scene = SceneManager._scene;
    if (scene && scene._buttonsWindow) {
        scene._buttonsWindow.select(0); // Select the OK button
        scene._buttonsWindow.activate();
        scene.onInputOk();
    }
};

Window_TextInput.prototype.onEscape = function() {
    // When Escape is pressed, trigger the Cancel action
    const scene = SceneManager._scene;
    if (scene && scene._buttonsWindow) {
        scene._buttonsWindow.select(1); // Select the Cancel button
        scene._buttonsWindow.activate();
        scene.onInputCancel();
    }
};

Window_TextInput.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    
    if (this.active) {
        this.updateCursor();
        this.updateInput();
        
        // Handle Input.isTriggered for key input
        this.processKeyboardInput();
    }
};

Window_TextInput.prototype.processKeyboardInput = function() {
    // Process keyboard input directly from RPG Maker's Input system
    // This ensures native input works even if HTML input fails
    
    // Check for backspace (we need this as a backup)
    if (Input.isTriggered('cancel') && !Input.isPressed('control')) {
        if (this._text.length > 0 && this._index > 0) {
            this._text = this._text.substring(0, this._index - 1) + this._text.substring(this._index);
            this._index--;
            this.refresh();
            
            // Sync with HTML input
            if (this._htmlInput) {
                this._htmlInput.value = this._text;
                this._htmlInput.selectionStart = this._index;
                this._htmlInput.selectionEnd = this._index;
            }
        }
    }
};

Window_TextInput.prototype.updateCursor = function() {
    // Blink cursor
    this._cursorTimer++;
    if (this._cursorTimer >= 30) {
        this._cursorVisible = !this._cursorVisible;
        this._cursorTimer = 0;
        this.refresh();
    }
};

Window_TextInput.prototype.updateInput = function() {
    // Handle keyboard input (handled by HTML input)
    if (this._htmlInput && document.activeElement !== this._htmlInput) {
        this._htmlInput.focus();
    }
};

Window_TextInput.prototype.refresh = function() {
    this.contents.clear();
    
    // Draw text or placeholder
    const text = this._text.length > 0 ? this._text : this._placeholder;
    
    // Set text color - use system colors (0 for normal text, 7 for gray placeholder)
    if (this._text.length > 0) {
        this.resetTextColor(); // Use default text color for actual input
    } else {
        this.changeTextColor(ColorManager.textColor(7)); // Use color 7 (typically gray) for placeholder
    }
    
    this.drawText(text, 0, 0, this.contentsWidth());
    
    // Draw cursor using a simple black color
    if (this.active && this._cursorVisible) {
        const textWidth = this.textWidth(this._text.substring(0, this._index));
        const cursorX = textWidth + 2;
        const cursorHeight = this.lineHeight() - 4;
        this.contents.fillRect(cursorX, 2, 2, cursorHeight, "#000000");
    }
};

Window_TextInput.prototype.text = function() {
    return this._text;
};

Window_TextInput.prototype.isCursorMovable = function() {
    return this.active;
};

Window_TextInput.prototype.deactivate = function() {
    Window_Base.prototype.deactivate.call(this);
    if (this._htmlInput) {
        this._htmlInput.blur();
    }
};

Window_TextInput.prototype.activate = function() {
    Window_Base.prototype.activate.call(this);
    if (this._htmlInput) {
        this._htmlInput.focus();
    }
};

Window_TextInput.prototype.close = function() {
    Window_Base.prototype.close.call(this);
    if (this._htmlInput) {
        document.body.removeChild(this._htmlInput);
        this._htmlInput = null;
    }
};

//=============================================================================
// Window_TextInputButtons
//=============================================================================

function Window_TextInputButtons() {
    this.initialize(...arguments);
}

Window_TextInputButtons.prototype = Object.create(Window_HorzCommand.prototype);
Window_TextInputButtons.prototype.constructor = Window_TextInputButtons;

Window_TextInputButtons.prototype.initialize = function(rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
};

Window_TextInputButtons.prototype.makeCommandList = function() {
    this.addCommand("OK", "ok");
    this.addCommand("Cancel", "cancel");
};

Window_TextInputButtons.prototype.maxCols = function() {
    return 2;
};

Window_TextInputButtons.prototype.itemWidth = function() {
    return Math.floor((this.innerWidth - this.colSpacing()) / 2);
};

// Add method to check if mouse is on this window
Window_TextInputButtons.prototype.isTouchedInsideFrame = function() {
    const touchPos = new Point(TouchInput.x, TouchInput.y);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.innerRect.contains(localPos.x, localPos.y);
};
Scene_TextInput.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    
    // Check if mouse was clicked on buttons window
    if (TouchInput.isTriggered() && this._buttonsWindow.isTouchedInsideFrame()) {
        this._textInputWindow.deactivate();
        this._buttonsWindow.activate();
        return;
    }
    
    // Check if mouse was clicked on text input window
    if (TouchInput.isTriggered() && this._textInputWindow.isTouchedInsideFrame()) {
        this._textInputWindow.activate();
        this._buttonsWindow.deactivate();
        return;
    }
    
    // By default, keep focus on the text input window unless explicitly changed
    if (!this._textInputWindow.active && !this._buttonsWindow.active) {
        this._textInputWindow.activate();
    }
};
})();