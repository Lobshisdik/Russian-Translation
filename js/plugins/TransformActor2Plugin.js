/*:
 * @target MZ
 * @plugindesc Transforms Actor2 or Actor3 to match event properties without equipping items
 * @author Omni-Lex (Modified)
 * @help
 * This plugin creates special functions that can be called from events
 * to transform Actor2's or Actor3's properties to match the calling event.
 * 
 * Event Call Instructions:
 * Use the "Plugin Command" event command and select one of:
 * - "TransformActor2": Transforms Actor2 based on the event
 * - "TransformActor3": Transforms Actor3 based on the event
 * - "Greet": Shows a greeting message with actor name and class
 * - "JoinMessage": Shows a "[Name] joins the party!" message
 * 
 * What TransformActor2/3 does:
 * - Sets Actor's name to match the event's name (unless note is "NPC-0")
 * - If the event's note is "NPC-0", assigns a random class and keeps original name
 * - Otherwise sets Actor's class to the number found in the event's note field
 * - Sets Actor's character graphics to match the event's sprite
 * - Sets Actor's level to match Actor1's level
 * - Does NOT equip any items automatically (equipment remains as default)
 * 
 * @command TransformActor2
 * @desc Transforms Actor2 based on the triggering event
 * 
 * @command TransformActor3
 * @desc Transforms Actor3 based on the triggering event
 * 
 * @command Greet
 * @desc Shows a greeting message with the actor's name and class
 * 
 * @command JoinMessage
 * @desc Shows a message that the actor has joined the party
 */

(function() {
    "use strict";
    
    const pluginName = "TransformActor2Plugin";
    
    PluginManager.registerCommand(pluginName, "TransformActor2", args => {
        transformActor(2);
    });
    
    PluginManager.registerCommand(pluginName, "TransformActor3", args => {
        transformActor(3);
    });
    
    PluginManager.registerCommand(pluginName, "Greet", args => {
        showGreetingMessage();
    });
    
    PluginManager.registerCommand(pluginName, "JoinMessage", args => {
        showJoinMessage();
    });
    
    function transformActor(actorId) {
        if (!$gameParty || !$gameMap || !$gameTemp) return;
        
        // Get the event that called this (triggering event)
        const eventId = $gameTemp.lastPluginCommandEventId || $gameMap._interpreter._eventId;
        if (!eventId) return;
        
        const event = $gameMap.event(eventId);
        if (!event) return;
        
        // Get Actor1 and target Actor
        const actor1 = $gameActors.actor(1);
        const targetActor = $gameActors.actor(actorId);
        if (!actor1 || !targetActor) return;
        
        // Check if note value is NPC-0 for random class mode
        let classId = 1; // Default class ID
        let randomClassMode = false;
        const noteData = event.event().note;
        if (noteData) {
            // Updated regex to match NPC-X format
            const match = noteData.match(/NPC-(\d+)/);
            if (match && match[1]) {
                const noteValue = parseInt(match[1]);
                if (noteValue === 0) {
                    // Enable random class mode
                    randomClassMode = true;
                    // Get a list of all valid classes (excluding ID 0)
                    const validClassIds = [];
                    for (let i = 1; i < $dataClasses.length; i++) {
                        if ($dataClasses[i]) {
                            validClassIds.push(i);
                        }
                    }
                    // Pick a random class
                    if (validClassIds.length > 0) {
                        classId = validClassIds[Math.floor(Math.random() * validClassIds.length)];
                    }
                } else {
                    classId = noteValue;
                }
            }
        }
        
        // Verify class exists
        if (!$dataClasses[classId]) {
            classId = 1; // Fallback to class 1 if invalid
        }
        
        // Apply changes to target actor properties
        targetActor._classId = classId;
        
        // Get the event name directly from the event data
        const eventName = event.event().name;
        
        // Only set name if not in random class mode
        if (!randomClassMode) {
            targetActor._name = eventName;
        }
        
        // Set target actor's character graphics to match the event's sprite
        const characterName = event.characterName();
        const characterIndex = event.characterIndex();
        if (characterName) {
            targetActor._characterName = characterName;
            targetActor._characterIndex = characterIndex;
        }
        
        // Set target actor's level to match Actor1's level
        const newLevel = actor1._level;
        targetActor._level = newLevel;
        
        // FIXED: Set experience points to match the new level
        // This ensures the actor has proper XP for their level and can gain experience
        targetActor._exp[targetActor._classId] = targetActor.expForLevel(newLevel);
        
        // Refresh actor to apply changes
        targetActor.refresh();
    }
    
    function showGreetingMessage() {
        if (!$gameMap || !$gameTemp) return;
        
        // Get the event that called this command
        const eventId = $gameTemp.lastPluginCommandEventId || $gameMap._interpreter._eventId;
        if (!eventId) return;
        
        const event = $gameMap.event(eventId);
        if (!event) return;
        
        // Get the event name directly from the event data
        const eventName = event.event().name;
        
        // Get class from event note
        let className = "Unknown";
        const noteData = event.event().note;
        if (noteData) {
            // Updated regex to match NPC-X format
            const match = noteData.match(/NPC-(\d+)/);
            if (match && match[1]) {
                const classId = parseInt(match[1]);
                // If class ID is 0, we need to use the current class of the last transformed actor
                if (classId === 0) {
                    // Attempt to get actor2 first, then actor3 if actor2 isn't available
                    const actor = $gameActors.actor(2) || $gameActors.actor(3);
                    if (actor) {
                        className = actor.currentClass().name;
                    }
                } else if ($dataClasses[classId]) {
                    // Otherwise use the class from the note
                    className = $dataClasses[classId].name;
                }
            }
        }
        window.skipLocalization = true;

        // Show the greeting message
        const message = ConfigManager.language === 'it' ? "Il mio nome è " + eventName + " e sono un " + className : "My name is " + eventName + " and I'm a " + className;

        $gameMessage.add(message);
        window.skipLocalization = false;

    }
    
    function showJoinMessage() {
        if (!$gameMap || !$gameTemp) return;
        
        // Get the event that called this command
        const eventId = $gameTemp.lastPluginCommandEventId || $gameMap._interpreter._eventId;
        if (!eventId) return;
        
        const event = $gameMap.event(eventId);
        if (!event) return;
        
        // Get the event name directly from the event data
        const eventName = event.event().name;
        
        // Show the join message
        window.skipLocalization = true;
        const message = eventName + " joins the party!";
        $gameMessage.add(message);
        window.skipLocalization = false;

    }
})();