/*:
 * @target MZ
 * @plugindesc News Management System v1.0.1
 * @author Omni-Lex
 * @url https://nocoldiz.itch.io/hypernet-explorer
 * @help
 * ============================================================================
 * News Management Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin manages news events and market effects for your game.
 * It can work standalone or integrate with the Real Estate System.
 * 
 * Features:
 * - Procedural news generation
 * - Real/hardcoded news events at 8AM daily
 * - Market effects on properties
 * - News history tracking
 * - Soul tendency system integration
 * - Multi-language support (English/Italian)
 * 
 * Plugin Commands:
 * - Check News History
 * - Force News Event (for testing)
 * 
 * @command checkNewsHistory
 * @text Check News History
 * @desc Shows recent market news
 * 
 * @command forceNewsEvent
 * @text Force News Event
 * @desc Forces a news event to occur (for testing)
 */

(() => {
    'use strict';

    const pluginName = 'NewsSystem';

    // Language check function
    window.NewsSystemUtils = window.NewsSystemUtils || {};

    window.NewsSystemUtils.isItalian = function () {
        return ConfigManager.language === "it";
    };

    // Get News Data
    const { News, Translations, RealNews } = window.News || { News: {}, Translations: {}, RealNews: [] };

    // Export translations for other plugins
    window.NewsSystemUtils.Translations = Translations;

    // Get translation function
    window.NewsSystemUtils.t = function (key, replacements = {}) {
        const lang = window.NewsSystemUtils.isItalian() ? 'it' : 'en';
        let text = Translations[lang][key] || Translations.en[key] || key;

        // Handle replacements
        Object.keys(replacements).forEach(placeholder => {
            text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
        });

        return text;
    };

    const t = window.NewsSystemUtils.t;

    // --- Helper Function to Parse Game Date from Variable 113 ---
    function getGameDateFromVariable() {
        const dateStr = $gameVariables.value(113) || '01 JAN 2001 12:00';
        // Format: "01 JAN 2001 12:00"
        const parts = dateStr.split(' ');
        if (parts.length < 4) {
            return { day: 1, month: 0, year: 2001, hours: 8, minutes: 0 };
        }

        const day = parseInt(parts[0]);
        const monthStr = parts[1].toUpperCase();
        const year = parseInt(parts[2]);
        const timeStr = parts[3].split(':');
        const hours = parseInt(timeStr[0]);
        const minutes = parseInt(timeStr[1]);

        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const month = months.indexOf(monthStr);

        return { day, month, year, hours, minutes };
    }

    // --- Helper Function to Convert Game Date to Milliseconds ---
    function gameDateToMilliseconds(dateObj) {
        const jsDate = new Date(dateObj.year, dateObj.month, dateObj.day, dateObj.hours, dateObj.minutes, 0);
        return jsDate.getTime();
    }

    // --- Helper Function to Get Current Game Date as JavaScript Date ---
    function getGameDateAsJSDate() {
        const gameDate = getGameDateFromVariable();
        return new Date(gameDate.year, gameDate.month, gameDate.day, gameDate.hours, gameDate.minutes, 0);
    }

    // European locations with Italian Translations
    window.NewsSystemUtils.LOCATIONS = {
        en: [
            'Paris, France', 'Rome, Italy', 'Barcelona, Spain', 'Berlin, Germany',
            'Amsterdam, Netherlands', 'Prague, Czech Republic', 'Vienna, Austria',
            'Lisbon, Portugal', 'Athens, Greece', 'Budapest, Hungary',
            'Copenhagen, Denmark', 'Stockholm, Sweden', 'Dublin, Ireland',
            'Brussels, Belgium', 'Warsaw, Poland', 'Zurich, Switzerland',
            'Edinburgh, Scotland', 'Oslo, Norway', 'Helsinki, Finland',
            'Venice, Italy', 'Nice, France', 'Munich, Germany',
            'Santorini, Greece', 'Dubrovnik, Croatia', 'Reykjavik, Iceland',
            'Malta', 'Luxembourg', 'Monaco', 'Ljubljana, Slovenia', 'Tallinn, Estonia', 'Washington, United States', 'New York, United States'
        ],
        it: [
            'Parigi, Francia', 'Roma, Italia', 'Barcellona, Spagna', 'Berlino, Germania',
            'Amsterdam, Paesi Bassi', 'Praga, Repubblica Ceca', 'Vienna, Austria',
            'Lisbona, Portogallo', 'Atene, Grecia', 'Budapest, Ungheria',
            'Copenaghen, Danimarca', 'Stoccolma, Svezia', 'Dublino, Irlanda',
            'Bruxelles, Belgio', 'Varsavia, Polonia', 'Zurigo, Svizzera',
            'Edimburgo, Scozia', 'Oslo, Norvegia', 'Helsinki, Finlandia',
            'Venezia, Italia', 'Nizza, Francia', 'Monaco, Germania',
            'Santorini, Grecia', 'Dubrovnik, Croazia', 'Reykjavik, Islanda',
            'Malta', 'Lussemburgo', 'Monaco', 'Lubiana, Slovenia', 'Tallinn, Estonia', 'Washington, Stati Uniti', 'New York, Stati Uniti'
        ]
    };

    window.NewsSystemUtils.getLocations = function () {
        return window.NewsSystemUtils.isItalian() ?
            window.NewsSystemUtils.LOCATIONS.it :
            window.NewsSystemUtils.LOCATIONS.en;
    };

    // News Manager Class
    class NewsManager {
        constructor() {
            this.newsHistory = [];
            this.activeEffects = [];
            const gameDate = getGameDateFromVariable();
            this.currentHour = gameDate.hours;
            this.lastDailyNewsCheck = null;
            this.usedRealNewsIds = new Set();
            this.newsListeners = [];
        }

        // Register a listener for news events
        registerListener(callback) {
            this.newsListeners.push(callback);
        }

        // Notify all listeners of news events
        notifyListeners(news, duration) {
            this.newsListeners.forEach(callback => {
                if (typeof callback === 'function') {
                    callback(news, duration);
                }
            });
        }

        initialize() {
            console.log('NewsManager: Initializing...');
            console.log('NewsManager: RealNews data available:', RealNews ? RealNews.length : 0, 'items');

            // First generate past real news to show historical context
            this.generatePastRealNews();

            // Then generate procedural news mixed throughout the timeline
            this.generateInitialProceduralNews();

            this.lastDailyNewsCheck = getGameDateAsJSDate();
            this.startHourlyUpdates();

            console.log('NewsManager: Initialization complete. Total news items:', this.newsHistory.length);
        }

        // Parse date from DD/MM/YYYY format
        parseDateString(dateString) {
            const [day, month, year] = dateString.split('/').map(num => parseInt(num, 10));
            return new Date(year, month - 1, day);
        }

        // Parse date and create current year version
        parseDateToCurrentYear(dateString) {
            const [day, month, year] = dateString.split('/').map(num => parseInt(num, 10));
            const currentYear = new Date().getFullYear();
            return new Date(currentYear, month - 1, day);
        }

        // Check if a date matches today
        isDateToday(dateString) {
            const [day, month] = dateString.split('/').map(num => parseInt(num, 10));
            const today = getGameDateAsJSDate();
            return today.getDate() === day && (today.getMonth() + 1) === month;
        }

        // Check if a date is from January 1st of current year to now
        isDateSinceJanuary1st(dateString) {
            const [day, month, originalYear] = dateString.split('/').map(num => parseInt(num, 10));
            const now = getGameDateAsJSDate();
            const currentYear = now.getFullYear();
            const january1st = new Date(currentYear, 0, 1); // January 1st of current year

            // Check current year date
            const currentYearDate = new Date(currentYear, month - 1, day);

            return currentYearDate >= january1st && currentYearDate <= now;
        }

        // Check if we need to process daily news
        shouldProcessDailyNews() {
            const now = getGameDateAsJSDate();

            if (!this.lastDailyNewsCheck) {
                return true;
            }

            const lastCheck = new Date(this.lastDailyNewsCheck);

            // Check if it's a new day
            if (now.getDate() !== lastCheck.getDate() ||
                now.getMonth() !== lastCheck.getMonth() ||
                now.getFullYear() !== lastCheck.getFullYear()) {
                return true;
            }

            return false;
        }

        // Check if we need to process timed news for today
        shouldProcessTimedNews() {
            if (!RealNews || !Array.isArray(RealNews)) return [];

            const now = getGameDateAsJSDate();
            const todaysNews = RealNews.filter(newsItem => {
                return this.isDateToday(newsItem.date) && !this.usedRealNewsIds.has(newsItem.title);
            });

            // Filter news that should be shown at current time
            return todaysNews.filter(newsItem => {
                if (!newsItem.time) return false;

                const [hours, minutes] = newsItem.time.split(':').map(num => parseInt(num, 10));
                const newsTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

                // Show news if current time is at or past the scheduled time
                return now >= newsTime;
            });
        }

        // Process daily hardcoded news
        processDailyNews() {
            if (!RealNews || !Array.isArray(RealNews)) {
                console.log('NewsManager: No RealNews data available for daily processing');
                return;
            }

            console.log('NewsManager: Processing daily news...');

            const todaysNews = RealNews.filter(newsItem => {
                return this.isDateToday(newsItem.date) && !this.usedRealNewsIds.has(newsItem.title);
            });

            console.log('NewsManager: Found', todaysNews.length, 'news items for today');

            // Sort today's news by time if available
            todaysNews.sort((a, b) => {
                const timeA = a.time || "08:00";
                const timeB = b.time || "08:00";
                return timeA.localeCompare(timeB);
            });

            todaysNews.forEach(newsItem => {
                this.addRealNewsItem(newsItem, false); // false = not historical
                this.usedRealNewsIds.add(newsItem.title);
            });

            this.lastDailyNewsCheck = getGameDateAsJSDate();
        }

        // Process timed news that should appear now
        processTimedNews() {
            const timedNews = this.shouldProcessTimedNews();

            if (timedNews.length > 0) {
                console.log('NewsManager: Processing', timedNews.length, 'timed news items');

                timedNews.forEach(newsItem => {
                    this.addRealNewsItem(newsItem, false); // false = not historical, show notification
                    this.usedRealNewsIds.add(newsItem.title);
                });
            }
        }

        // Add a real news item
        // Add a real news item
        addRealNewsItem(newsItem) {
            const lang = window.NewsSystemUtils.isItalian() ? 'it' : 'en';
            const title = lang === 'it' && newsItem.titleIt ? newsItem.titleIt : newsItem.title;
            const description = lang === 'it' && newsItem.desc_it ? newsItem.desc_it : newsItem.desc;

            // Priority order: explicit location key > city key > enhanced location detection
            let location;
            if (newsItem.location && newsItem.location.trim() !== '') {
                location = newsItem.location.trim();
            } else if (newsItem.city && newsItem.city.trim() !== '') {
                location = newsItem.city.trim();
            } else {
                location = window.NewsSystemUtils.LocationMatcher.determineLocation(newsItem);
            }

            const soulEffect = newsItem.soul || 0;
            let priceEffect = 1;
            let occupancyEffect = 1;

            if (soulEffect > 0) {
                priceEffect = 1 + (soulEffect * 0.02);
                occupancyEffect = 1 + (soulEffect * 0.03);
            } else if (soulEffect < 0) {
                priceEffect = 1 + (soulEffect * 0.02);
                occupancyEffect = 1 + (soulEffect * 0.03);
            }

            const news = {
                text: title,
                fullText: description,
                location: location,
                category: 'real',
                type: 'daily',
                timestamp: getGameDateAsJSDate(),
                priceEffect: priceEffect,
                occupancyEffect: occupancyEffect,
                soulTendencyModifier: soulEffect,
                isRealNews: true,
                isHistorical: false
            };

            this.newsHistory.unshift(news);
            if (this.newsHistory.length > 100) {
                this.newsHistory.pop();
            }

            this.applyNewsEffects(news, 168); // 1 week duration

            if (SceneManager._scene instanceof Scene_Map) {
                this.showNewsNotification(title);
            }
        }

        showNewsNotification(title) {
            $gameMessage.setBackground(1);
            $gameMessage.setPositionType(0);
            window.skipLocalization = true;
            $gameMessage.add(`\\c[6]===== ${t('breakingNews')} =====\\c[0]`);
            $gameMessage.add(title);
            window.skipLocalization = false;
        }

        generateInitialProceduralNews() {

            const now = getGameDateAsJSDate();
            const currentYear = now.getFullYear();
            const january1st = new Date(currentYear, 0, 1);

            // Calculate how many weeks have passed since January 1st
            const msInWeek = 7 * 24 * 60 * 60 * 1000;
            const weeksSinceJanuary = Math.floor((now - january1st) / msInWeek);
            const maxProceduralNews = Math.min(weeksSinceJanuary * 4, 50); // Max 4 per week, cap at 50


            for (let i = 0; i < maxProceduralNews; i++) {
                // Generate random timestamp between January 1st and now
                const randomTime = january1st.getTime() + Math.random() * (now.getTime() - january1st.getTime());
                const timestamp = new Date(randomTime);

                const locations = window.NewsSystemUtils.getLocations();
                const location = locations[Math.floor(Math.random() * locations.length)];
                const eventCategory = this.selectEventCategory();
                const eventType = this.selectEventType(eventCategory);
                const event = News[eventCategory][eventType];

                if (!event) {
                    console.warn('NewsManager: Could not find event for category:', eventCategory, 'type:', eventType);
                    continue;
                }

                let newsText = this.generateNewsText(event, location, eventType);

                const news = {
                    text: newsText,
                    location: location,
                    category: eventCategory,
                    type: eventType,
                    timestamp: timestamp,
                    priceEffect: event.priceEffect,
                    occupancyEffect: event.occupancyEffect,
                    isRealNews: false,
                    isHistorical: true
                };

                this.newsHistory.push(news);

                // Apply effects only if the news is recent (within last week)
                const hoursElapsed = (now - timestamp) / 3600000;
                if (hoursElapsed <= 168) { // Within last week
                    const hoursRemaining = event.duration - hoursElapsed;
                    if (hoursRemaining > 0) {
                        this.applyNewsEffects(news, hoursRemaining);
                    }
                }
            }

            // Sort all news by timestamp after adding both real and procedural news
            this.newsHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        }

        generatePastRealNews() {
            if (!RealNews || !Array.isArray(RealNews)) {
                console.log('NewsManager: No RealNews data available for past news generation');
                return;
            }

            const now = getGameDateAsJSDate();
            const currentYear = now.getFullYear();
            const january1st = new Date(currentYear, 0, 1); // January 1st of current year

            let addedCount = 0;

            // Create array of past news with proper timestamps
            const pastNewsItems = [];

            RealNews.forEach(newsItem => {
                // Parse the original date
                const [day, month, originalYear] = newsItem.date.split('/').map(num => parseInt(num, 10));

                // Create date for current year only
                const currentYearDate = new Date(currentYear, month - 1, day);

                // Check if current year date is since January 1st and not in the future
                if (currentYearDate >= january1st && currentYearDate <= now) {
                    // Create timestamp with proper time
                    let timestamp;
                    if (newsItem.time) {
                        const [hours, minutes] = newsItem.time.split(':').map(num => parseInt(num, 10));
                        timestamp = new Date(currentYearDate.getFullYear(), currentYearDate.getMonth(), currentYearDate.getDate(), hours, minutes, 0);
                    } else {
                        timestamp = new Date(currentYearDate.getFullYear(), currentYearDate.getMonth(), currentYearDate.getDate(), 8, 0, 0);
                    }

                    pastNewsItems.push({
                        newsItem: newsItem,
                        timestamp: timestamp
                    });
                }
            });

            // Sort by timestamp (chronological order)
            pastNewsItems.sort((a, b) => a.timestamp - b.timestamp);

            // Add news items in chronological order
            pastNewsItems.forEach(({ newsItem, timestamp }) => {
                const lang = window.NewsSystemUtils.isItalian() ? 'it' : 'en';
                const title = lang === 'it' && newsItem.titleIt ? newsItem.titleIt : newsItem.title;
                const description = lang === 'it' && newsItem.desc_it ? newsItem.desc_it : newsItem.desc;

                // Priority order: explicit location key > city key > enhanced location detection
                let location;
                if (newsItem.location && newsItem.location.trim() !== '') {
                    location = newsItem.location.trim();
                } else if (newsItem.city && newsItem.city.trim() !== '') {
                    location = newsItem.city.trim();
                } else {
                    location = window.NewsSystemUtils.LocationMatcher.determineLocation(newsItem);
                }

                const soulEffect = newsItem.soul || 0;
                let priceEffect = 1;
                let occupancyEffect = 1;

                if (soulEffect !== 0) {
                    priceEffect = 1 + (soulEffect * 0.02);
                    occupancyEffect = 1 + (soulEffect * 0.03);
                }

                const news = {
                    text: title,
                    fullText: description,
                    location: location,
                    category: 'real',
                    type: 'daily',
                    timestamp: timestamp,
                    priceEffect: priceEffect,
                    occupancyEffect: occupancyEffect,
                    soulTendencyModifier: soulEffect,
                    isRealNews: true,
                    isHistorical: true,
                    scheduledTime: newsItem.time || null
                };

                this.newsHistory.push(news);
                this.usedRealNewsIds.add(newsItem.title);
                addedCount++;

                // Apply effects if still within duration (1 week from event date)
                const hoursElapsed = (now - timestamp) / 3600000;
                const hoursRemaining = 168 - hoursElapsed; // 1 week duration
                if (hoursRemaining > 0) {
                    this.applyNewsEffects(news, hoursRemaining);
                }
            });
        }

        startHourlyUpdates() {
            setInterval(() => {
                const gameDate = getGameDateFromVariable();
                if (gameDate.hours !== this.currentHour) {
                    this.currentHour = gameDate.hours;
                    this.processHourlyUpdate();
                }

                // Check for timed news every minute
                this.processTimedNews();

                if (this.shouldProcessDailyNews()) {
                    this.processDailyNews();
                }
            }, 60000); // Check every minute for more precise timing
        }

        processHourlyUpdate() {
            this.activeEffects = this.activeEffects.filter(effect => {
                effect.remainingHours--;
                return effect.remainingHours > 0;
            });

            if (Math.random() < 0.3) {
                this.generateNewsEvent();
            }

            if (SceneManager._scene instanceof Scene_Map && this.newsHistory.length > 0) {
                const recentNews = this.newsHistory.filter(news => {
                    const newsTime = new Date(news.timestamp);
                    const now = getGameDateAsJSDate();
                    return (now - newsTime) < 3600000;
                });

                if (recentNews.length > 0) {
                    $gameMessage.setBackground(1);
                    $gameMessage.setPositionType(0);
                    window.skipLocalization = true;
                    $gameMessage.add(`\\c[6]===== ${t('breakingNews')} =====\\c[0]`);
                    recentNews.forEach(news => {
                        $gameMessage.add(news.text);
                    });
                    window.skipLocalization = false;
                }
            }

            this.save();
        }

        generateNewsEvent() {
            const locations = window.NewsSystemUtils.getLocations();
            const location = locations[Math.floor(Math.random() * locations.length)];
            const eventCategory = this.selectEventCategory();
            const eventType = this.selectEventType(eventCategory);
            const event = News[eventCategory][eventType];

            let newsText = this.generateNewsText(event, location, eventType);

            const news = {
                text: newsText,
                location: location,
                category: eventCategory,
                type: eventType,
                timestamp: getGameDateAsJSDate(),
                priceEffect: event.priceEffect,
                occupancyEffect: event.occupancyEffect,
                isRealNews: false
            };

            this.newsHistory.unshift(news);
            if (this.newsHistory.length > 50) {
                this.newsHistory.pop();
            }

            this.applyNewsEffects(news, event.duration);
        }

        selectEventCategory() {
            const rand = Math.random();
            if (rand < 0.35) return 'positive';
            if (rand < 0.60) return 'negative';
            if (rand < 0.75) return 'neutral';
            return 'surreal';
        }

        selectEventType(category) {
            const types = Object.keys(News[category]);
            return types[Math.floor(Math.random() * types.length)];
        }

        generateNewsText(event, location, eventType) {
            const lang = window.NewsSystemUtils.isItalian() ? 'it' : 'en';
            const templates = event.templates[lang];
            let text = templates[Math.floor(Math.random() * templates.length)];

            text = text.replace(/{location}/g, location);

            // Handle all the specific replacements
            if (text.includes('{festival}') && event.festivals) {
                const festival = event.festivals[lang][Math.floor(Math.random() * event.festivals[lang].length)];
                text = text.replace(/{festival}/g, festival);
            }

            if (text.includes('{discovery}') && event.discoveries) {
                const discovery = event.discoveries[lang][Math.floor(Math.random() * event.discoveries[lang].length)];
                text = text.replace(/{discovery}/g, discovery);
            }

            if (text.includes('{disaster}') && event.disasters) {
                const disaster = event.disasters[lang][Math.floor(Math.random() * event.disasters[lang].length)];
                text = text.replace(/{disaster}/g, disaster);
            }

            if (text.includes('{celebrity}') && event.celebrities) {
                const celebrity = event.celebrities[lang][Math.floor(Math.random() * event.celebrities[lang].length)];
                text = text.replace(/{celebrity}/g, celebrity);
            }

            if (text.includes('{phenomenon}') && event.phenomenon) {
                const phenomenon = event.phenomenon[lang][Math.floor(Math.random() * event.phenomenon[lang].length)];
                text = text.replace(/{phenomenon}/g, phenomenon);
            }

            if (text.includes('{color}') && event.colors) {
                const color = event.colors[lang][Math.floor(Math.random() * event.colors[lang].length)];
                text = text.replace(/{color}/g, color);
            }

            if (text.includes('{food}') && event.foods) {
                const food = event.foods[lang][Math.floor(Math.random() * event.foods[lang].length)];
                text = text.replace(/{food}/g, food);
            }

            if (text.includes('{action}') && event.actions) {
                const action = event.actions[lang][Math.floor(Math.random() * event.actions[lang].length)];
                text = text.replace(/{action}/g, action);
            }

            if (text.includes('{animal}') && event.animals) {
                const animal = event.animals[lang][Math.floor(Math.random() * event.animals[lang].length)];
                text = text.replace(/{animal}/g, animal);
            }

            if (text.includes('{amount}')) {
                const amount = Math.floor(Math.random() * 450) + 50;
                text = text.replace(/{amount}/g, amount);
            }

            if (text.includes('{number}')) {
                if (text.includes(window.NewsSystemUtils.isItalian() ? 'licenziamenti' : 'layoffs')) {
                    const number = (Math.floor(Math.random() * 9) + 1) * 100;
                    text = text.replace(/{number}/, number);
                } else if (text.includes(window.NewsSystemUtils.isItalian() ? 'paperelle' : 'ducks')) {
                    const number = Math.floor(Math.random() * 9000) + 1000;
                    text = text.replace(/{number}/, number);
                } else {
                    const number = Math.floor(Math.random() * 100) + 1;
                    text = text.replace(/{number}/g, number);
                }
            }

            if (text.includes('{rank}')) {
                const rank = Math.floor(Math.random() * 10) + 1;
                text = text.replace(/{rank}/g, '#' + rank);
            }

            return text;
        }

        applyNewsEffects(news, duration) {
            const effect = {
                newsId: news.timestamp,
                location: news.location,
                priceEffect: news.priceEffect,
                occupancyEffect: news.occupancyEffect,
                remainingHours: duration,
                category: news.category,
                type: news.type,
                soulTendencyModifier: news.soulTendencyModifier || 0,
                isHistorical: news.isHistorical || false
            };

            this.activeEffects.push(effect);

            // Notify listeners (like Real Estate plugin)
            this.notifyListeners(news, duration);

            // Update soul tendency if applicable
            this.updateSoulTendencyVariable();
        }

        getActiveEffectsForLocation(location) {
            return this.activeEffects.filter(effect => effect.location === location);
        }

        calculateCombinedSoulTendency() {
            let totalModifier = 0;

            this.activeEffects.forEach(effect => {
                const newsItem = this.newsHistory.find(news => news.timestamp === effect.newsId);
                const isHistorical = newsItem && newsItem.isHistorical;

                if (!isHistorical) {
                    if (effect.soulTendencyModifier) {
                        totalModifier += effect.soulTendencyModifier;
                    } else if (effect.category && effect.type && News[effect.category] && News[effect.category][effect.type]) {
                        const soulModifier = News[effect.category][effect.type].soulTendencyModifier || 0;
                        totalModifier += soulModifier;
                    }
                }
            });

            return totalModifier;
        }

        updateSoulTendencyVariable() {
            const totalModifier = this.calculateCombinedSoulTendency();
            const currentValue = $gameVariables.value(53) || 66666;

            const percentageChange = totalModifier;
            const newValue = currentValue + (currentValue * percentageChange / 100);

            $gameVariables.setValue(53, Math.round(newValue * 100) / 100);
        }

        cleanupOldNews() {
            const now = getGameDateAsJSDate();
            const currentYear = now.getFullYear();
            const january1st = new Date(currentYear, 0, 1);

            this.newsHistory = this.newsHistory.filter(news => {
                const newsTime = new Date(news.timestamp);
                return newsTime >= january1st;
            });

            this.activeEffects = this.activeEffects.filter(effect => {
                return effect.remainingHours > 0;
            });

            if (RealNews && Array.isArray(RealNews)) {
                const validNewsIds = new Set();
                RealNews.forEach(newsItem => {
                    if (this.isDateSinceJanuary1st(newsItem.date)) {
                        validNewsIds.add(newsItem.title);
                    }
                });

                this.usedRealNewsIds = new Set([...this.usedRealNewsIds].filter(id => validNewsIds.has(id)));
            }
        }

        save() {
            $gameSystem.newsSystemData = {
                newsHistory: this.newsHistory,
                activeEffects: this.activeEffects,
                currentHour: this.currentHour,
                lastDailyNewsCheck: this.lastDailyNewsCheck,
                usedRealNewsIds: Array.from(this.usedRealNewsIds)
            };
        }

        load() {
            const data = $gameSystem.newsSystemData;
            if (data) {
                // Check if we need to clear news due to year change
                const shouldClearNews = this.shouldClearNewsForYearChange(data);

                if (shouldClearNews) {
                    console.log('NewsManager: Year change detected, clearing old news data');
                    this.newsHistory = [];
                    this.activeEffects = [];
                    this.usedRealNewsIds = new Set();
                    this.lastDailyNewsCheck = null;
                    this.initialize();
                } else {
                    this.newsHistory = data.newsHistory || [];
                    this.activeEffects = data.activeEffects || [];
                    const gameDate = getGameDateFromVariable();
                    this.currentHour = data.currentHour !== undefined ? data.currentHour : gameDate.hours;
                    this.lastDailyNewsCheck = data.lastDailyNewsCheck ? new Date(data.lastDailyNewsCheck) : null;
                    this.usedRealNewsIds = new Set(data.usedRealNewsIds || []);

                    this.cleanupOldNews();

                    if (this.newsHistory.length === 0) {
                        this.initialize();
                    } else {
                        // Still generate procedural news if we have gaps
                        this.fillProceduralNewsGaps();
                    }

                    if (this.shouldProcessDailyNews()) {
                        this.processDailyNews();
                    }
                }
            } else {
                this.initialize();
            }
        }

        shouldClearNewsForYearChange(data) {
            if (!data.lastDailyNewsCheck) return false;

            const lastCheckDate = new Date(data.lastDailyNewsCheck);
            const currentDate = getGameDateAsJSDate();

            // If the year has changed, clear the news
            return lastCheckDate.getFullYear() !== currentDate.getFullYear();
        }

        fillProceduralNewsGaps() {
            const now = getGameDateAsJSDate();
            const currentYear = now.getFullYear();
            const january1st = new Date(currentYear, 0, 1);

            // Calculate how many weeks have passed and how many procedural news we should have
            const msInWeek = 7 * 24 * 60 * 60 * 1000;
            const weeksSinceJanuary = Math.floor((now - january1st) / msInWeek);
            const expectedProceduralNews = Math.min(weeksSinceJanuary * 4, 50);

            // Count existing procedural news
            const existingProceduralNews = this.newsHistory.filter(news => !news.isRealNews).length;

            const newsToAdd = Math.max(0, expectedProceduralNews - existingProceduralNews);

            for (let i = 0; i < newsToAdd; i++) {
                // Generate random timestamp between January 1st and now
                const randomTime = january1st.getTime() + Math.random() * (now.getTime() - january1st.getTime());
                const timestamp = new Date(randomTime);

                const locations = window.NewsSystemUtils.getLocations();
                const location = locations[Math.floor(Math.random() * locations.length)];
                const eventCategory = this.selectEventCategory();
                const eventType = this.selectEventType(eventCategory);
                const event = News[eventCategory][eventType];

                if (!event) {
                    continue;
                }

                let newsText = this.generateNewsText(event, location, eventType);

                const news = {
                    text: newsText,
                    location: location,
                    category: eventCategory,
                    type: eventType,
                    timestamp: timestamp,
                    priceEffect: event.priceEffect,
                    occupancyEffect: event.occupancyEffect,
                    isRealNews: false,
                    isHistorical: true
                };

                this.newsHistory.push(news);

                // Apply effects only if the news is recent (within last week)
                const hoursElapsed = (now - timestamp) / 3600000;
                if (hoursElapsed <= 168) { // Within last week
                    const hoursRemaining = event.duration - hoursElapsed;
                    if (hoursRemaining > 0) {
                        this.applyNewsEffects(news, hoursRemaining);
                    }
                }
            }

            // Sort all news by timestamp
            this.newsHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }
    }

    // Scene_NewsHistory
    // Scene_NewsHistory - Updated with modal navigation support
    class Scene_NewsHistory extends Scene_MenuBase {
        create() {
            super.create();
            this.createMonthHeaderWindow();
            this.createNewsWindow();
            this.createModalWindow();
        }

        createMonthHeaderWindow() {
            const rect = this.monthHeaderWindowRect();
            this._monthHeaderWindow = new Window_MonthHeader(rect);
            this.addWindow(this._monthHeaderWindow);
        }

        monthHeaderWindowRect() {
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(1, false);
            const wx = 0;
            const wy = this.mainAreaTop();
            return new Rectangle(wx, wy, ww, wh);
        }

        createNewsWindow() {
            const rect = this.newsWindowRect();
            this._newsWindow = new Window_NewsDetailed(rect);
            this._newsWindow.setHandler("cancel", this.popScene.bind(this));
            this._newsWindow.setHandler("ok", this.showNewsModal.bind(this));
            this._newsWindow.setHandler("pageup", this.previousMonth.bind(this));
            this._newsWindow.setHandler("pagedown", this.nextMonth.bind(this));
            this._newsWindow.setMonthHeaderWindow(this._monthHeaderWindow);
            this.addWindow(this._newsWindow);
        }

        createModalWindow() {
            const rect = this.modalWindowRect();
            this._modalWindow = new Window_NewsModal(rect);
            this._modalWindow.setHandler("cancel", this.hideNewsModal.bind(this));
            this._modalWindow.setNewsWindow(this._newsWindow); // Pass the news window reference
            this._modalWindow.hide();
            this.addWindow(this._modalWindow);
        }

        modalWindowRect() {
            const ww = Math.min(Graphics.boxWidth - 60, 800); // Increased from 600 to 800, reduced margin from 100 to 60
            const wh = Math.min(Graphics.boxHeight - 40, 700); // Increased from 650 to 700, reduced margin from 50 to 40
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2;
            return new Rectangle(wx, wy, ww, wh);
        }
        showNewsModal() {
            const newsItem = this._newsWindow.item();
            if (newsItem) {
                this._modalWindow.setNews(newsItem);
                this._modalWindow.show();
                this._modalWindow.activate();
                this._newsWindow.deactivate();
            }
        }

        hideNewsModal() {
            this._modalWindow.hide();
            this._modalWindow.deactivate();
            this._newsWindow.activate();
        }

        popScene() {
            if ($gameTemp.newsReturnScene) {
                const returnScene = $gameTemp.newsReturnScene;
                $gameTemp.newsReturnScene = null;
                $gameTemp.newsFilterLocation = null;

                if (returnScene === 'realEstate') {
                    // Return to real estate scene if available
                    if (window.Scene_RealEstate) {
                        SceneManager.goto(window.Scene_RealEstate);
                    } else {
                        super.popScene();
                    }
                } else {
                    super.popScene();
                }
            } else {
                super.popScene();
            }
        }

        newsWindowRect() {
            const monthHeaderRect = this.monthHeaderWindowRect();
            const wx = 0;
            const wy = monthHeaderRect.y + monthHeaderRect.height;
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }

        previousMonth() {
            if (this._modalWindow.visible) return;
            this._newsWindow.changeMonth(-1);
        }

        nextMonth() {
            if (this._modalWindow.visible) return;
            this._newsWindow.changeMonth(1);
        }

        start() {
            super.start();
            ensureNewsManager();

            $newsManager.updateSoulTendencyVariable();

            if ($gameTemp.newsFilterLocation) {
                this._newsWindow.setLocationFilter($gameTemp.newsFilterLocation);
            }

            this._newsWindow.activate();
            this._newsWindow.select(0);
        }

        update() {
            super.update();

            // Handle month navigation with A/D and left/right arrow keys only when modal is not visible
            if (!this._modalWindow.visible && this._newsWindow.active) {
                if (Input.isTriggered('left') || this.isKeyPressed('KeyA')) {
                    this.previousMonth();
                    SoundManager.playCursor();
                } else if (Input.isTriggered('right') || this.isKeyPressed('KeyD')) {
                    this.nextMonth();
                    SoundManager.playCursor();
                }
            }

            // Handle right mouse button to close modal
            if (this._modalWindow.visible && TouchInput.isCancelled()) {
                this.hideNewsModal();
            }
        }

        isKeyPressed(key) {
            return Input._currentState[key] && !Input._previousState[key];
        }
    }
    // Window_MonthHeader
    class Window_MonthHeader extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            const gameDate = getGameDateFromVariable();
            this._currentMonth = gameDate.month;
            this._currentYear = gameDate.year;
            this.refresh();
        }

        setCurrentMonth(month, year) {
            this._currentMonth = month;
            this._currentYear = year;
            this.refresh();
        }

        getCurrentMonth() {
            return this._currentMonth;
        }

        getCurrentYear() {
            return this._currentYear;
        }

        refresh() {
            this.contents.clear();
            this.drawMonthHeader();
        }

        drawMonthHeader() {
            const monthNames = window.NewsSystemUtils.isItalian() ? [
                'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
            ] : [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            const monthText = `${monthNames[this._currentMonth]} 2001`;
            const textWidth = this.textWidth(monthText);
            const x = (this.contentsWidth() - textWidth) / 2;
            const y = 0;

            this.changeTextColor(ColorManager.systemColor());
            this.drawText(monthText, x, y, textWidth, 'center');

            // Draw navigation arrows
            const arrowY = y;
            const leftArrowText = '◀';
            const rightArrowText = '▶';

            this.changeTextColor(ColorManager.normalColor());
            this.drawText(leftArrowText, 20, arrowY);
            this.drawText(rightArrowText, this.contentsWidth() - 40, arrowY);

            // Draw help text
            const helpText = window.NewsSystemUtils.isItalian() ?
                'A/D o ←/→: Cambia mese | W/S o ↑/↓: Naviga notizie' :
                'A/D or ←/→: Change month | W/S or ↑/↓: Navigate news';
            this.changeTextColor(ColorManager.dimColor1());
            const helpWidth = this.textWidth(helpText);
            this.drawText(helpText, (this.contentsWidth() - helpWidth) / 2, y + this.lineHeight());
        }
    }

    // Window_NewsDetailed
    // Window_NewsDetailed - Fixed version
    // Window_NewsDetailed - Fixed version
    class Window_NewsDetailed extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._data = [];
            const gameDate = getGameDateFromVariable();
            this._currentMonth = gameDate.month;
            this._currentYear = gameDate.year;
            this._monthHeaderWindow = null;
            this.refresh();
            this.select(0);
        }

        setMonthHeaderWindow(window) {
            this._monthHeaderWindow = window;
        }

        processHandling() {
            if (this.isOpenAndActive()) {
                // Handle month navigation first - don't process other inputs during these
                if (Input.isTriggered('left') || this.isKeyPressed('KeyA')) {
                    this.changeMonth(-1);
                    SoundManager.playCursor();
                    return;
                } else if (Input.isTriggered('right') || this.isKeyPressed('KeyD')) {
                    this.changeMonth(1);
                    SoundManager.playCursor();
                    return;
                }

                // Let the parent class handle standard navigation to avoid double processing
                super.processHandling();
            }
        }

        // Override cursorUp to ensure proper scrolling
        cursorUp(wrap) {
            const index = this.index();
            const maxItems = this.maxItems();

            if (maxItems > 0 && index > 0) {
                this.select(index - 1);
                this.ensureCursorVisible();
            } else if (wrap && maxItems > 0) {
                this.select(maxItems - 1);
                this.ensureCursorVisible();
            }
        }

        // Override cursorDown to ensure proper scrolling
        cursorDown(wrap) {
            const index = this.index();
            const maxItems = this.maxItems();

            if (maxItems > 0 && index < maxItems - 1) {
                this.select(index + 1);
                this.ensureCursorVisible();
            } else if (wrap && maxItems > 0) {
                this.select(0);
                this.ensureCursorVisible();
            }
        }

        ensureCursorVisible() {
            const index = this.index();
            const topRow = this.topRow();
            const maxTopRow = Math.max(0, this.maxRows() - this.maxPageRows());

            if (index < topRow) {
                // Cursor is above visible area
                this.setTopRow(index);
            } else if (index >= topRow + this.maxPageRows()) {
                // Cursor is below visible area
                this.setTopRow(Math.min(index - this.maxPageRows() + 1, maxTopRow));
            }
        }

        isKeyPressed(key) {
            return Input._currentState && Input._currentState[key] &&
                (!Input._previousState || !Input._previousState[key]);
        }

        update() {
            super.update();

            // Custom handling for W/S keys for news navigation - but don't interfere with normal scrolling
            if (this.isOpenAndActive()) {
                if (this.isKeyPressed('KeyS') && !Input.isRepeated('down')) {
                    this.cursorDown(false);
                    SoundManager.playCursor();
                } else if (this.isKeyPressed('KeyW') && !Input.isRepeated('up')) {
                    this.cursorUp(false);
                    SoundManager.playCursor();
                }
            }
        }

        changeMonth(direction) {
            const newMonth = this._currentMonth + direction;
            const currentDate = getGameDateAsJSDate();
            const january = new Date(this._currentYear, 0, 1);

            if (newMonth < 0) {
                this._currentMonth = 11;
                this._currentYear--;
                // Don't go before January of current year
                if (this._currentYear < currentDate.getFullYear()) {
                    this._currentYear = currentDate.getFullYear();
                    this._currentMonth = 0;
                }
            } else if (newMonth > 11) {
                this._currentMonth = 0;
                this._currentYear++;
                // Don't go beyond current date
                if (this._currentYear > currentDate.getFullYear()) {
                    this._currentYear = currentDate.getFullYear();
                    this._currentMonth = currentDate.getMonth();
                }
            } else {
                this._currentMonth = newMonth;
                // Don't go beyond current month
                if (this._currentYear === currentDate.getFullYear() &&
                    this._currentMonth > currentDate.getMonth()) {
                    this._currentMonth = currentDate.getMonth();
                }
            }

            if (this._monthHeaderWindow) {
                this._monthHeaderWindow.setCurrentMonth(this._currentMonth, this._currentYear);
            }

            this.refresh();
            this.select(0);
        }

        maxItems() {
            return this._data ? this._data.length : 0;
        }

        setLocationFilter(location) {
            this._locationFilter = location;
            this.refresh();
            this.select(0);
        }

        item() {
            return this.maxItems() > 0 ? this._data[this.index()] : null;
        }

        makeItemList() {
            ensureNewsManager();
            const allNews = $newsManager ? $newsManager.newsHistory : [];

            // Filter news by current month and year
            const monthNews = allNews.filter(news => {
                const newsDate = new Date(news.timestamp);
                return newsDate.getMonth() === this._currentMonth &&
                    newsDate.getFullYear() === this._currentYear;
            });

            if (this._locationFilter) {
                this._data = monthNews.filter(news => news.location === this._locationFilter);
            } else {
                this._data = monthNews;
            }

            // Sort by timestamp (most recent first), but if same day, sort by time
            this._data.sort((a, b) => {
                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);

                // If same day, sort by actual time
                if (dateA.toDateString() === dateB.toDateString()) {
                    return dateB.getTime() - dateA.getTime(); // Later times first
                }

                // Otherwise sort by date
                return dateB - dateA;
            });
        }

        drawItem(index) {
            const news = this._data[index];
            if (news) {
                const rect = this.itemLineRect(index);
                const newsDate = new Date(news.timestamp);
                const timeDiff = getGameDateAsJSDate() - newsDate;
                const hoursAgo = Math.floor(timeDiff / 3600000);

                // Format time display
                let timeText;
                if (news.scheduledTime) {
                    // Show scheduled time for real news
                    timeText = news.scheduledTime;
                } else if (hoursAgo === 0) {
                    timeText = t('justNow');
                } else if (hoursAgo < 24) {
                    timeText = `${hoursAgo}${t('hoursAgo')}`;
                } else {
                    timeText = `${Math.floor(hoursAgo / 24)}${t('daysAgo')}`;
                }

                this.changeTextColor(ColorManager.systemColor());
                this.drawText(timeText, rect.x, rect.y, 100);

                if (news.isRealNews) {
                    this.changeTextColor(ColorManager.textColor(6));
                } else if (news.category === 'positive') {
                    this.changeTextColor(ColorManager.powerUpColor());
                } else if (news.category === 'negative') {
                    this.changeTextColor(ColorManager.deathColor());
                } else if (news.category === 'surreal') {
                    this.changeTextColor(ColorManager.textColor(23));
                } else {
                    this.resetTextColor();
                }

                // Only show headline, not full description
                let headlineText = news.text;
                const maxChars = 50; // Increased since we're not showing description
                if (headlineText.length > maxChars) {
                    headlineText = headlineText.substring(0, maxChars) + "...";
                }
                const headlineX = rect.x + 110;
                const headlineWidth = rect.width - 110;
                this.drawText(headlineText, headlineX, rect.y, headlineWidth);
            }
        }

        refresh() {
            this.makeItemList();
            super.refresh();
        }
    }
    // New Window_NewsModal class - add this to your plugin
    // Window_NewsModal - Fixed version with navigation and scrolling
    class Window_NewsModal extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._newsItem = null;
            this._newsWindow = null;
            this._textScrollY = 0;
            this._maxScrollY = 0;
            this.createContents();
        }

        setNews(newsItem) {
            this._newsItem = newsItem;
            this._textScrollY = 0;
            this._maxScrollY = 0;
            this.refresh();
        }

        setNewsWindow(newsWindow) {
            this._newsWindow = newsWindow;
        }

        refresh() {
            this.contents.clear();
            if (this._newsItem) {
                this.drawNewsContent();
            }
        }

        // Helper function to check if location was properly identified
        isLocationIdentified(location) {
            if (!location) return false;

            // If the location came from the news item's location key, always show it
            if (this._newsItem && this._newsItem.location === location) {
                return true;
            }

            // Check if location is one of the valid locations from our lists
            const allLocations = [
                ...window.NewsSystemUtils.LOCATIONS.en,
                ...window.NewsSystemUtils.LOCATIONS.it
            ];

            // Also check special locations from LocationMatcher
            const specialLocations = window.NewsSystemUtils.isItalian() ? [
                'Città del Vaticano',
                'Mosca, URSS',
                'Londra, Britannia',
                'Pechino, Cina',
                'Tokyo, Giappone',
                'Gerusalemme, Israele',
                'Gaza, Palestina',
                'Teheran, Persia',
                'Baghdad, Iraq',
                'Damasco, Siria',
                'Riyadh, Arabia Saudita',
                'Il Cairo, Egitto',
                'Istanbul, Turchia',
                'Beirut, Libano',
                'Amman, Giordania',
                'Kuwait City, Kuwait',
                'Doha, Qatar',
                'Abu Dhabi, Emirati',
                'Belgrado, URSS',
                'Zagabria, URSS',
                'Sarajevo, URSS',
                'Skopje, URSS',
                'Pristina, URSS',
                'Podgorica, URSS',
                'Tirana, URSS',
                'Sofia, URSS',
                'Bucarest, URSS'
            ] : [
                'Vatican City',
                'Moscow, USSR',
                'London, Britannia',
                'Beijing, China',
                'Tokyo, Japan',
                'Jerusalem, Israel',
                'Gaza, Palestine',
                'Tehran, Persia',
                'Baghdad, Iraq',
                'Damascus, Syria',
                'Riyadh, Saudi Arabia',
                'Cairo, Egypt',
                'Istanbul, Turkey',
                'Beirut, Lebanon',
                'Amman, Jordan',
                'Kuwait City, Kuwait',
                'Doha, Qatar',
                'Abu Dhabi, UAE',
                'Belgrade, USSR',
                'Zagreb, USSR',
                'Sarajevo, USSR',
                'Skopje, USSR',
                'Pristina, USSR',
                'Podgorica, USSR',
                'Tirana, USSR',
                'Sofia, USSR',
                'Bucharest, USSR'
            ];

            const validLocations = [...allLocations, ...specialLocations];
            return validLocations.includes(location);
        }

        drawNewsContent() {
            const newsItem = this._newsItem;
            const padding = 10;
            let y = padding - this._textScrollY;
            let totalContentHeight = padding;

            // Draw timestamp
            const newsDate = new Date(newsItem.timestamp);
            const dateString = newsDate.toLocaleDateString().replace(newsDate.getFullYear(), '2001');
            const dateText = dateString + ' ' + (newsItem.scheduledTime || newsDate.toLocaleTimeString());

            if (y >= -this.lineHeight() && y < this.contentsHeight()) {
                this.changeTextColor(ColorManager.textColor(3));
                this.drawText(dateText, padding, Math.max(0, y), this.contentsWidth() - padding * 2);
            }
            y += this.lineHeight() + 5;
            totalContentHeight += this.lineHeight() + 5;

            // Draw location only if properly identified
            if (this.isLocationIdentified(newsItem.location)) {
                if (y >= -this.lineHeight() && y < this.contentsHeight()) {
                    this.changeTextColor(ColorManager.textColor(1));
                    this.drawText(newsItem.location, padding, Math.max(0, y), this.contentsWidth() - padding * 2);
                }
                y += this.lineHeight() + 15;
                totalContentHeight += this.lineHeight() + 15;
            } else {
                // Skip location display and just add some spacing
                y += 10;
                totalContentHeight += 10;
            }

            // Draw news content
            if (newsItem.isRealNews) {
                this.changeTextColor(ColorManager.textColor(6));
            } else if (newsItem.category === 'positive') {
                this.changeTextColor(ColorManager.powerUpColor());
            } else if (newsItem.category === 'negative') {
                this.changeTextColor(ColorManager.deathColor());
            } else if (newsItem.category === 'surreal') {
                this.changeTextColor(ColorManager.textColor(23));
            } else {
                this.resetTextColor();
            }

            const contentText = newsItem.fullText || newsItem.text;
            const wrappedText = this.wordWrapText(contentText);
            const lines = wrappedText.split('\n');

            for (const line of lines) {
                if (y >= -this.lineHeight() && y < this.contentsHeight()) {
                    this.drawText(line, padding, Math.max(0, y), this.contentsWidth() - padding * 2);
                }
                y += this.lineHeight();
                totalContentHeight += this.lineHeight();
            }

            // Calculate max scroll
            this._maxScrollY = Math.max(0, totalContentHeight - this.contentsHeight() + padding);

            // Draw navigation hints at the bottom
            const hintY = this.contentsHeight() - this.lineHeight() - 5;
            this.changeTextColor(ColorManager.dimColor1());
            const hintText = window.NewsSystemUtils.isItalian() ?
                '← →: Altra notizia | ↑ ↓: Scorri testo | ESC: Chiudi' :
                '← →: Other news | ↑ ↓: Scroll text | ESC: Close';
            const hintWidth = this.textWidth(hintText);
            const hintX = (this.contentsWidth() - hintWidth) / 2;

            // Draw background for hint text
            this.contents.fillRect(0, hintY - 2, this.contentsWidth(), this.lineHeight() + 4, ColorManager.dimColor2());
            this.drawText(hintText, hintX, hintY, hintWidth);
        }

        wordWrapText(text) {
            if (!text) return "";

            const maxLineWidth = this.contentsWidth() - 20; // Account for padding
            const words = text.split(' ');
            let currentLine = '';
            let result = '';

            for (const word of words) {
                const testLine = currentLine.length > 0 ? currentLine + ' ' + word : word;
                if (this.textWidth(testLine) > maxLineWidth && currentLine.length > 0) {
                    result += currentLine + '\n';
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            result += currentLine;
            return result;
        }

        processHandling() {
            if (this.isOpenAndActive()) {
                if (Input.isTriggered('cancel') || Input.isTriggered('escape')) {
                    this.processCancel();
                } else if (Input.isTriggered('up')) {
                    this.navigateNews(-1);
                    SoundManager.playCursor();
                } else if (Input.isTriggered('down')) {
                    this.navigateNews(1);
                    SoundManager.playCursor();
                }
            }
        }

        navigateNews(direction) {
            if (!this._newsWindow) return;

            const currentIndex = this._newsWindow.index();
            const maxItems = this._newsWindow.maxItems();

            if (maxItems === 0) return;

            let newIndex;
            if (direction > 0) {
                // Navigate to next news (right arrow)
                newIndex = currentIndex < maxItems - 1 ? currentIndex + 1 : 0;
            } else {
                // Navigate to previous news (left arrow)
                newIndex = currentIndex > 0 ? currentIndex - 1 : maxItems - 1;
            }

            // Update the news window selection
            this._newsWindow.select(newIndex);
            this._newsWindow.ensureCursorVisible();

            // Get the new news item and display it
            const newNewsItem = this._newsWindow.item();
            if (newNewsItem) {
                this.setNews(newNewsItem);
            }
        }

        scrollText(direction) {
            if (this._maxScrollY === 0) return;

            const scrollAmount = this.lineHeight();
            const oldScrollY = this._textScrollY;

            if (direction > 0) {
                // Scroll down
                this._textScrollY = Math.min(this._maxScrollY, this._textScrollY + scrollAmount);
            } else {
                // Scroll up
                this._textScrollY = Math.max(0, this._textScrollY - scrollAmount);
            }

            // Only refresh if scroll position actually changed
            if (this._textScrollY !== oldScrollY) {
                this.refresh();
            }
        }
    }


    window.NewsSystemUtils.LocationMatcher = {
        // Comprehensive location mapping with variations and translations
        locationVariations: {
            en: {
                // European locations
                'Paris, France': ['paris', 'france', 'french capital', 'city of light'],
                'Rome, Italy': ['rome', 'roma', 'italy', 'italia', 'eternal city', 'italian capital'],
                'Barcelona, Spain': ['barcelona', 'spain', 'catalunya', 'catalonia', 'spanish'],
                'Berlin, Germany': ['berlin', 'germany', 'deutschland', 'german capital'],
                'Amsterdam, Netherlands': ['amsterdam', 'netherlands', 'holland', 'dutch'],
                'Prague, Czech Republic': ['prague', 'praha', 'czech republic', 'czechia'],
                'Vienna, Austria': ['vienna', 'wien', 'austria', 'austrian'],
                'Lisbon, Portugal': ['lisbon', 'lisboa', 'portugal', 'portuguese'],
                'Athens, Greece': ['athens', 'athina', 'greece', 'greek', 'hellenic'],
                'Budapest, Hungary': ['budapest', 'hungary', 'hungarian'],
                'Copenhagen, Denmark': ['copenhagen', 'kobenhavn', 'denmark', 'danish'],
                'Stockholm, Sweden': ['stockholm', 'sweden', 'swedish'],
                'Dublin, Ireland': ['dublin', 'ireland', 'irish'],
                'Brussels, Belgium': ['brussels', 'bruxelles', 'belgium', 'belgian'],
                'Warsaw, Poland': ['warsaw', 'warszawa', 'poland', 'polish'],
                'Zurich, Switzerland': ['zurich', 'schweiz', 'switzerland', 'swiss'],
                'Edinburgh, Scotland': ['edinburgh', 'scotland', 'scottish'],
                'Oslo, Norway': ['oslo', 'norway', 'norwegian'],
                'Helsinki, Finland': ['helsinki', 'finland', 'finnish'],
                'Venice, Italy': ['venice', 'venezia', 'italy', 'italia'],
                'Nice, France': ['nice', 'france', 'french riviera', 'cote d\'azur'],
                'Munich, Germany': ['munich', 'munchen', 'germany', 'bavaria', 'bavarian'],
                'Santorini, Greece': ['santorini', 'greece', 'greek islands', 'cyclades'],
                'Dubrovnik, Croatia': ['dubrovnik', 'croatia', 'croatian', 'adriatic'],
                'Reykjavik, Iceland': ['reykjavik', 'iceland', 'icelandic'],
                'Malta': ['malta', 'maltese', 'valletta'],
                'Luxembourg': ['luxembourg', 'luxembourgish'],
                'Monaco': ['monaco', 'monte carlo', 'monegasque'],
                'Ljubljana, Slovenia': ['ljubljana', 'slovenia', 'slovenian'],
                'Tallinn, Estonia': ['tallinn', 'estonia', 'estonian'],

                // Special locations
                'Vatican City': ['vatican', 'vatican city', 'holy see', 'pope', 'papal', 'pontiff', 'bishop of rome', 'catholic church'],
                'New York, USA': ['new york', 'manhattan', 'nyc', 'united nations', 'un headquarters', 'onu', 'big apple'],

                // Major world powers (renamed)
                'Washington, USA': ['washington', 'usa', 'united states', 'america', 'american', 'white house', 'pentagon', 'capitol'],
                'Moscow, USSR': ['moscow', 'russia', 'russian', 'ussr', 'soviet union', 'kremlin', 'red square'],
                'London, Britannia': ['london', 'britain', 'british', 'britannia', 'england', 'uk', 'united kingdom', 'westminster', 'downing street'],

                // Asian powers
                'Beijing, China': ['beijing', 'china', 'chinese', 'shanghai', 'hong kong', 'tiananmen', 'forbidden city'],
                'Tokyo, Japan': ['tokyo', 'japan', 'japanese', 'osaka', 'kyoto', 'mount fuji', 'nippon'],

                // Middle East
                'Jerusalem, Israel': ['jerusalem', 'israel', 'israeli', 'tel aviv'],
                'Gaza, Palestine': ['haifa', 'gaza', 'west bank'],
                'Tehran, Persia': ['tehran', 'iran', 'iranian', 'persia', 'persian', 'isfahan', 'shiraz'],
                'Baghdad, Iraq': ['baghdad', 'iraq', 'iraqi', 'mesopotamia', 'basra', 'kurdistan'],
                'Damascus, Syria': ['damascus', 'syria', 'syrian', 'aleppo', 'levant'],
                'Riyadh, Saudi Arabia': ['riyadh', 'saudi arabia', 'saudi', 'mecca', 'medina', 'jeddah'],
                'Cairo, Egypt': ['cairo', 'egypt', 'egyptian', 'alexandria', 'nile', 'giza'],
                'Istanbul, Turkey': ['istanbul', 'turkey', 'turkish', 'ankara', 'constantinople', 'bosphorus'],
                'Beirut, Lebanon': ['beirut', 'lebanon', 'lebanese', 'tripoli', 'cedar'],
                'Amman, Jordan': ['amman', 'jordan', 'jordanian', 'petra', 'dead sea'],
                'Kuwait City, Kuwait': ['kuwait', 'kuwaiti', 'kuwait city'],
                'Doha, Qatar': ['doha', 'qatar', 'qatari'],
                'Abu Dhabi, UAE': ['abu dhabi', 'dubai', 'uae', 'emirates', 'emirati'],

                // Balkans (under USSR influence)
                'Belgrade, USSR': ['belgrade', 'serbia', 'serbian', 'yugoslavia', 'yugoslav'],
                'Zagreb, USSR': ['zagreb', 'croatia', 'croatian'],
                'Sarajevo, USSR': ['sarajevo', 'bosnia', 'bosnian', 'herzegovina'],
                'Skopje, USSR': ['skopje', 'macedonia', 'macedonian', 'north macedonia'],
                'Pristina, USSR': ['pristina', 'kosovo', 'kosovar'],
                'Podgorica, USSR': ['podgorica', 'montenegro', 'montenegrin'],
                'Tirana, USSR': ['tirana', 'albania', 'albanian'],
                'Sofia, USSR': ['sofia', 'bulgaria', 'bulgarian'],
                'Bucharest, USSR': ['bucharest', 'romania', 'romanian'],
                // Additional Middle Eastern countries
                'Manama, Bahrain': ['manama', 'bahrain', 'bahraini'],
                'Muscat, Oman': ['muscat', 'oman', 'omani'],
                'Sanaa, Yemen': ['sanaa', 'yemen', 'yemeni', 'aden'],
                'Yerevan, Armenia': ['yerevan', 'armenia', 'armenian'],
                'Baku, Azerbaijan': ['baku', 'azerbaijan', 'azerbaijani'],
                'Tbilisi, Georgia': ['tbilisi', 'georgia', 'georgian'],
                'Nicosia, Cyprus': ['nicosia', 'cyprus', 'cypriot'],

                // Africa - North
                'Tripoli, Libya': ['tripoli', 'libya', 'libyan', 'benghazi'],
                'Algiers, Algeria': ['algiers', 'algeria', 'algerian'],
                'Tunis, Tunisia': ['tunis', 'tunisia', 'tunisian'],
                'Rabat, Morocco': ['rabat', 'morocco', 'moroccan', 'casablanca', 'marrakech'],
                'Khartoum, Sudan': ['khartoum', 'sudan', 'sudanese'],
                'Juba, South Sudan': ['juba', 'south sudan', 'south sudanese'],

                // Africa - West
                'Dakar, Senegal': ['dakar', 'senegal', 'senegalese'],
                'Bamako, Mali': ['bamako', 'mali', 'malian'],
                'Ouagadougou, Burkina Faso': ['ouagadougou', 'burkina faso', 'burkinabe'],
                'Niamey, Niger': ['niamey', 'niger', 'nigerien'],
                'Abuja, Nigeria': ['abuja', 'nigeria', 'nigerian', 'lagos'],
                'Accra, Ghana': ['accra', 'ghana', 'ghanaian'],
                'Lome, Togo': ['lome', 'togo', 'togolese'],
                'Porto-Novo, Benin': ['porto novo', 'benin', 'beninese'],
                'Abidjan, Ivory Coast': ['abidjan', 'ivory coast', 'cote d ivoire', 'ivorian'],
                'Monrovia, Liberia': ['monrovia', 'liberia', 'liberian'],
                'Freetown, Sierra Leone': ['freetown', 'sierra leone'],
                'Conakry, Guinea': ['conakry', 'guinea', 'guinean'],
                'Bissau, Guinea-Bissau': ['bissau', 'guinea bissau'],
                'Praia, Cape Verde': ['praia', 'cape verde', 'cabo verde'],
                'Banjul, Gambia': ['banjul', 'gambia', 'gambian'],

                // Africa - Central
                'Yaounde, Cameroon': ['yaounde', 'cameroon', 'cameroonian'],
                'Bangui, Central African Republic': ['bangui', 'central african republic', 'car'],
                'Ndjamena, Chad': ['ndjamena', 'chad', 'chadian'],
                'Kinshasa, Democratic Republic of Congo': ['kinshasa', 'democratic republic of congo', 'drc', 'congo kinshasa'],
                'Brazzaville, Republic of Congo': ['brazzaville', 'republic of congo', 'congo brazzaville'],
                'Libreville, Gabon': ['libreville', 'gabon', 'gabonese'],
                'Malabo, Equatorial Guinea': ['malabo', 'equatorial guinea'],
                'Sao Tome, Sao Tome and Principe': ['sao tome', 'sao tome and principe'],

                // Africa - East
                'Addis Ababa, Ethiopia': ['addis ababa', 'ethiopia', 'ethiopian'],
                'Asmara, Eritrea': ['asmara', 'eritrea', 'eritrean'],
                'Djibouti': ['djibouti', 'djiboutian'],
                'Mogadishu, Somalia': ['mogadishu', 'somalia', 'somali'],
                'Nairobi, Kenya': ['nairobi', 'kenya', 'kenyan', 'mombasa'],
                'Kampala, Uganda': ['kampala', 'uganda', 'ugandan'],
                'Kigali, Rwanda': ['kigali', 'rwanda', 'rwandan'],
                'Bujumbura, Burundi': ['bujumbura', 'burundi', 'burundian'],
                'Dodoma, Tanzania': ['dodoma', 'tanzania', 'tanzanian', 'dar es salaam'],
                'Antananarivo, Madagascar': ['antananarivo', 'madagascar', 'malagasy'],
                'Port Louis, Mauritius': ['port louis', 'mauritius', 'mauritian'],
                'Victoria, Seychelles': ['victoria', 'seychelles'],
                'Moroni, Comoros': ['moroni', 'comoros', 'comorian'],

                // Africa - Southern
                'Luanda, Angola': ['luanda', 'angola', 'angolan'],
                'Lusaka, Zambia': ['lusaka', 'zambia', 'zambian'],
                'Harare, Zimbabwe': ['harare', 'zimbabwe', 'zimbabwean'],
                'Gaborone, Botswana': ['gaborone', 'botswana', 'batswana'],
                'Windhoek, Namibia': ['windhoek', 'namibia', 'namibian'],
                'Cape Town, South Africa': ['cape town', 'south africa', 'south african', 'johannesburg', 'pretoria'],
                'Maseru, Lesotho': ['maseru', 'lesotho'],
                'Mbabane, Eswatini': ['mbabane', 'eswatini', 'swaziland'],
                'Maputo, Mozambique': ['maputo', 'mozambique', 'mozambican'],
                'Lilongwe, Malawi': ['lilongwe', 'malawi', 'malawian'],

                // North America
                'Ottawa, Canada': ['ottawa', 'canada', 'canadian', 'toronto', 'vancouver', 'montreal'],
                'Mexico City, Mexico': ['mexico city', 'mexico', 'mexican', 'guadalajara'],
                'Guatemala City, Guatemala': ['guatemala city', 'guatemala', 'guatemalan'],
                'Belize City, Belize': ['belize city', 'belize', 'belizean'],
                'Tegucigalpa, Honduras': ['tegucigalpa', 'honduras', 'honduran'],
                'San Salvador, El Salvador': ['san salvador', 'el salvador', 'salvadoran'],
                'Managua, Nicaragua': ['managua', 'nicaragua', 'nicaraguan'],
                'San Jose, Costa Rica': ['san jose', 'costa rica', 'costa rican'],
                'Panama City, Panama': ['panama city', 'panama', 'panamanian'],

                // Caribbean
                'Havana, Cuba': ['havana', 'cuba', 'cuban'],
                'Kingston, Jamaica': ['kingston', 'jamaica', 'jamaican'],
                'Port-au-Prince, Haiti': ['port au prince', 'haiti', 'haitian'],
                'Santo Domingo, Dominican Republic': ['santo domingo', 'dominican republic', 'dominican'],
                'San Juan, Puerto Rico': ['san juan', 'puerto rico', 'puerto rican'],
                'Bridgetown, Barbados': ['bridgetown', 'barbados', 'barbadian'],
                'Port of Spain, Trinidad and Tobago': ['port of spain', 'trinidad and tobago', 'trinidadian'],
                'St. George\'s, Grenada': ['st georges', 'grenada', 'grenadian'],
                'Castries, Saint Lucia': ['castries', 'saint lucia', 'st lucia'],
                'Kingstown, Saint Vincent and the Grenadines': ['kingstown', 'saint vincent', 'st vincent'],
                'St. John\'s, Antigua and Barbuda': ['st johns', 'antigua', 'barbuda'],
                'Roseau, Dominica': ['roseau', 'dominica'],
                'Basseterre, Saint Kitts and Nevis': ['basseterre', 'saint kitts', 'nevis'],
                'Nassau, Bahamas': ['nassau', 'bahamas', 'bahamian'],

                // South America
                'Brasilia, Brazil': ['brasilia', 'brazil', 'brazilian', 'rio de janeiro', 'sao paulo'],
                'Buenos Aires, Argentina': ['buenos aires', 'argentina', 'argentinian'],
                'Santiago, Chile': ['santiago', 'chile', 'chilean'],
                'Lima, Peru': ['lima', 'peru', 'peruvian', 'machu picchu'],
                'La Paz, Bolivia': ['la paz', 'bolivia', 'bolivian', 'sucre'],
                'Asuncion, Paraguay': ['asuncion', 'paraguay', 'paraguayan'],
                'Montevideo, Uruguay': ['montevideo', 'uruguay', 'uruguayan'],
                'Bogota, Colombia': ['bogota', 'colombia', 'colombian', 'medellin'],
                'Caracas, Venezuela': ['caracas', 'venezuela', 'venezuelan'],
                'Georgetown, Guyana': ['georgetown', 'guyana', 'guyanese'],
                'Paramaribo, Suriname': ['paramaribo', 'suriname', 'surinamese'],
                'Cayenne, French Guiana': ['cayenne', 'french guiana'],
                'Quito, Ecuador': ['quito', 'ecuador', 'ecuadorian', 'galapagos'],

                // Oceania
                'Canberra, Australia': ['canberra', 'australia', 'australian', 'sydney', 'melbourne'],
                'Wellington, New Zealand': ['wellington', 'new zealand', 'kiwi', 'auckland'],
                'Port Moresby, Papua New Guinea': ['port moresby', 'papua new guinea', 'png'],
                'Suva, Fiji': ['suva', 'fiji', 'fijian'],
                'Apia, Samoa': ['apia', 'samoa', 'samoan'],
                'Nuku\'alofa, Tonga': ['nukualofa', 'tonga', 'tongan'],
                'Port Vila, Vanuatu': ['port vila', 'vanuatu'],
                'Honiara, Solomon Islands': ['honiara', 'solomon islands'],
                'Tarawa, Kiribati': ['tarawa', 'kiribati'],
                'Funafuti, Tuvalu': ['funafuti', 'tuvalu'],
                'Yaren, Nauru': ['yaren', 'nauru'],
                'Ngerulmud, Palau': ['ngerulmud', 'palau'],
                'Majuro, Marshall Islands': ['majuro', 'marshall islands'],
                'Palikir, Micronesia': ['palikir', 'micronesia'],

                // Balkans (under USSR influence - existing)
                'Belgrade, USSR': ['belgrade', 'serbia', 'serbian', 'yugoslavia', 'yugoslav'],
                'Zagreb, USSR': ['zagreb', 'croatia', 'croatian'],
                'Sarajevo, USSR': ['sarajevo', 'bosnia', 'bosnian', 'herzegovina'],
                'Skopje, USSR': ['skopje', 'macedonia', 'macedonian', 'north macedonia'],
                'Pristina, USSR': ['pristina', 'kosovo', 'kosovar'],
                'Podgorica, USSR': ['podgorica', 'montenegro', 'montenegrin'],
                'Tirana, USSR': ['tirana', 'albania', 'albanian'],
                'Sofia, USSR': ['sofia', 'bulgaria', 'bulgarian'],
                'Bucharest, USSR': ['bucharest', 'romania', 'romanian']
            },
            it: {
                // European locations
                'Parigi, Francia': ['parigi', 'francia', 'francese', 'paris', 'france'],
                'Roma, Italia': ['roma', 'italia', 'italiano', 'rome', 'italy'],
                'Barcellona, Spagna': ['barcellona', 'spagna', 'spagnolo', 'barcelona', 'spain', 'catalogna'],
                'Berlino, Germania': ['berlino', 'germania', 'tedesco', 'berlin', 'germany'],
                'Amsterdam, Paesi Bassi': ['amsterdam', 'paesi bassi', 'olanda', 'olandese', 'netherlands'],
                'Praga, Repubblica Ceca': ['praga', 'repubblica ceca', 'ceco', 'prague', 'czech'],
                'Vienna, Austria': ['vienna', 'austria', 'austriaco', 'wien'],
                'Lisbona, Portogallo': ['lisbona', 'portogallo', 'portoghese', 'lisbon', 'portugal'],
                'Atene, Grecia': ['atene', 'grecia', 'greco', 'athens', 'greece'],
                'Budapest, Ungheria': ['budapest', 'ungheria', 'ungherese', 'hungary'],
                'Copenaghen, Danimarca': ['copenaghen', 'danimarca', 'danese', 'copenhagen', 'denmark'],
                'Stoccolma, Svezia': ['stoccolma', 'svezia', 'svedese', 'stockholm', 'sweden'],
                'Dublino, Irlanda': ['dublino', 'irlanda', 'irlandese', 'dublin', 'ireland'],
                'Bruxelles, Belgio': ['bruxelles', 'belgio', 'belga', 'brussels', 'belgium'],
                'Varsavia, Polonia': ['varsavia', 'polonia', 'polacco', 'warsaw', 'poland'],
                'Zurigo, Svizzera': ['zurigo', 'svizzera', 'svizzero', 'zurich', 'switzerland'],
                'Edimburgo, Scozia': ['edimburgo', 'scozia', 'scozzese', 'edinburgh', 'scotland'],
                'Oslo, Norvegia': ['oslo', 'norvegia', 'norvegese', 'norway'],
                'Helsinki, Finlandia': ['helsinki', 'finlandia', 'finlandese', 'finland'],
                'Venezia, Italia': ['venezia', 'italia', 'italiano', 'venice', 'italy'],
                'Nizza, Francia': ['nizza', 'francia', 'francese', 'nice', 'france', 'costa azzurra'],
                'Monaco, Germania': ['monaco di baviera', 'germania', 'tedesco', 'munich', 'baviera'],
                'Santorini, Grecia': ['santorini', 'grecia', 'greco', 'greece', 'cicladi'],
                'Dubrovnik, Croazia': ['dubrovnik', 'croazia', 'croato', 'croatia', 'adriatico'],
                'Reykjavik, Islanda': ['reykjavik', 'islanda', 'islandese', 'iceland'],
                'Malta': ['malta', 'maltese', 'valletta'],
                'Lussemburgo': ['lussemburgo', 'luxembourg'],
                'Monaco': ['monaco', 'monte carlo', 'monegasco'],
                'Lubiana, Slovenia': ['lubiana', 'slovenia', 'sloveno', 'ljubljana'],
                'Tallinn, Estonia': ['tallinn', 'estonia', 'estone', 'estonia'],

                // Special locations
                'Città del Vaticano': ['vaticano', 'città del vaticano', 'santa sede', 'papa', 'papale', 'pontefice', 'vescovo di roma', 'chiesa cattolica'],
                'New York, USA': ['new york', 'manhattan', 'nyc', 'nazioni unite', 'sede onu', 'onu', 'grande mela'],

                // Major world powers (renamed)
                'Washington, USA': ['washington', 'usa', 'stati uniti', 'america', 'americano', 'casa bianca', 'pentagono', 'campidoglio'],
                'Mosca, URSS': ['mosca', 'russia', 'russo', 'urss', 'unione sovietica', 'cremlino', 'piazza rossa'],
                'Londra, Britannia': ['londra', 'britannia', 'britannico', 'inghilterra', 'regno unito', 'westminster', 'downing street'],

                // Asian powers
                'Pechino, Cina': ['pechino', 'cina', 'cinese', 'shanghai', 'hong kong', 'tiananmen', 'città proibita'],
                'Tokyo, Giappone': ['tokyo', 'giappone', 'giapponese', 'osaka', 'kyoto', 'monte fuji', 'nippon'],

                // Middle East
                'Gerusalemme, Israele': ['gerusalemme', 'israele', 'israeliano', 'tel aviv'],
                'Gaza, Palestina': ['haifa', 'gaza', 'cisgiordania'],
                'Teheran, Persia': ['teheran', 'iran', 'iraniano', 'persia', 'persiano', 'isfahan', 'shiraz'],
                'Baghdad, Iraq': ['baghdad', 'iraq', 'iracheno', 'mesopotamia', 'basra', 'kurdistan'],
                'Damasco, Siria': ['damasco', 'siria', 'siriano', 'aleppo', 'levante'],
                'Riyadh, Arabia Saudita': ['riyadh', 'arabia saudita', 'saudita', 'mecca', 'medina', 'jeddah'],
                'Il Cairo, Egitto': ['cairo', 'egitto', 'egiziano', 'alessandria', 'nilo', 'giza'],
                'Istanbul, Turchia': ['istanbul', 'turchia', 'turco', 'ankara', 'costantinopoli', 'bosforo'],
                'Beirut, Libano': ['beirut', 'libano', 'libanese', 'tripoli', 'cedro'],
                'Amman, Giordania': ['amman', 'giordania', 'giordano', 'petra', 'mar morto'],
                'Kuwait City, Kuwait': ['kuwait', 'kuwaitiano', 'città del kuwait'],
                'Doha, Qatar': ['doha', 'qatar', 'qatariota'],
                'Abu Dhabi, Emirati': ['abu dhabi', 'dubai', 'emirati arabi uniti', 'emirati', 'emiratino'],

                // Balkans (under USSR influence)
                'Belgrado, URSS': ['belgrado', 'serbia', 'serbo', 'jugoslavia', 'jugoslavo'],
                'Zagabria, URSS': ['zagabria', 'croazia', 'croato'],
                'Sarajevo, URSS': ['sarajevo', 'bosnia', 'bosniaco', 'erzegovina'],
                'Skopje, URSS': ['skopje', 'macedonia', 'macedone', 'macedonia del nord'],
                'Pristina, URSS': ['pristina', 'kosovo', 'kosovaro'],
                'Podgorica, URSS': ['podgorica', 'montenegro', 'montenegrino'],
                'Tirana, URSS': ['tirana', 'albania', 'albanese'],
                'Sofia, URSS': ['sofia', 'bulgaria', 'bulgaro'],
                'Bucarest, URSS': ['bucarest', 'romania', 'rumeno'],
                // Paesi europei aggiuntivi
                'Riga, Lettonia': ['riga', 'lettonia', 'lettone', 'latvia', 'latvian'],
                'Vilnius, Lituania': ['vilnius', 'lituania', 'lituano', 'lithuania', 'lithuanian'],
                'Minsk, Bielorussia': ['minsk', 'bielorussia', 'bielorusso', 'belarus', 'belarusian'],
                'Kiev, Ucraina': ['kiev', 'kyiv', 'ucraina', 'ucraino', 'odessa', 'ukraine', 'ukrainian'],
                'Chisinau, Moldavia': ['chisinau', 'moldavia', 'moldavo', 'moldova', 'moldovan'],
                'San Marino': ['san marino', 'sanmarinese', 'sammarinese'],
                'Andorra la Vella, Andorra': ['andorra', 'andorrano', 'andorran'],
                'Vaduz, Liechtenstein': ['vaduz', 'liechtenstein'],

                // Località speciali
                'Città del Vaticano': ['vaticano', 'città del vaticano', 'santa sede', 'papa', 'papale', 'pontefice', 'vescovo di roma', 'chiesa cattolica', 'vatican', 'holy see'],
                'New York, USA': ['new york', 'manhattan', 'nyc', 'nazioni unite', 'sede onu', 'onu', 'grande mela', 'united nations'],

                // Grandi potenze mondiali
                'Washington, USA': ['washington', 'usa', 'stati uniti', 'america', 'americano', 'casa bianca', 'pentagono', 'campidoglio', 'united states', 'white house'],
                'Mosca, URSS': ['mosca', 'russia', 'russo', 'urss', 'unione sovietica', 'cremlino', 'piazza rossa', 'moscow', 'kremlin'],
                'Londra, Britannia': ['londra', 'gran bretagna', 'britannico', 'britannia', 'inghilterra', 'regno unito', 'westminster', 'downing street', 'london', 'britain'],

                // Potenze asiatiche
                'Pechino, Cina': ['pechino', 'cina', 'cinese', 'shanghai', 'hong kong', 'tiananmen', 'città proibita', 'beijing', 'china'],
                'Tokyo, Giappone': ['tokyo', 'giappone', 'giapponese', 'osaka', 'kyoto', 'monte fuji', 'nippon', 'japan'],

                // Paesi asiatici aggiuntivi
                'Seoul, Corea del Sud': ['seoul', 'corea del sud', 'coreano', 'busan', 'jeju', 'south korea'],
                'Pyongyang, Corea del Nord': ['pyongyang', 'corea del nord', 'rpdc', 'regno eremita', 'north korea', 'dprk'],
                'Nuova Delhi, India': ['nuova delhi', 'delhi', 'india', 'indiano', 'mumbai', 'bangalore', 'kolkata', 'new delhi'],
                'Islamabad, Pakistan': ['islamabad', 'pakistan', 'pakistano', 'karachi', 'lahore'],
                'Dhaka, Bangladesh': ['dhaka', 'bangladesh', 'bengalese', 'bangladeshi'],
                'Colombo, Sri Lanka': ['colombo', 'sri lanka', 'cingalese', 'ceylon'],
                'Kathmandu, Nepal': ['kathmandu', 'nepal', 'nepalese', 'himalaya'],
                'Thimphu, Bhutan': ['thimphu', 'bhutan', 'bhutanese'],
                'Male, Maldive': ['male', 'maldive', 'maldiviano', 'maldives'],
                'Bangkok, Thailandia': ['bangkok', 'thailandia', 'thai', 'siam', 'thailand'],
                'Hanoi, Vietnam': ['hanoi', 'vietnam', 'vietnamita', 'ho chi minh', 'saigon'],
                'Vientiane, Laos': ['vientiane', 'laos', 'laotiano'],
                'Phnom Penh, Cambogia': ['phnom penh', 'cambogia', 'cambogiano', 'khmer', 'cambodia'],
                'Yangon, Myanmar': ['yangon', 'myanmar', 'birmania', 'birmano', 'burma'],
                'Kuala Lumpur, Malesia': ['kuala lumpur', 'malesia', 'malese', 'malaysia'],
                'Singapore': ['singapore', 'singaporiano', 'singaporean'],
                'Giacarta, Indonesia': ['giacarta', 'indonesia', 'indonesiano', 'giava', 'bali', 'jakarta'],
                'Manila, Filippine': ['manila', 'filippine', 'filippino', 'cebu', 'philippines'],
                'Brunei': ['bandar seri begawan', 'brunei'],
                'Dili, Timor Est': ['dili', 'timor est', 'timor leste', 'east timor'],
                'Ulaanbaatar, Mongolia': ['ulaanbaatar', 'mongolia', 'mongolo', 'mongolian'],

                // Paesi dell'Asia centrale
                'Astana, Kazakistan': ['astana', 'nur sultan', 'kazakistan', 'kazako', 'almaty', 'kazakhstan'],
                'Tashkent, Uzbekistan': ['tashkent', 'uzbekistan', 'uzbeko', 'samarcanda', 'samarkand'],
                'Bishkek, Kirghizistan': ['bishkek', 'kirghizistan', 'kirghiso', 'kyrgyzstan'],
                'Dushanbe, Tagikistan': ['dushanbe', 'tagikistan', 'tagiko', 'tajikistan'],
                'Ashgabat, Turkmenistan': ['ashgabat', 'turkmenistan', 'turkmeno'],
                'Kabul, Afghanistan': ['kabul', 'afghanistan', 'afghano', 'afghan'],

                // Medio Oriente
                'Gerusalemme, Israele': ['gerusalemme', 'israele', 'israeliano', 'tel aviv', 'jerusalem', 'israel'],
                'Gaza, Palestina': ['haifa', 'gaza', 'cisgiordania', 'palestine', 'west bank'],
                'Teheran, Persia': ['teheran', 'iran', 'iraniano', 'persia', 'persiano', 'isfahan', 'shiraz', 'tehran'],
                'Baghdad, Iraq': ['baghdad', 'iraq', 'iracheno', 'mesopotamia', 'bassora', 'kurdistan', 'basra'],
                'Damasco, Siria': ['damasco', 'siria', 'siriano', 'aleppo', 'levante', 'damascus', 'syria'],
                'Riyadh, Arabia Saudita': ['riyadh', 'arabia saudita', 'saudita', 'mecca', 'medina', 'gedda', 'saudi arabia'],
                'Il Cairo, Egitto': ['il cairo', 'egitto', 'egiziano', 'alessandria', 'nilo', 'giza', 'cairo', 'egypt'],
                'Istanbul, Turchia': ['istanbul', 'turchia', 'turco', 'ankara', 'costantinopoli', 'bosforo', 'turkey'],
                'Beirut, Libano': ['beirut', 'libano', 'libanese', 'tripoli', 'cedro', 'lebanon'],
                'Amman, Giordania': ['amman', 'giordania', 'giordano', 'petra', 'mar morto', 'jordan'],
                'Città del Kuwait, Kuwait': ['kuwait', 'kuwaitiano', 'città del kuwait', 'kuwait city'],
                'Doha, Qatar': ['doha', 'qatar', 'qatariano', 'qatari'],
                'Abu Dhabi, Emirati Arabi Uniti': ['abu dhabi', 'dubai', 'eau', 'emirati', 'emiratino', 'uae', 'emirates'],

                // Paesi mediorientali aggiuntivi
                'Manama, Bahrein': ['manama', 'bahrein', 'bahreinita', 'bahrain'],
                'Mascate, Oman': ['mascate', 'oman', 'omanita', 'muscat'],
                'Sanaa, Yemen': ['sanaa', 'yemen', 'yemenita', 'aden'],
                'Yerevan, Armenia': ['yerevan', 'armenia', 'armeno', 'armenian'],
                'Baku, Azerbaigian': ['baku', 'azerbaigian', 'azero', 'azerbaijan'],
                'Tbilisi, Georgia': ['tbilisi', 'georgia', 'georgiano', 'georgian'],
                'Nicosia, Cipro': ['nicosia', 'cipro', 'cipriota', 'cyprus'],

                // Africa - Nord
                'Tripoli, Libia': ['tripoli', 'libia', 'libico', 'bengasi', 'libya', 'benghazi'],
                'Algeri, Algeria': ['algeri', 'algeria', 'algerino', 'algiers'],
                'Tunisi, Tunisia': ['tunisi', 'tunisia', 'tunisino', 'tunis'],
                'Rabat, Marocco': ['rabat', 'marocco', 'marocchino', 'casablanca', 'marrakech', 'morocco'],
                'Khartoum, Sudan': ['khartoum', 'sudan', 'sudanese'],
                'Juba, Sud Sudan': ['juba', 'sud sudan', 'sud sudanese', 'south sudan'],

                // Africa - Ovest
                'Dakar, Senegal': ['dakar', 'senegal', 'senegalese'],
                'Bamako, Mali': ['bamako', 'mali', 'maliano', 'malian'],
                'Ouagadougou, Burkina Faso': ['ouagadougou', 'burkina faso', 'burkinabe'],
                'Niamey, Niger': ['niamey', 'niger', 'nigerino', 'nigerien'],
                'Abuja, Nigeria': ['abuja', 'nigeria', 'nigeriano', 'lagos', 'nigerian'],
                'Accra, Ghana': ['accra', 'ghana', 'ghanese', 'ghanaian'],
                'Lomé, Togo': ['lomé', 'togo', 'togolese'],
                'Porto-Novo, Benin': ['porto novo', 'benin', 'beninese'],
                'Abidjan, Costa d\'Avorio': ['abidjan', 'costa d avorio', 'ivoriano', 'ivory coast'],
                'Monrovia, Liberia': ['monrovia', 'liberia', 'liberiano', 'liberian'],
                'Freetown, Sierra Leone': ['freetown', 'sierra leone', 'sierraleonese'],
                'Conakry, Guinea': ['conakry', 'guinea', 'guineano', 'guinean'],
                'Bissau, Guinea-Bissau': ['bissau', 'guinea bissau'],
                'Praia, Capo Verde': ['praia', 'capo verde', 'cabo verde', 'capoverdiano'],
                'Banjul, Gambia': ['banjul', 'gambia', 'gambiano', 'gambian'],

                // Africa - Centro
                'Yaoundé, Camerun': ['yaoundé', 'camerun', 'camerunese', 'yaounde', 'cameroon'],
                'Bangui, Repubblica Centrafricana': ['bangui', 'repubblica centrafricana', 'rca', 'central african republic'],
                'N\'Djamena, Ciad': ['ndjamena', 'ciad', 'ciadiano', 'chad'],
                'Kinshasa, Repubblica Democratica del Congo': ['kinshasa', 'repubblica democratica del congo', 'rdc', 'congo kinshasa', 'democratic republic of congo'],
                'Brazzaville, Repubblica del Congo': ['brazzaville', 'repubblica del congo', 'congo brazzaville', 'republic of congo'],
                'Libreville, Gabon': ['libreville', 'gabon', 'gabonese'],
                'Malabo, Guinea Equatoriale': ['malabo', 'guinea equatoriale', 'equatorial guinea'],
                'São Tomé, São Tomé e Príncipe': ['são tomé', 'são tomé e príncipe', 'sao tome'],

                // Africa - Est
                'Addis Abeba, Etiopia': ['addis abeba', 'etiopia', 'etiope', 'addis ababa', 'ethiopia'],
                'Asmara, Eritrea': ['asmara', 'eritrea', 'eritreo', 'eritrean'],
                'Gibuti': ['gibuti', 'gibutiano', 'djibouti'],
                'Mogadiscio, Somalia': ['mogadiscio', 'somalia', 'somalo', 'mogadishu', 'somali'],
                'Nairobi, Kenya': ['nairobi', 'kenya', 'keniota', 'mombasa', 'kenyan'],
                'Kampala, Uganda': ['kampala', 'uganda', 'ugandese', 'ugandan'],
                'Kigali, Ruanda': ['kigali', 'ruanda', 'ruandese', 'rwanda', 'rwandan'],
                'Bujumbura, Burundi': ['bujumbura', 'burundi', 'burundese', 'burundian'],
                'Dodoma, Tanzania': ['dodoma', 'tanzania', 'tanzaniano', 'dar es salaam', 'tanzanian'],
                'Antananarivo, Madagascar': ['antananarivo', 'madagascar', 'malgascio', 'malagasy'],
                'Port Louis, Mauritius': ['port louis', 'mauritius', 'mauriziano', 'mauritian'],
                'Victoria, Seychelles': ['victoria', 'seychelles', 'seicellese'],
                'Moroni, Comore': ['moroni', 'comore', 'comoriano', 'comoros'],

                // Africa - Sud
                'Luanda, Angola': ['luanda', 'angola', 'angolano', 'angolan'],
                'Lusaka, Zambia': ['lusaka', 'zambia', 'zambiano', 'zambian'],
                'Harare, Zimbabwe': ['harare', 'zimbabwe', 'zimbabwese'],
                'Gaborone, Botswana': ['gaborone', 'botswana', 'botswaniano'],
                'Windhoek, Namibia': ['windhoek', 'namibia', 'namibiano', 'namibian'],
                'Città del Capo, Sudafrica': ['città del capo', 'sudafrica', 'sudafricano', 'johannesburg', 'pretoria', 'cape town', 'south africa'],
                'Maseru, Lesotho': ['maseru', 'lesotho'],
                'Mbabane, Eswatini': ['mbabane', 'eswatini', 'swaziland'],
                'Maputo, Mozambico': ['maputo', 'mozambico', 'mozambicano', 'mozambique'],
                'Lilongwe, Malawi': ['lilongwe', 'malawi', 'malawiano', 'malawian'],

                // Nord America
                'Ottawa, Canada': ['ottawa', 'canada', 'canadese', 'toronto', 'vancouver', 'montreal', 'canadian'],
                'Città del Messico, Messico': ['città del messico', 'messico', 'messicano', 'guadalajara', 'mexico city', 'mexican'],
                'Città del Guatemala, Guatemala': ['città del guatemala', 'guatemala', 'guatemalteco', 'guatemala city'],
                'Belize City, Belize': ['belize city', 'belize', 'beliziano', 'belizean'],
                'Tegucigalpa, Honduras': ['tegucigalpa', 'honduras', 'honduregno', 'honduran'],
                'San Salvador, El Salvador': ['san salvador', 'el salvador', 'salvadoregno', 'salvadoran'],
                'Managua, Nicaragua': ['managua', 'nicaragua', 'nicaraguense', 'nicaraguan'],
                'San José, Costa Rica': ['san josé', 'costa rica', 'costaricano', 'costa rican'],
                'Città di Panama, Panama': ['città di panama', 'panama', 'panamense', 'panama city', 'panamanian'],

                // Caraibi
                'L\'Avana, Cuba': ['l avana', 'cuba', 'cubano', 'havana', 'cuban'],
                'Kingston, Giamaica': ['kingston', 'giamaica', 'giamaicano', 'jamaica', 'jamaican'],
                'Port-au-Prince, Haiti': ['port au prince', 'haiti', 'haitiano', 'haitian'],
                'Santo Domingo, Repubblica Dominicana': ['santo domingo', 'repubblica dominicana', 'dominicano', 'dominican republic'],
                'San Juan, Puerto Rico': ['san juan', 'porto rico', 'portoricano', 'puerto rico'],
                'Bridgetown, Barbados': ['bridgetown', 'barbados', 'barbadiano', 'barbadian'],
                'Port of Spain, Trinidad e Tobago': ['port of spain', 'trinidad e tobago', 'trinidadiano', 'trinidad and tobago'],
                'St. George\'s, Grenada': ['st georges', 'grenada', 'grenadino', 'grenadian'],
                'Castries, Santa Lucia': ['castries', 'santa lucia', 'saint lucia'],
                'Kingstown, Saint Vincent e Grenadine': ['kingstown', 'saint vincent', 'st vincent', 'grenadine'],
                'St. John\'s, Antigua e Barbuda': ['st johns', 'antigua', 'barbuda'],
                'Roseau, Dominica': ['roseau', 'dominica'],
                'Basseterre, Saint Kitts e Nevis': ['basseterre', 'saint kitts', 'nevis'],
                'Nassau, Bahamas': ['nassau', 'bahamas', 'bahamiano', 'bahamian'],

                // Sud America
                'Brasília, Brasile': ['brasília', 'brasile', 'brasiliano', 'rio de janeiro', 'san paolo', 'brasilia', 'brazil'],
                'Buenos Aires, Argentina': ['buenos aires', 'argentina', 'argentino', 'argentinian'],
                'Santiago, Cile': ['santiago', 'cile', 'cileno', 'chile', 'chilean'],
                'Lima, Perù': ['lima', 'perù', 'peruviano', 'machu picchu', 'peru', 'peruvian'],
                'La Paz, Bolivia': ['la paz', 'bolivia', 'boliviano', 'sucre', 'bolivian'],
                'Asunción, Paraguay': ['asunción', 'paraguay', 'paraguayano', 'paraguayan'],
                'Montevideo, Uruguay': ['montevideo', 'uruguay', 'uruguayano', 'uruguayan'],
                'Bogotá, Colombia': ['bogotá', 'colombia', 'colombiano', 'medellín', 'bogota', 'medellin'],
                'Caracas, Venezuela': ['caracas', 'venezuela', 'venezuelano', 'venezuelan'],
                'Georgetown, Guyana': ['georgetown', 'guyana', 'guyanese'],
                'Paramaribo, Suriname': ['paramaribo', 'suriname', 'surinamese'],
                'Cayenne, Guyana Francese': ['cayenne', 'guyana francese', 'french guiana'],
                'Quito, Ecuador': ['quito', 'ecuador', 'ecuadoriano', 'galapagos', 'ecuadorian'],

                // Oceania
                'Canberra, Australia': ['canberra', 'australia', 'australiano', 'sydney', 'melbourne', 'australian'],
                'Wellington, Nuova Zelanda': ['wellington', 'nuova zelanda', 'neozelandese', 'auckland', 'new zealand', 'kiwi'],
                'Port Moresby, Papua Nuova Guinea': ['port moresby', 'papua nuova guinea', 'png', 'papua new guinea'],
                'Suva, Figi': ['suva', 'figi', 'figiano', 'fiji', 'fijian'],
                'Apia, Samoa': ['apia', 'samoa', 'samoano', 'samoan'],
                'Nuku\'alofa, Tonga': ['nukualofa', 'tonga', 'tongano', 'tongan'],
                'Port Vila, Vanuatu': ['port vila', 'vanuatu'],
                'Honiara, Isole Salomone': ['honiara', 'isole salomone', 'solomon islands'],
                'Tarawa, Kiribati': ['tarawa', 'kiribati'],
                'Funafuti, Tuvalu': ['funafuti', 'tuvalu'],
                'Yaren, Nauru': ['yaren', 'nauru'],
                'Ngerulmud, Palau': ['ngerulmud', 'palau'],
                'Majuro, Isole Marshall': ['majuro', 'isole marshall', 'marshall islands'],
                'Palikir, Micronesia': ['palikir', 'micronesia'],

                // Balcani (sotto influenza URSS)
                'Belgrado, URSS': ['belgrado', 'serbia', 'serbo', 'jugoslavia', 'jugoslavo', 'belgrade', 'yugoslav'],
                'Zagabria, URSS': ['zagabria', 'croazia', 'croato', 'zagreb', 'croatia'],
                'Sarajevo, URSS': ['sarajevo', 'bosnia', 'bosniaco', 'erzegovina', 'bosnian', 'herzegovina'],
                'Skopje, URSS': ['skopje', 'macedonia', 'macedone', 'macedonia del nord', 'north macedonia'],
                'Pristina, URSS': ['pristina', 'kosovo', 'kosovaro', 'kosovar'],
                'Podgorica, URSS': ['podgorica', 'montenegro', 'montenegrino', 'montenegrin'],
                'Tirana, URSS': ['tirana', 'albania', 'albanese', 'albanian'],
                'Sofia, URSS': ['sofia', 'bulgaria', 'bulgaro', 'bulgarian'],
                'Bucarest, URSS': ['bucarest', 'romania', 'rumeno', 'bucharest', 'romanian']

            }
        },

        // Special priority rules for specific types of news
        specialLocationRules: {
            priority: [
                // Pope-related news always goes to Vatican unless specifically mentioned elsewhere
                {
                    keywords: ['pope', 'papa', 'pontiff', 'pontefice', 'papal', 'papale', 'vatican', 'vaticano', 'holy see', 'santa sede', 'bishop of rome', 'vescovo di roma'],
                    defaultLocation: {
                        en: 'Vatican City',
                        it: 'Città del Vaticano'
                    },
                    checkForOverride: true
                },
                // UN/ONU related news goes to New York
                {
                    keywords: ['united nations', 'nazioni unite', 'un headquarters', 'sede onu', 'un general assembly', 'assemblea generale onu', 'security council', 'consiglio di sicurezza'],
                    defaultLocation: {
                        en: 'New York, USA',
                        it: 'New York, USA'
                    },
                    checkForOverride: false
                }
            ]
        },

        // Enhanced location detection with special rules
        detectLocationFromText: function (title, description) {
            const lang = window.NewsSystemUtils.isItalian() ? 'it' : 'en';
            const fullText = ((title || '') + ' ' + (description || '')).toLowerCase();

            // Remove common punctuation and normalize text
            const normalizedText = fullText.replace(/[.,!?;:"'()[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();

            // Check special priority rules first
            for (const rule of this.specialLocationRules.priority) {
                const hasKeyword = rule.keywords.some(keyword =>
                    new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i').test(normalizedText)
                );

                if (hasKeyword) {
                    if (rule.checkForOverride) {
                        // For pope news, check if another location is mentioned
                        const otherLocation = this.findNonDefaultLocation(normalizedText, rule.defaultLocation[lang], lang);
                        if (otherLocation) {
                            return otherLocation;
                        }
                    }
                    return rule.defaultLocation[lang];
                }
            }

            // Normal location detection
            const variations = this.locationVariations[lang];
            let bestMatch = null;
            let bestScore = 0;

            // Check each location and its variations
            for (const [location, variants] of Object.entries(variations)) {
                let score = 0;

                for (const variant of variants) {
                    // Exact word match gets highest score
                    const regex = new RegExp(`\\b${variant.toLowerCase()}\\b`, 'i');
                    if (regex.test(normalizedText)) {
                        score += variant.length * 2; // Longer matches get more weight
                    }
                    // Partial match gets lower score
                    else if (normalizedText.includes(variant.toLowerCase())) {
                        score += variant.length;
                    }
                }

                // Prefer longer location names for ties
                if (score > bestScore || (score === bestScore && location.length > (bestMatch?.length || 0))) {
                    bestScore = score;
                    bestMatch = location;
                }
            }

            // Return match only if we have a reasonable confidence
            return bestScore >= 3 ? bestMatch : null;
        },

        // Helper function to find alternative locations when special rules apply
        findNonDefaultLocation: function (normalizedText, defaultLocation, lang) {
            const variations = this.locationVariations[lang];

            for (const [location, variants] of Object.entries(variations)) {
                if (location === defaultLocation) continue; // Skip the default location

                for (const variant of variants) {
                    const regex = new RegExp(`\\b${variant.toLowerCase()}\\b`, 'i');
                    if (regex.test(normalizedText)) {
                        return location;
                    }
                }
            }

            return null;
        },

        // Function to get random location as fallback
        getRandomLocation: function () {
            const locations = window.NewsSystemUtils.getLocations();
            return locations[Math.floor(Math.random() * locations.length)];
        },

        // Main function to determine location for news item
        // Main function to determine location for news item
        determineLocation: function (newsItem) {
            // 1. Check if location key is explicitly provided and not empty (highest priority)
            if (newsItem.location && newsItem.location.trim() !== '') {
                return newsItem.location.trim();
            }

            // 2. Check if city is explicitly provided and not empty
            if (newsItem.city && newsItem.city.trim() !== '') {
                return newsItem.city.trim();
            }

            // 3. Try to detect location from title and description
            const title = newsItem.title || newsItem.titleIt || '';
            const description = newsItem.desc || newsItem.desc_it || '';

            const detectedLocation = this.detectLocationFromText(title, description);
            if (detectedLocation) {
                console.log(`NewsSystem: Detected location "${detectedLocation}" from text: "${title}"`);
                return detectedLocation;
            }

            // 4. Fallback to random location
            console.log(`NewsSystem: No location detected for "${title}", using random location`);
            return this.getRandomLocation();
        }
    }

    // Global instance
    let $newsManager = null;

    // Export for other plugins
    window.$newsManager = null;
    window.NewsManager = NewsManager;

    // Ensure News Manager exists
    function ensureNewsManager() {
        if (!$newsManager) {
            $newsManager = new NewsManager();

            // Check if we have saved data first
            const savedData = $gameSystem.newsSystemData;
            if (savedData && savedData.newsHistory && savedData.newsHistory.length > 0) {
                // Load existing data
                $newsManager.load();
            } else {
                // Only initialize if no saved data exists
                $newsManager.initialize();
            }

            window.$newsManager = $newsManager;
        }
    }

    // Plugin commands
    PluginManager.registerCommand(pluginName, 'checkNewsHistory', args => {
        ensureNewsManager();
        SceneManager.push(Scene_NewsHistory);
    });

    PluginManager.registerCommand(pluginName, 'forceNewsEvent', args => {
        ensureNewsManager();
        $newsManager.generateNewsEvent();
        window.skipLocalization = true;
        $gameMessage.add(t('newsEventMsg'));
        window.skipLocalization = false;
    });

    // Save/Load
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        const contents = _DataManager_makeSaveContents.call(this);
        if ($newsManager) {
            $newsManager.save();
        }
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents.call(this, contents);
        // Don't automatically create and load - wait for ensureNewsManager to be called
        $newsManager = null;
        window.$newsManager = null;
    };

    // Export Scene for other plugins
    window.Scene_NewsHistory = Scene_NewsHistory;
    window.Window_MonthHeader = Window_MonthHeader;
    window.Window_NewsModal = Window_NewsModal;
})();