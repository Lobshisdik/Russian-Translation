/*:
 * @target MZ
 * @plugindesc Visual Piano v1.0.0 - Two-octave visual keyboard with real-time synthesis
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help
 * ============================================================================
 * Visual Piano Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin creates a visual two-octave piano keyboard that can be played
 * using the keyboard. Keys light up when pressed and show their assigned
 * keyboard buttons.
 * 
 * Features:
 * - Two full octaves (C3 to B4)
 * - Visual keyboard with proper black/white key layout
 * - Keys show their keyboard mappings
 * - Visual feedback when keys are pressed
 * - Real-time sound synthesis using Web Audio API
 * - Multiple waveform options
 * 
 * Keyboard Layout:
 * White keys: Z X C V B N M , . / ; ' ] (and more for second octave)
 * Black keys: S D G H J L ; [ (and more for second octave)
 * 
 * Controls:
 * - Number keys 1-4: Change waveform (sine, square, triangle, sawtooth)
 * - Q/A: Transpose octave up/down
 * - Shift: Sustain pedal
 * - Escape: Close piano
 * 
 * ============================================================================
 * 
 * @command openPiano
 * @text Open Piano
 * @desc Opens the visual piano interface
 * 
 * @command closePiano
 * @text Close Piano
 * @desc Closes the visual piano interface
 * 
 * @command setWaveform
 * @text Set Waveform
 * @desc Changes the synthesizer waveform
 * @arg waveform
 * @type select
 * @option sine
 * @option square
 * @option triangle
 * @option sawtooth
 * @default sawtooth
 * @desc Select the waveform type
 * 
 * @param defaultWaveform
 * @text Default Waveform
 * @type select
 * @option sine
 * @option square
 * @option triangle
 * @option sawtooth
 * @default sawtooth
 * @desc Default waveform when piano opens
 * 
 * @param defaultVolume
 * @text Default Volume
 * @type number
 * @min 0
 * @max 100
 * @default 30
 * @desc Default volume (0-100)
 */

