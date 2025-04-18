<!-- CharacterCreation.svelte -->
<script>
    import { onMount } from "svelte";

    import {
        skills,
        skillCategories,
        getSkillInfo,
    } from "$lib/stories/skills.ts";

    import { characterStore, updateCharacter } from "$lib/stores/character.ts";
    import { characterClasses } from "$lib/stories/characterclasses.ts";

    import { goto } from "$app/navigation";

    $: character = $characterStore;
    let isEditingExistingCharacter = false;
    let bodyForm = {
        height: $characterStore.body?.height || 160,
        weight: $characterStore.body?.weight || 50,
        bust: $characterStore.body?.bust || 90,
        waist: $characterStore.body?.waist || 60,
        hips: $characterStore.body?.hips || 90,
        cup: $characterStore.body?.cup || "",
        bodytype: $characterStore.body?.bodytype || "",
        eyecolor: $characterStore.body?.eyecolor || "",
        haircolor: $characterStore.body?.haircolor || "",
        pubichair: $characterStore.body?.pubichair || "",
        piercings: Array.isArray($characterStore.body?.piercings)
            ? $characterStore.body.piercings
            : $characterStore.body?.piercings
                  ?.split(",")
                  .map((p) => p.trim())
                  .filter(Boolean) || [],
        tattoos: Array.isArray($characterStore.body?.tattoos)
            ? $characterStore.body.tattoos
            : $characterStore.body?.tattoos
                  ?.split(",")
                  .map((t) => t.trim())
                  .filter(Boolean) || [],
    };

    let biographyText = $characterStore.biography || "";

    // Body type options
    const bodyTypes = [
        "Athletic",
        "Curvy",
        "Slim",
        "Voluptuous",
        "Petite",
        "Muscular",
        "Average",
    ];

    // Eye color options
    const eyeColors = [
        "Blue",
        "Green",
        "Brown",
        "Hazel",
        "Gray",
        "Amber",
        "Black",
    ];

    // Hair color options
    const hairColors = [
        "Blonde",
        "Brunette",
        "Black",
        "Red",
        "Auburn",
        "Brown",
        "White",
        "Pink",
        "Blue",
        "Purple",
    ];

    // Pubic hair options
    const pubicHairStyles = [
        "Natural",
        "Trimmed",
        "Landing Strip",
        "Brazilian",
        "Heart",
        "Shaved",
        "None",
    ];

    // Cup sizes
    const cupSizes = ["A", "B", "C", "D", "DD", "E", "F", "G", "H"];
    // Piercing options
    const piercingOptions = [
        "Ears",
        "Nose",
        "Eyebrow",
        "Lip",
        "Tongue",
        "Navel",
        "Nipples",
        "Christina",
        "VCH",
        "Labia",
        "Industrial",
        "Septum",
        "Monroe",
        "Tragus",
        "Daith",
    ];

    // Tattoo placement options (for suggestions)
    const tattooPlacementOptions = [
        "Shoulder",
        "Back",
        "Chest",
        "Arm",
        "Forearm",
        "Wrist",
        "Ankle",
        "Thigh",
        "Hip",
        "Neck",
        "Ribcage",
        "Lower Back",
        "Stomach",
        "Finger",
        "Behind Ear",
    ];

    // Custom piercing/tattoo inputs
    let customPiercing = "";
    let customPiercingDescription = "";
    let customTattoo = "";
    let customTattooDescription = "";

    onMount(() => {
        // Check if we're editing an existing character
        if ($characterStore.id) {
            isEditingExistingCharacter = true;
            // If editing existing character, set selected class to match
            selectedClassId = $characterStore.classId;
            selectedClass = characterClasses.find(
                (c) => c.id === selectedClassId,
            );
        } else {
            // For new character, select first class by default
            selectedClassId = characterClasses[0].id;
            selectedClass = characterClasses.find(
                (c) => c.id === selectedClassId,
            );

            // Generate a random name for new characters
            if (!$characterStore.name) {
                $characterStore.name = generateRandomName();
            }
        }
    });

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
            "Cory",
            "Dior",
            "Echo",
            "Ella",
            "Emiliy",
            "Fendi",
            "Gigi",
            "Harper",
            "Kenzo",
            "Luisa",
            "Lux",
            "Mia",
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
            "White",
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
        if (!isEditingExistingCharacter) {
            selectedClassId = classId;
            const classObject = characterClasses.find((c) => c.id === classId);
            updateCharacter({ class: classObject });
        } else {
            alert("You cannot change your class for an existing character.");
        }
    }

    function handleNameChange(event) {
        // store name in store
        updateCharacter({ name: event.target.value });
    }

    function updateBiography() {
        updateCharacter({ biography: biographyText });
    }

    function updateBodyAttributes() {
        // Convert arrays to comma-separated strings for storage
        updateCharacter({
            body: {
                ...character.body,
                ...bodyForm,
            },
        });
    }

    function togglePiercing(piercing) {
        if (bodyForm.piercings.includes(piercing)) {
            bodyForm.piercings = bodyForm.piercings.filter(
                (p) => p !== piercing,
            );
        } else {
            bodyForm.piercings = [...bodyForm.piercings, piercing];
        }
        bodyForm = { ...bodyForm }; // Trigger reactivity
        updateBodyAttributes();
    }

    function addCustomPiercing() {
        if (customPiercing) {
            const piercingEntry = customPiercingDescription
                ? `${customPiercing} (${customPiercingDescription})`
                : customPiercing;

            if (!bodyForm.piercings.includes(piercingEntry)) {
                bodyForm.piercings = [...bodyForm.piercings, piercingEntry];
                bodyForm = { ...bodyForm }; // Trigger reactivity
                customPiercing = "";
                customPiercingDescription = "";
                updateBodyAttributes();
            }
        }
    }

    function removePiercing(index) {
        bodyForm.piercings = bodyForm.piercings.filter((_, i) => i !== index);
        bodyForm = { ...bodyForm }; // Trigger reactivity
        updateBodyAttributes();
    }

    function addCustomTattoo() {
        if (customTattoo) {
            const tattooEntry = customTattooDescription
                ? `${customTattoo} (${customTattooDescription})`
                : customTattoo;

            if (!bodyForm.tattoos.includes(tattooEntry)) {
                bodyForm.tattoos = [...bodyForm.tattoos, tattooEntry];
                bodyForm = { ...bodyForm }; // Trigger reactivity
                customTattoo = "";
                customTattooDescription = "";
                updateBodyAttributes();
            }
        }
    }

    function removeTattoo(index) {
        bodyForm.tattoos = bodyForm.tattoos.filter((_, i) => i !== index);
        bodyForm = { ...bodyForm }; // Trigger reactivity
        updateBodyAttributes();
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
        updateBodyAttributes();
        updateBiography();

        // Debug log
        console.log("Creating character with class:", selectedClass);

        if (!isEditingExistingCharacter) {
            // For new characters, set up class details
            updateCharacter({
                classId: selectedClassId,
                stats: selectedClass.startingStats || {},
                skills: selectedClass.startingSkills || {},
                abilities: selectedClass.startingAbilities || [],
                className: selectedClass.name,
                classDescription: selectedClass.description,
                classPortrait: selectedClass.portrait,
                // Include other attributes if they exist in the class definition
                attributes:
                    selectedClass.attributes || $characterStore.attributes,
                hitPoints: selectedClass.hitPoints || {
                    current: selectedClass.startingStats?.health || 10,
                    max: selectedClass.startingStats?.health || 10,
                },
            });
        }

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
    function resetCharacter() {
        if (
            confirm(
                "Are you sure you want to reset all character data? This cannot be undone.",
            )
        ) {
            // Reset form values
            bodyForm = {
                height: 160,
                weight: 50,
                bust: 90,
                waist: 60,
                hips: 90,
                cup: "",
                bodytype: "",
                eyecolor: "",
                haircolor: "",
                pubichair: "",
                piercings: [],
                tattoos: [],
            };

            biographyText = "";
            selectedClassId = characterClasses[0].id;

            // Reset the character store
            updateCharacter({
                name: generateRandomName(),
                body: {
                    height: 160,
                    weight: 50,
                    bust: 90,
                    waist: 60,
                    hips: 90,
                    cup: "",
                    bodytype: "",
                    eyecolor: "",
                    haircolor: "",
                    pubichair: "",
                    piercings: [],
                    tattoos: [],
                },
                biography: "",
                classId: null,
                className: "",
                class: null,
                stats: {},
                skills: {},
                abilities: [],
            });

            // Reset editing state if we were editing
            isEditingExistingCharacter = false;
        }
    }
</script>

<div class="character-creation">
    <div class="character-details">
        <h1>
            {isEditingExistingCharacter
                ? "Edit Your Character"
                : "Create Your Character"}
        </h1>
        <div class="name-input">
            <label for="character-name">Character Name:</label>
            <input
                id="character-name"
                type="text"
                placeholder="Enter name..."
                bind:value={$characterStore.name}
                oninput={handleNameChange}
                disabled={isEditingExistingCharacter}
            />
            {#if !isEditingExistingCharacter}
                <button
                    class="random-name-btn"
                    onclick={() =>
                        updateCharacter({ name: generateRandomName() })}
                >
                    Generate Random Name
                </button>
            {/if}
        </div>

        <div class="body-details-section">
            <h2>Physical Attributes</h2>

            <div class="body-grid">
                <div class="form-group">
                    <label for="height">Height (cm):</label>
                    <input
                        id="height"
                        type="number"
                        bind:value={bodyForm.height}
                        onchange={updateBodyAttributes}
                        min="140"
                        max="200"
                    />
                </div>

                <div class="form-group">
                    <label for="weight">Weight (kg):</label>
                    <input
                        id="weight"
                        type="number"
                        bind:value={bodyForm.weight}
                        onchange={updateBodyAttributes}
                        min="40"
                        max="100"
                    />
                </div>

                <div class="form-group">
                    <label for="bust">Bust:</label>
                    <input
                        id="bust"
                        type="number"
                        bind:value={bodyForm.bust}
                        oninput={updateBodyAttributes}
                        min="60"
                        max="150"
                    />
                </div>
                <div class="form-group">
                    <label for="waist">Waist:</label>
                    <input
                        id="waist"
                        type="number"
                        bind:value={bodyForm.waist}
                        oninput={updateBodyAttributes}
                        min="40"
                        max="120"
                    />
                </div>
                <div class="form-group">
                    <label for="hips">Hips:</label>
                    <input
                        id="hips"
                        type="number"
                        bind:value={bodyForm.hips}
                        oninput={updateBodyAttributes}
                        min="60"
                        max="150"
                    />
                </div>

                <div class="form-group">
                    <label for="cup">Cup Size:</label>
                    <select
                        id="cup"
                        bind:value={bodyForm.cup}
                        onchange={updateBodyAttributes}
                    >
                        <option value="">Select Cup Size</option>
                        {#each cupSizes as size}
                            <option value={size}>{size}</option>
                        {/each}
                    </select>
                </div>

                <div class="form-group">
                    <label for="bodytype">Body Type:</label>
                    <select
                        id="bodytype"
                        bind:value={bodyForm.bodytype}
                        onchange={updateBodyAttributes}
                    >
                        <option value="">Select Body Type</option>
                        {#each bodyTypes as type}
                            <option value={type}>{type}</option>
                        {/each}
                    </select>
                </div>

                <div class="form-group">
                    <label for="eyecolor">Eye Color:</label>
                    <select
                        id="eyecolor"
                        bind:value={bodyForm.eyecolor}
                        onchange={updateBodyAttributes}
                    >
                        <option value="">Select Eye Color</option>
                        {#each eyeColors as color}
                            <option value={color}>{color}</option>
                        {/each}
                    </select>
                </div>

                <div class="form-group">
                    <label for="haircolor">Hair Color:</label>
                    <select
                        id="haircolor"
                        bind:value={bodyForm.haircolor}
                        onchange={updateBodyAttributes}
                    >
                        <option value="">Select Hair Color</option>
                        {#each hairColors as color}
                            <option value={color}>{color}</option>
                        {/each}
                    </select>
                </div>

                <div class="form-group">
                    <label for="pubichair">Pubic Hair:</label>
                    <select
                        id="pubichair"
                        bind:value={bodyForm.pubichair}
                        onchange={updateBodyAttributes}
                    >
                        <option value="">Select Style</option>
                        {#each pubicHairStyles as style}
                            <option value={style}>{style}</option>
                        {/each}
                    </select>
                </div>

                <!-- Multiple-choice piercings -->
                <div class="multi-select-section">
                    <h3>Piercings</h3>
                    <div class="tattoo-input">
                        <div class="tattoo-location">
                            <label for="piercing-location">Location:</label><br
                            />
                            <select
                                id="piercing-location"
                                bind:value={customPiercing}
                            >
                                <option value="">Select or type below</option>
                                {#each piercingOptions as location}
                                    <option value={location}>{location}</option>
                                {/each}
                            </select>
                            <input
                                type="text"
                                bind:value={customPiercing}
                                placeholder="Piercing location..."
                            />
                        </div>

                        <div class="tattoo-description">
                            <label for="piercing-description"
                                >Description:</label
                            ><br />
                            <input
                                id="piercing-description"
                                type="text"
                                bind:value={customPiercingDescription}
                                placeholder="Piercing description..."
                            />
                        </div>

                        <button
                            onclick={addCustomPiercing}
                            disabled={!customPiercing}>Add Piercing</button
                        >
                    </div>

                    {#if bodyForm.piercings.length > 0}
                        <div class="selected-items tattoo-list">
                            <h4>Your piercings:</h4>
                            <ul>
                                {#each bodyForm.piercings as piercing, i}
                                    <li>
                                        {piercing}
                                        <button
                                            class="remove-btn"
                                            onclick={() => removePiercing(i)}
                                            >×</button
                                        >
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                </div>

                <!-- Multiple-choice tattoos -->
                <div class="multi-select-section">
                    <h3>Tattoos</h3>
                    <div class="tattoo-input">
                        <div class="tattoo-location">
                            <label>Location:</label>
                            <select bind:value={customTattoo}>
                                <option value="">Select or type below</option>
                                {#each tattooPlacementOptions as location}
                                    <option value={location}>{location}</option>
                                {/each}
                            </select>
                            <input
                                type="text"
                                bind:value={customTattoo}
                                placeholder="Tattoo location..."
                            />
                        </div>

                        <div class="tattoo-description">
                            <label>Description:</label>
                            <input
                                type="text"
                                bind:value={customTattooDescription}
                                placeholder="Tattoo description..."
                            />
                        </div>

                        <button
                            onclick={addCustomTattoo}
                            disabled={!customTattoo}>Add Tattoo</button
                        >
                    </div>

                    {#if bodyForm.tattoos.length > 0}
                        <div class="selected-items tattoo-list">
                            <h4>Your tattoos:</h4>
                            <ul>
                                {#each bodyForm.tattoos as tattoo, i}
                                    <li>
                                        {tattoo}
                                        <button
                                            class="remove-btn"
                                            onclick={() => removeTattoo(i)}
                                            >✕</button
                                        >
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                </div>
                <div class="biography-section">
                    <h2>Biography</h2>
                    <textarea
                        bind:value={bodyForm.biographyText}
                        oninput={updateBiography}
                        placeholder="Write your character's backstory..."
                        rows="5"
                    ></textarea>
                </div>
            </div>
        </div>
        <div class="action-buttons">
            <button class="reset-button-bottom" onclick={resetCharacter}>
                Reset Character
            </button>
            <button class="create-button" onclick={createCharacter}>
                Begin Your Adventure
            </button>
        </div>
    </div>

    <div class="class-selection" class:disabled={isEditingExistingCharacter}>
        <h2>
            Choose a Class {isEditingExistingCharacter
                ? "(Locked for existing character)"
                : ""}
        </h2>
        <div class="class-options">
            {#each characterClasses as characterClass}
                <button
                    aria-label={characterClass.name}
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
</div>

<style>
    /* Main container with two-column layout */
    .character-creation {
        display: grid;
        grid-template-columns: 3fr 2fr; /* 60% left column, 40% right column */
        gap: 20px;
        max-width: 1200px; /* Increased max-width for the two-column layout */
        margin: 0 auto;
        padding: 20px;
    }

    /* Left column - character details */
    .character-details {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    /* Right column - class selection */
    .class-selection {
        position: sticky;
        top: 20px; /* Stick slightly below the top */
        align-self: flex-start;
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .class-selection.disabled {
        opacity: 0.7;
        pointer-events: none;
    }

    .class-options {
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-height: 70vh; /* Limit height and enable scrolling */
        overflow-y: auto;
        padding-right: 10px;
    }

    .class-option {
        border: 2px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        background: none;
        display: flex;
        flex-direction: column;
    }

    .class-option:hover:not(.disabled) {
        background-color: #f5f5f5;
        transform: translateY(-2px);
    }

    .class-option.selected {
        border-color: #4a6;
        background-color: #efffef;
    }

    .class-option.disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    .class-portrait {
        width: 80px;
        height: 80px;
        border-radius: 40px;
        object-fit: cover;
        margin: 0 auto 10px;
        display: block;
    }

    .name-input {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .name-input input {
        flex: 1;
        padding: 8px;
        font-size: 16px;
    }

    .random-name-btn {
        padding: 8px 12px;
        background-color: #6a8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
    }

    .body-details-section,
    .biography-section {
        margin-bottom: 25px;
        padding: 15px;
        background-color: #f7f7f7;
        border-radius: 8px;
    }

    .body-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 15px;
    }

    .form-group {
        margin-bottom: 12px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
    }

    .form-group input,
    .form-group select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .multi-select-section {
        background-color: #f0f0f0;
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 20px;
    }

    .multi-select-section h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 1.1em;
    }

    .checkbox-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
        margin-bottom: 15px;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
    }

    .checkbox-label input {
        margin: 0;
    }

    .custom-input {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
    }

    .custom-input input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .custom-input button,
    .tattoo-input button {
        padding: 8px 12px;
        background-color: #6a8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .custom-input button:disabled,
    .tattoo-input button:disabled {
        background-color: #aaa;
        cursor: not-allowed;
    }

    .selected-items {
        margin-top: 10px;
        background-color: #fff;
        padding: 10px;
        border-radius: 4px;
    }

    .selected-items h4 {
        margin-top: 0;
        margin-bottom: 5px;
        font-size: 0.9em;
        color: #555;
    }

    .selected-items p {
        margin: 0;
    }

    .tattoo-input {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
    }

    .tattoo-location,
    .tattoo-description {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .tattoo-location label,
    .tattoo-description label {
        min-width: 80px;
        font-weight: 500;
    }

    .tattoo-location select,
    .tattoo-location input,
    .tattoo-description input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .tattoo-list ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .tattoo-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
    }

    .remove-btn {
        background: none;
        border: none;
        color: #e74c3c;
        cursor: pointer;
        font-weight: bold;
        padding: 2px 6px;
    }

    .remove-btn:hover {
        background-color: #f8d7da;
        border-radius: 4px;
    }

    textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: vertical;
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

    /* Action buttons container - move to left column */
    .action-buttons {
        display: flex;
        gap: 15px;
        margin-top: 20px;
    }

    .reset-button-bottom {
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 12px;
        cursor: pointer;
        font-size: 16px;
        flex: 1;
    }

    .reset-button-bottom:hover {
        background-color: #c0392b;
    }

    .create-button {
        flex: 2;
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

    h2 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #333;
    }

    /* Media query for responsive design */
    @media (max-width: 900px) {
        .character-creation {
            grid-template-columns: 1fr; /* Single column on smaller screens */
        }

        .class-selection {
            position: static;
            margin-top: 20px;
        }

        .class-options {
            max-height: none;
            overflow-y: visible;
        }
    }
</style>
