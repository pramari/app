// $lib/stores/character.js
import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

// Define the Character type
interface Character {
  id: string;
  name: string;
  level: number;
  class: string;
  race: string;
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  experience: number;
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
  skills: Record<string, number>;
  abilities: string[];
}

// Initial state
export const initialCharacter: Character = {
  name: "",
  class: null,
  classId: null,
  className: null,
  skills: {},
  stats: {},
  skillPoints: 3,
  level: 1,
  experience: 0,
  abilities: [],
};

// Create the store
const characterStore: Writable<Character> = writable(initialCharacter);

// Helper function to update character
function updateCharacter(updates: Partial<Character>): void {
  characterStore.update((character) => ({
    ...character,
    ...updates,
  }));
}

// Optional: Function to load character from server
async function loadCharacterFromServer(characterId: string): Promise<void> {
  try {
    const response = await fetch(`/api/characters/${characterId}`);
    if (!response.ok) throw new Error("Failed to fetch character");
    const data: Character = await response.json();
    characterStore.set(data);
  } catch (error) {
    console.error("Error loading character:", error);
    // Fallback to initial character if loading fails
    characterStore.set(initialCharacter);
  }
}

// Helper functions for common operations
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

// Export the store and methods
export {
  characterStore,
  updateCharacter,
  loadCharacterFromServer,
  type Character,
};
