export const characterClasses = [
  {
    id: "warrior",
    name: "Warrior",
    description: "Strong and durable fighters who excel in combat.",
    portrait: "/images/classes/warrior.jpg",
    startingStats: {
      health: 100,
      stamina: 80,
      mana: 20,
    },
    startingSkills: {
      combat: 3,
      strength: 3,
      defense: 2,
      persuasion: 1,
    },
    equipmentSlots: [
      "weapon",
      "shield",
      "armor",
      "helmet",
      "boots",
      "accessory",
    ],
    abilities: [
      {
        id: "power_strike",
        name: "Power Strike",
        description: "A powerful melee attack that deals extra damage.",
        unlockLevel: 1,
      },
      {
        id: "shield_bash",
        name: "Shield Bash",
        description: "Bash enemies with your shield, stunning them briefly.",
        unlockLevel: 3,
      },
      {
        id: "endurance",
        name: "Endurance",
        description: "Passive ability that increases maximum health.",
        unlockLevel: 5,
      },
    ],
  },
  {
    id: "mage",
    name: "Mage",
    description: "Intelligent spellcasters with powerful magical abilities.",
    portrait: "/images/classes/mage.jpg",
    startingStats: {
      health: 60,
      stamina: 50,
      mana: 120,
    },
    startingSkills: {
      magic: 3,
      intelligence: 3,
      perception: 2,
      alchemy: 1,
    },
    equipmentSlots: ["staff", "robe", "amulet", "ring", "boots", "accessory"],
    abilities: [
      {
        id: "fireball",
        name: "Fireball",
        description: "Launch a ball of fire at your enemies.",
        unlockLevel: 1,
      },
      {
        id: "arcane_shield",
        name: "Arcane Shield",
        description: "Create a magical barrier that absorbs damage.",
        unlockLevel: 3,
      },
      {
        id: "mana_surge",
        name: "Mana Surge",
        description:
          "Passive ability that increases spell power based on remaining mana.",
        unlockLevel: 5,
      },
    ],
  },
  {
    id: "rogue",
    name: "Rogue",
    description:
      "Agile and cunning characters who excel at stealth and trickery.",
    portrait: "/images/classes/rogue.jpg",
    startingStats: {
      health: 75,
      stamina: 100,
      mana: 40,
    },
    startingSkills: {
      stealth: 3,
      agility: 3,
      lockpicking: 2,
      perception: 1,
    },
    equipmentSlots: [
      "dagger",
      "light_armor",
      "hood",
      "boots",
      "gloves",
      "accessory",
    ],
    abilities: [
      {
        id: "backstab",
        name: "Backstab",
        description: "Attack an enemy from behind for massive damage.",
        unlockLevel: 1,
      },
      {
        id: "vanish",
        name: "Vanish",
        description:
          "Disappear from sight briefly, allowing you to reposition or escape.",
        unlockLevel: 3,
      },
      {
        id: "quick_fingers",
        name: "Quick Fingers",
        description:
          "Passive ability that increases lockpicking success and pickpocketing chance.",
        unlockLevel: 5,
      },
    ],
  },
];

export function getClassById(classId) {
  return characterClasses.find((c) => c.id === classId) || null;
}

export function getStartingSkillsForClass(classId) {
  const characterClass = getClassById(classId);
  return characterClass ? characterClass.startingSkills : {};
}
