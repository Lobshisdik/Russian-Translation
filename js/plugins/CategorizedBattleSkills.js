//=============================================================================
// CategorizedBattleSkills.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Categorized skill menus for battle and the menu scene, with fullscreen skill UI and party switching.
 * @author Omni-Lex
 * @version 2.0.0
 *
 * @help CategorizedBattleSkills.js
 *
 * Combines CategorizedBattleSkills and CustomSkillsMenuSwitcher into one plugin.
 *
 * --- BATTLE ---
 * Skills are grouped by category. Select a category first, then choose a skill.
 * Categories grey out when no usable skills exist in them.
 *
 * --- MENU (Skills scene) ---
 * Same categorized layout with icons. Categories are NEVER greyed out.
 * Individual skills grey out if the actor cannot use them.
 * Left/Right switches party members. The skill info panel replaces the status window.
 * "Basic" tab shows Basic-tagged skills. "Level Up" tab shows learnable skills by level.
 *
 * --- HOW TO USE ---
 * Add <category: CategoryName> to a skill's Note field.
 * Skills without a category tag fall into "General".
 *
 * --- CHANGE LOG ---
 * v2.0.0 - Merged CustomSkillsMenuSwitcher into CategorizedBattleSkills.
 *          Menu categories never grey out; individual skills grey if unusable.
 *          Category icons shown in menu skill list.
 * v1.6.1 - Fixed skill type filtering
 * v1.6.0 - Category descriptions in help window
 * v1.5.0 - Italian translation support
 * v1.4.0 - Cursor position memory
 * v1.3.0 - Category icons
 * v1.2.0 - Main menu Skills window + party switching
 */

