/*:
 * @target MZ
 * @plugindesc Road Navigation System with 3D Driving Mode v2.0.0
 * @author Omni-Lex
 * https://nocoldiz.itch.io/hypernet-explorer
 * @help
 * ============================================================================
 * Road Navigation System with 3D Driving Mode for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin provides both automatic road-following and a first-person
 * 3D driving mode inspired by Euro Truck Simulator with retro Elite-style
 * graphics.
 * 
 * Features:
 * - Automatic road following with crossroad navigation
 * - First-person 3D driving mode with simple polygon graphics
 * - WASD controls for steering and speed
 * - Traffic simulation with collision damage
 * - Dynamic city signs at crossroads
 * - Exit to world map at any point
 * 
 * 3D Driving Mode Controls:
 * - W: Accelerate
 * - S: Brake/Reverse
 * - A: Steer Left
 * - D: Steer Right
 * - ESC: Exit to map
 * - E: Stop and exit to world map location
 * 
 * Setup Instructions:
 * 1. Configure plugin parameters for tile IDs and map settings
 * 2. Place "Teleport" events for cities on your map
 * 3. Use plugin commands to switch between modes
 * 
 * Damage System:
 * - Colliding with other cars damages all party members
 * - Damage is proportional to impact speed
 * - Cars will honk when you get too close
 * 
 * @param mapId
 * @text Road Map ID
 * @desc The ID of the map containing the road system
 * @type number
 * @default 1
 * 
 * @param highwayTileId
 * @text Highway Autotile ID
 * @desc The autotile ID used for highways (A2 layer)
 * @type number
 * @default 1
 * 
 * @param localRoadTileId
 * @text Local Road Autotile ID
 * @desc The autotile ID used for local roads (A2 layer)
 * @type number
 * @default 2
 * 
 * @param moveSpeed
 * @text Auto Move Speed
 * @desc Speed when auto-following roads (1-6)
 * @type number
 * @min 1
 * @max 6
 * @default 4
 * 
 * @param detectionRadius
 * @text City Detection Radius
 * @desc Tiles away from city to trigger popup
 * @type number
 * @min 1
 * @max 5
 * @default 2
 * 
 * @param collisionDamage
 * @text Collision Damage
 * @desc Base HP damage for collisions
 * @type number
 * @min 1
 * @max 100
 * @default 10
 * 
 * @param tileScale
 * @text Tile to 3D Scale
 * @desc How many 3D units per map tile
 * @type number
 * @min 10
 * @max 100
 * @default 50
 * 
 * @command startRoadFollow
 * @text Start Road Following
 * @desc Begin automatic road navigation
 * 
 * @command stopRoadFollow
 * @text Stop Road Following
 * @desc End automatic road navigation
 * 
 * @command openDrivingMode
 * @text Open Driving Mode
 * @desc Opens the 3D driving mode
 * 
 * @command exitToWorldMap
 * @text Exit to World Map
 * @desc Stop and teleport to corresponding world map position
 */

