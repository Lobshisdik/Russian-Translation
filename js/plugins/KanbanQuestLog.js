/*:
 * @target MZ
 * @plugindesc Kanban Quest Log v1.1.0
 * @author Omni-Lex
 * @help
 * ============================================================================
 * Kanban Quest Log Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin creates a Kanban board-style quest log with draggable sticky
 * notes in three columns: To Do, In Progress, and Done.
 * 
 * Features:
 * - Draggable sticky notes with mouse (long press 0.6s to drag)
 * - Click to open quest details immediately
 * - Different colors for different quests
 * - Quest details with update history
 * - Menu integration
 * - Notifications for new quests and updates
 * - Plugin commands for quest management
 * 
 * Plugin Commands:
 * - Add Quest: Creates a new quest in the To Do column
 * - Update Quest: Adds an update to an existing quest
 * - Complete Quest: Moves a quest to the Done column
 * - Open Quest Log: Opens the Kanban quest board
 * 
 * @param menuCommand
 * @text Menu Command Name
 * @desc Name of the quest log command in the menu
 * @default Quest Log
 * 
 * @param showInMenu
 * @text Show in Menu
 * @desc Show the Quest Log command in the pause menu
 * @type boolean
 * @default true
 * 
 * @param notificationDuration
 * @text Notification Duration
 * @desc How long notifications stay on screen (in frames)
 * @type number
 * @default 180
 * 
 * @command addQuest
 * @text Add Quest
 * @desc Adds a new quest to the To Do column
 * 
 * @arg questId
 * @text Quest ID
 * @desc Unique identifier for the quest
 * @type string
 * 
 * @arg questTitle
 * @text Quest Title
 * @desc Title of the quest
 * @type string
 * 
 * @arg questDescription
 * @text Initial Description
 * @desc Initial description or objective
 * @type multiline_string
 * 
 * @command updateQuest
 * @text Update Quest
 * @desc Adds an update to an existing quest
 * 
 * @arg questId
 * @text Quest ID
 * @desc ID of the quest to update
 * @type string
 * 
 * @arg updateText
 * @text Update Text
 * @desc New update information
 * @type multiline_string
 * 
 * @command completeQuest
 * @text Complete Quest
 * @desc Moves a quest to the Done column
 * 
 * @arg questId
 * @text Quest ID
 * @desc ID of the quest to complete
 * @type string
 * 
 * @command openQuestLog
 * @text Open Quest Log
 * @desc Opens the Kanban quest board
 * 
 * @command clearAllQuests
 * @text Clear All Quests
 * @desc Removes all quests from the Kanban board
 */

