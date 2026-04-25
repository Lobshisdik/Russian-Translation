// ShopSystemCompatibilityFix.js
/*:
 * @target MZ
 * @plugindesc Fixes compatibility issues between BattleSystemEnhanced and EnhancedShopDetails
 * @author Omni-Lex
 * @pluginName ShopSystemCompatibilityFix
 * 
 * @help This plugin must be placed AFTER both BattleSystemEnhanced.js 
 * and EnhancedShopDetails.js in your plugins list.
 * 
 * It resolves the error that occurs when trying to open the shop menu
 * by ensuring the setActor method is properly defined and available.
 */

(() => {
    'use strict';
    
    // Ensure prepare and setActor methods exist for Scene_Shop
    // regardless of which plugins have modified it
    
    if (!Scene_Shop.prototype.prepare) {
        Scene_Shop.prototype.prepare = function(goods, purchaseOnly) {
            this._goods = goods;
            this._purchaseOnly = purchaseOnly;
        };
    }
    
    if (!Scene_Shop.prototype.setActor) {
        Scene_Shop.prototype.setActor = function(actor) {
            if (this._actor !== actor) {
                this._actor = actor;
                if (this._goodsWindow) {
                    this._goodsWindow.refresh();
                }
            }
        };
    }
    
    // Fix for any initialization issues between plugins
    const _Scene_Shop_initialize = Scene_Shop.prototype.initialize;
    Scene_Shop.prototype.initialize = function() {
        _Scene_Shop_initialize.call(this);
        this._actor = null; // Ensure _actor is initialized
    };
    
    // Ensure compatibility with EnhancedShopDetails windows
    const _Scene_Shop_createStatusWindow = Scene_Shop.prototype.createStatusWindow;
    Scene_Shop.prototype.createStatusWindow = function() {
        _Scene_Shop_createStatusWindow.call(this);
        // Make sure the status window has refresh method
        if (!this._statusWindow.refresh) {
            this._statusWindow.refresh = function() {
                this.contents.clear();
            };
        }
    };
})();