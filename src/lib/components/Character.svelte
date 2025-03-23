<!-- src/lib/components/rpg/Character.svelte -->
<script>
    import {
        skills,
        skillCategories,
        getSkillInfo,
    } from "$lib/components/stories/skills.js";

    export let player;
    export let spendSkillPoint;

    let expandedSection = "stats"; // stats, inventory, skills, abilities

    function toggleSection(section) {
        expandedSection = expandedSection === section ? null : section;
    }

    // Group skills by category for better display
    $: groupedSkills = Object.entries(player?.skills || {}).reduce(
        (acc, [skillId, value]) => {
            const skillInfo = getSkillInfo(skillId);
            const category = skillInfo.category;

            if (!acc[category]) {
                acc[category] = [];
            }

            acc[category].push({
                id: skillId,
                value,
                ...skillInfo,
            });

            return acc;
        },
        {},
    );
</script>

<div class="character-sheet">
    <h2>{player.name}</h2>
    <div class="character-class">
        <span class="label">Class:</span>
        {player.class.name}
    </div>

    <div class="character-level">
        <span class="label">Level:</span>
        {player.level}
        <div class="xp-bar">
            <div
                class="xp-fill"
                style="width: {((player.experience % (player.level * 100)) /
                    (player.level * 100)) *
                    100}%"
            ></div>
        </div>
        <div class="xp-text">
            XP: {player.experience} / {player.level * 100}
        </div>
    </div>

    <div class="section-header" on:click={() => toggleSection("stats")}>
        <h3>Character Stats</h3>
        <span class="toggle-icon"
            >{expandedSection === "stats" ? "▼" : "▶"}</span
        >
    </div>

    {#if expandedSection === "stats" && player.stats}
        <div class="section-content">
            <div class="stats-grid">
                {#each Object.entries(player.stats) as [stat, value]}
                    <div class="stat-item">
                        <span class="stat-name"
                            >{stat.charAt(0).toUpperCase() +
                                stat.slice(1)}</span
                        >
                        <span class="stat-value">{value}</span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <div class="section-header" on:click={() => toggleSection("skills")}>
        <h3>
            Skills {player.skillPoints
                ? `(${player.skillPoints} points available)`
                : ""}
        </h3>
        <span class="toggle-icon"
            >{expandedSection === "skills" ? "▼" : "▶"}</span
        >
    </div>

    {#if expandedSection === "skills"}
        <div class="section-content">
            {#each Object.entries(groupedSkills) as [category, categorySkills]}
                <div class="skill-category">
                    <h4>{skillCategories[category]?.name || category}</h4>

                    <div class="skills-list">
                        {#each categorySkills as skill}
                            <div class="skill-item" title={skill.description}>
                                <span class="skill-icon">{skill.icon}</span>
                                <span class="skill-name">{skill.name}</span>
                                <span class="skill-value">{skill.value}</span>
                                {#if (player.skillPoints || 0) > 0}
                                    <button
                                        class="improve-skill"
                                        on:click={() =>
                                            spendSkillPoint(skill.id)}>+</button
                                    >
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <div class="section-header" on:click={() => toggleSection("abilities")}>
        <h3>Abilities</h3>
        <span class="toggle-icon"
            >{expandedSection === "abilities" ? "▼" : "▶"}</span
        >
    </div>

    {#if expandedSection === "abilities" && player.abilities}
        <div class="section-content">
            <div class="abilities-list">
                {#each player.abilities as abilityId}
                    {@const ability = (
                        (player.class &&
                            characterClasses.find((c) => c.id === player.class)
                                ?.abilities) ||
                        []
                    ).find((a) => a.id === abilityId)}
                    {#if ability}
                        <div class="ability-item">
                            <h4>{ability.name}</h4>
                            <p>{ability.description}</p>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}

    <div class="section-header" on:click={() => toggleSection("inventory")}>
        <h3>Inventory</h3>
        <span class="toggle-icon"
            >{expandedSection === "inventory" ? "▼" : "▶"}</span
        >
    </div>

    {#if expandedSection === "inventory"}
        <div class="section-content">
            {#if player.inventory.length === 0}
                <p>Your inventory is empty.</p>
            {:else}
                <ul class="inventory-list">
                    {#each player.inventory as item}
                        <li>
                            {item.name}
                            {#if item.description}<span class="item-description"
                                    >- {item.description}</span
                                >{/if}
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
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

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
    }

    .skill-category {
        margin-bottom: 15px;
    }

    .skill-category h4 {
        margin: 0 0 5px 0;
        color: #444;
        font-size: 0.9em;
        border-bottom: 1px solid #ddd;
    }

    .skill-item {
        display: flex;
        align-items: center;
        padding: 5px 0;
        border-bottom: 1px dashed #ddd;
    }

    .skill-icon {
        width: 24px;
        text-align: center;
        margin-right: 5px;
    }

    .skill-name {
        flex: 1;
    }

    .improve-skill {
        background-color: #4a6;
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
        font-weight: bold;
        margin-left: 5px;
    }

    .ability-item {
        background: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 8px;
    }

    .ability-item h4 {
        margin: 0 0 5px 0;
        color: #444;
    }

    .ability-item p {
        margin: 0;
        font-size: 0.9em;
        color: #666;
    }

    .inventory-list {
        list-style-type: none;
        padding-left: 0;
    }

    .inventory-list li {
        padding: 5px 0;
        border-bottom: 1px solid #eee;
    }

    .item-description {
        font-size: 0.9em;
        color: #666;
    }
</style>
