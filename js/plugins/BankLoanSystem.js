/*:
 * @target MZ
 * @plugindesc Creates a banking system with deposits, withdrawals, interest, and loans.
 * @author Omni-Lex (Your Name Here)
 * @url https://yourwebsite.com
 *
 * @param Starting Interest Rate
 * @desc The starting interest rate for money in the bank (in percentage)
 * @default 2
 * @type number
 * @min 0
 * @decimals 1
 *
 * @param Interest Interval
 * @desc How often interest is applied (in game days)
 * @default 7
 * @type number
 * @min 1
 *
 * @param Loan Interest Rate
 * @desc The interest rate for loans (in percentage)
 * @default 5
 * @type number
 * @min 0
 * @decimals 1
 *
 * @param Max Loan Amount
 * @desc The maximum amount the player can borrow
 * @default 10000
 * @type number
 * @min 0
 *
 * @param Loan Duration
 * @desc How long before a loan must be paid back (in game days)
 * @default 30
 * @type number
 * @min 1
 *
 * @command OpenBankMenu
 * @desc Opens the banking system menu
 *
 * @command ProcessDayChange
 * @desc Process a day change for interest and loan calculations
 *
 * @help
 * ===========================================================================
 * Bank and Loan System
 * ===========================================================================
 * This plugin implements a banking system with the following features:
 * - Deposit gold into a bank account
 * - Withdraw gold from your bank account
 * - Earn interest on your bank balance
 * - Take out loans with interest
 * - Get penalized for not paying back loans on time
 * 
 * ===========================================================================
 * How to Use
 * ===========================================================================
 * 1. In an event, use the plugin command "OpenBankMenu" to open the bank menu.
 * 2. Use the plugin command "ProcessDayChange" whenever a game day passes
 *    (typically in your day change events).
 * 
 * ===========================================================================
 * Script Calls
 * ===========================================================================
 * $gameSystem.getBankBalance() - Returns the player's bank balance
 * $gameSystem.getLoanBalance() - Returns the player's current loan amount
 * $gameSystem.getLoanDueDate() - Returns the due date for the current loan
 * 
 */

