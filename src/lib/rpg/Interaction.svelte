<!-- src/lib/components/rpg/Interaction.svelte -->
<script>
    import { characterStore } from "$lib/stores/character.ts";
    export let npcnpcnpccharacter; // The NPC to interact with
    export let onDialogueEnd; // Callback for when dialogue ends

    // Dialogue state
    let currentDialogueIndex = 0;
    let dialogueOptions = [];
    let showOptions = false;
    let dialogueHistory = [];

    // Initialize dialogue based on NPC and relationship/state
    $: if (npccharacter) {
        initializeDialogue();
    }

    function initializeDialogue() {
        // Reset dialogue state
        currentDialogueIndex = 0;
        dialogueHistory = [];

        // Get starting dialogue based on NPC's attitude toward player
        // and any quest states or previous interactions
        if (npccharacter.dialogues && npccharacter.dialogues.greeting) {
            dialogueHistory.push({
                speaker: npccharacter.name,
                text: npccharacter.dialogues.greeting,
            });

            // Check if there are options for the player
            if (npccharacter.dialogues.options) {
                dialogueOptions = npccharacter.dialogues.options.map(
                    (option) => {
                        // Check if option should be available based on requirements
                        const available = checkRequirements(
                            option.requirements,
                        );
                        return {
                            ...option,
                            available,
                        };
                    },
                );
                showOptions = true;
            } else {
                showOptions = false;
                dialogueOptions = [];
            }
        }
    }

    function selectDialogueOption(option) {
        // Add player's response to history
        dialogueHistory.push({
            speaker: $characterStore.name,
            text: option.text,
        });

        // Apply any effects from this dialogue choice
        if (option.effects) {
            applyDialogueEffects(option.effects);
        }

        // Show NPC response
        if (option.response) {
            dialogueHistory.push({
                speaker: npccharacter.name,
                text: option.response,
            });
        }

        // Set next dialogue options
        if (option.next) {
            if (typeof option.next === "string") {
                // Reference to another dialogue section
                const nextDialogue = findDialogueSection(option.next);
                if (nextDialogue) {
                    dialogueOptions = nextDialogue.options.map((option) => {
                        const available = checkRequirements(
                            option.requirements,
                        );
                        return {
                            ...option,
                            available,
                        };
                    });
                    showOptions = dialogueOptions.length > 0;
                } else {
                    endDialogue();
                }
            } else if (Array.isArray(option.next)) {
                // Direct next options
                dialogueOptions = option.next.map((option) => {
                    const available = checkRequirements(option.requirements);
                    return {
                        ...option,
                        available,
                    };
                });
                showOptions = dialogueOptions.length > 0;
            }
        } else {
            // No more dialogue, end the conversation
            endDialogue();
        }
    }

    function findDialogueSection(sectionId) {
        if (npccharacter.dialogues && npccharacter.dialogues.sections) {
            return npccharacter.dialogues.sections[sectionId];
        }
        return null;
    }

    function checkRequirements(requirements) {
        if (!requirements) return true;

        // Check skill requirements
        if (requirements.skills) {
            for (const [skill, level] of Object.entries(requirements.skills)) {
                if (
                    !$characterStore.skills[skill] ||
                    $characterStore.skills[skill] < level
                ) {
                    return false;
                }
            }
        }

        // Check item requirements
        if (requirements.items) {
            for (const itemId of requirements.items) {
                if (
                    !$characterStore.inventory.some(
                        (item) => item.id === itemId,
                    )
                ) {
                    return false;
                }
            }
        }

        // Check quest state requirements
        if (requirements.quests) {
            // Implementation would depend on how quests are tracked
            // This is a simplified version
            for (const [questId, status] of Object.entries(
                requirements.quests,
            )) {
                const playerQuestStatus =
                    $characterStore.quests && $characterStore.quests[questId];
                if (playerQuestStatus !== status) {
                    return false;
                }
            }
        }

        return true;
    }

    function applyDialogueEffects(effects) {
        // Add items to inventory
        if (effects.items) {
            effects.items.forEach((item) => {
                // This would need to connect to your inventory management system
                // For example, using a store:
                // updateInventory(item);
                console.log(`Received item: ${item.name}`);
            });
        }

        // Update relationships
        if (effects.relationship) {
            // Update NPC relationship value
            // updateNPCRelationship(npccharacter.id, effects.relationship);
            console.log(
                `Relationship with ${npccharacter.name} changed by ${effects.relationship}`,
            );
        }

        // Update quest status
        if (effects.quests) {
            for (const [questId, newStatus] of Object.entries(effects.quests)) {
                // updateQuestStatus(questId, newStatus);
                console.log(`Quest ${questId} updated to ${newStatus}`);
            }
        }

        // Award experience
        if (effects.experience) {
            // giveExperience(effects.experience);
            console.log(`Gained ${effects.experience} experience`);
        }
    }

    function endDialogue() {
        showOptions = false;
        dialogueOptions = [];

        // If there's a farewell message, show it
        if (npccharacter.dialogues && npccharacter.dialogues.farewell) {
            dialogueHistory.push({
                speaker: npccharacter.name,
                text: npccharacter.dialogues.farewell,
            });
        }

        // Tell parent component dialogue is ending
        setTimeout(() => {
            if (onDialogueEnd) onDialogueEnd();
        }, 1500); // Brief delay to allow reading farewell
    }
