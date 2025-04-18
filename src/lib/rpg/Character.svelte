<!-- src/lib/components/rpg/Character.svelte -->
<script>
    import { characterClasses } from "$lib/stories/characterclasses.ts";
    import { characterStore } from "$lib/stores/character.ts";
    import Stats from "$lib/rpg/widgets/Stats.svelte";
    import Skills from "$lib/rpg/widgets/Skills.svelte";
    import Inventory from "$lib/rpg/widgets/Inventory.svelte";
    import Abilitites from "$lib/rpg/widgets/Abilitites.svelte";
    import Attributes from "$lib/rpg/widgets/Attributes.svelte";

    export let spendSkillPoint;

    export let expandedSection = "stats"; // stats, inventory, skills, abilities

    function toggleSection(section) {
        expandedSection = expandedSection === section ? null : section;
    }
</script>

<div class="character-sheet">
    <h2>{$characterStore.name}</h2>
    <div class="character-class">
        <span class="label">Class:</span>
        {$characterStore.className}
    </div>

    <div class="character-level">
        <span class="label">Level:</span>
        {$characterStore.level}
        <div class="xp-bar">
            <div
                class="xp-fill"
                style="width: {(($characterStore.experience %
                    ($characterStore.level * 100)) /
                    ($characterStore.level * 100)) *
                    100}%"
            ></div>
        </div>
        <div class="xp-text">
            XP: {$characterStore.experience} / {$characterStore.level * 100}
        </div>
    </div>

    <!-- Body Section -->
    <a class="section-header" onclick={() => toggleSection("body")}>
        <h3>Physical Attributes</h3>
        <span class="toggle-icon"
            >{expandedSection === "body" ? "▼" : "▶"}</span
        >
    </a>

    {#if expandedSection === "body" && $characterStore.body}
        <Attributes />
    {/if}

    <div class="stats-section">
        <button class="section-header" onclick={() => toggleSection("stats")}>
            <h3>Character Stats</h3>
            <span class="toggle-icon"
                >{expandedSection === "stats" ? "▼" : "▶"}</span
            >
        </button>

        {#if expandedSection === "stats" && $characterStore.stats}
            <Stats />
        {/if}
    </div>

    <a class="section-header" onclick={() => toggleSection("skills")}>
        <h3>
            Skills {$characterStore.skillPoints
                ? `(${$characterStore.skillPoints} points available)`
                : ""}
        </h3>
        <span class="toggle-icon"
            >{expandedSection === "skills" ? "▼" : "▶"}</span
        >
    </a>

    {#if expandedSection === "skills"}
        <Skills />
    {/if}

    <a class="section-header" onclick={() => toggleSection("abilities")}>
        <h3>Abilities</h3>
        <span class="toggle-icon"
            >{expandedSection === "abilities" ? "▼" : "▶"}</span
        >
    </a>

    {#if expandedSection === "abilities" && $characterStore.abilities}
        <Abilitites />
    {/if}

    <a class="section-header" onclick={() => toggleSection("inventory")}>
        <h3>Inventory</h3>
        <button class="toggle-icon"
            >{expandedSection === "inventory" ? "▼" : "▶"}</button
        >
    </a>

    {#if expandedSection === "inventory"}
        <Inventory />
    {/if}
</div>

<style>
    .character-sheet {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 15px;
    }

    h2 {
        margin-top: 0;
        border-bottom: 2px solid #ddd;
        padding-bottom: 8px;
    }

    .xp-bar {
        height: 10px;
        background-color: #ddd;
        border-radius: 5px;
        margin: 5px 0;
        overflow: hidden;
    }

    .xp-fill {
        height: 100%;
        background-color: #4a6;
    }

    .xp-text {
        font-size: 12px;
        color: #666;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        padding: 5px;
        margin-top: 15px;
        background-color: #e9e9e9;
        border-radius: 4px;
    }

    .section-header h3 {
        margin: 0;
    }

    .section-content {
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 0 0 4px 4px;
    }
</style>