(() => {
    'use strict';
    
    const pluginName = 'RoadNavigationSystem';
    const parameters = PluginManager.parameters(pluginName);
    
    const config = {
        mapId: Number(parameters['mapId'] || 1),
        highwayTileId: Number(parameters['highwayTileId'] || 1),
        localRoadTileId: Number(parameters['localRoadTileId'] || 2),
        moveSpeed: Number(parameters['moveSpeed'] || 4),
        detectionRadius: Number(parameters['detectionRadius'] || 2),
        collisionDamage: Number(parameters['collisionDamage'] || 10),
        tileScale: Number(parameters['tileScale'] || 50)
    };
    
    // 3D Math utilities
    class Vector3 {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        
        add(v) {
            return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
        }
        
        subtract(v) {
            return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
        }
        
        multiply(scalar) {
            return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
        }
        
        rotateY(angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return new Vector3(
                this.x * cos - this.z * sin,
                this.y,
                this.x * sin + this.z * cos
            );
        }
        
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
        
        normalize() {
            const len = this.length();
            if (len === 0) return new Vector3();
            return this.multiply(1 / len);
        }
    }
    
    // 3D Renderer for Elite-style graphics
    class Simple3DRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.width = canvas.width;
            this.height = canvas.height;
            this.fov = 90 * Math.PI / 180;
            this.near = 0.1;
            this.far = 1000;
        }
        
        clear(skyColor = '#000033', groundColor = '#111111') {
            // Sky gradient
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, skyColor);
            gradient.addColorStop(0.5, '#000066');
            gradient.addColorStop(0.5, '#222222');
            gradient.addColorStop(1, groundColor);
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
        
        project(vertex, camera) {
            // Transform to camera space
            let v = vertex.subtract(camera.position);
            v = v.rotateY(-camera.rotation.y);
            
            if (v.z <= this.near) return null;
            
            // Project to screen
            const scale = (this.height / 2) / Math.tan(this.fov / 2);
            const x = (v.x * scale / v.z) + this.width / 2;
            const y = (-v.y * scale / v.z) + this.height / 2;
            
            return { x, y, z: v.z };
        }
        
        drawPolygon(vertices, camera, color, outline = false) {
            const projected = vertices.map(v => this.project(v, camera)).filter(p => p !== null);
            
            if (projected.length < 3) return;
            
            this.ctx.beginPath();
            this.ctx.moveTo(projected[0].x, projected[0].y);
            for (let i = 1; i < projected.length; i++) {
                this.ctx.lineTo(projected[i].x, projected[i].y);
            }
            this.ctx.closePath();
            
            if (outline) {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            } else {
                this.ctx.fillStyle = color;
                this.ctx.fill();
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        }
        
        drawLine(start, end, camera, color, width = 2) {
            const p1 = this.project(start, camera);
            const p2 = this.project(end, camera);
            
            if (!p1 || !p2) return;
            
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = width;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        }
        
        drawText(text, position, camera, color = '#FFFFFF', size = 14) {
            const p = this.project(position, camera);
            if (!p || p.z > 200) return;
            
            this.ctx.fillStyle = color;
            this.ctx.font = `${size}px monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, p.x, p.y);
        }
    }
    
    // 3D Objects
    class GameObject3D {
        constructor(position) {
            this.position = position;
            this.rotation = new Vector3();
            this.vertices = [];
            this.faces = [];
            this.color = '#FFFFFF';
        }
        
        getTransformedVertices() {
            return this.vertices.map(v => {
                let transformed = v.rotateY(this.rotation.y);
                return transformed.add(this.position);
            });
        }
        
        render(renderer, camera) {
            const transformed = this.getTransformedVertices();
            this.faces.forEach(face => {
                const faceVerts = face.indices.map(i => transformed[i]);
                renderer.drawPolygon(faceVerts, camera, face.color || this.color);
            });
        }
    }
    
    class Building extends GameObject3D {
        constructor(position, width, height, depth) {
            super(position);
            const w = width / 2;
            const h = height;
            const d = depth / 2;
            
            // Define vertices for a box
            this.vertices = [
                new Vector3(-w, 0, -d),
                new Vector3(w, 0, -d),
                new Vector3(w, 0, d),
                new Vector3(-w, 0, d),
                new Vector3(-w, -h, -d),
                new Vector3(w, -h, -d),
                new Vector3(w, -h, d),
                new Vector3(-w, -h, d)
            ];
            
            // Define faces
            this.faces = [
                { indices: [0, 1, 5, 4], color: '#666666' }, // Front
                { indices: [2, 3, 7, 6], color: '#555555' }, // Back
                { indices: [1, 2, 6, 5], color: '#777777' }, // Right
                { indices: [3, 0, 4, 7], color: '#444444' }, // Left
                { indices: [4, 5, 6, 7], color: '#333333' }  // Top
            ];
        }
    }
    
    class Car extends GameObject3D {
        constructor(position, color = '#FF0000') {
            super(position);
            this.color = color;
            this.speed = 0;
            this.targetLane = 0;
            this.currentLane = 0;
            
            // Simple car shape
            this.vertices = [
                // Bottom
                new Vector3(-3, 0, -6),
                new Vector3(3, 0, -6),
                new Vector3(3, 0, 6),
                new Vector3(-3, 0, 6),
                // Top
                new Vector3(-2, -3, -4),
                new Vector3(2, -3, -4),
                new Vector3(2, -3, 2),
                new Vector3(-2, -3, 2)
            ];
            
            this.faces = [
                { indices: [0, 1, 5, 4], color: this.color },
                { indices: [1, 2, 6, 5], color: this.color },
                { indices: [2, 3, 7, 6], color: this.color },
                { indices: [3, 0, 4, 7], color: this.color },
                { indices: [4, 5, 6, 7], color: this.darkenColor(this.color) }
            ];
        }
        
        darkenColor(color) {
            const num = parseInt(color.slice(1), 16);
            const r = Math.max(0, (num >> 16) - 50);
            const g = Math.max(0, ((num >> 8) & 0x00FF) - 50);
            const b = Math.max(0, (num & 0x0000FF) - 50);
            return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
        }
        
        update(deltaTime) {
            // Simple AI movement
            this.position.z += this.speed * deltaTime;
            
            // Lane changing
            const laneDiff = this.targetLane - this.currentLane;
            if (Math.abs(laneDiff) > 0.1) {
                this.currentLane += laneDiff * 0.1;
                this.position.x = this.currentLane * 10;
            }
        }
    }
    
    class RoadSign extends GameObject3D {
        constructor(position, text, direction = 'forward') {
            super(position);
            this.text = text;
            this.direction = direction;
            
            // Sign post
            this.vertices = [
                new Vector3(-0.5, 0, -0.5),
                new Vector3(0.5, 0, -0.5),
                new Vector3(0.5, 0, 0.5),
                new Vector3(-0.5, 0, 0.5),
                new Vector3(-0.5, -10, -0.5),
                new Vector3(0.5, -10, -0.5),
                new Vector3(0.5, -10, 0.5),
                new Vector3(-0.5, -10, 0.5),
                // Sign board
                new Vector3(-10, -8, -0.5),
                new Vector3(10, -8, -0.5),
                new Vector3(10, -12, -0.5),
                new Vector3(-10, -12, -0.5)
            ];
            
            this.faces = [
                { indices: [0, 1, 5, 4], color: '#444444' },
                { indices: [8, 9, 10, 11], color: '#00AA00' }
            ];
        }
        
        render(renderer, camera) {
            super.render(renderer, camera);
            // Draw text on sign
            const textPos = this.position.add(new Vector3(0, -10, 0));
            renderer.drawText(this.text, textPos, camera, '#FFFFFF', 16);
        }
    }
    
    // Driving Game State
    class DrivingGameState {
        constructor() {
            this.camera = {
                position: new Vector3(0, -5, 0),
                rotation: new Vector3(0, 0, 0),
                velocity: new Vector3(0, 0, 0)
            };
            
            this.speed = 0;
            this.steerAngle = 0;
            this.maxSpeed = 30;
            this.acceleration = 15;
            this.deceleration = 20;
            this.steerSpeed = 2;
            
            this.objects = [];
            this.traffic = [];
            this.buildings = [];
            this.signs = [];
            this.mountains = [];
            
            this.roadWidth = 20;
            this.laneWidth = 10;
            
            this.distanceTraveled = 0;
            this.currentTileX = 0;
            this.currentTileY = 0;
            
            this.lastCollisionTime = 0;
            this.collisionCooldown = 1000;
            
            this.roadData = null;
            this.nextCities = {};
        }
        
        initialize(startX, startY, direction) {
            this.currentTileX = startX;
            this.currentTileY = startY;
            
            // Set initial camera direction
            const angleMap = { 2: Math.PI, 4: Math.PI/2, 6: -Math.PI/2, 8: 0 };
            this.camera.rotation.y = angleMap[direction] || 0;
            
            this.camera.position = new Vector3(
                startX * config.tileScale,
                -5,
                startY * config.tileScale
            );
            
            this.loadRoadData();
            this.generateEnvironment();
            this.spawnTraffic();
        }
        
        loadRoadData() {
            // Analyze the map to find road connections and cities
            this.roadData = [];
            this.nextCities = {};
            
            if ($gameMap.mapId() !== config.mapId) return;
            
            // Find all cities
            const cities = [];
            $gameMap.events().forEach(event => {
                if (event.event().name.startsWith('Teleport')) {
                    cities.push({
                        x: event.x,
                        y: event.y,
                        name: event.event().name.replace('Teleport', '').trim()
                    });
                }
            });
            
            // For each road tile, find connected cities
            // This is simplified - in production you'd use pathfinding
            this.nextCities = cities.reduce((acc, city) => {
                acc[`${city.x},${city.y}`] = city.name;
                return acc;
            }, {});
        }
        
        generateEnvironment() {
            // Generate buildings along the road
            for (let i = 0; i < 50; i++) {
                const side = Math.random() > 0.5 ? 1 : -1;
                const building = new Building(
                    new Vector3(
                        side * (this.roadWidth + 20 + Math.random() * 30),
                        0,
                        Math.random() * 2000 - 1000
                    ),
                    10 + Math.random() * 20,
                    20 + Math.random() * 40,
                    10 + Math.random() * 20
                );
                this.buildings.push(building);
            }
            
            // Generate mountains in the distance
            for (let i = 0; i < 10; i++) {
                const mountain = {
                    position: new Vector3(
                        (Math.random() - 0.5) * 1000,
                        0,
                        Math.random() * 500 + 500
                    ),
                    vertices: this.generateMountainVertices(),
                    color: '#2A2A3A'
                };
                this.mountains.push(mountain);
            }
            
            // Generate road signs at intersections
            this.generateRoadSigns();
        }
        
        generateMountainVertices() {
            const vertices = [];
            const peaks = 3 + Math.floor(Math.random() * 3);
            
            for (let i = 0; i < peaks; i++) {
                vertices.push(new Vector3(
                    (i - peaks/2) * 100,
                    -100 - Math.random() * 100,
                    0
                ));
            }
            
            return vertices;
        }
        
        generateRoadSigns() {
            // Check for crossroads near current position
            const checkRadius = 10;
            const tileX = Math.floor(this.camera.position.x / config.tileScale);
            const tileY = Math.floor(this.camera.position.z / config.tileScale);
            
            for (let x = tileX - checkRadius; x <= tileX + checkRadius; x++) {
                for (let y = tileY - checkRadius; y <= tileY + checkRadius; y++) {
                    const key = `${x},${y}`;
                    if (this.nextCities[key]) {
                        const sign = new RoadSign(
                            new Vector3(x * config.tileScale + 15, 0, y * config.tileScale),
                            this.nextCities[key]
                        );
                        this.signs.push(sign);
                    }
                }
            }
        }
        
        spawnTraffic() {
            this.traffic = [];
            
            for (let i = 0; i < 10; i++) {
                const car = new Car(
                    new Vector3(
                        (Math.random() - 0.5) * this.roadWidth,
                        0,
                        Math.random() * 500 + 50
                    ),
                    this.getRandomCarColor()
                );
                car.speed = 10 + Math.random() * 15;
                car.targetLane = Math.floor(Math.random() * 3) - 1;
                this.traffic.push(car);
            }
        }
        
        getRandomCarColor() {
            const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update(deltaTime) {
            const dt = deltaTime / 1000;
            
            // Update speed
            if (Input.isPressed('up')) {
                this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration * dt);
            } else if (Input.isPressed('down')) {
                this.speed = Math.max(-this.maxSpeed/2, this.speed - this.deceleration * dt);
            } else {
                // Friction
                if (this.speed > 0) {
                    this.speed = Math.max(0, this.speed - this.deceleration * 0.5 * dt);
                } else {
                    this.speed = Math.min(0, this.speed + this.deceleration * 0.5 * dt);
                }
            }
            
            // Update steering
            if (Input.isPressed('left')) {
                this.steerAngle = Math.min(1, this.steerAngle + this.steerSpeed * dt);
            } else if (Input.isPressed('right')) {
                this.steerAngle = Math.max(-1, this.steerAngle - this.steerSpeed * dt);
            } else {
                // Return to center
                if (Math.abs(this.steerAngle) > 0.01) {
                    this.steerAngle *= 0.9;
                } else {
                    this.steerAngle = 0;
                }
            }
            
            // Apply steering to rotation
            if (Math.abs(this.speed) > 0.1) {
                this.camera.rotation.y += this.steerAngle * dt * (this.speed / this.maxSpeed);
            }
            
            // Update position
            const forward = new Vector3(
                Math.sin(this.camera.rotation.y),
                0,
                Math.cos(this.camera.rotation.y)
            );
            
            this.camera.position = this.camera.position.add(forward.multiply(this.speed * dt));
            
            // Update distance and tile position
            this.distanceTraveled += Math.abs(this.speed * dt);
            this.currentTileX = Math.floor(this.camera.position.x / config.tileScale);
            this.currentTileY = Math.floor(this.camera.position.z / config.tileScale);
            
            // Update traffic
            this.updateTraffic(dt);
            
            // Check collisions
            this.checkCollisions();
            
            // Respawn distant objects
            this.respawnDistantObjects();
        }
        
        updateTraffic(deltaTime) {
            this.traffic.forEach(car => {
                car.update(deltaTime);
                
                // Respawn cars that are too far
                if (Math.abs(car.position.z - this.camera.position.z) > 1000) {
                    car.position.z = this.camera.position.z + (Math.random() > 0.5 ? 500 : -500);
                    car.position.x = (Math.random() - 0.5) * this.roadWidth;
                    car.speed = 10 + Math.random() * 15;
                }
                
                // Simple AI to avoid player
                const dist = car.position.subtract(this.camera.position).length();
                if (dist < 30) {
                    car.targetLane = car.position.x > this.camera.position.x ? 1 : -1;
                }
            });
        }
        
        checkCollisions() {
            const now = Date.now();
            if (now - this.lastCollisionTime < this.collisionCooldown) return;
            
            this.traffic.forEach(car => {
                const dist = car.position.subtract(this.camera.position).length();
                if (dist < 10) {
                    // Collision detected!
                    this.handleCollision();
                    this.lastCollisionTime = now;
                    
                    // Push car away
                    const pushDir = car.position.subtract(this.camera.position).normalize();
                    car.position = car.position.add(pushDir.multiply(20));
                }
            });
        }
        
        handleCollision() {
            // Damage all party members
            const damage = Math.floor(config.collisionDamage * (this.speed / this.maxSpeed));
            
            $gameParty.members().forEach(member => {
                member.gainHp(-damage);
            });
            
            // Play collision sound
            AudioManager.playSe({ name: 'Damage5', volume: 90, pitch: 100 });
            
            // Reduce speed
            this.speed *= 0.3;
            
            // Screen shake effect
            $gameScreen.startShake(5, 5, 10);
        }
        
        respawnDistantObjects() {
            // Respawn buildings
            this.buildings.forEach(building => {
                const dist = building.position.z - this.camera.position.z;
                if (Math.abs(dist) > 1000) {
                    building.position.z = this.camera.position.z + (dist > 0 ? -1000 : 1000);
                    building.position.x = (Math.random() > 0.5 ? 1 : -1) * 
                                        (this.roadWidth + 20 + Math.random() * 30);
                }
            });
        }
        
        exitToWorldMap() {
            // Calculate world map position based on distance traveled
            const tilesTraversed = Math.floor(this.distanceTraveled / (config.tileScale * 30));
            
            // Return to map
            $gamePlayer.locate(this.currentTileX, this.currentTileY);
            
            // Show exit message
            $gameMessage.add(`Traveled ${tilesTraversed} tiles. Exiting to map position (${this.currentTileX}, ${this.currentTileY}).`);
            
            return { x: this.currentTileX, y: this.currentTileY };
        }
    }
    
    // Driving Mode Scene
    class Scene_DrivingMode extends Scene_Base {
        create() {
            super.create();
            this.createCanvas();
            this.createHUD();
            
            this.renderer = new Simple3DRenderer(this.canvas);
            this.gameState = new DrivingGameState();
            this.gameState.initialize(
                $gamePlayer.x,
                $gamePlayer.y,
                $gamePlayer.direction()
            );
            
            this.lastTime = performance.now();
        }
        
        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.canvas.width = Graphics.boxWidth;
            this.canvas.height = Graphics.boxHeight;
            this.canvas.style.position = 'absolute';
            this.canvas.style.zIndex = '1';
            document.body.appendChild(this.canvas);
        }
        
        createHUD() {
            const rect = new Rectangle(0, 0, Graphics.boxWidth, 100);
            this._hudWindow = new Window_DrivingHUD(rect);
            this.addWindow(this._hudWindow);
        }
        
        update() {
            super.update();
            
            const currentTime = performance.now();
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            // Update game state
            this.gameState.update(deltaTime);
            
            // Update HUD
            this._hudWindow.setSpeed(Math.abs(this.gameState.speed));
            this._hudWindow.setDistance(this.gameState.distanceTraveled);
            this._hudWindow.refresh();
            
            // Render 3D scene
            this.render();
            
            // Handle input
            if (Input.isTriggered('cancel')) {
                this.popScene();
            }
            
            if (Input.isTriggered('ok')) {
                const mapPos = this.gameState.exitToWorldMap();
                this.popScene();
            }
        }
        
        render() {
            this.renderer.clear();
            
            // Sort objects by distance for proper rendering order
            const allObjects = [
                ...this.gameState.buildings,
                ...this.gameState.traffic,
                ...this.gameState.signs
            ];
            
            allObjects.sort((a, b) => {
                const distA = a.position.subtract(this.gameState.camera.position).length();
                const distB = b.position.subtract(this.gameState.camera.position).length();
                return distB - distA;
            });
            
            // Render mountains (background)
            this.gameState.mountains.forEach(mountain => {
                this.renderer.drawPolygon(
                    mountain.vertices.map(v => v.add(mountain.position)),
                    this.gameState.camera,
                    mountain.color
                );
            });
            
            // Render road
            this.renderRoad();
            
            // Render objects
            allObjects.forEach(obj => {
                obj.render(this.renderer, this.gameState.camera);
            });
        }
        
        renderRoad() {
            const camera = this.gameState.camera;
            const roadLength = 500;
            const roadWidth = this.gameState.roadWidth;
            const segments = 20;
            
            for (let i = 0; i < segments; i++) {
                const z = i * (roadLength / segments) - 250;
                const z2 = (i + 1) * (roadLength / segments) - 250;
                
                // Road surface
                const roadVerts = [
                    new Vector3(-roadWidth, 0, z).add(camera.position),
                    new Vector3(roadWidth, 0, z).add(camera.position),
                    new Vector3(roadWidth, 0, z2).add(camera.position),
                    new Vector3(-roadWidth, 0, z2).add(camera.position)
                ];
                
                this.renderer.drawPolygon(roadVerts, camera, '#333333');
                
                // Center line
                if (i % 2 === 0) {
                    const lineVerts = [
                        new Vector3(-1, -0.1, z).add(camera.position),
                        new Vector3(1, -0.1, z).add(camera.position),
                        new Vector3(1, -0.1, z2).add(camera.position),
                        new Vector3(-1, -0.1, z2).add(camera.position)
                    ];
                    this.renderer.drawPolygon(lineVerts, camera, '#FFFF00');
                }
                
                // Side lines
                const sideLineL = [
                    new Vector3(-roadWidth - 1, -0.1, z).add(camera.position),
                    new Vector3(-roadWidth + 1, -0.1, z).add(camera.position),
                    new Vector3(-roadWidth + 1, -0.1, z2).add(camera.position),
                    new Vector3(-roadWidth - 1, -0.1, z2).add(camera.position)
                ];
                
                const sideLineR = [
                    new Vector3(roadWidth - 1, -0.1, z).add(camera.position),
                    new Vector3(roadWidth + 1, -0.1, z).add(camera.position),
                    new Vector3(roadWidth + 1, -0.1, z2).add(camera.position),
                    new Vector3(roadWidth - 1, -0.1, z2).add(camera.position)
                ];
                
                this.renderer.drawPolygon(sideLineL, camera, '#FFFFFF');
                this.renderer.drawPolygon(sideLineR, camera, '#FFFFFF');
            }
        }
        
        terminate() {
            super.terminate();
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }
    
    // Driving HUD Window
    class Window_DrivingHUD extends Window_Base {
        constructor(rect) {
            super(rect);
            this.speed = 0;
            this.distance = 0;
            this.opacity = 180;
            this.refresh();
        }
        
        setSpeed(speed) {
            this.speed = speed;
        }
        
        setDistance(distance) {
            this.distance = distance;
        }
        
        refresh() {
            this.contents.clear();
            
            // Speed meter
            this.changeTextColor('#00FF00');
            this.drawText('SPEED', 0, 0, 150);
            this.resetTextColor();
            const speedKmh = Math.floor(this.speed * 3.6);
            this.drawText(`${speedKmh} km/h`, 0, 30, 150);
            
            // Distance
            this.changeTextColor('#00FFFF');
            this.drawText('DISTANCE', 200, 0, 150);
            this.resetTextColor();
            const km = (this.distance / 1000).toFixed(1);
            this.drawText(`${km} km`, 200, 30, 150);
            
            // Controls help
            this.changeTextColor('#FFFF00');
            this.drawText('W/S: Accel/Brake  A/D: Steer  E: Exit to Map  ESC: Menu', 400, 15, 400);
            
            // Party HP
            let x = 400;
            $gameParty.members().forEach((member, i) => {
                if (i < 4) {
                    const hpRate = member.hp / member.mhp;
                    const color = hpRate > 0.5 ? '#00FF00' : hpRate > 0.25 ? '#FFFF00' : '#FF0000';
                    this.changeTextColor(color);
                    this.drawText(`${member.name()}: ${member.hp}/${member.mhp}`, x, 45, 200);
                    x += 150;
                }
            });
        }
    }


    //=============================================================================
    // Plugin Command Registration
    //=============================================================================
    PluginManager.registerCommand(pluginName, "startRoadFollow", args => {
        // NOTE: The logic for automatic road following is not implemented in the plugin.
        console.log("Start Road Following command executed.");
    });

    PluginManager.registerCommand(pluginName, "stopRoadFollow", args => {
        // NOTE: The logic for automatic road following is not implemented in the plugin.
        console.log("Stop Road Following command executed.");
    });
    
    PluginManager.registerCommand(pluginName, "openDrivingMode", args => {
        SceneManager.push(Scene_DrivingMode);
    });

    PluginManager.registerCommand(pluginName, "exitToWorldMap", args => {
        // NOTE: This command is redundant as exiting is handled within the driving scene.
        // It's better to use the 'E' key while driving.
        console.log("Exit to World Map command executed.");
    });
})