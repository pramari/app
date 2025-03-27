<!-- CharacterCreation.svelte -->
<script>
    import { onMount } from "svelte";

    import {
        skills,
        skillCategories,
        getSkillInfo,
    } from "$lib/stories/skills.ts";

    import { characterStore, updateCharacter } from "$lib/stores/character.ts";
    import { characterClasses } from "$lib/stories/characterClasses.ts";

    import { goto } from "$app/navigation";

    $: character = $characterStore;

    onMount(() => {});

    let selectedClassId = characterClasses[0].id; // select first class by default
    $: selectedClass = characterClasses.find((c) => c.id === selectedClassId); // get selected class object

    function generateRandomName() {
        const fashionFirstNames = [
            "Ava",
            "Aria",
            "Abella",
            "Blaze",
            "Cherie",
            "Coco",
            "Cory"
            "Dior",
            "Echo",
            "Ella",
            "Emiliy",
            "Fendi",
            "Gigi",
            "Harper",
            "Kenzo",
            "Luisa"
            "Lux",
            "Mia"
            "Milan",
            "Nova",
            "Quinn",
            "Rogue",
            "Sloane",
            "Tyra",
            "Valentina",
            "Vogue",
            "Willow",
            "Xander",
            "Yves",
            "Zara",
        ];

        const fashionLastNames = [
            "Armani",
            "Belmont",
            "Chanel",
            "Dee",
            "Deville",
            "Ellison",
            "Ferragamo",
            "Gucci",
            "Herrera",
            "Ivory",
            "Jacobs",
            "Klein",
            "Laurent",
            "Marks",
            "McQueen",
            "Novak",
            "Osborne",
            "Sky",
            "Steele",
            "Simons",
            "Texas",
            "Tahari",
            "Urbana",
            "Valentino",
            "Wang",
            "White"
            "Xavier",
            "Young",
        ];

        const fashionTitles = [
            "the Avant-Garde",
            "of the Runway",
            "Couture",
            "the Trendsetter",
            "the Iconic",
            "of House Luxe",
            "the Stylish",
            "en Vogue",
            "the Fashionista",
            "Haute",
            "the Visionary",
            "of Milano",
            "the Glamorous",
            "of Paris",
            "Bespoke",
        ];

        // Random chance of different name formats
        const nameFormat = Math.random();
        let name = "";

        if (nameFormat < 0.4) {
            // Single chic name (40% chance)
            name =
                fashionFirstNames[
                    Math.floor(Math.random() * fashionFirstNames.length)
                ];
        } else if (nameFormat < 0.7) {
            // First and last name (30% chance)
            const firstName =
                fashionFirstNames[
                    Math.floor(Math.random() * fashionFirstNames.length)
                ];
            const lastName =
                fashionLastNames[
                    Math.floor(Math.random() * fashionLastNames.length)
                ];
            name = `${firstName} ${lastName}`;
        } else if (nameFormat < 0.9) {
            // Mononym with title (20% chance)
            const firstName =
                fashionFirstNames[
                    Math.floor(Math.random() * fashionFirstNames.length)
                ];
            const title =
                fashionTitles[Math.floor(Math.random() * fashionTitles.length)];
            name = `${firstName} ${title}`;
        } else {
            // Full high-fashion name (10% chance)
            const firstName =
                fashionFirstNames[
                    Math.floor(Math.random() * fashionFirstNames.length)
                ];
            const lastName =
                fashionLastNames[
                    Math.floor(Math.random() * fashionLastNames.length)
                ];
            const title =
                fashionTitles[Math.floor(Math.random() * fashionTitles.length)];
            name = `${firstName} ${lastName} ${title}`;
        }

        return name;
    }

    function handleClassSelection(classId) {
        selectedClassId = classId;
        const classObject = characterClasses.find((c) => c.id === classId);
        // updateCharacterClass(classId, classObject);
        updateCharacter({ class: classObject });
    }

    function handleNameChange(event) {
        // store name in store
        updateCharacter({ name: event.target.value });
    }

    function handleBodyChange(event) {
        // store name in store
        updateCharacter({ body: { height: event.target.value } });
    }

    async function createCharacter() {
        if ($characterStore.name.trim() === "") {
            alert("Please enter a character name");
            return;
        }

        // Make sure we have a valid selected class
        if (!selectedClass) {
            console.error("No class selected!", selectedClassId);
            alert("Please select a character class");
            return;
        }

        // Debug log
        console.log("Creating character with class:", selectedClass);

        $characterStore.classId = characterClasses[selectedClassId];
        $characterStore.stats = selectedClass.startingStats;
        $characterStore.skills = selectedClass.startingSkills;
        $characterStore.abilities = selectedClass.startingAbilities;

        $characterStore.className = selectedClass.name;
        $characterStore.classDescription = selectedClass.description;
        $characterStore.classPortrait = selectedClass.portrait;

        try {
            $characterStore.saveToServer();
            // For now, we'll just navigate to the game
        } catch (error) {
            console.error("Error saving character to server.");
            // todo
            goto("/game");
        }
        console.log("Character created:", character);
    }
