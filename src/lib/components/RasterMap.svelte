<!-- src/lib/components/rpg/RasterMap.svelte -->
<script>
    import { createEventDispatcher, onMount } from "svelte";

    // Export props
    export let mapImage;
    export let mapWidth = 400;
    export let mapHeight = 300;
    export let playerPosition = { x: 200, y: 150 };
    export let playerAvatar = "🧙‍♂️";
    export let obstacles = []; // Areas where player can't walk
    export let interactiveAreas = []; // Areas that trigger events when entered
    export let moveSpeed = 10; // Pixels per movement
    export let allowMovement = true;

    // Create a dispatcher for events
    const dispatch = createEventDispatcher();

    // Track keyboard state
    let keys = {};
    let canvasElement;
    let ctx;
    let animationFrame;
    let playerSize = 30; // Size of player avatar in pixels

    onMount(() => {
        // Set up the canvas
        if (canvasElement) {
            ctx = canvasElement.getContext("2d");

            // Load map image
            const img = new Image();
            img.src = mapImage;
            img.onload = () => {
                // Initial draw of the map
                drawMap(img);
            };

            // Set up keyboard listeners
            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);

            // Start animation loop
            startGameLoop(img);
        }

        return () => {
            // Clean up
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            cancelAnimationFrame(animationFrame);
        };
    });

    function handleKeyDown(e) {
        keys[e.key] = true;
    }

    function handleKeyUp(e) {
        keys[e.key] = false;
    }

    function startGameLoop(mapImg) {
        let lastTime = 0;

        function gameLoop(timestamp) {
            // Calculate delta time for smooth movement
            const deltaTime = lastTime ? (timestamp - lastTime) / 16.67 : 1; // normalize to ~60fps
            lastTime = timestamp;

            // Process movement if allowed
            if (allowMovement) {
                processMovement(deltaTime);
            }

            // Check for interactions with areas
            checkInteractions();

            // Redraw the map
            drawMap(mapImg);

            // Continue the loop
            animationFrame = requestAnimationFrame(gameLoop);
        }

        animationFrame = requestAnimationFrame(gameLoop);
    }

    function processMovement(deltaTime) {
        let newX = playerPosition.x;
        let newY = playerPosition.y;
        const adjustedSpeed = moveSpeed * deltaTime;

        // Check directional keys
        if (keys["ArrowUp"] || keys["w"]) newY -= adjustedSpeed;
        if (keys["ArrowDown"] || keys["s"]) newY += adjustedSpeed;
        if (keys["ArrowLeft"] || keys["a"]) newX -= adjustedSpeed;
        if (keys["ArrowRight"] || keys["d"]) newX += adjustedSpeed;

        // Check if the new position is valid (within map bounds and not hitting obstacles)
        if (isValidPosition(newX, newY)) {
            playerPosition = { x: newX, y: newY };
            dispatch("playerMoved", { position: playerPosition });
        }
    }

    function isValidPosition(x, y) {
        // Check map boundaries
        if (
            x < playerSize / 2 ||
            x > mapWidth - playerSize / 2 ||
            y < playerSize / 2 ||
            y > mapHeight - playerSize / 2
        ) {
            return false;
        }

        // Check collision with obstacles
        for (const obstacle of obstacles) {
            if (isCollidingWithObstacle(x, y, obstacle)) {
                return false;
            }
        }

        return true;
    }

    function isCollidingWithObstacle(x, y, obstacle) {
        // Rectangle collision detection
        if (obstacle.type === "rect") {
            return (
                x + playerSize / 2 > obstacle.x &&
                x - playerSize / 2 < obstacle.x + obstacle.width &&
                y + playerSize / 2 > obstacle.y &&
                y - playerSize / 2 < obstacle.y + obstacle.height
            );
        }

        // Circle collision detection
        if (obstacle.type === "circle") {
            const dx = x - obstacle.x;
            const dy = y - obstacle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < obstacle.radius + playerSize / 2;
        }

        // Polygon collision is more complex and not implemented here
        return false;
    }

    function checkInteractions() {
        for (const area of interactiveAreas) {
            if (isPlayerInArea(playerPosition.x, playerPosition.y, area)) {
                if (!area.entered) {
                    area.entered = true;
                    dispatch("areaEntered", { areaId: area.id, area });
                }
            } else if (area.entered) {
                area.entered = false;
                dispatch("areaLeft", { areaId: area.id, area });
            }
        }
    }

    function isPlayerInArea(x, y, area) {
        // Similar to obstacle collision but for interaction areas
        if (area.type === "rect") {
            return (
                x > area.x &&
                x < area.x + area.width &&
                y > area.y &&
                y < area.y + area.height
            );
        }

        if (area.type === "circle") {
            const dx = x - area.x;
            const dy = y - area.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < area.radius;
        }

        return false;
    }

    function drawMap(mapImg) {
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, mapWidth, mapHeight);

        // Draw the map image
        ctx.drawImage(mapImg, 0, 0, mapWidth, mapHeight);

        // Draw obstacles (for debugging)
        if (window.DEBUG_MODE) {
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            for (const obstacle of obstacles) {
                if (obstacle.type === "rect") {
                    ctx.fillRect(
                        obstacle.x,
                        obstacle.y,
                        obstacle.width,
                        obstacle.height,
                    );
                } else if (obstacle.type === "circle") {
                    ctx.beginPath();
                    ctx.arc(
                        obstacle.x,
                        obstacle.y,
                        obstacle.radius,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                }
            }

            // Draw interactive areas (for debugging)
            ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
            for (const area of interactiveAreas) {
                if (area.type === "rect") {
                    ctx.fillRect(area.x, area.y, area.width, area.height);
                } else if (area.type === "circle") {
                    ctx.beginPath();
                    ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Draw player
        if (typeof playerAvatar === "string" && playerAvatar.length <= 2) {
            // Draw emoji or character
            ctx.font = `${playerSize}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(playerAvatar, playerPosition.x, playerPosition.y);
        } else {
            // Draw a circular avatar with color
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(
                playerPosition.x,
                playerPosition.y,
                playerSize / 2,
                0,
                Math.PI * 2,
            );
            ctx.fill();

            // Add a border
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Handle click on map
    function handleMapClick(event) {
        const rect = canvasElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Dispatch click event with coordinates
        dispatch("mapClicked", { x, y });

        // Check if clicked on an interactive area
        for (const area of interactiveAreas) {
            if (isPlayerInArea(x, y, area)) {
                dispatch("areaClicked", { areaId: area.id, area });
            }
        }
    }
</script>

<div class="raster-map-container">
    <canvas
        bind:this={canvasElement}
        width={mapWidth}
        height={mapHeight}
        on:click={handleMapClick}
    ></canvas>

    <div class="map-controls">
        <div class="movement-instructions">
            <p>Use arrow keys or WASD to move your character on the map.</p>
        </div>

        <div class="player-position">
            <span
                >Position: X:{Math.round(playerPosition.x)}, Y:{Math.round(
                    playerPosition.y,
                )}</span
            >
        </div>
    </div>
</div>

<style>
    .raster-map-container {
        position: relative;
        margin: 0 auto;
        overflow: hidden;
    }

    canvas {
        border: 2px solid #8b7d6b;
        border-radius: 8px;
        display: block;
    }

    .map-controls {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .movement-instructions {
        font-style: italic;
        color: #666;
        font-size: 0.9em;
    }

    .player-position {
        font-family: monospace;
        background: #f0f0f0;
        padding: 5px 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
    }
</style>