(() => {
    'use strict';
    
    const pluginName = 'KanbanQuestLog';
    const parameters = PluginManager.parameters(pluginName);
    const menuCommand = parameters['menuCommand'] || 'Quest Log';
    const notificationDuration = Number(300);
    
    // Long press duration in milliseconds
    const LONG_PRESS_DURATION = 100;
    
    // Color palette for sticky notes
    const NOTE_COLORS = [
        '#FFE5B4', // Peach
        '#B4E5FF', // Light Blue
        '#FFB4B4', // Light Pink
        '#B4FFB4', // Light Green
        '#FFE5FF', // Light Purple
        '#FFFFB4', // Light Yellow
        '#E5B4FF', // Lavender
        '#B4FFE5'  // Light Cyan
    ];
    
    // Helper function to get date string with year 2001
    function getFixedDateString() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${month}/${day}/2001, ${hours}:${minutes}:${seconds}`;
    }
    
    // Notification Manager
    class NotificationManager {
        static initialize() {
            this._notifications = [];
            this._sprite = null;
        }
        
        static addNotification(text, type = 'info') {
            this._notifications.push({
                text: text,
                type: type,
                duration: notificationDuration,
                opacity: 0,
                targetOpacity: 255,
                y: 0
            });
        }
        
        static update() {
            if (!this._sprite) return;
            
            let yOffset = 10;
            for (let i = this._notifications.length - 1; i >= 0; i--) {
                const notif = this._notifications[i];
                
                // Update opacity
                if (notif.opacity < notif.targetOpacity) {
                    notif.opacity = Math.min(notif.opacity + 15, notif.targetOpacity);
                }
                
                // Update duration and fade out
                notif.duration--;
                if (notif.duration < 30) {
                    notif.targetOpacity = 0;
                    notif.opacity = Math.max(notif.opacity - 10, 0);
                }
                
                // Remove if fully faded
                if (notif.duration <= 0 && notif.opacity <= 0) {
                    this._notifications.splice(i, 1);
                    continue;
                }
                
                // Update position
                notif.y = yOffset;
                yOffset += 50;
            }
            
            this.drawNotifications();
        }
        
        static drawNotifications() {
            if (!this._sprite || !this._sprite.bitmap) return;
            
            const bitmap = this._sprite.bitmap;
            bitmap.clear();
            
            for (const notif of this._notifications) {
                bitmap.paintOpacity = notif.opacity;
                bitmap.fontSize = 20;
                bitmap.fontBold = true;
                
                // Measure text
                const textWidth = bitmap.measureTextWidth(notif.text) + 40;
                const textHeight = 36;
                
                // Draw notification box with black background
                const x = 10;
                const y = notif.y;
                
                // Black background
                bitmap.fillRect(x, y, textWidth, textHeight, 'rgba(0, 0, 0, 0.85)');
                
                // Colored border based on type
                const borderColor = notif.type === 'quest' ? '#4CAF50' : '#2196F3';
                bitmap.strokeRect(x, y, textWidth, textHeight, borderColor, 2);
                
                // Draw text
                bitmap.textColor = '#ffffff';
                bitmap.drawText(notif.text, x + 20, y + 6, textWidth - 40, textHeight, 'left');
            }
            
            bitmap.paintOpacity = 255;
        }
        
        static createSprite(parent) {
            this._sprite = new Sprite();
            this._sprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._sprite.z = 1000;
            parent.addChild(this._sprite);
        }
        
        static destroySprite() {
            if (this._sprite) {
                if (this._sprite.parent) {
                    this._sprite.parent.removeChild(this._sprite);
                }
                this._sprite.destroy();
                this._sprite = null;
            }
        }
    }
    
    // Data Manager
    class QuestManager {
        static initialize() {
            this._quests = {};
            this._questOrder = {
                todo: [],
                inProgress: [],
                done: []
            };
            this._colorIndex = 0;
        }
        
        static addQuest(id, title, description) {
            if (this._quests[id]) return false;
            
            this._quests[id] = {
                id: id,
                title: title,
                column: 'todo',
                color: NOTE_COLORS[this._colorIndex % NOTE_COLORS.length],
                updates: [{
                    text: description,
                    date: getFixedDateString()
                }]
            };
            
            this._colorIndex++;
            this._questOrder.todo.push(id);
            
            // Add notification
            NotificationManager.addNotification(`New Quest: ${title}`, 'quest');
            
            return true;
        }
        
        static updateQuest(id, updateText) {
            let quest = this._quests[id];
            
            // If quest doesn't exist, create it with ??? title
            if (!quest) {
                this._quests[id] = {
                    id: id,
                    title: '???',
                    column: 'todo',
                    color: NOTE_COLORS[this._colorIndex % NOTE_COLORS.length],
                    updates: []
                };
                this._colorIndex++;
                this._questOrder.todo.push(id);
                quest = this._quests[id];
                
                // Add notification for new mysterious quest
                NotificationManager.addNotification(`New Quest: ???`, 'quest');
            }
            
            quest.updates.unshift({
                text: updateText,
                date: getFixedDateString()
            });
            
            // Automatically move from todo to inProgress when updated
            if (quest.column === 'todo') {
                this.moveQuest(id, 'inProgress');
            }
            
            // Add notification
            NotificationManager.addNotification(`Quest Updated: ${quest.title}`, 'update');
            
            return true;
        }
        
        static completeQuest(id) {
            if (!this._quests[id]) return false;
            
            this.moveQuest(id, 'done');
            this._quests[id].updates.unshift({
                text: "Quest completed!",
                date: getFixedDateString()
            });
            
            // Add notification
            NotificationManager.addNotification(`Quest Complete: ${this._quests[id].title}`, 'quest');
            
            return true;
        }
        
        static moveQuest(id, targetColumn) {
            const quest = this._quests[id];
            if (!quest) return false;
            
            // Remove from current column
            const currentCol = this._questOrder[quest.column];
            const index = currentCol.indexOf(id);
            if (index > -1) currentCol.splice(index, 1);
            
            // Add to target column
            this._questOrder[targetColumn].push(id);
            quest.column = targetColumn;
            return true;
        }
        
        static getQuest(id) {
            return this._quests[id];
        }
        
        static getQuestsInColumn(column) {
            return this._questOrder[column].map(id => this._quests[id]);
        }
        
        static save() {
            const saveData = {
                quests: this._quests,
                questOrder: this._questOrder,
                colorIndex: this._colorIndex
            };
            return saveData;
        }
        
        static load(saveData) {
            if (saveData) {
                this._quests = saveData.quests || {};
                this._questOrder = saveData.questOrder || { todo: [], inProgress: [], done: [] };
                this._colorIndex = saveData.colorIndex || 0;
            }
        }
    }
    
    // Window for Kanban Board (now extends Selectable for proper input handling)
    class Window_KanbanBoard extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._columns = ['todo', 'inProgress', 'done'];
            this._columnTitles = ['To Do', 'In Progress', 'Done'];
            this._draggingNote = null;
            this._dragOffset = { x: 0, y: 0 };
            this._hoveredNote = null;
            this._selectedNote = null;
            this._notes = [];
            this._keyboardSelection = { column: 0, row: 0 };
            this._keyboardMode = false;
            
            // Long press detection variables
            this._pressStartTime = 0;
            this._pressedNote = null;
            this._isDragMode = false;
            this._longPressTriggered = false;
            this._initialPressPos = null;
            
            this.setBackgroundType(2); // Dark window background
        }
        
        maxItems() {
            return 0; // We handle selection manually
        }
        
        update() {
            super.update();
            this.updateKeyboardInput();
            this.updateMouseInteraction();
        }
        
        updateKeyboardInput() {
            if (!this.active) return;
            
            const oldColumn = this._keyboardSelection.column;
            const oldRow = this._keyboardSelection.row;
            let moved = false;
            
            // Handle arrow keys and WASD
            if (Input.isRepeated('down') || Input.isRepeated('s')) {
                this._keyboardSelection.row++;
                moved = true;
                this._keyboardMode = true;
            } else if (Input.isRepeated('up') || Input.isRepeated('w')) {
                this._keyboardSelection.row--;
                moved = true;
                this._keyboardMode = true;
            } else if (Input.isRepeated('left') || Input.isRepeated('a')) {
                this._keyboardSelection.column--;
                moved = true;
                this._keyboardMode = true;
            } else if (Input.isRepeated('right') || Input.isRepeated('d')) {
                this._keyboardSelection.column++;
                moved = true;
                this._keyboardMode = true;
            }
            
            // Constrain selection
            this._keyboardSelection.column = Math.max(0, Math.min(2, this._keyboardSelection.column));
            
            // Get quests in current column
            const column = this._columns[this._keyboardSelection.column];
            const quests = QuestManager.getQuestsInColumn(column);
            this._keyboardSelection.row = Math.max(0, Math.min(quests.length - 1, this._keyboardSelection.row));
            
            if (moved) {
                this.updateKeyboardHover();
                SoundManager.playCursor();
            }
            
            // Handle selection/interaction
            if (Input.isTriggered('ok') || Input.isTriggered(' ')) {
                this.handleKeyboardSelect();
            }
            
            // Handle moving quests with Shift+Arrow or Shift+WASD
            if (this._hoveredNote && this._hoveredNote.quest.column !== 'done') {
                if (Input.isPressed('shift')) {
                    if (Input.isTriggered('left') || Input.isTriggered('a')) {
                        this.moveQuestKeyboard('left');
                    } else if (Input.isTriggered('right') || Input.isTriggered('d')) {
                        this.moveQuestKeyboard('right');
                    }
                }
            }
        }
        
        updateKeyboardHover() {
            const column = this._columns[this._keyboardSelection.column];
            const quests = QuestManager.getQuestsInColumn(column);
            
            if (quests.length > 0 && this._keyboardSelection.row < quests.length) {
                const quest = quests[this._keyboardSelection.row];
                // Find the corresponding note
                for (const note of this._notes) {
                    if (note.quest.id === quest.id) {
                        this._hoveredNote = note;
                        break;
                    }
                }
            } else {
                this._hoveredNote = null;
            }
            
            this.refresh();
        }
        
        handleKeyboardSelect() {
            if (this._hoveredNote) {
                this._selectedNote = this._hoveredNote.quest;
                SoundManager.playOk();
                SceneManager._scene.openQuestDetails(this._hoveredNote.quest);
            }
        }
        
        moveQuestKeyboard(direction) {
            if (!this._hoveredNote || this._hoveredNote.quest.column === 'done') return;
            
            const currentColIndex = this._columns.indexOf(this._hoveredNote.quest.column);
            let targetColIndex = currentColIndex;
            
            if (direction === 'left' && currentColIndex > 0) {
                targetColIndex--;
            } else if (direction === 'right' && currentColIndex < 1) { // Can't move to done (index 2)
                targetColIndex++;
            }
            
            if (targetColIndex !== currentColIndex) {
                const targetColumn = this._columns[targetColIndex];
                QuestManager.moveQuest(this._hoveredNote.quest.id, targetColumn);
                this._keyboardSelection.column = targetColIndex;
                
                // Adjust row if necessary
                const quests = QuestManager.getQuestsInColumn(targetColumn);
                this._keyboardSelection.row = Math.min(this._keyboardSelection.row, quests.length - 1);
                
                SoundManager.playOk();
                this.refresh();
                this.updateKeyboardHover();
            }
        }
        
        updateMouseInteraction() {
            if (!this.active) return;
            
            const touchPos = this.getTouchPosition();
            
            // Handle mouse release
            if (!TouchInput.isPressed()) {
                if (this._pressedNote && !this._longPressTriggered) {
                    // This was a click, not a long press
                    this.handleClick(this._pressedNote);
                } else if (this._pressedNote && this._longPressTriggered && !this._noteMoved) {
                    // Long press completed without moving - open details
                    this.handleClick(this._pressedNote);
                }
                
                if (this._draggingNote) {
                    this.handleDrop();
                }
                
                // Reset press state
                this._pressStartTime = 0;
                this._pressedNote = null;
                this._isDragMode = false;
                this._longPressTriggered = false;
                this._initialPressPos = null;
                this._noteMoved = false; // Reset movement flag
                return;
            }
            
            if (!touchPos) return;
            
            // Switch to mouse mode when mouse is moved
            if (TouchInput.isMoved()) {
                this._keyboardMode = false;
            }
            
            const currentTime = Date.now();
            
            // Handle initial press
            if (TouchInput.isTriggered()) {
                this.handleMouseDown(touchPos, currentTime);
            }
            
            // Check for long press
            if (this._pressedNote && !this._longPressTriggered && !this._isDragMode) {
                const pressDuration = currentTime - this._pressStartTime;
                
                // Check if mouse has moved significantly during press
                if (this._initialPressPos) {
                    const deltaX = Math.abs(touchPos.x - this._initialPressPos.x);
                    const deltaY = Math.abs(touchPos.y - this._initialPressPos.y);
                    
                    // If mouse moved more than 5 pixels, cancel the press
                    if (deltaX > 5 || deltaY > 5) {
                        this._pressedNote = null;
                        this._pressStartTime = 0;
                        this._initialPressPos = null;
                        return;
                    }
                }
                
                if (pressDuration >= LONG_PRESS_DURATION) {
                    // Long press detected - start drag mode
                    this._longPressTriggered = true;
                    this._isDragMode = true;
                    this._noteMoved = false; // Initialize movement tracking
                    this.startDrag(this._pressedNote, touchPos);
                }
            }
            
            // Handle dragging
            if (this._draggingNote && TouchInput.isMoved()) {
                 this.handleDrag(touchPos);
            }
            
            // Only update hover from mouse if not in keyboard mode and not pressing
            if (!this._keyboardMode && !this._pressedNote) {
                this.updateHover(touchPos);
            }
        }
        
        getTouchPosition() {
            if (!TouchInput.isPressed() && !TouchInput.isTriggered() && !TouchInput.isMoved()) {
                return null;
            }
            
            const x = TouchInput.x - this.x;
            const y = TouchInput.y - this.y;
            
            if (x < 0 || x > this.width || y < 0 || y > this.height) {
                return null;
            }
            
            return { x: x, y: y };
        }
        
        handleMouseDown(pos, currentTime) {
            const note = this.getNoteAt(pos);
            if (note) {
                // Prevent any interaction with done quests
                if (note.quest.column === 'done') {
                    return;
                }
                
                this._pressStartTime = currentTime;
                this._pressedNote = note;
                this._initialPressPos = { x: pos.x, y: pos.y };
                this._longPressTriggered = false;
                this._isDragMode = false;
            }
        }
        
        startDrag(note, pos) {
            this._draggingNote = note;
            this._dragOffset = {
                x: pos.x - note.x,
                y: pos.y - note.y
            };
            SoundManager.playOk();
        }
        
        handleClick(note) {
            if (note) {
                this._selectedNote = note.quest;
                SoundManager.playOk();
                SceneManager._scene.openQuestDetails(note.quest);
            }
        }
        
        handleDrag(pos) {
            if (this._draggingNote) {
                const oldX = this._draggingNote.x;
                const oldY = this._draggingNote.y;
                
                this._draggingNote.x = pos.x - this._dragOffset.x;
                this._draggingNote.y = pos.y - this._dragOffset.y;
                
                // Check if the note has actually moved
                if (Math.abs(this._draggingNote.x - oldX) > 5 || Math.abs(this._draggingNote.y - oldY) > 5) {
                    this._noteMoved = true;
                }
                
                this.refresh();
            }
        }
        
        handleDrop() {
            if (!this._draggingNote) return;
            
            const column = this.getColumnAt(this._draggingNote.x + this._draggingNote.width / 2);
            
            // Prevent moving to done column (silently)
            if (column === 'done') {
                this._draggingNote = null;
                this.refresh();
                return;
            }
            
            if (column && column !== this._draggingNote.quest.column) {
                QuestManager.moveQuest(this._draggingNote.quest.id, column);
                SoundManager.playOk();
            }
            
            this._draggingNote = null;
            this.refresh();
        }
        
        updateHover(pos) {
            const note = this.getNoteAt(pos);
            if (note !== this._hoveredNote) {
                this._hoveredNote = note;
                this.refresh();
            }
        }
        
        getNoteAt(pos) {
            for (const note of this._notes) {
                if (pos.x >= note.x && pos.x <= note.x + note.width &&
                    pos.y >= note.y && pos.y <= note.y + note.height) {
                    return note;
                }
            }
            return null;
        }
        
        getColumnAt(x) {
            const columnWidth = this.contents.width / 3;
            if (x < columnWidth) return 'todo';
            if (x < columnWidth * 2) return 'inProgress';
            if (x < columnWidth * 3) return 'done';
            return null;
        }
        
        refresh() {
            this.contents.clear();
            this._notes = [];
            this.drawColumns();
            this.drawNotes();
        }
        
        drawColumns() {
            const columnWidth = this.contents.width / 3;
            const headerHeight = 60;
            
            // Draw black background for entire board
            this.contents.fillRect(0, 0, this.contents.width, this.contents.height, '#000000');
            
            for (let i = 0; i < 3; i++) {
                const x = i * columnWidth;
                
                // Draw column background with dark gray
                this.contents.fillRect(x + 4, 4, columnWidth - 8, this.contents.height - 8, '#1a1a1a');
                
                // Draw column header with slightly lighter gray
                this.contents.fillRect(x + 4, 4, columnWidth - 8, headerHeight, '#2a2a2a');
                
                // Draw column border
                this.contents.strokeRect(x + 4, 4, columnWidth - 8, this.contents.height - 8, '#444444', 1);
                
                // Draw column title
                this.contents.fontSize = 24;
                this.contents.fontBold = true;
                this.contents.textColor = '#ffffff';
                this.contents.drawText(this._columnTitles[i], x, 10, columnWidth, headerHeight, 'center');
                this.contents.fontBold = false;
                this.contents.fontSize = 22;
            }
        }
        
        drawNotes() {
            const columnWidth = this.contents.width / 3;
            const headerHeight = 60;
            const noteWidth = columnWidth - 40;
            const noteHeight = 80;
            const noteMargin = 10;
            
            for (let i = 0; i < 3; i++) {
                const column = this._columns[i];
                const quests = QuestManager.getQuestsInColumn(column);
                const x = i * columnWidth + 20;
                let y = headerHeight + 20;
                
                for (const quest of quests) {
                    if (this._draggingNote && this._draggingNote.quest.id === quest.id) {
                        continue; // Skip the dragging note in normal rendering
                    }
                    
                    const note = {
                        quest: quest,
                        x: x,
                        y: y,
                        width: noteWidth,
                        height: noteHeight
                    };
                    
                    this._notes.push(note);
                    this.drawStickyNote(note);
                    
                    y += noteHeight + noteMargin;
                }
            }
            
            // Draw dragging note on top
            if (this._draggingNote) {
                this.drawStickyNote(this._draggingNote, true);
            }
        }
        
        drawStickyNote(note, isDragging = false) {
            const quest = note.quest;
            const alpha = isDragging ? 0.7 : 1.0;
            
            // Shadow
            if (!isDragging) {
                this.contents.fillRect(note.x + 3, note.y + 3, note.width, note.height, 'rgba(0,0,0,0.2)');
            }
            
            // Note background - use gold background if keyboard selected
            this.contents.paintOpacity = alpha * 255;
            if (this._hoveredNote === note && this._keyboardMode && !isDragging) {
                if (quest.column !== 'done') {
                    // Gold background for keyboard selection
                    this.contents.fillRect(note.x, note.y, note.width, note.height, '#FFD700');
                } else {
                    // Dimmed gold for done items
                    this.contents.fillRect(note.x, note.y, note.width, note.height, '#DDD700');
                }
            } else {
                // Normal note color
                this.contents.fillRect(note.x, note.y, note.width, note.height, quest.color);
            }
            
            // Border effects
            if (this._hoveredNote === note && !isDragging) {
                if (quest.column !== 'done') {
                    if (this._keyboardMode) {
                        // Gold border for keyboard mode
                        this.contents.strokeRect(note.x - 2, note.y - 2, note.width + 4, note.height + 4, '#FFD700', 3);
                    } else {
                        // White border for mouse mode
                        this.contents.strokeRect(note.x - 2, note.y - 2, note.width + 4, note.height + 4, '#ffffff', 3);
                    }
                } else {
                    // Done items get dimmer borders
                    if (this._keyboardMode) {
                        this.contents.strokeRect(note.x - 2, note.y - 2, note.width + 4, note.height + 4, '#B8860B', 2);
                    } else {
                        this.contents.strokeRect(note.x - 2, note.y - 2, note.width + 4, note.height + 4, '#666666', 2);
                    }
                }
            }
            
            // Visual indicator for pressing state
            if (this._pressedNote === note && !this._longPressTriggered) {
                this.contents.strokeRect(note.x - 1, note.y - 1, note.width + 2, note.height + 2, '#ffff00', 2);
            }
            
            // Visual indicator for done quests (dimmed)
            if (quest.column === 'done') {
                this.contents.paintOpacity = 150; // Dimmed appearance for done items
                this.contents.fillRect(note.x, note.y, note.width, note.height, 'rgba(0,0,0,0.3)');
            }
            
            // Title only - no preview description
            this.contents.paintOpacity = 255;
            this.contents.fontSize = 18;
            this.contents.fontBold = true;
            this.drawTextEx(quest.title, note.x + 10, note.y + 10, note.width - 20);
            this.contents.fontBold = false;
            
            this.contents.fontSize = 22;
        }
    }
    
    // Window for Quest Details
    class Window_QuestDetails extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._quest = null;
            this.setBackgroundType(2); // Dark window background
        }
        
        setQuest(quest) {
            this._quest = quest;
            this.refresh();
        }
        
        maxItems() {
            return this._quest ? this._quest.updates.length : 0;
        }
        
        drawItem(index) {
            const update = this._quest.updates[index];
            const rect = this.itemLineRect(index);
            
            // Draw date
            this.contents.fontSize = 14;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(update.date, rect.x, rect.y, rect.width, 'left');
            
            // Draw update text
            this.contents.fontSize = 18;
            this.changeTextColor(ColorManager.normalColor());
            const textY = rect.y + 20;
            this.drawTextEx(update.text, rect.x, textY, rect.width);
            this.contents.fontSize = 22;
        }
        
        itemHeight() {
            return 80;
        }
        
        drawAllItems() {
            if (!this._quest) return;
            
            // Draw title
            this.contents.fontSize = 24;
            this.contents.fontBold = true;
            this.contents.fillRect(0, 0, this.contents.width, 50, this._quest.color);
            this.drawText(this._quest.title, 10, 10, this.contents.width - 20, 'left');
            this.contents.fontBold = false;
            this.contents.fontSize = 22;
            
            // Draw updates
            const topIndex = this.topRow();
            for (let i = 0; i < this.maxPageItems(); i++) {
                const index = topIndex + i;
                if (index < this.maxItems()) {
                    this.drawItem(index);
                }
            }
        }
        
        itemRect(index) {
            const rect = super.itemRect(index);
            rect.y += 60; // Offset for title
            return rect;
        }
    }
    
    // Scene for Kanban Quest Log
    class Scene_KanbanQuest extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            this.createBoardWindow();
            this.createDetailsWindow();
            this._boardWindow.refresh();
        }
        
        createHelpWindow() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText('Arrow/WASD: Navigate | Enter/Space: View Details | Shift+Left/Right: Move Quest | Click: View | Hold 0.6s: Drag | ESC: Close');
            this.addWindow(this._helpWindow);
        }
        
        helpWindowRect() {
            const wx = 0;
            const wy = 0;
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(1, false);
            return new Rectangle(wx, wy, ww, wh);
        }
        
        createBoardWindow() {
            const rect = this.boardWindowRect();
            this._boardWindow = new Window_KanbanBoard(rect);
            this._boardWindow.setHandler('cancel', this.popScene.bind(this));
            this._boardWindow.activate();
            this.addWindow(this._boardWindow);
        }
        
        boardWindowRect() {
            const wx = 0;
            const wy = this._helpWindow.height;
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - this._helpWindow.height;
            return new Rectangle(wx, wy, ww, wh);
        }
        
        createDetailsWindow() {
            const rect = this.detailsWindowRect();
            this._detailsWindow = new Window_QuestDetails(rect);
            this._detailsWindow.setHandler('cancel', this.closeDetails.bind(this));
            this._detailsWindow.hide();
            this._detailsWindow.deactivate();
            this.addWindow(this._detailsWindow);
        }
        
        detailsWindowRect() {
            const ww = 600;
            const wh = 400;
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2;
            return new Rectangle(wx, wy, ww, wh);
        }
        
        openQuestDetails(quest) {
            this._detailsWindow.setQuest(quest);
            this._detailsWindow.show();
            this._detailsWindow.activate();
            this._boardWindow.deactivate();
        }
        
        closeDetails() {
            this._detailsWindow.hide();
            this._detailsWindow.deactivate();
            this._boardWindow.activate();
        }
        
        update() {
            super.update();
            if (Input.isTriggered('cancel') && this._detailsWindow.visible) {
                this.closeDetails();
            }
        }
    }
    
    // Menu Integration
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand(menuCommand, 'questLog', true, 186);
    };
    
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('questLog', this.commandQuestLog.bind(this));
    };
    
    Scene_Menu.prototype.commandQuestLog = function() {
        SceneManager.push(Scene_KanbanQuest);
    };

    
    // Initialize WASD input mapping
    const _Input_initialize = Input.initialize;
    Input.initialize = function() {
        _Input_initialize.call(this);
        // Add WASD mappings
        this.keyMapper[87] = 'w'; // W
        this.keyMapper[65] = 'a'; // A
        this.keyMapper[83] = 's'; // S
        this.keyMapper[68] = 'd'; // D
    };
    
    const _Input_shouldPreventDefault = Input._shouldPreventDefault;
    Input._shouldPreventDefault = function(keyCode) {
        // Prevent default for WASD keys
        if (keyCode === 87 || keyCode === 65 || keyCode === 83 || keyCode === 68) {
            return true;
        }
        return _Input_shouldPreventDefault.call(this, keyCode);
    };
    
    // Plugin Commands
    PluginManager.registerCommand(pluginName, 'addQuest', args => {
        QuestManager.addQuest(args.questId, args.questTitle, args.questDescription);
    });
    
    PluginManager.registerCommand(pluginName, 'updateQuest', args => {
        QuestManager.updateQuest(args.questId, args.updateText);
    });
    
    PluginManager.registerCommand(pluginName, 'completeQuest', args => {
        QuestManager.completeQuest(args.questId);
    });
    
    PluginManager.registerCommand(pluginName, 'openQuestLog', args => {
        SceneManager.push(Scene_KanbanQuest);
    });
    
    // Notification System Integration
    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        NotificationManager.createSprite(this);
    };
    
    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        NotificationManager.destroySprite();
        _Scene_Map_terminate.call(this);
    };
    
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        NotificationManager.update();
    };
    
    // Save/Load Integration
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        QuestManager.initialize();
        NotificationManager.initialize();
    };
    
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.kanbanQuests = QuestManager.save();
        return contents;
    };
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        QuestManager.load(contents.kanbanQuests);
    };
    
    // Initialize on new game
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        QuestManager.initialize();
        NotificationManager.initialize();
    };

    // Add this with the other Plugin Commands (around line 1074)
PluginManager.registerCommand(pluginName, 'clearAllQuests', args => {
    QuestManager.initialize();
});
    
})();