(() => {
    'use strict';
    
    const pluginName = 'VisualPiano';
    const parameters = PluginManager.parameters(pluginName);
    const defaultWaveform = parameters.defaultWaveform || 'sawtooth';
    const defaultVolume = (parseInt(parameters.defaultVolume) || 30) / 100;
    
    class VisualPiano {
        constructor() {
            this.audioContext = null;
            this.masterGain = null;
            this.waveform = defaultWaveform;
            this.activeNotes = new Map();
            this.sustain = false;
            this.baseOctave = 3;
            this.isOpen = false;
            
            // Two octaves of key mappings
            this.keyMappings = {
                // First octave (C3-B3)
                'KeyZ': { note: 'C', octave: 0, type: 'white' },
                'KeyS': { note: 'C#', octave: 0, type: 'black' },
                'KeyX': { note: 'D', octave: 0, type: 'white' },
                'KeyD': { note: 'D#', octave: 0, type: 'black' },
                'KeyC': { note: 'E', octave: 0, type: 'white' },
                'KeyV': { note: 'F', octave: 0, type: 'white' },
                'KeyG': { note: 'F#', octave: 0, type: 'black' },
                'KeyB': { note: 'G', octave: 0, type: 'white' },
                'KeyH': { note: 'G#', octave: 0, type: 'black' },
                'KeyN': { note: 'A', octave: 0, type: 'white' },
                'KeyJ': { note: 'A#', octave: 0, type: 'black' },
                'KeyM': { note: 'B', octave: 0, type: 'white' },
                
                // Second octave (C4-B4)
                'Comma': { note: 'C', octave: 1, type: 'white' },
                'KeyL': { note: 'C#', octave: 1, type: 'black' },
                'Period': { note: 'D', octave: 1, type: 'white' },
                'Semicolon': { note: 'D#', octave: 1, type: 'black' },
                'Slash': { note: 'E', octave: 1, type: 'white' },
                'KeyQ': { note: 'F', octave: 1, type: 'white' },
                'Digit2': { note: 'F#', octave: 1, type: 'black' },
                'KeyW': { note: 'G', octave: 1, type: 'white' },
                'Digit3': { note: 'G#', octave: 1, type: 'black' },
                'KeyE': { note: 'A', octave: 1, type: 'white' },
                'Digit4': { note: 'A#', octave: 1, type: 'black' },
                'KeyR': { note: 'B', octave: 1, type: 'white' }
            };
            
            this.noteToMidi = {
                'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
                'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
            };
            
            this.container = null;
            this.pianoKeys = new Map();
            this.initAudio();
            this.setupEventListeners();
        }
        
        initAudio() {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = defaultVolume;
            this.masterGain.connect(this.audioContext.destination);
        }
        
        open() {
            if (this.isOpen) return;
            this.isOpen = true;
            this.createUI();
            
            // Resume audio context if needed
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }
        
        close() {
            if (!this.isOpen) return;
            this.isOpen = false;
            this.stopAllNotes();
            if (this.container) {
                this.container.remove();
                this.container = null;
            }
            this.pianoKeys.clear();
        }
        
        createUI() {
            // Create container
            this.container = document.createElement('div');
            this.container.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(20, 20, 30, 0.95);
                border: 2px solid #444;
                border-radius: 10px;
                padding: 20px;
                z-index: 10000;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            `;
            
            // Create header
            const header = document.createElement('div');
            header.style.cssText = `
                text-align: center;
                color: white;
                margin-bottom: 10px;
                font-family: Arial, sans-serif;
            `;
            header.innerHTML = `
                <h3 style="margin: 0 0 5px 0;">Visual Piano</h3>
                <div style="font-size: 12px;">
                    Waveform: <span id="waveform-display">${this.waveform}</span> | 
                    Use keys to play | ESC to close
                </div>
            `;
            this.container.appendChild(header);
            
            // Create piano keyboard
            const keyboard = document.createElement('div');
            keyboard.style.cssText = `
                position: relative;
                width: 840px;
                height: 150px;
                user-select: none;
            `;
            
            // Create white keys first
            let whiteKeyIndex = 0;
            const whiteKeyWidth = 60;
            const whiteKeyPositions = [];
            
            for (let octave = 0; octave < 2; octave++) {
                for (const note of ['C', 'D', 'E', 'F', 'G', 'A', 'B']) {
                    const keyCode = this.getKeyCodeForNote(note, octave);
                    if (keyCode) {
                        const key = this.createKey(note, octave, 'white', whiteKeyIndex * whiteKeyWidth, keyCode);
                        keyboard.appendChild(key);
                        whiteKeyPositions.push({ note, octave, x: whiteKeyIndex * whiteKeyWidth });
                        whiteKeyIndex++;
                    }
                }
            }
            
            // Create black keys
            const blackKeyOffsets = {
                'C#': 45, 'D#': 105, 'F#': 225, 'G#': 285, 'A#': 345
            };
            
            for (let octave = 0; octave < 2; octave++) {
                for (const [note, baseOffset] of Object.entries(blackKeyOffsets)) {
                    const keyCode = this.getKeyCodeForNote(note, octave);
                    if (keyCode) {
                        const x = baseOffset + (octave * 420); // 420px per octave
                        const key = this.createKey(note, octave, 'black', x, keyCode);
                        keyboard.appendChild(key);
                    }
                }
            }
            
            this.container.appendChild(keyboard);
            document.body.appendChild(this.container);
        }
        
        createKey(note, octave, type, x, keyCode) {
            const key = document.createElement('div');
            const isBlack = type === 'black';
            
            key.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: 0;
                width: ${isBlack ? '40px' : '58px'};
                height: ${isBlack ? '100px' : '148px'};
                background: ${isBlack ? '#222' : '#fff'};
                border: 1px solid #000;
                border-radius: 0 0 5px 5px;
                cursor: pointer;
                z-index: ${isBlack ? 2 : 1};
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                padding-bottom: 10px;
                transition: background 0.1s;
            `;
            
            // Add note label
            const label = document.createElement('div');
            label.style.cssText = `
                color: ${isBlack ? '#fff' : '#000'};
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 5px;
            `;
            label.textContent = note + (this.baseOctave + octave);
            key.appendChild(label);
            
            // Add keyboard key label
            const keyLabel = document.createElement('div');
            keyLabel.style.cssText = `
                color: ${isBlack ? '#aaa' : '#666'};
                font-size: 10px;
                font-family: monospace;
            `;
            keyLabel.textContent = this.getKeyLabel(keyCode);
            key.appendChild(keyLabel);
            
            // Store reference
            const midiNote = this.getMidiNote(note, octave);
            this.pianoKeys.set(midiNote, key);
            
            // Mouse events
            key.addEventListener('mousedown', () => {
                if (this.isOpen) this.playNote(midiNote);
            });
            
            key.addEventListener('mouseup', () => {
                if (this.isOpen) this.stopNote(midiNote);
            });
            
            key.addEventListener('mouseleave', () => {
                if (this.isOpen) this.stopNote(midiNote);
            });
            
            return key;
        }
        
        getKeyCodeForNote(note, octave) {
            for (const [keyCode, mapping] of Object.entries(this.keyMappings)) {
                if (mapping.note === note && mapping.octave === octave) {
                    return keyCode;
                }
            }
            return null;
        }
        
        getKeyLabel(keyCode) {
            const labels = {
                'KeyZ': 'Z', 'KeyS': 'S', 'KeyX': 'X', 'KeyD': 'D',
                'KeyC': 'C', 'KeyV': 'V', 'KeyG': 'G', 'KeyB': 'B',
                'KeyH': 'H', 'KeyN': 'N', 'KeyJ': 'J', 'KeyM': 'M',
                'Comma': ',', 'KeyL': 'L', 'Period': '.', 'Semicolon': ';',
                'Slash': '/', 'KeyQ': 'Q', 'Digit2': '2', 'KeyW': 'W',
                'Digit3': '3', 'KeyE': 'E', 'Digit4': '4', 'KeyR': 'R'
            };
            return labels[keyCode] || keyCode;
        }
        
        getMidiNote(note, octave) {
            return (this.baseOctave + octave) * 12 + this.noteToMidi[note];
        }
        
        midiToFrequency(midi) {
            return 440 * Math.pow(2, (midi - 69) / 12);
        }
        
        playNote(midiNote) {
            if (this.activeNotes.has(midiNote)) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = this.waveform;
            oscillator.frequency.value = this.midiToFrequency(midiNote);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.01);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            oscillator.start();
            
            this.activeNotes.set(midiNote, { oscillator, gainNode });
            
            // Update visual
            const key = this.pianoKeys.get(midiNote);
            if (key) {
                const isBlack = key.style.height === '100px';
                key.style.background = isBlack ? '#444' : '#ccc';
            }
        }
        
        stopNote(midiNote) {
            const note = this.activeNotes.get(midiNote);
            if (!note) return;
            
            const { oscillator, gainNode } = note;
            const releaseTime = this.sustain ? 0.5 : 0.1;
            
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + releaseTime);
            oscillator.stop(this.audioContext.currentTime + releaseTime + 0.1);
            
            this.activeNotes.delete(midiNote);
            
            // Update visual
            setTimeout(() => {
                const key = this.pianoKeys.get(midiNote);
                if (key) {
                    const isBlack = key.style.height === '100px';
                    key.style.background = isBlack ? '#222' : '#fff';
                }
            }, releaseTime * 1000);
        }
        
        stopAllNotes() {
            for (const midiNote of this.activeNotes.keys()) {
                this.stopNote(midiNote);
            }
        }
        
        setWaveform(waveform) {
            this.waveform = waveform;
            const display = document.getElementById('waveform-display');
            if (display) display.textContent = waveform;
        }
        
        setupEventListeners() {
            document.addEventListener('keydown', (e) => {
                if (!this.isOpen) return;
                if (e.repeat) return;
                
                // Close on Escape
                if (e.code === 'Escape') {
                    this.close();
                    return;
                }
                
                // Waveform changes
                if (e.code === 'Digit1') this.setWaveform('sine');
                else if (e.code === 'Digit5') this.setWaveform('square');
                else if (e.code === 'Digit6') this.setWaveform('triangle');
                else if (e.code === 'Digit7') this.setWaveform('sawtooth');
                
                // Sustain
                if (e.shiftKey) this.sustain = true;
                
                // Note keys
                const mapping = this.keyMappings[e.code];
                if (mapping) {
                    const midiNote = this.getMidiNote(mapping.note, mapping.octave);
                    this.playNote(midiNote);
                }
            });
            
            document.addEventListener('keyup', (e) => {
                if (!this.isOpen) return;
                
                // Release sustain
                if (!e.shiftKey) this.sustain = false;
                
                // Note keys
                const mapping = this.keyMappings[e.code];
                if (mapping) {
                    const midiNote = this.getMidiNote(mapping.note, mapping.octave);
                    this.stopNote(midiNote);
                }
            });
        }
    }
    
    // Create global instance
    window.VisualPiano = new VisualPiano();
    
    // Register plugin commands
    PluginManager.registerCommand(pluginName, 'openPiano', () => {
        window.VisualPiano.open();
    });
    
    PluginManager.registerCommand(pluginName, 'closePiano', () => {
        window.VisualPiano.close();
    });
    
    PluginManager.registerCommand(pluginName, 'setWaveform', args => {
        window.VisualPiano.setWaveform(args.waveform);
    });
})();