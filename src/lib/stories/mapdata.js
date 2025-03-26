// src/lib/data/mapData.js

export const mapData = {
  mapImage: "/images/maps/world-map.jpg", // Path to map background image

  // Each location has a position on the map with x, y coordinates (0-1000 range)
  locations: [
    {
      id: "village_square",
      name: "Village Square",
      description: "The central gathering place of Riverdale village.",
      x: 500,
      y: 500,
      icon: "🏠",
    },
    {
      id: "forest_path",
      name: "Forest Path",
      description: "A winding path through the ancient forest.",
      x: 600,
      y: 350,
      icon: "🌲",
    },
    {
      id: "ancient_ruins",
      name: "Ancient Ruins",
      description: "The crumbling remains of a once-great civilization.",
      x: 750,
      y: 250,
      icon: "🏛️",
    },
    {
      id: "mountain_pass",
      name: "Mountain Pass",
      description: "A treacherous path through the mountains.",
      x: 350,
      y: 300,
      icon: "⛰️",
    },
    {
      id: "tavern",
      name: "The Silver Tankard",
      description: "A cozy tavern where travelers share stories over ale.",
      x: 450,
      y: 550,
      icon: "🍺",
    },
    {
      id: "blacksmith",
      name: "Village Smithy",
      description: "The local blacksmith crafts fine weapons and armor.",
      x: 550,
      y: 550,
      icon: "🔨",
    },
    {
      id: "dark_cave",
      name: "Dark Cave",
      description: "A mysterious cave that few dare to enter.",
      x: 300,
      y: 200,
      icon: "🕳️",
    },
    {
      id: "mystic_grove",
      name: "Mystic Grove",
      description: "A peaceful grove teeming with magical energy.",
      x: 700,
      y: 450,
      icon: "🌿",
    },
    {
      id: "castle",
      name: "Baron's Castle",
      description: "The imposing castle of Baron Blackmoor.",
      x: 650,
      y: 650,
      icon: "🏰",
    },
  ],

  // Connections define paths between locations and any requirements to travel
  connections: [
    // Village connections
    { from: "village_square", to: "tavern" },
    { from: "village_square", to: "blacksmith" },
    { from: "village_square", to: "forest_path" },
    { from: "village_square", to: "mountain_pass" },
    {
      from: "village_square",
      to: "castle",
      requirement: {
        quest: "village_favor",
        description:
          "You need to help the village first before the castle gates will open to you.",
      },
    },

    // Forest connections
    { from: "forest_path", to: "mystic_grove" },
    {
      from: "forest_path",
      to: "ancient_ruins",
      requirement: {
        skill: "perception",
        value: 2,
        description: "You need better perception to find the hidden path.",
      },
    },

    // Mountain connections
    {
      from: "mountain_pass",
      to: "dark_cave",
      requirement: {
        item: "torch",
        description: "You need a torch to enter the dark cave.",
      },
    },

    // Other connections
    { from: "tavern", to: "blacksmith" },
    { from: "mystic_grove", to: "ancient_ruins" },
  ],
};

// Function to get initial scene for a location
export function getLocationScene(locationId) {
  const sceneMap = {
    village_square: "village_square",
    tavern: "tavern_entrance",
    blacksmith: "blacksmith_shop",
    forest_path: "forest_path_entrance",
    mountain_pass: "mountain_path_start",
    ancient_ruins: "ruins_entrance",
    dark_cave: "cave_entrance",
    mystic_grove: "mystic_grove_clearing",
    castle: "castle_gates",
  };

  return sceneMap[locationId] || locationId;
}
