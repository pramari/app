// $lib/stores/character.js
import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";
import { browser } from "$app/environment";

// Define the Character type
interface Character {
  id: string;
  name: string;
  level: number;
  class: string;
  classId?: string;
  className?: string;
  experience: number;
  skills: Record<string, number>;
  abilities: string[];
  body: {
    measurements: string;
    cup: string;
    boobs: string;
    height: number;
    weight: number;
    bodytype: string;
    eyecolor: string;
    haircolor: string;
    pubichair: string;
    piercings: string;
    tattoos: string;
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
  skills: [], // Record<string, number>;
  abilities: [],
  body: {
    measurements: "",
    cup: "",
    boobs: "",
    height: 160,
    weight: 50,
    bodytype: "string",
    eyecolor: "string",
    haircolor: "string",
    pubichair: "string",
    piercings: "string",
    tattoos: "string",
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
    connections: 0,
    reputation: 0,
  },
  roles: [
    {
      title: "",
      character: "",
      production: "",
      year: "",
      rating: "",
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
    ? JSON.parse(localStorage.getItem("character")!)
    : initialCharacter;

// Create the store
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

// Helper function to update character
function updateCharacter(updates: Partial<Character>): void {
  characterStore.update((character) => ({
    ...character,
    ...updates,
  }));
}

// Function to load character from server
async function loadCharacterFromServer(characterId: string): Promise<void> {
  try {
    const response = await fetch(
      `https://pramari.de/rpg/api/data/${characterId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch character");
    const data: Character = await response.json();
    characterStore.set(data);
  } catch (error) {
    console.error("Error loading character:", error);
  }
}

/* // Helper functions for common operations
export const updateCharacterName = (name) => {
  character.update((char) => ({
    ...char,
    name,
  }));
};

export const updateCharacterClass = (classId, classObject) => {
  character.update((char) => ({
    ...char,
    classId,
    class: classObject,
  }));
};
 */
// Export the store and methods
export {
  characterStore,
  updateCharacter,
  // loadCharacterFromServer,
  type Character,
};