</script>

<div class="character-creation">
    <div class="character-details">
        <h1>Create Your Character</h1>

        <div class="name-input">
            <label for="character-name">Character Name:</label>
            <input
                id="character-name"
                type="text"
                placeholder="Enter name..."
                bind:value={$characterStore.name}
                oninput={handleNameChange}
                onload={generateRandomName()}
            />
        </div>

        <div class="body-input">
            <label for="character-body">Character Body:</label>
            <input
                id="character-body-height"
                type="text"
                bind:value={$characterStore.body.height}
                placeholder="Enter body..."
                oninput={handleBodyChange}
            />
        </div>
    </div>

    <div class="class-selection">
        <h2>Choose a Class</h2>

        <div class="class-options">
            {#each characterClasses as characterClass}
                <button
                    aria-label={characterClass}
                    class="class-option"
                    class:selected={selectedClassId === characterClass.id}
                    onclick={() => handleClassSelection(characterClass.id)}
                >
                    {#if characterClass.portrait}
                        <img
                            src={characterClass.portrait}
                            alt={characterClass.name}
                            class="class-portrait"
                        />
                    {/if}

                    <h3>{characterClass.name}</h3>
                    <p>{characterClass.description}</p>
                    <div class="starting-skills">
                        <h4>Starting Skills:</h4>
                        <ul>
                            {#each Object.entries(characterClass.startingSkills) as [skillId, value]}
                                {@const skillInfo = getSkillInfo(skillId)}
                                <li>
                                    <span class="skill-icon"
                                        >{skillInfo.icon}</span
                                    >
                                    <span class="skill-name"
                                        >{skillInfo.name}:</span
                                    >
                                    <span class="skill-value">{value}</span>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </button>
            {/each}
        </div>
    </div>

    <button class="create-button" onclick={createCharacter}>
        Begin Your Adventure
    </button>
</div>

<style>
    .character-creation {
        display: grid;
        max-width: 800px;
        margin: 0 auto;
    }
    .character-details {
        display: grid;
        margin-bottom: 20px;
    }

    .name-input {
        margin-bottom: 20px;
    }

    .name-input input {
        width: 100%;
        padding: 8px;
        font-size: 16px;
    }

    .class-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    }

    .class-option {
        border: 2px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .class-option:hover {
        background-color: #f5f5f5;
        transform: translateY(-2px);
    }

    .class-option.selected {
        border-color: #4a6;
        background-color: #efffef;
    }

    .class-portrait {
        width: 80px;
        height: 80px;
        border-radius: 40px;
        object-fit: cover;
        margin: 0 auto 10px;
        display: block;
    }

    .starting-skills ul {
        list-style-type: none;
        padding-left: 5px;
    }

    .starting-skills li {
        margin-bottom: 4px;
        display: flex;
        align-items: center;
    }

    .skill-icon {
        margin-right: 5px;
        font-size: 1.2em;
    }

    .skill-name {
        flex: 1;
    }

    .skill-value {
        font-weight: bold;
    }

    .create-button {
        display: block;
        width: 100%;
        padding: 12px;
        background-color: #4a6;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 18px;
        cursor: pointer;
    }

    .create-button:hover {
        background-color: #3b5;
    }
</style>