(() => {
    'use strict';

    const DEFAULT_CATEGORY = "General";

    //=============================================================================
    // Category Data
    //=============================================================================

    const CATEGORY_DATA = {
        'Aeromancy': {
            name: { en: 'Aeromancy', it: 'Aeromanzia' },
            description: { en: 'Harness the power of wind and air.\nControl storms, flight, and atmospheric forces.', it: 'Sfrutta il potere del vento e dell\'aria.\nControlla tempeste, volo e forze atmosferiche.' },
            icon: 69
        },
        'AntiMagic': {
            name: { en: 'AntiMagic', it: 'Anti-Magia' },
            description: { en: 'Nullify and counter magical effects.\nDispel enchantments and resist spells.', it: 'Annulla e contrasta gli effetti magici.\nDissipa incantesimi e resisti agli incantesimi.' },
            icon: 75
        },
        'Arcanism': {
            name: { en: 'Arcanism', it: 'Arcanismo' },
            description: { en: 'Master pure arcane energy.\nChannel raw magical power.', it: 'Domina l\'energia arcana pura.\nCanalizza il potere magico grezzo.' },
            icon: 133
        },
        'AstralMagic': {
            name: { en: 'AstralMagic', it: 'Magia Astrale' },
            description: { en: 'Manipulate celestial and stellar forces.\nDraw power from the cosmos.', it: 'Manipola le forze celesti e stellari.\nTrai potere dal cosmo.' },
            icon: 87
        },
        'Basic': {
            name: { en: 'Basic', it: 'Base' },
            description: { en: 'Fundamental combat techniques.\nCore abilities for any fighter.', it: 'Tecniche di combattimento fondamentali.\nAbilità essenziali per ogni combattente.' },
            icon: 96
        },
        'Bestial': {
            name: { en: 'Bestial', it: 'Bestiale' },
            description: { en: 'Channel primal animal instincts.\nFight with savage ferocity.', it: 'Canalizza gli istinti animali primordiali.\nCombatti con ferocia selvaggia.' },
            icon: 293
        },
        'Boxing': {
            name: { en: 'Boxing', it: 'Pugilato' },
            description: { en: 'Strike with precision and speed.\nPowerful hand-to-hand combat.', it: 'Colpisci con precisione e velocità.\nCombattimento corpo a corpo potente.' },
            icon: 106
        },
        'CEO': {
            name: { en: 'CEO', it: 'CEO' },
            description: { en: 'Command with authority and influence.\nManagement and leadership skills.', it: 'Comanda con autorità e influenza.\nAbilità di gestione e leadership.' },
            icon: 248
        },
        'ChaosMagic': {
            name: { en: 'ChaosMagic', it: 'Magia del Caos' },
            description: { en: 'Wield unpredictable chaotic forces.\nEmbrace randomness and disorder.', it: 'Brandisci forze caotiche imprevedibili.\nAbbraccia casualità e disordine.' },
            icon: 75
        },
        'ChemicalArts': {
            name: { en: 'ChemicalArts', it: 'Arti Chimiche' },
            description: { en: 'Create potions and chemical reactions.\nBrew powerful concoctions.', it: 'Crea pozioni e reazioni chimiche.\nPrepara potenti miscele.' },
            icon: 180
        },
        'Chronomancy': {
            name: { en: 'Chronomancy', it: 'Cronomazia' },
            description: { en: 'Control the flow of time itself.\nManipulate past, present, and future.', it: 'Controlla il flusso del tempo stesso.\nManipola passato, presente e futuro.' },
            icon: 159
        },
        'Convokation': {
            name: { en: 'Convokation', it: 'Convocazione' },
            description: { en: 'Summon creatures and entities.\nCall forth allies from other realms.', it: 'Evoca creature ed entità.\nRichiama alleati da altri reami.' },
            icon: 79
        },
        'Cooking': {
            name: { en: 'Cooking', it: 'Cucina' },
            description: { en: 'Prepare restorative meals.\nCombine ingredients for beneficial effects.', it: 'Prepara pasti rigeneranti.\nCombina ingredienti per effetti benefici.' },
            icon: 219
        },
        'CosmicMagic': {
            name: { en: 'CosmicMagic', it: 'Magia Cosmica' },
            description: { en: 'Tap into universal energies.\nChannel the power of creation itself.', it: 'Attingi alle energie universali.\nCanalizza il potere della creazione stessa.' },
            icon: 87
        },
        'Cryomancy': {
            name: { en: 'Cryomancy', it: 'Criomanzia' },
            description: { en: 'Command ice and freezing cold.\nFreeze enemies and create ice constructs.', it: 'Comanda ghiaccio e freddo gelido.\nCongela i nemici e crea costrutti di ghiaccio.' },
            icon: 65
        },
        'VoidMagic': {
            name: { en: 'VoidMagic', it: 'Magia del Vuoto' },
            description: { en: 'Harness the power of nothingness.\nErase and consume with void energy.', it: 'Sfrutta il potere del nulla.\nCancella e consuma con energia del vuoto.' },
            icon: 241
        },
        'Divination': {
            name: { en: 'Divination', it: 'Divinazione' },
            description: { en: 'Peer into the unknown.\nReveal hidden truths and future events.', it: 'Scruta nell\'ignoto.\nRivela verità nascoste ed eventi futuri.' },
            icon: 408
        },
        'Divine': {
            name: { en: 'Divine', it: 'Divino' },
            description: { en: 'Channel the power of gods.\nBless allies with divine grace.', it: 'Canalizza il potere degli dei.\nBenedici gli alleati con grazia divina.' },
            icon: 243
        },
        'Electromancy': {
            name: { en: 'Electromancy', it: 'Elettromanzia' },
            description: { en: 'Control lightning and electricity.\nStrike with shocking speed and power.', it: 'Controlla fulmini ed elettricità.\nColpisci con velocità e potenza fulminea.' },
            icon: 66
        },
        'EnhancementMagic': {
            name: { en: 'EnhancementMagic', it: 'Magia di Potenziamento' },
            description: { en: 'Amplify abilities and strengthen allies.\nBoost power beyond normal limits.', it: 'Amplifica le abilità e rafforza gli alleati.\nAumenta il potere oltre i limiti normali.' },
            icon: 73
        },
        'Firefighting': {
            name: { en: 'Firefighting', it: 'Vigili del Fuoco' },
            description: { en: 'Rescue and protect with courage.\nBrave flames to save others.', it: 'Salva e proteggi con coraggio.\nAffronta le fiamme per salvare gli altri.' },
            icon: 347
        },
        'ForbiddenMagic': {
            name: { en: 'ForbiddenMagic', it: 'Magia Proibita' },
            description: { en: 'Wield dark and dangerous spells.\nPower that comes at a terrible cost.', it: 'Brandisci incantesimi oscuri e pericolosi.\nPotere che ha un costo terribile.' },
            icon: 191
        },
        'Geomancy': {
            name: { en: 'Geomancy', it: 'Geomanzia' },
            description: { en: 'Command earth and stone.\nShape terrain and crush with rocks.', it: 'Comanda terra e pietra.\nModella il terreno e schiaccia con le rocce.' },
            icon: 68
        },
        'HolyMagic': {
            name: { en: 'HolyMagic', it: 'Magia Sacra' },
            description: { en: 'Purify with sacred light.\nSmite evil with righteous power.', it: 'Purifica con luce sacra.\nColpisci il male con potere giusto.' },
            icon: 70
        },
        'Firearms': {
            name: { en: 'Firearms', it: 'Armi da Fuoco' },
            description: { en: 'Master modern ranged weapons.\nStrike from afar with deadly accuracy.', it: 'Domina le armi a distanza moderne.\nColpisci da lontano con precisione letale.' },
            icon: 104
        },
        'Hydromancy': {
            name: { en: 'Hydromancy', it: 'Idromanzia' },
            description: { en: 'Control water and its flows.\nCommand waves, currents, and tides.', it: 'Controlla l\'acqua e i suoi flussi.\nComanda onde, correnti e maree.' },
            icon: 67
        },
        'Idromancy': {
            name: { en: 'Idromancy', it: 'Idromanzia' },
            description: { en: 'Control water and its flows.\nCommand waves, currents, and tides.', it: 'Controlla l\'acqua e i suoi flussi.\nComanda onde, correnti e maree.' },
            icon: 67
        },
        'Journalism': {
            name: { en: 'Journalism', it: 'Giornalismo' },
            description: { en: 'Uncover and report the truth.\nInvestigate and expose secrets.', it: 'Scopri e riporta la verità.\nIndaga ed esponi i segreti.' },
            icon: 234
        },
        'LawEnforcement': {
            name: { en: 'LawEnforcement', it: 'Forze dell\'Ordine' },
            description: { en: 'Uphold justice and maintain order.\nEnforce the law with authority.', it: 'Sostieni la giustizia e mantieni l\'ordine.\nFai rispettare la legge con autorità.' },
            icon: 131
        },
        'Leadership': {
            name: { en: 'Leadership', it: 'Leadership' },
            description: { en: 'Inspire and guide your team.\nRally allies to victory.', it: 'Ispira e guida la tua squadra.\nRaduna gli alleati verso la vittoria.' },
            icon: 246
        },
        'MartialArts': {
            name: { en: 'MartialArts', it: 'Arti Marziali' },
            description: { en: 'Master disciplined combat techniques.\nStrike with precision and form.', it: 'Domina le tecniche di combattimento disciplinate.\nColpisci con precisione e forma.' },
            icon: 77
        },
        'MinorMagic': {
            name: { en: 'MinorMagic', it: 'Magia Minore' },
            description: { en: 'Cast simple but useful spells.\nBasic magical utilities.', it: 'Lancia incantesimi semplici ma utili.\nUtilità magiche di base.' },
            icon: 88
        },
        'Natural': {
            name: { en: 'Natural', it: 'Naturale' },
            description: { en: 'Commune with nature\'s forces.\nHarness the power of the wild.', it: 'Comunica con le forze della natura.\nSfrutta il potere della natura selvaggia.' },
            icon: 276
        },
        'Performance': {
            name: { en: 'Performance', it: 'Performance' },
            description: { en: 'Captivate and influence through art.\nInspire with music and expression.', it: 'Affascina e influenza attraverso l\'arte.\nIspira con musica ed espressione.' },
            icon: 199
        },
        'PlantMagic': {
            name: { en: 'PlantMagic', it: 'Magia delle Piante' },
            description: { en: 'Control plants and vegetation.\nGrow, entangle, and poison with nature.', it: 'Controlla piante e vegetazione.\nFai crescere, intrappola e avvelena con la natura.' },
            icon: 276
        },
        'PsychicAbilities': {
            name: { en: 'PsychicAbilities', it: 'Abilità Psichiche' },
            description: { en: 'Manipulate minds and emotions.\nRead thoughts and bend wills.', it: 'Manipola menti ed emozioni.\nLeggi i pensieri e piega le volontà.' },
            icon: 408
        },
        'Pyromancy': {
            name: { en: 'Pyromancy', it: 'Piromanzia' },
            description: { en: 'Command flames and heat.\nBurn enemies with searing fire.', it: 'Comanda fiamme e calore.\nBrucia i nemici con fuoco bruciante.' },
            icon: 64
        },
        'Roguery': {
            name: { en: 'Roguery', it: 'Furfanteria' },
            description: { en: 'Strike from shadows with cunning.\nDeceive, steal, and backstab.', it: 'Colpisci dalle ombre con astuzia.\nInganna, ruba e pugnala alle spalle.' },
            icon: 195
        },
        'SelfDestructive': {
            name: { en: 'SelfDestructive', it: 'Autodistruttivo' },
            description: { en: 'Sacrifice yourself for devastating power.\nRisk everything for victory.', it: 'Sacrificati per un potere devastante.\nRischia tutto per la vittoria.' },
            icon: 64
        },
        'StatusMagic': {
            name: { en: 'StatusMagic', it: 'Magia di Status' },
            description: { en: 'Alter conditions and states.\nInflict or cure various ailments.', it: 'Altera condizioni e stati.\nInfliggi o cura vari disturbi.' },
            icon: 80
        },
        'Swordsmanship': {
            name: { en: 'Swordsmanship', it: 'Arte della Spada' },
            description: { en: 'Master the way of the blade.\nStrike with refined sword techniques.', it: 'Domina la via della lama.\nColpisci con tecniche raffinate di spada.' },
            icon: 76
        },
        'Technomancy': {
            name: { en: 'Technomancy', it: 'Tecnomanzia' },
            description: { en: 'Blend magic with technology.\nControl machines through arcane means.', it: 'Unisci magia e tecnologia.\nControlla le macchine con mezzi arcani.' },
            icon: 83
        },
        'TerrorMagic': {
            name: { en: 'TerrorMagic', it: 'Magia del Terrore' },
            description: { en: 'Inspire fear and dread.\nWeaken enemies with psychological horror.', it: 'Ispira paura e terrore.\nIndebolisci i nemici con orrore psicologico.' },
            icon: 64
        },
        'Training': {
            name: { en: 'Training', it: 'Allenamento' },
            description: { en: 'Develop and improve abilities.\nGrow stronger through discipline.', it: 'Sviluppa e migliora le abilità.\nDiventa più forte attraverso la disciplina.' },
            icon: 169
        },
        'Uncategorized': {
            name: { en: 'Uncategorized', it: 'Non Categorizzato' },
            description: { en: 'Unique abilities without classification.\nSpecial techniques that defy categories.', it: 'Abilità uniche senza classificazione.\nTecniche speciali che sfuggono alle categorie.' },
            icon: 160
        },
        'UnholyMagic': {
            name: { en: 'UnholyMagic', it: 'Magia Empia' },
            description: { en: 'Channel dark unholy powers.\nCorrupt and curse with profane energy.', it: 'Canalizza poteri empi oscuri.\nCorrompi e maledici con energia profana.' },
            icon: 191
        },
        'Wrestling': {
            name: { en: 'Wrestling', it: 'Lotta' },
            description: { en: 'Grapple and overpower opponents.\nDominate through physical control.', it: 'Lotta e sopraffai gli avversari.\nDomina attraverso il controllo fisico.' },
            icon: 106
        },
        'General': {
            name: { en: 'General', it: 'Generale' },
            description: { en: 'Various abilities without specialization.\nGeneral purpose skills.', it: 'Varie abilità senza specializzazione.\nAbilità per scopi generali.' },
            icon: 160
        },
        'Favourites': {
            name: { en: 'Favourites', it: 'Preferiti' },
            description: { en: 'Your favourite skills.', it: 'Le tue abilità preferite.' },
            icon: 87
        }
    };

    const FAVOURITES_CATEGORY = "Favourites";
    const FAVOURITE_ICON = 87;

    function getActorFavourites(actorId) {
        if (!$gameSystem._favouriteSkills) $gameSystem._favouriteSkills = {};
        if (!$gameSystem._favouriteSkills[actorId]) $gameSystem._favouriteSkills[actorId] = [];
        return $gameSystem._favouriteSkills[actorId];
    }

    function isSkillFavourited(actorId, skillId) {
        return getActorFavourites(actorId).includes(skillId);
    }

    function toggleFavouriteSkill(actorId, skillId) {
        const favs = getActorFavourites(actorId);
        const idx = favs.indexOf(skillId);
        if (idx >= 0) favs.splice(idx, 1);
        else favs.push(skillId);
    }

    function getCategoryInfo(categoryName) {
        const isItalian = ConfigManager.language === 'it';
        const data = CATEGORY_DATA[categoryName];
        if (!data) return { name: categoryName, description: '', icon: 160 };
        return {
            name: isItalian ? data.name.it : data.name.en,
            description: isItalian ? data.description.it : data.description.en,
            icon: data.icon
        };
    }

    function getCategoryDisplayName(categoryName) {
        return getCategoryInfo(categoryName).name;
    }

    function getCategoryDescription(categoryName) {
        return getCategoryInfo(categoryName).description;
    }

    function getEquippedWeaponType(actor) {
        if (!actor) return null;
        const weapons = actor.weapons();
        if (weapons && weapons.length > 0 && weapons[0]) return weapons[0].wtypeId;
        return null;
    }

    function isCategoryCompatibleWithWeapon(categoryName, weaponType) {
        if (weaponType === null) {
            if (categoryName === 'Swordsmanship' || categoryName === 'Firearms') return false;
            return true;
        }
        if (categoryName === 'Swordsmanship') {
            return ![3, 5, 6, 7, 8, 9, 10, 11].includes(weaponType);
        }
        if (categoryName === 'Firearms') {
            return ![1, 2, 3, 4, 5, 6, 10, 11, 12].includes(weaponType);
        }
        return true;
    }

    //=============================================================================
    // CategorizedSkillMixin (used by Window_BattleSkill)
    //=============================================================================

    const CategorizedSkillMixin = {
        initializeCategorizedMode: function() {
            this._categoryMode = true;
            this._selectedCategory = null;
            this._lastCategoryIndex = 0;
            this._categorySkillIndexes = {};
        },

        resetCategorizedState: function(actor) {
            if (this._actor !== actor) {
                this._categoryMode = true;
                this._selectedCategory = null;
                this._lastCategoryIndex = 0;
                this._categorySkillIndexes = {};
            }
        },

        resetToCategoryMode: function() {
            this._categoryMode = true;
            this._selectedCategory = null;
        },

        maxColsCategorized: function(originalMaxCols) {
            if (this._categoryMode) return originalMaxCols.call(this);
            return 1;
        },

        makeCategorizedItemList: function() {
            if (this._categoryMode) {
                this.makeCategoryList();
            } else {
                this.makeFilteredSkillList();
            }
        },

        makeCategoryList: function() {
            if (this._actor) {
                const actorId = this._actor.actorId();
                const categoriesSet = new Set();
                let hasFavourites = false;
                for (const skill of this._actor.skills()) {
                    if (this._stypeId && skill.stypeId !== this._stypeId) continue;
                    if (isSkillFavourited(actorId, skill.id)) hasFavourites = true;
                    categoriesSet.add(skill.meta.category || DEFAULT_CATEGORY);
                }
                const categories = Array.from(categoriesSet).sort();
                if (hasFavourites) categories.unshift(FAVOURITES_CATEGORY);
                this._data = categories;
            } else {
                this._data = [];
            }
        },

        makeFilteredSkillList: function() {
            if (this._actor && this._selectedCategory) {
                const actorId = this._actor.actorId();
                this._data = this._actor.skills().filter(skill => {
                    if (this._stypeId && skill.stypeId !== this._stypeId) return false;
                    if (this._selectedCategory === FAVOURITES_CATEGORY) {
                        return isSkillFavourited(actorId, skill.id);
                    }
                    return (skill.meta.category || DEFAULT_CATEGORY) === this._selectedCategory;
                });
            } else {
                this._data = [];
            }
        },

        getCategoryIcon: function(categoryName) {
            return getCategoryInfo(categoryName).icon;
        },

        drawCategorizedItem: function(index) {
            const item = this.itemAt(index);
            if (!item) return;
            const rect = this.itemLineRect(index);
            if (this._categoryMode) {
                this.changePaintOpacity(this.hasCategoryUsableSkills(item));
                this.resetTextColor();
                this.drawIcon(this.getCategoryIcon(item), rect.x + 2, rect.y + 2);
                this.drawText(getCategoryDisplayName(item), rect.x + ImageManager.iconWidth + 4, rect.y, rect.width - ImageManager.iconWidth - 4);
            } else {
                // All skills selectable regardless of usability
                this.changePaintOpacity(true);
                const isFav = this._actor && isSkillFavourited(this._actor.actorId(), item.id);
                const favW = isFav ? ImageManager.iconWidth + 4 : 0;
                this.drawItemName(item, rect.x, rect.y, rect.width - this.costWidth() - favW);
                if (isFav) {
                    this.drawIcon(FAVOURITE_ICON, rect.x + rect.width - this.costWidth() - ImageManager.iconWidth - 2, rect.y + 2);
                }
                this.drawSkillCost(item, rect.x, rect.y, rect.width);
            }
            this.changePaintOpacity(1);
        },

        costWidth: function() {
            return this.textWidth("000");
        },

        drawSkillCost: function(skill, x, y, width) {
            if (this._actor.skillTpCost(skill) > 0) {
                this.changeTextColor(ColorManager.tpCostColor());
                this.drawText(this._actor.skillTpCost(skill), x, y, width, "right");
                this.resetTextColor();
            } else if (this._actor.skillMpCost(skill) > 0) {
                this.changeTextColor(ColorManager.mpCostColor());
                this.drawText(this._actor.skillMpCost(skill), x, y, width, "right");
                this.resetTextColor();
            }
        },

        isCategoryEnabled: function(categoryName) {
            return true;
        },

        hasCategoryUsableSkills: function(categoryName) {
            if (!this._actor) return false;
            const actorId = this._actor.actorId();
            return this._actor.skills().some(skill => {
                if (this._stypeId && skill.stypeId !== this._stypeId) return false;
                if (categoryName === FAVOURITES_CATEGORY) {
                    return isSkillFavourited(actorId, skill.id) && this._actor.canUse(skill);
                }
                if ((skill.meta.category || DEFAULT_CATEGORY) !== categoryName) return false;
                if (categoryName === 'Swordsmanship' || categoryName === 'Firearms') {
                    if (!isCategoryCompatibleWithWeapon(categoryName, getEquippedWeaponType(this._actor))) return false;
                }
                return this._actor.canUse(skill);
            });
        },

        isCategorizedItemEnabled: function(item, originalIsEnabled) {
            if (this._categoryMode) return this.isCategoryEnabled(item);
            return true; // All skills selectable; usability shown in action context menu
        },

        processCategorizedOk: function(originalProcessOk) {
            if (this._categoryMode) {
                if (this.isCurrentItemEnabled()) {
                    SoundManager.playOk();
                    this._selectedCategory = this.item();
                    this._lastCategoryIndex = this.index();
                    this._categoryMode = false;
                    this.refresh();
                    const savedIndex = this._categorySkillIndexes[this._selectedCategory];
                    if (savedIndex !== undefined && savedIndex < this.maxItems()) {
                        this.select(savedIndex);
                    } else {
                        this.select(0);
                    }
                    this.activate();
                } else {
                    this.playBuzzerSound();
                }
            } else {
                if (this._selectedCategory) {
                    this._categorySkillIndexes[this._selectedCategory] = this.index();
                }
                // Show skill action menu instead of directly confirming
                if (this.isHandled('skillaction')) {
                    SoundManager.playOk();
                    this.updateInputData();
                    this.deactivate();
                    this.callHandler('skillaction');
                } else {
                    originalProcessOk.call(this);
                }
            }
        },

        processCategorizedCancel: function(originalProcessCancel) {
            if (!this._categoryMode) {
                if (this._selectedCategory) {
                    this._categorySkillIndexes[this._selectedCategory] = this.index();
                }
                this._categoryMode = true;
                this._selectedCategory = null;
                this.refresh();
                this.select(Math.min(this._lastCategoryIndex, this.maxItems() - 1));
                this.activate();
                SoundManager.playCancel();
            } else {
                originalProcessCancel.call(this);
            }
        },

        handleCursorMove: function() {
            if (Input.isRepeated("down")) this.cursorDown(Input.isTriggered("down"));
            if (Input.isRepeated("up")) this.cursorUp(Input.isTriggered("up"));
            if (Input.isRepeated("right")) this.cursorRight(Input.isTriggered("right"));
            if (Input.isRepeated("left")) this.cursorLeft(Input.isTriggered("left"));
            if (!this.isHandled("pagedown") && Input.isRepeated("pagedown")) this.cursorPagedown();
            if (!this.isHandled("pageup") && Input.isRepeated("pageup")) this.cursorPageup();
        },

        updateCategoryHelp: function() {
            if (this._categoryMode) {
                const category = this.item();
                this.setHelpWindowText(category ? getCategoryDescription(category) : '');
            }
        }
    };

    //=============================================================================
    // Window_BattleSkill — categorized battle skill window
    // NOTE: This section must come before Window_SkillList overrides so that
    // prototype captures (maxCols, setActor, processOk, etc.) grab the base
    // RPG Maker versions, not our menu overrides.
    //=============================================================================

    const _Window_BattleSkill_initialize = Window_BattleSkill.prototype.initialize;
    Window_BattleSkill.prototype.initialize = function(rect) {
        _Window_BattleSkill_initialize.call(this, rect);
        CategorizedSkillMixin.initializeCategorizedMode.call(this);
    };

    const _Window_BattleSkill_setActor = Window_BattleSkill.prototype.setActor;
    Window_BattleSkill.prototype.setActor = function(actor) {
        CategorizedSkillMixin.resetCategorizedState.call(this, actor);
        _Window_BattleSkill_setActor.call(this, actor);
    };

    const _Window_BattleSkill_show = Window_BattleSkill.prototype.show;
    Window_BattleSkill.prototype.show = function() {
        CategorizedSkillMixin.resetToCategoryMode.call(this);
        _Window_BattleSkill_show.call(this);
        if (this._categoryMode && this._lastCategoryIndex !== undefined) {
            this.select(Math.min(this._lastCategoryIndex, this.maxItems() - 1));
        }
    };

    const _Window_BattleSkill_refresh = Window_BattleSkill.prototype.refresh;
    Window_BattleSkill.prototype.refresh = function() {
        if (!this._navigatingCategories) CategorizedSkillMixin.resetToCategoryMode.call(this);
        _Window_BattleSkill_refresh.call(this);
        if (this._categoryMode && this._lastCategoryIndex !== undefined && !this._navigatingCategories) {
            this.select(Math.min(this._lastCategoryIndex, this.maxItems() - 1));
        }
    };

    const _Window_BattleSkill_maxCols = Window_BattleSkill.prototype.maxCols;
    Window_BattleSkill.prototype.maxCols = function() {
        return CategorizedSkillMixin.maxColsCategorized.call(this, _Window_BattleSkill_maxCols);
    };

    Window_BattleSkill.prototype.makeItemList = function() {
        CategorizedSkillMixin.makeCategorizedItemList.call(this);
    };

    Window_BattleSkill.prototype.makeCategoryList = CategorizedSkillMixin.makeCategoryList;
    Window_BattleSkill.prototype.makeFilteredSkillList = CategorizedSkillMixin.makeFilteredSkillList;
    Window_BattleSkill.prototype.isCategoryEnabled = CategorizedSkillMixin.isCategoryEnabled;
    Window_BattleSkill.prototype.hasCategoryUsableSkills = CategorizedSkillMixin.hasCategoryUsableSkills;
    Window_BattleSkill.prototype.getCategoryIcon = CategorizedSkillMixin.getCategoryIcon;

    Window_BattleSkill.prototype.drawItem = function(index) {
        CategorizedSkillMixin.drawCategorizedItem.call(this, index);
    };

    const _Window_BattleSkill_isEnabled = Window_BattleSkill.prototype.isEnabled;
    Window_BattleSkill.prototype.isEnabled = function(item) {
        return CategorizedSkillMixin.isCategorizedItemEnabled.call(this, item, _Window_BattleSkill_isEnabled);
    };

    const _Window_BattleSkill_processOk = Window_BattleSkill.prototype.processOk;
    Window_BattleSkill.prototype.processOk = function() {
        this._navigatingCategories = true;
        CategorizedSkillMixin.processCategorizedOk.call(this, _Window_BattleSkill_processOk);
        this._navigatingCategories = false;
    };

    const _Window_BattleSkill_processCancel = Window_BattleSkill.prototype.processCancel;
    Window_BattleSkill.prototype.processCancel = function() {
        this._navigatingCategories = true;
        CategorizedSkillMixin.processCategorizedCancel.call(this, _Window_BattleSkill_processCancel);
        this._navigatingCategories = false;
    };

    const _Window_BattleSkill_processCursorMove = Window_BattleSkill.prototype.processCursorMove;
    Window_BattleSkill.prototype.processCursorMove = function() {
        if (this.isCursorMovable()) {
            CategorizedSkillMixin.handleCursorMove.call(this);
        }
    };

    const _Window_BattleSkill_updateHelp = Window_BattleSkill.prototype.updateHelp;
    Window_BattleSkill.prototype.updateHelp = function() {
        if (this._categoryMode) {
            CategorizedSkillMixin.updateCategoryHelp.call(this);
        } else {
            _Window_BattleSkill_updateHelp.call(this);
        }
    };

    Window_BattleSkill.prototype.setHelpWindowText = function(text) {
        if (this._helpWindow) this._helpWindow.setText(text);
    };


    //=============================================================================
    // Scene_Skill — fullscreen layout with party member switching
    //=============================================================================

    const _Scene_Skill_create = Scene_Skill.prototype.create;
    Scene_Skill.prototype.create = function() {
        _Scene_Skill_create.call(this);
        this._actorIndex = $gameParty.allMembers().indexOf(this.actor());
        if (this._actorIndex < 0) this._actorIndex = 0;
    };

    const _Scene_Skill_createStatusWindow = Scene_Skill.prototype.createStatusWindow;
    Scene_Skill.prototype.createStatusWindow = function() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_SkillInfo(rect);
        this._statusWindow.setActor(this.actor());
        this.addWindow(this._statusWindow);
    };

    const _Scene_Skill_createItemWindow = Scene_Skill.prototype.createItemWindow;
    Scene_Skill.prototype.createItemWindow = function() {
        _Scene_Skill_createItemWindow.call(this);
        if (this._statusWindow && this._itemWindow) {
            this._itemWindow.setSkillInfoWindow(this._statusWindow);
        }
        this._itemWindow.setHandler('skillaction', this.onSkillAction.bind(this));
        const ww = 220;
        const wh = this.calcWindowHeight(3, true);
        const rect = new Rectangle(Math.floor((Graphics.boxWidth - ww) / 2), Math.floor((Graphics.boxHeight - wh) / 2), ww, wh);
        this._skillActionWindow = new Window_SkillAction(rect);
        this._skillActionWindow.setHandler('ok',     this.onSkillActionOk.bind(this));
        this._skillActionWindow.setHandler('cancel', this.onSkillActionCancel.bind(this));
        this.addWindow(this._skillActionWindow);
    };

    Scene_Skill.prototype.onSkillAction = function() {
        this._skillActionWindow.setSkill(this.actor(), this._itemWindow.item());
    };

    Scene_Skill.prototype.onSkillActionOk = function() {
        const symbol = this._skillActionWindow.currentSymbol();
        if (symbol === 'use') {
            this._skillActionWindow.hide();
            this._skillActionWindow.deactivate();
            this.onItemOk();
        } else if (symbol === 'favourite') {
            const skill = this._itemWindow.item();
            if (skill) toggleFavouriteSkill(this.actor().actorId(), skill.id);
            this._skillActionWindow.hide();
            this._skillActionWindow.deactivate();
            this._itemWindow.refresh();
            this._itemWindow.activate();
        } else if (symbol === 'cancel') {
            this.onSkillActionCancel();
        }
    };

    Scene_Skill.prototype.onSkillActionCancel = function() {
        this._skillActionWindow.hide();
        this._skillActionWindow.deactivate();
        this._itemWindow.activate();
    };

    const _Scene_Skill_update = Scene_Skill.prototype.update;
    Scene_Skill.prototype.update = function() {
        _Scene_Skill_update.call(this);
        if ((this._skillTypeWindow && this._skillTypeWindow.active) ||
            (this._itemWindow && this._itemWindow.active)) {
            this.updateActorSelection();
        }
    };

    Scene_Skill.prototype.updateActorSelection = function() {
        if (Input.isTriggered('right')) {
            this.nextActor();
        } else if (Input.isTriggered('left')) {
            this.previousActor();
        }
    };

    Scene_Skill.prototype.nextActor = function() {
        const allMembers = $gameParty.allMembers();
        if (allMembers.length <= 1) return;
        this._actorIndex = (this._actorIndex + 1) % allMembers.length;
        this.changeActor();
    };

    Scene_Skill.prototype.previousActor = function() {
        const allMembers = $gameParty.allMembers();
        if (allMembers.length <= 1) return;
        this._actorIndex = (this._actorIndex - 1 + allMembers.length) % allMembers.length;
        this.changeActor();
    };

    Scene_Skill.prototype.changeActor = function() {
        const newActor = $gameParty.allMembers()[this._actorIndex];
        if (newActor && this._actor !== newActor) {
            this._actor = newActor;
            SoundManager.playCursor();
            if (this._statusWindow) this._statusWindow.setActor(this._actor);
            if (this._skillTypeWindow) {
                this._skillTypeWindow.setActor(this._actor);
                this._skillTypeWindow.refresh();
            }
            if (this._itemWindow) {
                this._itemWindow.setActor(this._actor);
                this._itemWindow.refresh();
                this._itemWindow.scrollTo(0, 0);
                this._itemWindow.select(0);
            }
        }
    };

    Scene_Skill.prototype.actor = function() {
        return this._actor;
    };

    Scene_Skill.prototype.helpAreaHeight = function() {
        return this.calcWindowHeight(2, false);
    };

    Scene_Skill.prototype.helpAreaTop = function() {
        return Graphics.boxHeight - this.helpAreaHeight();
    };

    Scene_Skill.prototype.mainAreaTop = function() {
        return 0;
    };

    Scene_Skill.prototype.mainAreaHeight = function() {
        return Graphics.boxHeight - this.helpAreaHeight();
    };

    Scene_Skill.prototype.skillTypeWindowRect = function() {
        return new Rectangle(0, 0, 240, this.calcWindowHeight(4, true));
    };

    Scene_Skill.prototype.statusWindowRect = function() {
        return new Rectangle(240, 0, Graphics.boxWidth - 240, this.calcWindowHeight(4, true));
    };

    Scene_Skill.prototype.itemWindowRect = function() {
        const wy = this.calcWindowHeight(4, true);
        return new Rectangle(0, wy, Graphics.boxWidth, this.mainAreaHeight() - wy);
    };

    //=============================================================================
    // Window_SkillType — add Basic and Level Up tabs; block left/right for actor switching
    //=============================================================================

    Window_SkillType.prototype.processCursorMove = function() {
        if (this.isCursorMovable()) {
            const lastIndex = this.index();
            if (Input.isRepeated("down")) this.cursorDown(Input.isTriggered("down"));
            if (Input.isRepeated("up")) this.cursorUp(Input.isTriggered("up"));
            // Left/Right reserved for actor switching in Scene_Skill
            if (this.index() !== lastIndex) this.playCursorSound();
        }
    };

    const _Window_SkillType_makeCommandList = Window_SkillType.prototype.makeCommandList;
    Window_SkillType.prototype.makeCommandList = function() {
        _Window_SkillType_makeCommandList.call(this);
        if (this._actor) {
            this.addCommand("Basic", "skill", true, "basic");
            const favsText = ConfigManager.language === 'it' ? "Preferiti" : "Favourites";
            this.addCommand(favsText, "skill", true, "favourites");
            const levelUpText = ConfigManager.language === 'it' ? "Avanzamento" : "Level Up";
            this.addCommand(levelUpText, "skill", true, "levelup");
        }
    };

    const _Window_SkillType_update = Window_SkillType.prototype.update;
    Window_SkillType.prototype.update = function() {
        _Window_SkillType_update.call(this);
        if (this._itemWindow) {
            this._itemWindow.setStypeId(this.currentExt());
        }
    };

    //=============================================================================
    // Window_SkillList — categorized display for menu; Basic/LevelUp tabs;
    //                    skill info panel connection; left/right blocked for actor switching
    //=============================================================================

    // --- Initialise categorized state ---

    const _Window_SkillList_initialize = Window_SkillList.prototype.initialize;
    Window_SkillList.prototype.initialize = function(rect) {
        _Window_SkillList_initialize.call(this, rect);
        this._categoryMode = true;
        this._selectedCategory = null;
        this._lastCategoryIndex = 0;
        this._categorySkillIndexes = {};
        this._skillInfoWindow = null;
    };

    // Reset categorized state when stypeId changes
    const _Window_SkillList_setStypeId = Window_SkillList.prototype.setStypeId;
    Window_SkillList.prototype.setStypeId = function(stypeId) {
        if (this._stypeId !== stypeId) {
            this._categoryMode = true;
            this._selectedCategory = null;
            this._lastCategoryIndex = 0;
        }
        _Window_SkillList_setStypeId.call(this, stypeId);
    };

    // Reset categorized state when actor changes
    const _Window_SkillList_setActor = Window_SkillList.prototype.setActor;
    Window_SkillList.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._categoryMode = true;
            this._selectedCategory = null;
            this._lastCategoryIndex = 0;
            this._categorySkillIndexes = {};
        }
        _Window_SkillList_setActor.call(this, actor);
        this.updateSkillInfo();
    };

    // --- Skill info window connection ---

    Window_SkillList.prototype.setSkillInfoWindow = function(skillInfoWindow) {
        this._skillInfoWindow = skillInfoWindow;
        this.updateSkillInfo();
    };

    Window_SkillList.prototype._isSpecialStypeId = function() {
        return this._stypeId === "levelup" || this._stypeId === "basic" || this._stypeId === "favourites";
    };

    Window_SkillList.prototype.updateSkillInfo = function() {
        if (this._skillInfoWindow) {
            const isCatMode = this._categoryMode && !this._isSpecialStypeId();
            this._skillInfoWindow.setItem(isCatMode ? null : this.item());
        }
    };

    const _Window_SkillList_update = Window_SkillList.prototype.update;
    Window_SkillList.prototype.update = function() {
        _Window_SkillList_update.call(this);
        this.updateSkillInfo();
    };

    const _Window_SkillList_select = Window_SkillList.prototype.select;
    Window_SkillList.prototype.select = function(index) {
        _Window_SkillList_select.call(this, index);
        this.updateSkillInfo();
    };

    // --- Single column ---

    Window_SkillList.prototype.maxCols = function() {
        return 1;
    };

    // --- Block left/right (Scene_Skill handles actor switching) ---

    Window_SkillList.prototype.processCursorMove = function() {
        if (this.isCursorMovable()) {
            const lastIndex = this.index();
            if (Input.isRepeated("down")) this.cursorDown(Input.isTriggered("down"));
            if (Input.isRepeated("up")) this.cursorUp(Input.isTriggered("up"));
            if (Input.isRepeated("pagedown")) this.cursorPagedown();
            if (Input.isRepeated("pageup")) this.cursorPageup();
            // Left/Right reserved for actor switching
            if (this.index() !== lastIndex) this.playCursorSound();
        }
    };

    // --- Helper: detect Basic-tagged skills ---

    Window_SkillList.prototype.isBasicSkill = function(skill) {
        if (!skill || !skill.note) return false;
        return /\<[Cc]ategory\s*:\s*Basic\>/i.test(skill.note);
    };

    // --- Item list construction ---

    Window_SkillList.prototype.makeItemList = function() {
        if (this._stypeId === "levelup") {
            this._data = this._makeLearnableSkillsList();
        } else if (this._stypeId === "basic") {
            this._data = this._makeBasicSkillsList();
        } else if (this._stypeId === "favourites") {
            this._data = this._makeFavouritesSkillsList();
        } else if (this._categoryMode) {
            this._data = this._makeCategoryListForMenu();
        } else {
            this._data = this._makeFilteredSkillsForMenu();
        }
    };

    // Build sorted category list for the menu (Basic skills excluded — they have their own tab)
    Window_SkillList.prototype._makeCategoryListForMenu = function() {
        if (!this._actor) return [];
        const categoriesSet = new Set();
        for (const skill of this._actor.skills()) {
            if (this._stypeId && skill.stypeId !== this._stypeId) continue;
            if (this.isBasicSkill(skill)) continue;
            categoriesSet.add(skill.meta.category || DEFAULT_CATEGORY);
        }
        return Array.from(categoriesSet).sort();
    };

    // Build skill list for the selected category in the menu
    Window_SkillList.prototype._makeFilteredSkillsForMenu = function() {
        if (!this._actor || !this._selectedCategory) return [];
        return this._actor.skills().filter(skill => {
            if (this._stypeId && skill.stypeId !== this._stypeId) return false;
            if (this.isBasicSkill(skill)) return false;
            return (skill.meta.category || DEFAULT_CATEGORY) === this._selectedCategory;
        });
    };

    // Skills that can be learned by level up
    Window_SkillList.prototype._makeLearnableSkillsList = function() {
        if (!this._actor) return [];
        const classData = $dataClasses[this._actor._classId];
        if (!classData || !classData.learnings) return [];
        return classData.learnings
            .map(l => ({ skill: $dataSkills[l.skillId], level: l.level, isLearned: this._actor.isLearnedSkill(l.skillId) }))
            .sort((a, b) => a.level !== b.level ? a.level - b.level : a.skill.name.localeCompare(b.skill.name));
    };

    // Skills with the Basic category tag
    Window_SkillList.prototype._makeBasicSkillsList = function() {
        if (!this._actor) return [];
        return this._actor.skills().filter(skill => this.isBasicSkill(skill));
    };

    // All favourited skills for this actor (across all stypeIds)
    Window_SkillList.prototype._makeFavouritesSkillsList = function() {
        if (!this._actor) return [];
        const actorId = this._actor.actorId();
        return this._actor.skills().filter(skill => isSkillFavourited(actorId, skill.id));
    };

    // --- item() accessor ---

    const _Window_SkillList_item = Window_SkillList.prototype.item;
    Window_SkillList.prototype.item = function() {
        if (this._stypeId === "levelup") {
            const data = this._data[this.index()];
            return data ? data.skill : null;
        }
        return _Window_SkillList_item.call(this);
    };

    // --- isEnabled ---

    const _Window_SkillList_isEnabled = Window_SkillList.prototype.isEnabled;
    Window_SkillList.prototype.isEnabled = function(item) {
        if (this._stypeId === "levelup") return false;
        if (this._stypeId === "basic") return _Window_SkillList_isEnabled.call(this, item); // basic untouched
        if (this._categoryMode) return true; // categories always enabled
        return true; // All skills selectable; context menu handles usability
    };

    // --- Drawing ---

    Window_SkillList.prototype.drawItem = function(index) {
        if (this._stypeId === "levelup") {
            this._drawLearnableSkillItem(index);
            return;
        }

        const item = this.itemAt(index);
        if (!item) return;
        const rect = this.itemLineRect(index);

        if (this._categoryMode && !this._isSpecialStypeId()) {
            // Categories: always full opacity, show icon
            this.changePaintOpacity(true);
            this.resetTextColor();
            this.drawIcon(getCategoryInfo(item).icon, rect.x + 2, rect.y + 2);
            this.drawText(getCategoryDisplayName(item), rect.x + ImageManager.iconWidth + 4, rect.y, rect.width - ImageManager.iconWidth - 4);
        } else if (this._stypeId === "basic") {
            // Basic tab: original greyed-out behaviour
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - this.costWidth());
            this.drawSkillCost(item, rect.x, rect.y, rect.width);
        } else {
            // Skills (normal & favourites tabs): always selectable, show favourite icon
            this.changePaintOpacity(true);
            const isFav = this._actor && isSkillFavourited(this._actor.actorId(), item.id);
            const favW = isFav ? ImageManager.iconWidth + 4 : 0;
            this.drawItemName(item, rect.x, rect.y, rect.width - this.costWidth() - favW);
            if (isFav) {
                this.drawIcon(FAVOURITE_ICON, rect.x + rect.width - this.costWidth() - ImageManager.iconWidth - 2, rect.y + 2);
            }
            this.drawSkillCost(item, rect.x, rect.y, rect.width);
        }
        this.changePaintOpacity(1);
    };

    Window_SkillList.prototype._drawLearnableSkillItem = function(index) {
        const entry = this._data[index];
        if (!entry || !entry.skill) return;
        const rect = this.itemLineRect(index);

        if (entry.isLearned) this.changePaintOpacity(false);

        const levelText = `Lv ${entry.level}: `;
        const levelWidth = this.textWidth(levelText);
        this.drawText(levelText, rect.x, rect.y, levelWidth);

        this.drawIcon(entry.skill.iconIndex, rect.x + levelWidth, rect.y + 2);
        const nameX = rect.x + levelWidth + ImageManager.iconWidth + 4;
        this.drawText(entry.skill.name, nameX, rect.y, rect.width - (nameX - rect.x) - 60);
        this.drawSkillCost(entry.skill, rect.x, rect.y, rect.width);

        this.changePaintOpacity(true);
    };

    // --- Process OK: enter category or use skill ---

    const _Window_SkillList_processOk = Window_SkillList.prototype.processOk;
    Window_SkillList.prototype.processOk = function() {
        if (this._stypeId === "levelup") {
            _Window_SkillList_processOk.call(this);
            return;
        }
        if (this._stypeId === "basic") {
            _Window_SkillList_processOk.call(this); // basic untouched
            return;
        }
        if (this._stypeId === "favourites") {
            // Favourites tab: show action menu
            SoundManager.playOk();
            this.updateInputData();
            this.deactivate();
            this.callHandler('skillaction');
            return;
        }
        if (this._categoryMode) {
            SoundManager.playOk();
            this._selectedCategory = this.item();
            this._lastCategoryIndex = this.index();
            this._categoryMode = false;
            this.refresh();
            const saved = this._categorySkillIndexes[this._selectedCategory];
            this.select((saved !== undefined && saved < this.maxItems()) ? saved : 0);
            this.activate();
        } else {
            if (this._selectedCategory) {
                this._categorySkillIndexes[this._selectedCategory] = this.index();
            }
            SoundManager.playOk();
            this.updateInputData();
            this.deactivate();
            this.callHandler('skillaction');
        }
    };

    // --- Process Cancel: go back to category list, or exit ---

    const _Window_SkillList_processCancel = Window_SkillList.prototype.processCancel;
    Window_SkillList.prototype.processCancel = function() {
        if (this._isSpecialStypeId()) {
            _Window_SkillList_processCancel.call(this);
            return;
        }
        if (!this._categoryMode) {
            if (this._selectedCategory) {
                this._categorySkillIndexes[this._selectedCategory] = this.index();
            }
            this._categoryMode = true;
            this._selectedCategory = null;
            this.refresh();
            this.select(Math.min(this._lastCategoryIndex, this.maxItems() - 1));
            this.activate();
            SoundManager.playCancel();
        } else {
            _Window_SkillList_processCancel.call(this);
        }
    };

    // --- Help window ---

    const _Window_SkillList_updateHelp = Window_SkillList.prototype.updateHelp;
    Window_SkillList.prototype.updateHelp = function() {
        if (this._skillInfoWindow) {
            const isCatMode = this._categoryMode && !this._isSpecialStypeId();
            this._skillInfoWindow.setItem(isCatMode ? null : this.item());
        }
        if (!this._isSpecialStypeId() && this._categoryMode) {
            const category = this.item();
            if (category && typeof category === 'string') {
                this._setHelpText(getCategoryDescription(category));
            } else {
                this._setHelpText('');
            }
        } else {
            _Window_SkillList_updateHelp.call(this);
        }
    };

    Window_SkillList.prototype._setHelpText = function(text) {
        if (this._helpWindow) this._helpWindow.setText(text);
    };

    //=============================================================================
    // Window_SkillAction — context popup: Use / Favourite / Cancel
    //=============================================================================

    function Window_SkillAction() {
        this.initialize(...arguments);
    }

    Window_SkillAction.prototype = Object.create(Window_Command.prototype);
    Window_SkillAction.prototype.constructor = Window_SkillAction;

    Window_SkillAction.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this._actor = null;
        this._skill = null;
        this.hide();
        this.deactivate();
    };

    Window_SkillAction.prototype.makeCommandList = function() {
        if (!this._actor || !this._skill) return;
        if (this._actor.canUse(this._skill)) {
            this.addCommand("Use", "use", true);
        }
        const isFav = isSkillFavourited(this._actor.actorId(), this._skill.id);
        const favLabel = isFav ? "Unfavourite" : "Favourite";
        this.addCommand(favLabel, "favourite", true);
        this.addCommand("Cancel", "cancel", true);
    };

    Window_SkillAction.prototype.setSkill = function(actor, skill) {
        this._actor = actor;
        this._skill = skill;
        this.clearCommandList();
        this.makeCommandList();
        // Resize to fit the actual number of commands
        const n = this._list.length;
        this.height = n * this.itemHeight() + $gameSystem.windowPadding() * 2;
        this.y = Math.floor((Graphics.boxHeight - this.height) / 2);
        this.createContents();
        this.select(0);
        this.refresh();
        this.show();
        this.activate();
    };

    window.Window_SkillAction = Window_SkillAction;

    //=============================================================================
    // Window_SkillInfo — replaces the status window in Scene_Skill
    //=============================================================================

    function Window_SkillInfo() {
        this.initialize(...arguments);
    }

    Window_SkillInfo.prototype = Object.create(Window_Base.prototype);
    Window_SkillInfo.prototype.constructor = Window_SkillInfo;

    Window_SkillInfo.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._actor = null;
        this._skill = null;
    };

    Window_SkillInfo.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    Window_SkillInfo.prototype.setItem = function(skill) {
        if (this._skill !== skill) {
            this._skill = skill;
            this.refresh();
        }
    };

    Window_SkillInfo.prototype.refresh = function() {
        this.contents.clear();
        if (this._skill) this.drawSkillInfo();
        this.drawPartyTabs();
    };

    const _getTranslation = function(key) {
        const it = ConfigManager.language === "it";
        const t = {
            none:    { en: 'None',       it: 'Nessuno' },
            effect:  { en: 'Effect:',    it: 'Effetto:' },
            hpDmg:   { en: 'HP Damage',  it: 'Danno HP' },
            mpDmg:   { en: 'MP Damage',  it: 'Danno MP' },
            hpHeal:  { en: 'HP Recover', it: 'Recupero HP' },
            mpHeal:  { en: 'MP Recover', it: 'Recupero MP' },
            hpDrain: { en: 'HP Drain',   it: 'Assorbi HP' },
            mpDrain: { en: 'MP Drain',   it: 'Assorbi MP' },
            buffs:   { en: 'Buffs',      it: 'Potenzia' },
            debuffs: { en: 'Debuffs',    it: 'Riduce' },
            state:   { en: 'State',      it: 'Stato' }
        }[key];
        if (!t) return key;
        return it ? t.it : t.en;
    };

    Window_SkillInfo.prototype.getSkillScale = function(skill) {
        if (!skill || !skill.damage || !skill.damage.formula) return null;
        const formula = skill.damage.formula;
        const statPatterns = {
            'a.atk':      'FOR',
            'a.mat':      'INT',
            'a.param(2)': 'FOR',
            'a.param(3)': 'COS',
            'a.param(4)': 'INT',
            'a.param(5)': 'SAG',
            'a.param(6)': 'DES',
            'a.param(7)': 'PSI'
        };
        let mainStat = null;
        let maxMultiplier = 0;
        for (const [pattern, statName] of Object.entries(statPatterns)) {
            const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const match = formula.match(new RegExp(escaped + '\\s*\\*\\s*([\\d.]+)', 'i'));
            if (match) {
                const m = parseFloat(match[1]);
                if (m > maxMultiplier) { maxMultiplier = m; mainStat = statName; }
            } else if (formula.includes(pattern) && maxMultiplier === 0) {
                mainStat = statName; maxMultiplier = 1;
            }
        }
        if (!mainStat) return null;
        let grade = 'F';
        if (maxMultiplier >= 9) grade = 'S';
        else if (maxMultiplier >= 7) grade = 'A';
        else if (maxMultiplier >= 5) grade = 'B';
        else if (maxMultiplier >= 3) grade = 'C';
        else if (maxMultiplier >= 2) grade = 'D';
        else if (maxMultiplier >= 1) grade = 'E';
        return { stat: mainStat, grade };
    };

    Window_SkillInfo.prototype.getSkillCategory = function(skill) {
        if (!skill || !skill.note) return null;
        const match = skill.note.match(/<category:\s*(\w+)>/i);
        if (!match) return null;
        return match[1].replace(/([A-Z])/g, ' $1').trim();
    };

    Window_SkillInfo.prototype.isBasicSkill = function(skill) {
        if (!skill || !skill.note) return false;
        return /\<[Cc]ategory\s*:\s*Basic\>/i.test(skill.note);
    };

    Window_SkillInfo.prototype.drawSkillInfo = function() {
        const skill = this._skill;
        const lh = this.lineHeight();
        const x = this.itemPadding();
        let y = this.itemPadding();

        const category = this.getSkillCategory(skill);
        if (category) {
            this.drawKeyValue("Type:", category, x, y);
            y += lh;
        }

        if (skill.damage.elementId > 0) {
            this.drawIcon(63 + skill.damage.elementId - 1, x, y + 2);
            this.drawText($dataSystem.elements[skill.damage.elementId] || _getTranslation('none'), x + ImageManager.iconWidth + 4, y, 150);
            y += lh;
        }

        const scaleData = this.getSkillScale(skill);
        if (scaleData) {
            const scaleText = `${scaleData.stat} (${scaleData.grade})`;
            this.drawKeyValue("Scale:", scaleText, x, y);
            if (this.isBasicSkill(skill)) {
                const basicX = x + 100 + this.textWidth(scaleText) + 20;
                this.changeTextColor(ColorManager.systemColor());
                this.drawText("Basic", basicX, y, 100);
                this.resetTextColor();
            }
            y += lh;
        }

        const damageText = this.getDamageTypeText(skill);
        if (damageText) {
            const keyWidth = 100;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(_getTranslation('effect'), x, y, keyWidth);
            this.resetTextColor();
            const maxWidth = this.contents.width - keyWidth - x * 2;
            for (const line of this.wrapText(damageText, maxWidth)) {
                this.drawText(line, x + keyWidth + 20, y, maxWidth);
                y += lh;
            }
        }
    };

    Window_SkillInfo.prototype.wrapText = function(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let current = '';
        for (const word of words) {
            const test = current ? current + ' ' + word : word;
            if (this.textWidth(test) > maxWidth && current) {
                lines.push(current);
                current = word;
            } else {
                current = test;
            }
        }
        if (current) lines.push(current);
        return lines.length > 0 ? lines : [text];
    };

    Window_SkillInfo.prototype.drawKeyValue = function(key, value, x, y) {
        const kw = 100;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(key, x, y, kw);
        this.resetTextColor();
        this.drawText(value, x + kw, y, this.contents.width - kw - x * 2);
    };

    Window_SkillInfo.prototype.getDamageTypeText = function(skill) {
        const damage = skill.damage;
        const typeMap = { 1: 'hpDmg', 2: 'mpDmg', 3: 'hpHeal', 4: 'mpHeal', 5: 'hpDrain', 6: 'mpDrain' };
        let text = typeMap[damage.type] ? _getTranslation(typeMap[damage.type]) : "";

        const buffEffects = skill.effects.filter(e => e.code === 31 || e.code === 32);
        if (buffEffects.length > 0) {
            const bt = buffEffects.map(e => `${_getTranslation(e.code === 31 ? 'buffs' : 'debuffs')} ${TextManager.param(e.dataId)}`).join(", ");
            if (text) text += ", ";
            text += bt;
        }

        const stateEffects = skill.effects.filter(e => e.code === 21 || e.code === 22);
        if (stateEffects.length > 0) {
            const st = stateEffects.map(e => { const s = $dataStates[e.dataId]; return s ? s.name : _getTranslation('state'); }).join(", ");
            if (text) text += ", ";
            text += st;
        }

        return text || _getTranslation('none');
    };

    Window_SkillInfo.prototype.drawPartyTabs = function() {
        if (!this._actor) return;
        const allMembers = $gameParty.allMembers();
        if (allMembers.length <= 1) return;
        const actorIndex = allMembers.indexOf(this._actor);
        if (actorIndex < 0) return;

        const tabWidth = 120;
        const tabHeight = 32;
        const tabSpacing = 10;
        const arrowWidth = 20;
        const total = allMembers.length === 2 ? tabWidth : (tabWidth * 2 + tabSpacing);
        const startX = this.contents.width - total - 20;
        const startY = 8;

        const prevIdx = (actorIndex - 1 + allMembers.length) % allMembers.length;
        const nextIdx = (actorIndex + 1) % allMembers.length;

        const overlayW = total + arrowWidth * 2 + 20;
        this.contents.fillRect(startX - arrowWidth - 15, startY - 8, overlayW, tabHeight + 16, 'rgba(0,0,0,0.5)');

        if (allMembers.length === 2) {
            this.drawArrow(startX - arrowWidth - 5, startY + tabHeight / 2, "left");
            this.drawTab(allMembers[prevIdx], startX, startY, tabWidth, tabHeight);
            this.drawArrow(startX + tabWidth + 5, startY + tabHeight / 2, "right");
        } else {
            const leftX = startX;
            this.drawArrow(leftX - arrowWidth - 5, startY + tabHeight / 2, "left");
            this.drawTab(allMembers[prevIdx], leftX, startY, tabWidth, tabHeight);
            const rightX = startX + tabWidth + tabSpacing;
            this.drawTab(allMembers[nextIdx], rightX, startY, tabWidth, tabHeight);
            this.drawArrow(rightX + tabWidth + 5, startY + tabHeight / 2, "right");
        }
    };

    Window_SkillInfo.prototype.drawArrow = function(x, y, direction) {
        this.changeTextColor(ColorManager.normalColor());
        this.contents.fontSize = 22;
        const arrowText = direction === "left" ? "◀" : "▶";
        this.contents.drawText(arrowText, x - 12, y - 11, 24, 22, "center");
        this.resetFontSettings();
    };

    Window_SkillInfo.prototype.drawTab = function(actor, x, y, width, height) {
        this.contents.fillRect(x, y, width, height, ColorManager.dimColor1());
        this.contents.strokeRect(x, y, width, height, ColorManager.outlineColor());
        this.contents.fontSize = 16;
        this.changeTextColor(ColorManager.normalColor());
        this.contents.drawText(actor.name(), x, y + (height - 16) / 2 - 2, width, 16, "center");
        this.resetFontSettings();
    };

    window.Window_SkillInfo = Window_SkillInfo;

})();
