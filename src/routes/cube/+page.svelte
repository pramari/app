<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let canvasElement: HTMLCanvasElement;
    let labelContainerElement: HTMLDivElement; // Reference to the labels' container
    let ctx: CanvasRenderingContext2D | null = null;
    let animationFrameId: number;

    // --- Cube Definition ---
    const cubeSize = 120; // Slightly smaller to fit next to labels
    const halfSize = cubeSize / 2;

    const vertices = [
        { x: -halfSize, y: -halfSize, z: -halfSize },
        { x: halfSize, y: -halfSize, z: -halfSize },
        { x: halfSize, y: halfSize, z: -halfSize },
        { x: -halfSize, y: halfSize, z: -halfSize },
        { x: -halfSize, y: -halfSize, z: halfSize },
        { x: halfSize, y: -halfSize, z: halfSize },
        { x: halfSize, y: halfSize, z: halfSize },
        { x: -halfSize, y: halfSize, z: halfSize },
    ];
    const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
    ];

    // 1. Define 3D coordinates for dots on faces (relative to cube center)
    //    and map them to label IDs
    const faceDots = [
        { id: "label-front", x: 0, y: 0, z: halfSize }, // Front Face (+Z)
        { id: "label-right", x: halfSize, y: 0, z: 0 }, // Right Face (+X)
        { id: "label-top", x: 0, y: halfSize, z: 0 }, // Top Face   (+Y)
    ];

    // Store calculated 2D positions for labels relative to canvas
    let labelPositions: { [key: string]: { x: number; y: number } } = {};

    // --- Rotation and Projection ---
    let angleX = 0.3; // Start tilted slightly
    let angleY = 0.4;
    const rotationSpeed = 0.01;
    let distance = 400;

    function rotateX(p: { x: number; y: number; z: number }, angle: number) {
        /* ... (same as before) ... */
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const y = p.y * cos - p.z * sin;
        const z = p.y * sin + p.z * cos;
        return { x: p.x, y, z };
    }
    function rotateY(p: { x: number; y: number; z: number }, angle: number) {
        /* ... (same as before) ... */
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = p.x * cos + p.z * sin;
        const z = -p.x * sin + p.z * cos;
        return { x, y: p.y, z };
    }
    function project(
        p: { x: number; y: number; z: number },
        cw: number,
        ch: number,
    ) {
        /* ... (same as before) ... */
        const perspectiveFactor = distance / (distance + p.z);
        const projectedX = p.x * perspectiveFactor + cw / 2;
        const projectedY = p.y * perspectiveFactor + ch / 2;
        return { x: projectedX, y: projectedY };
    }

    // --- Drawing and Animation ---
    function draw() {
        if (!ctx || !canvasElement) return;

        const cw = canvasElement.width;
        const ch = canvasElement.height;

        // Clear canvas
        ctx.fillStyle = "#222222";
        ctx.fillRect(0, 0, cw, ch);

        // --- Rotate & Project Cube Vertices ---
        const rotatedVertices = vertices.map((v) => {
            let rotated = rotateY(v, angleY);
            rotated = rotateX(rotated, angleX);
            return rotated;
        });
        const projectedVertices = rotatedVertices.map((v) =>
            project(v, cw, ch),
        );

        // --- Draw Cube Edges ---
        ctx.strokeStyle = "#00dd00"; // Slightly brighter green
        ctx.lineWidth = 1.5;
        edges.forEach((edge) => {
            const p1 = projectedVertices[edge[0]];
            const p2 = projectedVertices[edge[1]];
            if (p1 && p2) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });

        // --- Rotate, Project, and Draw Dots + Connecting Lines ---
        faceDots.forEach((dotInfo) => {
            // Rotate dot 3D position
            let rotatedDot = rotateY(dotInfo, angleY);
            rotatedDot = rotateX(rotatedDot, angleX);

            // Project dot to 2D canvas coordinates
            const projectedDot = project(rotatedDot, cw, ch);

            // Get the target label's position (relative to canvas)
            const targetLabelPos = labelPositions[dotInfo.id];

            if (projectedDot && targetLabelPos) {
                // Draw the dot on the cube face
                ctx.fillStyle = "#ffff00"; // Yellow dot
                ctx.beginPath();
                ctx.arc(projectedDot.x, projectedDot.y, 4, 0, Math.PI * 2); // Small circle
                ctx.fill();

                // Draw the connecting line
                ctx.strokeStyle = "#aaaaaa"; // Grey line
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(projectedDot.x, projectedDot.y);
                ctx.lineTo(targetLabelPos.x, targetLabelPos.y);
                ctx.stroke();
            }
        });
    }

    function animate() {
        angleX += rotationSpeed * 0.6; // Tweak speeds
        angleY += rotationSpeed;

        draw();
        animationFrameId = requestAnimationFrame(animate);
    }

    // 4. Calculate label positions relative to the canvas
    function calculateLabelPositions() {
        if (!canvasElement || !labelContainerElement) return;

        const canvasRect = canvasElement.getBoundingClientRect();
        labelPositions = {}; // Reset

        faceDots.forEach((dotInfo) => {
            const labelElement = document.getElementById(dotInfo.id);
            if (labelElement) {
                const labelRect = labelElement.getBoundingClientRect();
                // Calculate center of label relative to canvas top-left
                const x =
                    labelRect.left + labelRect.width / 2 - canvasRect.left;
                const y = labelRect.top + labelRect.height / 2 - canvasRect.top;
                labelPositions[dotInfo.id] = { x, y };
                // console.log(`Label ${dotInfo.id} canvas relative pos:`, x, y);
            }
        });
    }

    function handleResize() {
        if (!canvasElement || !ctx) return;
        const displayWidth = canvasElement.clientWidth;
        const displayHeight = canvasElement.clientHeight;

        if (
            canvasElement.width !== displayWidth ||
            canvasElement.height !== displayHeight
        ) {
            canvasElement.width = displayWidth;
            canvasElement.height = displayHeight;
            // Recalculate distance based on smaller dimension for consistent projection
            distance = Math.min(displayWidth, displayHeight) * 1.5;
            console.log(`Canvas resized to: ${displayWidth}x${displayHeight}`);
        }
        // ALWAYS recalculate label positions on resize, as layout might change
        calculateLabelPositions();
        // No need to call draw() here, animate loop will handle it.
    }

    onMount(() => {
        if (!canvasElement) return;
        ctx = canvasElement.getContext("2d");
        if (!ctx) return;

        // Initial size setup & label position calculation
        handleResize(); // Sets canvas size, distance, and calculates initial label positions
        window.addEventListener("resize", handleResize);

        animate(); // Start the animation loop

        return () => {
            // Cleanup
            console.log("Cleaning up Canvas 2D cube with labels");
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            ctx = null;
            labelPositions = {};
        };
    });