</script>

<div class="interaction-container">
    <div class="npccharacter-portrait">
        {#if npccharacter.portrait}
            <img src={npccharacter.portrait} alt={npccharacter.name} />
        {:else}
            <div class="default-portrait">{npccharacter.name.charAt(0)}</div>
        {/if}
        <h3>{npccharacter.name}</h3>
    </div>

    <div class="dialogue-container">
        <div class="dialogue-history">
            {#each dialogueHistory as dialogue}
                <div
                    class="dialogue-entry"
                    class:player-dialogue={dialogue.speaker ===
                        $characterStore.name}
                >
                    <span class="speaker">{dialogue.speaker}:</span>
                    <span class="dialogue-text">{dialogue.text}</span>
                </div>
            {/each}
        </div>

        {#if showOptions}
            <div class="dialogue-options">
                {#each dialogueOptions as option}
                    <button
                        class="dialogue-option"
                        class:disabled={!option.available}
                        on:click={() =>
                            option.available && selectDialogueOption(option)}
                    >
                        {option.text}
                        {#if !option.available && option.requirementHint}
                            <span class="requirement-hint"
                                >({option.requirementHint})</span
                            >
                        {/if}
                    </button>
                {/each}
            </div>
        {:else if dialogueHistory.length > 0 && !dialogueOptions.length}
            <button class="end-dialogue" on:click={endDialogue}
                >End conversation</button
            >
        {/if}
    </div>
</div>

<style>
    .interaction-container {
        display: flex;
        background-color: rgba(10, 10, 10, 0.8);
        border-radius: 8px;
        padding: 20px;
        margin-top: 20px;
        color: #f0f0f0;
    }

    .npccharacter-portrait {
        flex: 0 0 150px;
        text-align: center;
    }

    .npccharacter-portrait img {
        width: 120px;
        height: 120px;
        border-radius: 60px;
        border: 3px solid #aa9;
        object-fit: cover;
    }

    .default-portrait {
        width: 120px;
        height: 120px;
        border-radius: 60px;
        background-color: #4a6;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
        margin: 0 auto;
    }

    .dialogue-container {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .dialogue-history {
        flex: 1;
        overflow-y: auto;
        max-height: 200px;
        margin-bottom: 15px;
        padding-right: 10px;
    }

    .dialogue-entry {
        margin-bottom: 12px;
        line-height: 1.4;
    }

    .speaker {
        font-weight: bold;
        color: #dd9;
    }

    .player-dialogue .speaker {
        color: #9dd;
    }

    .dialogue-text {
        display: block;
        padding-left: 10px;
        border-left: 2px solid rgba(255, 255, 255, 0.2);
        margin-top: 4px;
    }

    .dialogue-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .dialogue-option {
        background-color: rgba(70, 70, 70, 0.6);
        border: 1px solid #666;
        color: #fff;
        padding: 8px 12px;
        text-align: left;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .dialogue-option:hover:not(.disabled) {
        background-color: rgba(100, 100, 100, 0.6);
    }

    .dialogue-option.disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .requirement-hint {
        font-size: 0.8em;
        color: #f99;
        margin-left: 8px;
    }

    .end-dialogue {
        align-self: flex-end;
        background-color: #555;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
    }

    .end-dialogue:hover {
        background-color: #666;
    }
</style>
