export const skills = {
  // Combat Skills
  combat: {
    name: "Combat",
    description: "Proficiency in melee combat and weapon handling.",
    category: "combat",
    icon: "⚔️",
  },
  archery: {
    name: "Archery",
    description: "Skill with bows and ranged weapons.",
    category: "combat",
    icon: "🏹",
  },
  defense: {
    name: "Defense",
    description: "Ability to block and resist physical damage.",
    category: "combat",
    icon: "🛡️",
  },

  // Attribute Skills
  strength: {
    name: "Strength",
    description: "Physical power and carrying capacity.",
    category: "attribute",
    icon: "💪",
  },
  agility: {
    name: "Agility",
    description: "Speed, reflexes, and balance.",
    category: "attribute",
    icon: "🏃",
  },
  intelligence: {
    name: "Intelligence",
    description: "Knowledge, memory, and reasoning ability.",
    category: "attribute",
    icon: "🧠",
  },

  // Magic Skills
  magic: {
    name: "Magic",
    description: "General magical aptitude and spellcasting.",
    category: "magic",
    icon: "✨",
  },
  alchemy: {
    name: "Alchemy",
    description: "Creation of potions and magical items.",
    category: "magic",
    icon: "⚗️",
  },

  // Stealth Skills
  stealth: {
    name: "Stealth",
    description: "Ability to move unseen and unheard.",
    category: "stealth",
    icon: "👤",
  },
  lockpicking: {
    name: "Lockpicking",
    description: "Opening locks without the proper key.",
    category: "stealth",
    icon: "🔓",
  },
  pickpocket: {
    name: "Pickpocket",
    description: "Taking items from others without detection.",
    category: "stealth",
    icon: "👛",
  },

  // Social Skills
  persuasion: {
    name: "Persuasion",
    description: "Convincing others through logical argument or charm.",
    category: "social",
    icon: "🗣️",
  },
  intimidation: {
    name: "Intimidation",
    description: "Using fear to influence others.",
    category: "social",
    icon: "😠",
  },

  // Perception Skills
  perception: {
    name: "Perception",
    description: "Noticing hidden details and sensing danger.",
    category: "perception",
    icon: "👁️",
  },
};

export const skillCategories = {
  combat: {
    name: "Combat Skills",
    description: "Skills related to fighting and defense",
  },
  attribute: {
    name: "Attributes",
    description: "Core character traits",
  },
  magic: {
    name: "Magical Skills",
    description: "Spellcasting and arcane knowledge",
  },
  stealth: {
    name: "Stealth Skills",
    description: "Abilities related to subterfuge and stealth",
  },
  social: {
    name: "Social Skills",
    description: "Interacting with other characters",
  },
  perception: {
    name: "Perception Skills",
    description: "Noticing and understanding your surroundings",
  },
};

export function getSkillInfo(skillId) {
  return (
    skills[skillId] || {
      name: skillId,
      description: "Unknown skill",
      category: "other",
      icon: "❓",
    }
  );
}

export function getSkillsByCategory() {
  const result = {};

  Object.keys(skillCategories).forEach((category) => {
    result[category] = Object.entries(skills)
      .filter(([_, skill]) => skill.category === category)
      .map(([id, skill]) => ({
        id,
        ...skill,
      }));
  });

  return result;
}
