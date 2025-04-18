<!-- StoryEngine.svelte -->
<script>
    export let scene;
    export let makeChoice;
    export let player;

    function canMakeChoice(choice) {
        // Check if there are requirements for this choice
        if (!choice.requirements) return true;

        // Check skill requirements
        if (choice.requirements.skills) {
            for (const [skill, required] of Object.entries(
                choice.requirements.skills,
            )) {
                if ((player.skills[skill] || 0) < required) {
                    return false;
                }
            }
        }

        // Check inventory requirements
        if (choice.requirements.items) {
            for (const requiredItem of choice.requirements.items) {
                if (
                    !player.inventory.some((item) => item.id === requiredItem)
                ) {
                    return false;
                }
            }
        }

        return true;
    }
</script>

<div class="story-container">
    <div class="scene-title">
        <h2>{scene.title}</h2>
    </div>

    <div class="scene-description">
        <p>{scene.description}</p>
    </div>

    {#if scene.image}
        <div class="scene-image">
            <img src={scene.image} alt={scene.title} />
        </div>
    {/if}

    {#if scene.characters && scene.characters.length > 0}
        <div class="scene-characters">
            <h3>Characters present:</h3>
            <ul>
                {#each scene.characters as character}
                    <li>
                        <strong>{character.name}</strong>
                        {#if character.description}
                            <span> - {character.description}</span>
                        {/if}
                    </li>
                {/each}
            </ul>
        </div>
    {/if}

    <div class="choices">
        <h3>What will you do?</h3>

        {#each scene.choices as choice}
            <button
                class="choice-button"
                class:disabled={!canMakeChoice(choice)}
                on:click={() => canMakeChoice(choice) && makeChoice(choice)}
            >
                {choice.text}

                {#if choice.skillCheck}
                    <span class="skill-check">
                        ({choice.skillCheck.skill} check - Difficulty: {choice
                            .skillCheck.difficulty})
                    </span>
                {/if}

                {#if choice.requirements && !canMakeChoice(choice)}
                    <span class="requirements-not-met">
                        (Requirements not met)
                    </span>
                {/if}
            </button>
        {/each}
    </div>
</div>

<style>
    .story-container {
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .scene-title h2 {
        margin-top: 0;
        color: #333;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
    }

    .scene-description {
        font-size: 1.1em;
        line-height: 1.5;
        margin-bottom: 20px;
    }

    .scene-image {
        margin: 15px 0;
        text-align: center;
    }

    .scene-image img {
        max-width: 100%;
        border-radius: 8px;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    }

    .scene-characters {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .scene-characters h3 {
        margin-top: 0;
        font-size: 1em;
        color: #555;
    }

    .scene-characters ul {
        list-style-type: none;
        padding-left: 0;
    }

    .scene-characters li {
        margin-bottom: 5px;
    }

    .choices {
        margin-top: 30px;
    }

    .choice-button {
        display: block;
        width: 100%;
        padding: 12px 15px;
        margin-bottom: 10px;
        background-color: #f8f8f8;
        border: 1px solid #ddd;
        border-radius: 6px;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 1em;
    }

    .choice-button:hover:not(.disabled) {
        background-color: #eaeaea;
        border-color: #ccc;
    }

    .choice-button.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: #f0f0f0;
    }

    .skill-check {
        display: block;
        font-size: 0.8em;
        color: #666;
        margin-top: 5px;
    }

    .requirements-not-met {
        display: block;
        font-size: 0.8em;
        color: #c33;
        margin-top: 5px;
    }
</style>
