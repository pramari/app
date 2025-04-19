<!-- src/lib/components/rpg/RasterMap.svelte -->
<script>
    import { createEventDispatcher, onMount } from "svelte";

    // Export props
    export let mapWidth = 400;
    export let mapHeight = 300;
    export let playerPosition = { x: 200, y: 150 };
    export let playerAvatar = "🧙‍♂️";
    export let obstacles = []; // Areas where player can't walk
    export let interactiveAreas = []; // Areas that trigger events when entered
    export let moveSpeed = 10; // Pixels per movement
    export let allowMovement = true;

    // Viewport properties
    export let viewportWidth = 400; // Width of the viewport (canvas)
    export let viewportHeight = 300; // Height of the viewport (canvas)

    // Create a dispatcher for events
    const dispatch = createEventDispatcher();

    // Track keyboard state
    let keys = {};
    let canvasElement;
    let ctx;
    let animationFrame;
    let playerSize = 30; // Size of player avatar in pixels

    // Track viewport offset
    let viewportOffsetX = 0;
    let viewportOffsetY = 0;

    onMount(() => {
        // Set up the canvas
        if (canvasElement) {
            ctx = canvasElement.getContext("2d");

            // Load map image
            const img = new Image();
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

        // Valid position - update viewport offset when position changes
        // This makes sure viewport is updated immediately after position check
        updateViewportOffset();

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

    // Helper function to draw a dot grid background
    function drawDotGrid() {
        // Set background color
        ctx.fillStyle = "#f8f8f8";
        ctx.fillRect(0, 0, mapWidth, mapHeight);

        // Set up the dot grid style
        ctx.fillStyle = "#cccccc";

        // Define dot size and spacing
        const dotSize = 1.5;
        const spacing = 20;

        // Draw the grid of dots
        for (let x = spacing; x < mapWidth; x += spacing) {
            for (let y = spacing; y < mapHeight; y += spacing) {
                ctx.beginPath();
                ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function updateViewportOffset() {
        if (!canvasElement) return;

        // Calculate the offset needed to keep player centered in viewport
        viewportOffsetX = playerPosition.x - viewportWidth / 2;
        viewportOffsetY = playerPosition.y - viewportHeight / 2;

        // Clamp offset to map boundaries
        viewportOffsetX = Math.max(
            0,
            Math.min(viewportOffsetX, mapWidth - viewportWidth),
        );
        viewportOffsetY = Math.max(
            0,
            Math.min(viewportOffsetY, mapHeight - viewportHeight),
        );
    }

    function drawMap(mapImg) {
        if (!ctx) return;

        // Update viewport offset to follow player
        updateViewportOffset();

        // Clear the entire canvas
        ctx.clearRect(0, 0, viewportWidth, viewportHeight);

        // Save context state
        ctx.save();

        // Translate context to create camera effect - center the view on player
        ctx.translate(-viewportOffsetX, -viewportOffsetY);

        // Draw dot grid for the entire map
        drawDotGrid();

        // Draw map boundaries as a visual indicator
        ctx.strokeStyle = "rgba(50, 50, 50, 0.5)";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, mapWidth, mapHeight);

        // Draw obstacles - always visible
        ctx.fillStyle = "rgba(100, 70, 50, 0.5)"; // Brown color for obstacles
        for (const obstacle of obstacles) {
            // Only draw obstacles that are within or near the viewport
            if (!isObjectInViewport(obstacle, 50)) continue;

            if (obstacle.type === "rect") {
                ctx.fillRect(
                    obstacle.x,
                    obstacle.y,
                    obstacle.width,
                    obstacle.height,
                );

                // Add a subtle border
                ctx.strokeStyle = "rgba(80, 50, 30, 0.8)";
                ctx.lineWidth = 1;
                ctx.strokeRect(
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

                // Add a subtle border
                ctx.strokeStyle = "rgba(80, 50, 30, 0.8)";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        // Draw interactive areas (only in debug mode)
        if (window.DEBUG_MODE) {
            ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
            for (const area of interactiveAreas) {
                if (!isObjectInViewport(area, 50)) continue;

                if (area.type === "rect") {
                    ctx.fillRect(area.x, area.y, area.width, area.height);
                } else if (area.type === "circle") {
                    ctx.beginPath();
                    ctx.arc(area.x, area.y, area.radius || 30, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Draw location icons for interactive areas
        for (const area of interactiveAreas) {
            // Skip areas that are far outside the viewport
            if (!isObjectInViewport(area, 50)) continue;

            // Get coordinates
            const x = area.x;
            const y = area.y;

            // Draw icon background
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();

            // Draw icon or letter
            ctx.font = "16px Arial";
            ctx.fillStyle = "#333";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Use area name initial if no icon specified
            const icon = area.icon || area.name?.charAt(0) || "?";
            ctx.fillText(icon, x, y);

            // Draw name below (only if player is nearby)
            const distToPlayer = Math.sqrt(
                Math.pow(playerPosition.x - x, 2) +
                    Math.pow(playerPosition.y - y, 2),
            );

            if (distToPlayer < 120) {
                // Only show names when close enough
                ctx.font = "12px Arial";
                ctx.fillStyle = "black";
                ctx.fillText(area.name || area.id, x, y + 25);
            }
        }

        // Restore context to reset translation before drawing player
        ctx.restore();

        // Calculate player position in viewport
        // Player should be drawn at the center of the viewport, unless at map edges
        const playerViewportX = playerPosition.x - viewportOffsetX;
        const playerViewportY = playerPosition.y - viewportOffsetY;

        // Draw player at viewport position
        if (typeof playerAvatar === "string" && playerAvatar.length <= 2) {
            // Draw emoji or character
            ctx.font = `${playerSize}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(playerAvatar, playerViewportX, playerViewportY);
        } else {
            // Draw a circular avatar with color
            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(
                playerViewportX,
                playerViewportY,
                playerSize / 2,
                0,
                Math.PI * 2,
            );
            ctx.fill();

            // Add a border
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw a target circle around player for better visibility
            ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(
                playerViewportX,
                playerViewportY,
                playerSize,
                0,
                Math.PI * 2,
            );
            ctx.stroke();
        }
    }

    // Helper function to check if an object is within or near the viewport
    function isObjectInViewport(obj, padding = 0) {
        // For rectangular objects
        if (obj.type === "rect") {
            return !(
                obj.x > viewportOffsetX + viewportWidth + padding ||
                obj.x + obj.width < viewportOffsetX - padding ||
                obj.y > viewportOffsetY + viewportHeight + padding ||
                obj.y + obj.height < viewportOffsetY - padding
            );
        }

        // For circular objects
        if (obj.type === "circle") {
            const radius = obj.radius || 30;
            return !(
                obj.x + radius < viewportOffsetX - padding ||
                obj.x - radius > viewportOffsetX + viewportWidth + padding ||
                obj.y + radius < viewportOffsetY - padding ||
                obj.y - radius > viewportOffsetY + viewportHeight + padding
            );
        }

        // For point objects (default to small rectangle)
        return !(
            obj.x > viewportOffsetX + viewportWidth + padding ||
            obj.x < viewportOffsetX - padding ||
            obj.y > viewportOffsetY + viewportHeight + padding ||
            obj.y < viewportOffsetY - padding
        );
    }

    // Handle click on map
    function handleMapClick(event) {
        // Get click position in the canvas element
        const rect = canvasElement.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        // Convert canvas coordinates to map coordinates by adding viewport offset
        const mapX = canvasX + viewportOffsetX;
        const mapY = canvasY + viewportOffsetY;

        console.log(
            "Click detected - Canvas coords:",
            canvasX,
            canvasY,
            "Map coords:",
            mapX,
            mapY,
        );

        // Dispatch click event with map coordinates
        dispatch("mapClicked", { x: mapX, y: mapY });

        // Check if clicked on an interactive area
        for (const area of interactiveAreas) {
            if (isPlayerInArea(mapX, mapY, area)) {
                dispatch("areaClicked", { areaId: area.id, area });
            }
        }
    }
</script>

<div class="raster-map-container">
    <canvas
        bind:this={canvasElement}
        width={viewportWidth}
        height={viewportHeight}
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
