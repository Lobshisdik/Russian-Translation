//=============================================================================
// MoneyFormatter.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Money Formatter v1.1.0
 * @author Omni-Lex
 * @version 1.1.0
 * @description v1.1.0 Formats money display and truncates long item names
 *
 * @help MoneyFormatter.js
 * 
 * This plugin reformats money display by adding a dot before the last two digits.
 * For example: 12345 becomes 123.45
 * 
 * Additionally, item names longer than 10 characters are truncated with "..."
 * 
 * The plugin automatically applies to all money displays in the game including:
 * - Status windows
 * - Shop windows  
 * - Item acquisition messages
 * 
 * No additional setup required - just install and activate the plugin.
 * 
 * License: Free for commercial and non-commercial use
 */

(() => {
    'use strict';

    // Function to format money with dot before last two digits
    Window_Base.prototype.drawCurrencyValue = function(value, unit, x, y, width) {
        const formattedValue = this.formatMoneyValue(value);
        const unitWidth = this.textWidth(unit);
        this.resetTextColor();
        this.drawText(formattedValue, x, y, width - unitWidth - 6, "right");
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(unit, x + width - unitWidth, y, unitWidth, "right");
    };

    // Format money value with dot before last two digits
    Window_Base.prototype.formatMoneyValue = function(value) {
        const valueStr = value.toString();
    
        // If value has 2 or fewer digits, pad with zeros and add 0.
        if (valueStr.length <= 2) {
            const result = "0." + valueStr.padStart(2, '0');
            return result.endsWith(".00") ? "0" : result;
        }
    
        // Insert dot before last two digits
        const mainPart = valueStr.slice(0, -2);
        const decimalPart = valueStr.slice(-2);
        const result = mainPart + "." + decimalPart;
        return result.endsWith(".00") ? mainPart : result;
    };

    // Truncate item names longer than 10 characters
    Window_Base.prototype.truncateItemName = function(name) {
        if (name.length > 18) {
            return name.substring(0, 18) + "...";
        }
        return name;
    };

    // Override drawItemName to truncate long names
    const _Window_Base_drawItemName = Window_Base.prototype.drawItemName;
    Window_Base.prototype.drawItemName = function(item, x, y, width) {
        if (item) {
            const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
            const textMargin = ImageManager.iconWidth + 4;
            const itemWidth = Math.max(0, width - textMargin);
            const truncatedName = this.truncateItemName(item.name);
            this.resetTextColor();
            this.drawIcon(item.iconIndex, x, iconY);
            this.drawText(truncatedName, x + textMargin, y, itemWidth);
        }
    };

    // Override Window_Gold drawValue method
    const _Window_Gold_drawValue = Window_Gold.prototype.drawValue;
    Window_Gold.prototype.drawValue = function() {
        const x = this.itemPadding();
        const y = 0;
        const width = this.innerWidth - this.itemPadding() * 2;
        const value = $gameParty ? $gameParty._gold : 0;
        const unit = $dataSystem ? $dataSystem.currencyUnit : "";
        const formattedValue = this.formatMoneyValue(value);
        const unitWidth = this.textWidth(unit);
        
        this.resetTextColor();
        this.drawText(formattedValue, x, y, width - unitWidth - 6, "right");
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(unit, x + width - unitWidth, y, unitWidth, "right");
    };

    // Override Window_ShopBuy refresh method to format prices
    const _Window_ShopBuy_drawItem = Window_ShopBuy.prototype.drawItem;
    Window_ShopBuy.prototype.drawItem = function(index) {
        const item = this.itemAt(index);
        const price = this.price(item);
        const rect = this.itemLineRect(index);
        const priceWidth = this.priceWidth();
        const nameWidth = rect.width - priceWidth;
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, nameWidth);
        const formattedPrice = this.formatMoneyValue(price);
        this.drawText(formattedPrice, rect.x + nameWidth, rect.y, priceWidth, "right");
        this.changePaintOpacity(true);
    };

    // Override Window_ShopSell refresh method to format prices
    const _Window_ShopSell_drawItem = Window_ShopSell.prototype.drawItem;
    Window_ShopSell.prototype.drawItem = function(index) {
        const item = this.itemAt(index);
        if (item) {
            const numberWidth = this.numberWidth();
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(true);
        }
    };

    // Override message display for money gain/loss
    const _Game_Message_add = Game_Message.prototype.add;
    Game_Message.prototype.add = function(text) {
        // Check if the text contains money references and format them
        const moneyRegex = /\\G\[(\d+)\]/g;
        const formattedText = text.replace(moneyRegex, (match, amount) => {
            const formattedAmount = this.formatMoneyForMessage(parseInt(amount));
            const currencyUnit = $dataSystem ? $dataSystem.currencyUnit : "";
            return formattedAmount + " " + currencyUnit;
        });
        
        _Game_Message_add.call(this, formattedText);
    };

    // Format money for message display
    Game_Message.prototype.formatMoneyForMessage = function(value) {
        const valueStr = value.toString();
        
        if (valueStr.length <= 2) {
            return "0." + valueStr.padStart(2, '0');
        }
        
        const mainPart = valueStr.slice(0, -2);
        const decimalPart = valueStr.slice(-2);
        return mainPart + "." + decimalPart;
    };

})();