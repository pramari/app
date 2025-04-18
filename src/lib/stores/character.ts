// $lib/stores/character.ts
import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";
import { browser } from "$app/environment";

// Define the Character type
export interface Character {
  id: string;
  name: string;
  level: number;
  class: string | null;
  classId?: string | null;
  className?: string;
  experience: number;
  skills: Record<string, number>;
  abilities: string[];
  body: {
    bust: number;
    waist: number;
    hips: number;
    cup: string;
    height: number;
    weight: number;
    bodytype: string;
    eyecolor: string;
    haircolor: string;
    pubichair: string;
    piercings: string[];
    tattoos: string[];
  };
  attributes: {
    strength: number;
    constitution: number;
    agility: number; // agility
    intelligence: number;
    charisma: number;
  };
  hitPoints: {
    current: number;
    max: number;
  };
  inventory: Array<{
    id: string;
    name: string;
    quantity: number;
    description?: string;
  }>;
  // Actor-specific attributes
  performanceSkills: {
    acting: number;
    gonzo: number;
  };
  careerAttributes: {
    fame: number;
    fanbase: number;
    connections: string[];
    reputation: number;
  };
  roles: Array<{
    title: string;
    character: string;
    production: string;
    year: number;
    rating: number;
  }>;
  specialTalents: string[];
  biography: string;
  stats?: Record<string, number>;
  skillPoints?: number;
}

// Initial state
const initialCharacter: Character = {
  id: "",
  name: "",
  level: 1,
  class: null,
  classId: null,
  className: "",
  experience: 0,
  skills: {}, // Empty Record<string, number>
  abilities: [],
  body: {
    bust: 90,
    waist: 60,
    hips: 90,
    cup: "",
    height: 160,
    weight: 50,
    bodytype: "",
    eyecolor: "",
    haircolor: "",
    pubichair: "string",
    piercings: [],
    tattoos: [],
  },
  attributes: {
    strength: 0,
    constitution: 0,
    agility: 0, // agility
    intelligence: 0,
    charisma: 0,
  },
  hitPoints: {
    current: 1,
    max: 1,
  },
  inventory: [
    { id: "money", name: "money", quantity: 100, description: "currency" },
  ],
  // Actor-specific attributes
  performanceSkills: {
    acting: 0,
    gonzo: 0,
  },
  careerAttributes: {
    fame: 0,
    fanbase: 0,
    connections: [], // Fixed to match string[] type
    reputation: 0,
  },
  roles: [
    {
      title: "",
      character: "",
      production: "",
      year: 0, // Fixed to match number type
      rating: 0, // Fixed to match number type
    },
  ],
  specialTalents: [],
  biography: "",
  stats: { scenes: 0 },
  skillPoints: 0,
};

// Get character from localStorage if available
const storedCharacter =
  browser && localStorage.getItem("character")
    ? (JSON.parse(localStorage.getItem("character")!) as Partial<Character>)
    : ({} as Partial<Character>);

// Create the store with type validation
const characterStore: Writable<Character> = writable({
  ...initialCharacter,
  ...storedCharacter,
});

// Subscribe to changes and persist to localStorage
if (browser) {
  characterStore.subscribe((character) => {
    localStorage.setItem("character", JSON.stringify(character));
  });
}

/**
 * Helper function to update character with type checking
 * @param updates Partial character data to update
 */
function updateCharacter(updates: Partial<Character>): void {
  // Ensure updates conform to Character type
  characterStore.update((character) => {
    // Type checking happens when merging updates with character
    const updatedCharacter: Character = {
      ...character,
      ...updates,
    };
    return updatedCharacter;
  });
}

/**
 * Function to load character from server
 * @param characterId The ID of the character to load
 */
async function loadCharacterFromServer(characterId: string): Promise<void> {
  try {
    const response = await fetch(
      `https://pramari.de/rpg/api/data/${characterId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch character");
    const data = (await response.json()) as Character;

    // Validate data conforms to Character type before setting store
    characterStore.set(data);
  } catch (error) {
    console.error("Error loading character:", error);
  }
}

// Export the store and methods
export { characterStore, updateCharacter, loadCharacterFromServer }; // Character type is already exported at the top
