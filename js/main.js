//=============================================================================
// main.js v1.8.0
//=============================================================================

const scriptUrls = [
    "js/libs/pixi.js",
    "js/libs/pako.min.js",
    "js/libs/localforage.min.js",
    "js/libs/effekseer.min.js",
    "js/libs/vorbisdecoder.js",
    "js/rmmz_core.js",
    "js/rmmz_managers.js",
    "js/rmmz_objects.js",
    "js/rmmz_scenes.js",
    "js/rmmz_sprites.js",
    "js/rmmz_windows.js",
    "js/plugins.js"
];
const effekseerWasmUrl = "js/libs/effekseer.wasm";

class Main {
    constructor() {
        this.xhrSucceeded = false;
        this.loadCount = 0;
        this.error = null;
    }

    run() {
        this.showLoadingSpinner();
        this.testXhr();
        this.hookNwjsClose();
        this.loadMainScripts();
    }

    showLoadingSpinner() {
        const bootScreen = document.createElement("div");
        bootScreen.id = "bootScreen";
        bootScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            color: #c0c0c0;
            font-family: 'Courier New', monospace;
            font-size: 18px;
            padding: 20px;
            box-sizing: border-box;
            z-index: 10000;
            overflow: hidden;
            line-height: 1.4;
        `;
        
        // Add Energy logo in top right
        const energyLogo = document.createElement("img");
        energyLogo.src = "img/pictures/energy.png";
        energyLogo.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            width: 300px;
            height: auto;
            z-index: 10001;
        `;
        bootScreen.appendChild(energyLogo);
        
        const bootContent = document.createElement("div");
        bootContent.id = "bootContent";
        bootScreen.appendChild(bootContent);
        document.body.appendChild(bootScreen);
        
        const bootSequence = [
            { text: "★ Esoteric Heavy Industries", delay: 0 },
            { text: "Copyright (C) 2001, Esoteric Systems Division", delay: 0 },
            { text: "", delay: 0 },
            { text: "HexDOS Me System v3.14", delay: 0 },
            { text: "", delay: 0 },
            { text: "Main Processor    : Quad-core HEX-9 Core", delay: 0 },
            { text: "Memory Test       : 65536KB OK", delay: 0 },
            { text: "Quantum Buffer    : 2048KB OK", delay: 0 },
            { text: "", delay: 0 },
            { text: "Detecting Primary Master   ... OK", delay: 0 },
            { text: "Detecting Primary Bioslave    ... OK", delay: 0 },
            { text: "Detecting Neural Interface  ... OK", delay: 0 },
            { text: "Detecting Mana Capacitors  ... OK", delay: 0 },
            { text: "", delay: 0 },
            { text: "Loading HexDOS System Files...", delay: 0 },
            { text: "HEXKERN.SYS ████████████████████ 100%", delay: 0, loading: true },
            { text: "MAGIDRV.SYS ████████████████████ 100%", delay: 0, loading: true },
            { text: "ETHLINK.DRV ████████████████████ 100%", delay: 0, loading: true },
            { text: "", delay: 0 },
            { text: "Initializing Arcane Protocols...", delay: 0 },
            { text: "Calibrating Mana Flow... OK", delay: 0 },
            { text: "Syncing Ethereal Network... OK", delay: 0 },
            { text: "Loading Game Environment... ", delay: 0, final: true }
        ];
        
        let currentLine = 0;
        
        function typeBootLine() {
            if (currentLine >= bootSequence.length) {
                // Add final loading animation
                const finalDots = document.createElement("span");
                finalDots.style.color = "#c0c0c0";
                let dotCount = 0;
                const dotInterval = setInterval(() => {
                    finalDots.textContent = '.'.repeat((dotCount % 4));
                    dotCount++;
                }, 100);
                
                bootContent.appendChild(finalDots);
                
                // Complete loading after 300ms
                setTimeout(() => {
                    clearInterval(dotInterval);
                    bootContent.innerHTML += "<br><br>✓ System Ready - Launching Game...";
                }, 300);
                return;
            }
            
            const line = bootSequence[currentLine];
            const lineElement = document.createElement("div");
            lineElement.style.color = "#c0c0c0";
            
            if (line.loading) {
                // Animate loading bar quickly
                const loadingText = line.text.replace(/█/g, '▒');
                lineElement.textContent = loadingText;
                bootContent.appendChild(lineElement);
                
                let progress = 0;
                const loadInterval = setInterval(() => {
                    const filled = Math.floor((progress / 100) * 20);
                    const bar = '█'.repeat(filled) + '▒'.repeat(20 - filled);
                    lineElement.textContent = line.text.replace(/[█▒]+/, bar);
                    progress += 20;
                    
                    if (progress > 100) {
                        clearInterval(loadInterval);
                        currentLine++;
                        setTimeout(typeBootLine, 0);
                    }
                }, 20);
                return;
            }
            
            lineElement.textContent = line.text;
            bootContent.appendChild(lineElement);
            
            // Auto-scroll to bottom
            bootScreen.scrollTop = bootScreen.scrollHeight;
            
            currentLine++;
            setTimeout(typeBootLine, 0);
        }
        
        // Add blinking cursor effect
        const style = document.createElement('style');
        style.textContent = `
            #bootContent::after {
                content: '█';
                animation: blink 1s infinite;
                color: #c0c0c0;
            }
            
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            
            @media (max-width: 768px) {
                #bootScreen {
                    font-size: 14px;
                    padding: 10px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Start boot sequence immediately
        setTimeout(typeBootLine, 0);
    }


    eraseLoadingSpinner() {
        const bootScreen = document.getElementById("bootScreen");
        if (bootScreen) {
            // Fade out effect
            bootScreen.style.transition = "opacity 0.5s ease-out";
            bootScreen.style.opacity = "0";
            
            setTimeout(() => {
                if (bootScreen.parentNode) {
                    document.body.removeChild(bootScreen);
                }
                // Clean up styles
                const bootStyles = document.querySelector('style');
                if (bootStyles && bootStyles.textContent.includes('@keyframes blink')) {
                    bootStyles.remove();
                }
            }, 500);
        }
    }

    testXhr() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", document.currentScript.src);
        xhr.onload = () => (this.xhrSucceeded = true);
        xhr.send();
    }

    hookNwjsClose() {
        // [Note] When closing the window, the NW.js process sometimes does
        //   not terminate properly. This code is a workaround for that.
        if (typeof nw === "object") {
            nw.Window.get().on("close", () => nw.App.quit());
        }
    }

    loadMainScripts() {
        for (const url of scriptUrls) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.async = false;
            script.defer = true;
            script.onload = this.onScriptLoad.bind(this);
            script.onerror = this.onScriptError.bind(this);
            script._url = url;
            document.body.appendChild(script);
        }
        this.numScripts = scriptUrls.length;
        window.addEventListener("load", this.onWindowLoad.bind(this));
        window.addEventListener("error", this.onWindowError.bind(this));
    }

    onScriptLoad() {
        if (++this.loadCount === this.numScripts) {
            PluginManager.setup($plugins);
        }
    }

    onScriptError(e) {
        this.printError("Failed to load", e.target._url);
    }

    printError(name, message) {
        this.eraseLoadingSpinner();
        if (!document.getElementById("errorPrinter")) {
            const errorPrinter = document.createElement("div");
            errorPrinter.id = "errorPrinter";
            errorPrinter.innerHTML = this.makeErrorHtml(name, message);
            document.body.appendChild(errorPrinter);
        }
    }

    makeErrorHtml(name, message) {
        const nameDiv = document.createElement("div");
        const messageDiv = document.createElement("div");
        nameDiv.id = "errorName";
        messageDiv.id = "errorMessage";
        nameDiv.innerHTML = name;
        messageDiv.innerHTML = message;
        return nameDiv.outerHTML + messageDiv.outerHTML;
    }

    onWindowLoad() {
        if (!this.xhrSucceeded) {
            const message = "Your browser does not allow to read local files.";
            this.printError("Error", message);
        } else if (this.isPathRandomized()) {
            const message = "Please move the Game.app to a different folder.";
            this.printError("Error", message);
        } else if (this.error) {
            this.printError(this.error.name, this.error.message);
        } else {
            this.initEffekseerRuntime();
        }
    }

    onWindowError(event) {
        if (!this.error) {
            this.error = event.error;
        }
    }

    isPathRandomized() {
        // [Note] We cannot save the game properly when Gatekeeper Path
        //   Randomization is in effect.
        return (
            typeof process === "object" &&
            process.mainModule.filename.startsWith("/private/var")
        );
    }

    initEffekseerRuntime() {
        const onLoad = this.onEffekseerLoad.bind(this);
        const onError = this.onEffekseerError.bind(this);
        effekseer.initRuntime(effekseerWasmUrl, onLoad, onError);
    }

    onEffekseerLoad() {
        this.eraseLoadingSpinner();
        SceneManager.run(Scene_Boot);
    }

    onEffekseerError() {
        this.printError("Failed to load", effekseerWasmUrl);
    }
}

const main = new Main();
main.run();

//-----------------------------------------------------------------------------