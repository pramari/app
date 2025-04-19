<!-- src/lib/components/rpg/Interaction.svelte -->
<script lang="ts">
    import { characterStore } from "$lib/stores/character";
    import type { NPC } from "$lib/stories/npc";
    
    // Define interfaces for dialogue structures
    interface DialogueOption {
        text: string;
        response: string;
        next: string | null;
        requirements?: any;
        requirementHint?: string;
        effects?: any;
        available?: boolean;
    }
    
    interface DialogueEntry {
        speaker: string;
        text: string;
    }
    
    export let character: NPC; // The NPC to interact with
    export let onDialogueEnd: () => void; // Callback for when dialogue ends

    // Dialogue state
    let currentDialogueIndex = 0;
    let dialogueOptions: DialogueOption[] = [];
    let showOptions = false;
    let dialogueHistory: DialogueEntry[] = [];

    // Initialize dialogue based on NPC and relationship/state
    $: if (character) {
        initializeDialogue();
    }

    function initializeDialogue() {
        // Reset dialogue state
        currentDialogueIndex = 0;
        dialogueHistory = [];

        // Get starting dialogue based on NPC's attitude toward player
        // and any quest states or previous interactions
        if (character.dialogues && character.dialogues.greeting) {
            dialogueHistory.push({
                speaker: character.name,
                text: character.dialogues.greeting,
            });

            // Check if there are options for the player
            if (character.dialogues.options) {
                dialogueOptions = character.dialogues.options.map(
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

    function selectDialogueOption(option: DialogueOption): void {
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
                speaker: character.name,
                text: option.response,
            });
        }

        // Set next dialogue options
        if (option.next) {
            if (typeof option.next === "string") {
                // Reference to another dialogue section
                const nextDialogue = findDialogueSection(option.next);
                if (nextDialogue && nextDialogue.options) {
                    // Explicitly declare the type of options array
                    const optionsArray: DialogueOption[] = nextDialogue.options;
                    dialogueOptions = optionsArray.map((option: DialogueOption) => {
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
                const nextOptions: DialogueOption[] = option.next as DialogueOption[];
                dialogueOptions = nextOptions.map((option: DialogueOption) => {
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

    interface DialogueSection {
        options: DialogueOption[];
    }

    function findDialogueSection(sectionId: string): DialogueSection | null {
        // Assert the sections object has the right type
        type SectionMap = Record<string, DialogueSection>;
        if (character.dialogues && character.dialogues.sections) {
            const sections = character.dialogues.sections as Record<string, DialogueSection>;
            return sections[sectionId];
        }
        return null;
    }

    interface Requirements {
        skills?: Record<string, number>;
        items?: string[];
        quests?: Record<string, string>;
    }

    function checkRequirements(requirements: Requirements | undefined): boolean {
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
                // Use optional chaining and type assertion for quests
                const quests = ($characterStore as any).quests;
                const playerQuestStatus = quests && quests[questId];
                if (playerQuestStatus !== status) {
                    return false;
                }
            }
        }

        return true;
    }

    interface DialogueEffects {
        items?: Array<{id: string; name: string; description: string}>;
        relationship?: number;
        quests?: Record<string, string>;
        experience?: number;
    }

    function applyDialogueEffects(effects: DialogueEffects): void {
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
            // updateNPCRelationship(character.id, effects.relationship);
            console.log(
                `Relationship with ${character.name} changed by ${effects.relationship}`,
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

    function endDialogue(): void {
        showOptions = false;
        dialogueOptions = [];

        // If there's a farewell message, show it
        if (character.dialogues && character.dialogues.farewell) {
            dialogueHistory.push({
                speaker: character.name,
                text: character.dialogues.farewell,
            });
        }

        // Tell parent component dialogue is ending
        setTimeout(() => {
            if (onDialogueEnd) onDialogueEnd();
        }, 1500); // Brief delay to allow reading farewell
    }
</script>

<div class="interaction-container">
    <div class="character-portrait">
        {#if character.portrait}
            <img src={character.portrait} alt={character.name} />
        {:else}
            <div class="default-portrait">{character.name.charAt(0)}</div>
        {/if}
        <h3>{character.name}</h3>
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

    .character-portrait {
        flex: 0 0 150px;
        text-align: center;
    }

    .character-portrait img {
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