</script>

<svelte:head>
    <title>Cube Dots to Labels</title>
</svelte:head>

<!-- 1. Main container using Flexbox -->
<div class="main-container">
    <!-- Canvas container (takes up most space) -->
    <div class="canvas-container">
        <canvas bind:this={canvasElement}></canvas>
    </div>

    <!-- 3. Labels container -->
    <div bind:this={labelContainerElement} class="label-area">
        <div class="label" id="label-front">Front Point</div>
        <div class="label" id="label-right">Right Point</div>
        <div class="label" id="label-top">Top Point</div>
    </div>
</div>

<style>
    /* Use flexbox for side-by-side layout */
    .main-container {
        display: flex;
        align-items: stretch; /* Make items fill height */
        width: 100%;
        height: 85vh; /* Adjust overall height */
        background-color: #1a1a1a;
        gap: 20px; /* Space between canvas and labels */
        padding: 15px;
        box-sizing: border-box;
    }

    .canvas-container {
        flex-grow: 1; /* Allow canvas to take available space */
        display: flex; /* To center canvas if needed, or just contain */
        justify-content: center;
        align-items: center;
        min-width: 0; /* Prevent flex item from overflowing */
        overflow: hidden;
    }

    canvas {
        display: block;
        max-width: 100%; /* Ensure canvas doesn't exceed its container */
        max-height: 100%;
        /* Background is set in JS clearRect */
        /* border: 1px dashed grey; */ /* For debugging layout */
    }

    .label-area {
        flex-shrink: 0; /* Prevent labels from shrinking */
        width: 150px; /* Fixed width for label area */
        display: flex;
        flex-direction: column;
        justify-content: space-around; /* Distribute labels vertically */
        padding: 10px;
        /* border: 1px dashed lightblue; */ /* For debugging layout */
    }

    .label {
        padding: 8px 12px;
        background-color: #444;
        color: #eee;
        border-radius: 4px;
        text-align: center;
        font-family: sans-serif;
        font-size: 0.9em;
        border: 1px solid #666;
    }
</style>