(() => {
    'use strict';
    
    const pluginName = "BankLoanSystem";
    
    //=============================================================================
    // Plugin Parameters
    //=============================================================================
    
    const parameters = PluginManager.parameters(pluginName);
    const interestRate = Number(parameters['Starting Interest Rate'] || 2) / 100;
    const interestInterval = Number(parameters['Interest Interval'] || 7);
    const loanInterestRate = Number(parameters['Loan Interest Rate'] || 5) / 100;
    const maxLoanAmount = Number(parameters['Max Loan Amount'] || 10000);
    const loanDuration = Number(parameters['Loan Duration'] || 30);
    
    //=============================================================================
    // Game_System
    //=============================================================================
    
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._bankBalance = 0;
        this._loanBalance = 0;
        this._loanDueDate = 0;
        this._daysSinceInterest = 0;
        this._currentDay = 0;
    };
    
    Game_System.prototype.getBankBalance = function() {
        return this._bankBalance || 0;
    };
    
    Game_System.prototype.getLoanBalance = function() {
        return this._loanBalance || 0;
    };
    
    Game_System.prototype.getLoanDueDate = function() {
        return this._loanDueDate || 0;
    };
    
    Game_System.prototype.deposit = function(amount) {
        if (amount > 0 && $gameParty.gold() >= amount) {
            this._bankBalance = (this._bankBalance || 0) + amount;
            $gameParty.loseGold(amount);
            return true;
        }
        return false;
    };
    
    Game_System.prototype.withdraw = function(amount) {
        if (amount > 0 && (this._bankBalance || 0) >= amount) {
            this._bankBalance -= amount;
            $gameParty.gainGold(amount);
            return true;
        }
        return false;
    };
    
    Game_System.prototype.takeLoan = function(amount) {
        if (amount > 0 && amount <= maxLoanAmount && (this._loanBalance || 0) === 0) {
            this._loanBalance = amount;
            this._loanDueDate = (this._currentDay || 0) + loanDuration;
            $gameParty.gainGold(amount);
            return true;
        }
        return false;
    };
    
    Game_System.prototype.repayLoan = function(amount) {
        if (amount > 0 && $gameParty.gold() >= amount) {
            const repaidAmount = Math.min(amount, this._loanBalance || 0);
            this._loanBalance -= repaidAmount;
            $gameParty.loseGold(repaidAmount);
            
            if (this._loanBalance <= 0) {
                this._loanBalance = 0;
                this._loanDueDate = 0;
            }
            return true;
        }
        return false;
    };
    
    Game_System.prototype.processDayChange = function() {
        this._currentDay = (this._currentDay || 0) + 1;
        this._daysSinceInterest = (this._daysSinceInterest || 0) + 1;
        
        // Apply bank interest
        if (this._daysSinceInterest >= interestInterval) {
            this._bankBalance = (this._bankBalance || 0) + Math.floor((this._bankBalance || 0) * interestRate);
            this._daysSinceInterest = 0;
        }
        
        // Process loan
        if ((this._loanBalance || 0) > 0) {
            // Check if loan is overdue
            if ((this._currentDay || 0) > (this._loanDueDate || 0)) {
                // Add penalty interest
                this._loanBalance += Math.floor((this._loanBalance || 0) * (loanInterestRate * 2));
            }
        }
    };
    
    //=============================================================================
    // Plugin Commands
    //=============================================================================
    
    PluginManager.registerCommand(pluginName, "OpenBankMenu", args => {
        SceneManager.push(Scene_BankSystem);
    });
    
    PluginManager.registerCommand(pluginName, "ProcessDayChange", args => {
        $gameSystem.processDayChange();
    });
    
    //=============================================================================
    // Window_BankCommand
    //=============================================================================
    
    function Window_BankCommand() {
        this.initialize(...arguments);
    }
    
    Window_BankCommand.prototype = Object.create(Window_Command.prototype);
    Window_BankCommand.prototype.constructor = Window_BankCommand;
    
    Window_BankCommand.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };
    
    Window_BankCommand.prototype.makeCommandList = function() {
        this.addCommand("Deposit", "deposit");
        this.addCommand("Withdraw", "withdraw");
        this.addCommand("Loan", "loan");
        this.addCommand("Repay Loan", "repay");
        this.addCommand("Exit", "cancel");
    };
    
    //=============================================================================
    // Window_BankStatus
    //=============================================================================
    
    function Window_BankStatus() {
        this.initialize(...arguments);
    }
    
    Window_BankStatus.prototype = Object.create(Window_Base.prototype);
    Window_BankStatus.prototype.constructor = Window_BankStatus;
    
    Window_BankStatus.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.refresh();
    };
    
    Window_BankStatus.prototype.refresh = function() {
        this.contents.clear();
        
        const lineHeight = this.lineHeight();
        const x = this.itemPadding();
        let y = 0;
        
        // Player's money
        this.drawText("Your Money:", x, y, 120);
        this.drawText($gameParty.gold() + " G", x + 140, y, 120, 'right');
        y += lineHeight;
        
        // Bank balance
        this.drawText("Bank Balance:", x, y, 120);
        this.drawText($gameSystem.getBankBalance() + " G", x + 140, y, 120, 'right');
        y += lineHeight;
        
        // Interest rate
        this.drawText("Interest Rate:", x, y, 120);
        this.drawText((interestRate * 100).toFixed(1) + "% / " + interestInterval + " days", x + 140, y, 180, 'right');
        y += lineHeight;
        
        // Loan information
        if ($gameSystem.getLoanBalance() > 0) {
            this.drawText("Loan Amount:", x, y, 120);
            this.drawText($gameSystem.getLoanBalance() + " G", x + 140, y, 120, 'right');
            y += lineHeight;
            
            this.drawText("Due Date:", x, y, 120);
            const daysLeft = $gameSystem.getLoanDueDate() - ($gameSystem._currentDay || 0);
            const dueDateText = daysLeft + " days left";
            this.drawText(dueDateText, x + 140, y, 120, 'right');
            y += lineHeight;
            
            this.drawText("Loan Rate:", x, y, 120);
            this.drawText((loanInterestRate * 100).toFixed(1) + "%", x + 140, y, 120, 'right');
        } else {
            this.drawText("Max Loan:", x, y, 120);
            this.drawText(maxLoanAmount + " G", x + 140, y, 120, 'right');
            y += lineHeight;
            
            this.drawText("Loan Rate:", x, y, 120);
            this.drawText((loanInterestRate * 100).toFixed(1) + "%", x + 140, y, 120, 'right');
            y += lineHeight;
            
            this.drawText("Loan Duration:", x, y, 120);
            this.drawText(loanDuration + " days", x + 140, y, 120, 'right');
        }
    };
    
    //=============================================================================
    // Window_Amount - A simplified window for amount input
    //=============================================================================
    
    function Window_Amount() {
        this.initialize(...arguments);
    }
    
    Window_Amount.prototype = Object.create(Window_Base.prototype);
    Window_Amount.prototype.constructor = Window_Amount;
    
    Window_Amount.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._amount = 0;
        this._maxAmount = 0;
        this._mode = "";
        this.active = false;
        this.refresh();
    };
    
    Window_Amount.prototype.setMode = function(mode, maxAmount) {
        this._mode = mode;
        this._maxAmount = maxAmount;
        this._amount = 0;
        this.refresh();
        this.activate();
    };
    
    Window_Amount.prototype.amount = function() {
        return this._amount;
    };
    
    Window_Amount.prototype.refresh = function() {
        this.contents.clear();
        const lineHeight = this.lineHeight();
        const title = this._mode + " Amount:";
        this.drawText(title, 0, 0, 200);
        
        const amountText = this._amount + " G";
        this.drawText(amountText, 0, lineHeight, this.width - this.padding * 2, 'right');
        
        const helpText = "↑↓: ±100  ←→: ±1000";
        this.contents.drawText(helpText, 0, lineHeight * 2, this.width - this.padding * 2, lineHeight);
        
        const confirmText = "OK: Enter   Cancel: ESC";
        this.contents.drawText(confirmText, 0, lineHeight * 3, this.width - this.padding * 2, lineHeight);
    };
    
    Window_Amount.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this.active) {
            this.processDigitChange();
            if (Input.isTriggered('ok')) {
                this.processOk();
            }
            if (Input.isTriggered('cancel')) {
                this.processCancel();
            }
        }
    };
    
    Window_Amount.prototype.processDigitChange = function() {
        let changed = false;
        let newAmount = this._amount;
        
        if (Input.isRepeated('up')) {
            newAmount = Math.min(newAmount + 100, this._maxAmount);
            changed = true;
        }
        if (Input.isRepeated('down')) {
            newAmount = Math.max(newAmount - 100, 0);
            changed = true;
        }
        if (Input.isRepeated('right')) {
            newAmount = Math.min(newAmount + 1000, this._maxAmount);
            changed = true;
        }
        if (Input.isRepeated('left')) {
            newAmount = Math.max(newAmount - 1000, 0);
            changed = true;
        }
        
        if (changed && newAmount !== this._amount) {
            this._amount = newAmount;
            SoundManager.playCursor();
            this.refresh();
        }
    };
    
    Window_Amount.prototype.processOk = function() {
        this.deactivate();
        this.callOkHandler();
    };
    
    Window_Amount.prototype.processCancel = function() {
        this.deactivate();
        this.callCancelHandler();
    };
    
    Window_Amount.prototype.activate = function() {
        this.active = true;
        this.refresh();
    };
    
    Window_Amount.prototype.deactivate = function() {
        this.active = false;
        this.refresh();
    };
    
    Window_Amount.prototype.callOkHandler = function() {
        if (this._okHandler) {
            this._okHandler();
        }
    };
    
    Window_Amount.prototype.callCancelHandler = function() {
        if (this._cancelHandler) {
            this._cancelHandler();
        }
    };
    
    Window_Amount.prototype.setHandler = function(symbol, method) {
        if (symbol === 'ok') {
            this._okHandler = method;
        } else if (symbol === 'cancel') {
            this._cancelHandler = method;
        }
    };
    
    //=============================================================================
    // Scene_BankSystem
    //=============================================================================
    
    function Scene_BankSystem() {
        this.initialize(...arguments);
    }
    
    Scene_BankSystem.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_BankSystem.prototype.constructor = Scene_BankSystem;
    
    Scene_BankSystem.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    Scene_BankSystem.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        
        // Create status window
        const statusRect = this.statusWindowRect();
        this._statusWindow = new Window_BankStatus(statusRect);
        this.addWindow(this._statusWindow);
        
        // Create command window
        const commandRect = this.commandWindowRect();
        this._commandWindow = new Window_BankCommand(commandRect);
        this._commandWindow.setHandler("deposit", this.commandDeposit.bind(this));
        this._commandWindow.setHandler("withdraw", this.commandWithdraw.bind(this));
        this._commandWindow.setHandler("loan", this.commandLoan.bind(this));
        this._commandWindow.setHandler("repay", this.commandRepay.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
        
        // Create amount window
        const amountRect = this.amountWindowRect();
        this._amountWindow = new Window_Amount(amountRect);
        this._amountWindow.setHandler('ok', this.onAmountOk.bind(this));
        this._amountWindow.setHandler('cancel', this.onAmountCancel.bind(this));
        this.addWindow(this._amountWindow);
        this._amountWindow.hide(); // Hide the amount window initially
    };
    
    Scene_BankSystem.prototype.statusWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(6, true);
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_BankSystem.prototype.commandWindowRect = function() {
        const wx = 0;
        const wy = this._statusWindow.y + this._statusWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(5, true);
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_BankSystem.prototype.amountWindowRect = function() {
        const ww = 400;
        const wh = this.calcWindowHeight(5, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_BankSystem.prototype.commandDeposit = function() {
        const maxAmount = $gameParty.gold();
        if (maxAmount > 0) {
            this._commandWindow.deactivate();
            this._amountWindow.setMode("Deposit", maxAmount);
            this._mode = "deposit";
        } else {
            this._commandWindow.activate();
            SoundManager.playBuzzer();
            this.showMessage("You don't have any money to deposit!");
        }
    };
    
    Scene_BankSystem.prototype.commandWithdraw = function() {
        const maxAmount = $gameSystem.getBankBalance();
        if (maxAmount > 0) {
            this._commandWindow.deactivate();
            this._amountWindow.setMode("Withdraw", maxAmount);
            this._mode = "withdraw";
        } else {
            this._commandWindow.activate();
            SoundManager.playBuzzer();
            this.showMessage("You don't have any money in your bank account!");
        }
    };
    
    Scene_BankSystem.prototype.commandLoan = function() {
        if ($gameSystem.getLoanBalance() === 0) {
            this._commandWindow.deactivate();
            this._amountWindow.setMode("Loan", maxLoanAmount);
            this._mode = "loan";
        } else {
            this._commandWindow.activate(); 
            SoundManager.playBuzzer();
            this.showMessage("You already have an outstanding loan!");
        }
    };
    
    Scene_BankSystem.prototype.commandRepay = function() {
        const loanAmount = $gameSystem.getLoanBalance();
        const playerGold = $gameParty.gold();
        
        if (loanAmount > 0) {
            const maxRepay = Math.min(loanAmount, playerGold);
            if (maxRepay > 0) {
                this._commandWindow.deactivate();
                this._amountWindow.setMode("Repay", maxRepay);
                this._mode = "repay";
            } else {
                this._commandWindow.activate();
                SoundManager.playBuzzer();
                this.showMessage("You don't have any money to repay your loan!");
            }
        } else {
            this._commandWindow.activate();
            SoundManager.playBuzzer();
            this.showMessage("You don't have any outstanding loans!");
        }
    };
    
    Scene_BankSystem.prototype.onAmountOk = function() {
        const amount = this._amountWindow.amount();
        let success = false;
        
        if (amount > 0) {
            switch (this._mode) {
                case "deposit":
                    success = $gameSystem.deposit(amount);
                    break;
                case "withdraw":
                    success = $gameSystem.withdraw(amount);
                    break;
                case "loan":
                    success = $gameSystem.takeLoan(amount);
                    break;
                case "repay":
                    success = $gameSystem.repayLoan(amount);
                    break;
            }
            
            if (success) {
                SoundManager.playShop();
                // Display success message
                const actionText = {
                    deposit: "deposited",
                    withdraw: "withdrew",
                    loan: "borrowed",
                    repay: "repaid"
                }[this._mode];
                
                this.showMessage("You " + actionText + " " + amount + " G.");
            } else {
                SoundManager.playBuzzer();
            }
        }
        
        this._statusWindow.refresh();
        this._commandWindow.activate();
        this._amountWindow.hide();
    };
    
    Scene_BankSystem.prototype.onAmountCancel = function() {
        this._commandWindow.activate();
        this._amountWindow.hide();
    };
    
    Scene_BankSystem.prototype.showMessage = function(text) {
        window.skipLocalization = true;

        $gameMessage.add(text);
        window.skipLocalization = false;

        
    };

})();