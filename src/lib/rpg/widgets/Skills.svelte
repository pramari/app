<script>
    import { characterStore } from "$lib/stores/character.ts";
    import { skillCategories, getSkillInfo } from "$lib/stories/skills.ts";

    // Group skills by category for better display
    $: groupedSkills = Object.entries($characterStore?.skills || {}).reduce(
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

<div class="section-content">
    Skills: {$characterStore.skillPoints || 0} skill points available
    {#each Object.entries(groupedSkills) as [category, categorySkills]}
        <div class="skill-category">
            <h4>{skillCategories[category]?.name || category}</h4>

            <div class="skills-list">
                {#each categorySkills as skill}
                    <div class="skill-item" title={skill.description}>
                        <span class="skill-icon">{skill.icon}</span>
                        <span class="skill-name">{skill.name}</span>
                        <span class="skill-value">{skill.value}</span>
                        {#if ($characterStore.skillPoints || 0) > 0}
                            <button
                                class="improve-skill"
                                onclick={() => spendSkillPoint(skill.id)}
                                >+</button
                            >
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
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
</style>
