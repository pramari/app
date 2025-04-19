// src/lib/stories/npc.ts

// Skill requirements interface
interface SkillRequirements {
  [key: string]: number; // Skill name and required level
}

// Requirement interface
interface Requirements {
  skills?: SkillRequirements;
  // Could be extended with other requirement types like items, level, etc.
}

// Item interface
interface Item {
  id: string;
  name: string;
  description: string;
  quantity?: number;
}

// Effects interface for dialogue options
interface DialogueEffects {
  experience?: number;
  relationship?: number;
  items?: Item[];
  quests?: {
    [key: string]: string; // Quest ID and its new status
  };
  // Could be extended with other effects
}

// Dialogue option interface
interface DialogueOption {
  text: string;
  response: string;
  next: string | null;
  requirements?: Requirements;
  requirementHint?: string;
  effects?: DialogueEffects;
}

// Dialogue section interface
interface DialogueSection {
  options: DialogueOption[];
}

// Dialogue sections dictionary
interface DialogueSections {
  [key: string]: DialogueSection;
}

// NPC dialogues interface
interface NPCDialogues {
  greeting: string;
  farewell: string;
  options: DialogueOption[];
  sections: DialogueSections;
}

// Main NPC interface
export interface NPC {
  id: string;
  name: string;
  portrait: string;
  description: string;
  dialogues: NPCDialogues;
}

// Type for the NPCs collection
export interface NPCCollection {
  [key: string]: NPC;
}

// NPCs data with type validation
export const npcs: NPCCollection = {
  spiegler: {
    id: "spiegler",
    name: "",
    portrait: "",
    description: "",
    dialogues: {
      greeting: "",
      farewell: "",
      options: [],
      sections: {},
    },
  },
  thaddeus: {
    id: "thaddeus",
    name: "Old Man Thaddeus",
    portrait: "/images/characters/thaddeus.png",
    description: "A village elder with a worried look.",
    dialogues: {
      greeting: "Ah, a new face. You've come at a troubled time, stranger.",
      farewell: "Stay safe out there. These are dangerous times.",
      options: [
        {
          text: "Tell me about the village troubles.",
          response:
            "It started a month ago. People began disappearing at night. No signs of struggle, just... gone.",
          next: "village_troubles",
        },
        {
          text: "Are you in charge here?",
          response:
            "No, no. Mayor Orlen runs things around here. Though he's not doing much about our problems...",
          next: "about_mayor",
        },
        {
          text: "I should go.",
          response: "Very well.",
          next: null,
        },
      ],
      sections: {
        village_troubles: {
          options: [
            {
              text: "Any idea what's causing the disappearances?",
              requirements: {
                skills: { persuasion: 2 },
              },
              requirementHint: "Need Persuasion 2",
              response:
                "I shouldn't be saying this, but... there are ruins in the forest north of here. The disappearances started after scholars visited those ruins.",
              effects: {
                experience: 10,
              },
              next: "about_ruins",
            },
            {
              text: "Has anyone investigated?",
              response:
                "The local guard is overwhelmed, and the mayor refuses to send for help from the capital. Says it would hurt our reputation as a peaceful trading post.",
              next: "about_investigations",
            },
            {
              text: "I could help investigate.",
              response:
                "Would you? That would be a blessing! Not many have the courage these days.",
              effects: {
                relationship: 10,
                quests: { missing_villagers: "active" },
                experience: 15,
              },
              next: "quest_details",
            },
          ],
        },
        about_ruins: {
          options: [
            {
              text: "Can you show me where these ruins are?",
              response:
                "I can do better than that. Here, take this map. I marked their location for you.",
              effects: {
                items: [
                  {
                    id: "ruins_map",
                    name: "Map to Ancient Ruins",
                    description:
                      "A hand-drawn map showing the way to mysterious ruins in the northern forest.",
                  },
                ],
              },
              next: null,
            },
            {
              text: "What were the scholars looking for?",
              response:
                "Artifacts from the old kingdom, I believe. They spoke of ancient magic and relics of power. Dangerous business if you ask me.",
              next: null,
            },
          ],
        },
        // More dialogue sections...
      },
    },
  },
  // More NPCs...
};

// Helper function to get an NPC by ID with type safety
export function getNPC(id: string): NPC | undefined {
  return npcs[id];
}

// Helper function to validate an NPC against the type definition
export function validateNPC(npc: any): boolean {
  // Basic required fields
  if (!npc.id || typeof npc.id !== 'string') return false;
  if (typeof npc.name !== 'string') return false;
  if (typeof npc.portrait !== 'string') return false;
  if (typeof npc.description !== 'string') return false;
  
  // Dialogues validation
  if (!npc.dialogues) return false;
  if (typeof npc.dialogues.greeting !== 'string') return false;
  if (typeof npc.dialogues.farewell !== 'string') return false;
  
  // Options validation
  if (!Array.isArray(npc.dialogues.options)) return false;
  
  // Sections validation (if any)
  if (npc.dialogues.sections && typeof npc.dialogues.sections !== 'object') return false;
  
  return true;
}