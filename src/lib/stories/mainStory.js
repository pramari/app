// stories/mainStory.js

export const gameStory = {
  title: "The Forgotten Kingdom",
  startingScene: "appartment",
  startingLocation: "appartment",

  // Map configuration
  map: {
    // image: "/images/world_map.jpg", // Background image for your map
    width: 800,
    height: 600,

    // Define all locations on the map
    locations: {
      appartment: {
        name: "Appartement",
        description: "The place where you live",
        icon: "🏠", // Emoji or custom icon
      },
      photo_agency: {
        name: "Photo Agency",
        description: "A place where you can take pictures for your adventures.",
        x: 400,
        y: 400,
        icon: "📸",
      },
      village_square: {
        name: "Village Square",
        description: "The central gathering place of Willowbrook village.",
        icon: "🏠", // Emoji or custom icon
      },
      tavern: {
        name: "Silver Tankard Tavern",
        description:
          "A cozy establishment where villagers gather for drinks and gossip.",
        icon: "🍺",
      },
      forest_path: {
        name: "Forest Path",
        description: "A winding trail leading into the dense woods.",
        icon: "🌲",
      },
      ancient_ruins: {
        name: "Ancient Ruins",
        description: "The crumbling remains of a once-grand structure.",
        icon: "🏛️",
        // Requires a specific quest or condition to discover
        discoveryConditions: {
          requiredItem: "ruins_map",
        },
      },
      market: {
        name: "Village Market",
        description: "Bustling stalls selling goods from surrounding farms.",
        icon: "🛒",
      },
      blacksmith: {
        name: "Blacksmith",
        description:
          "The forge glows with heat as weapons and tools are crafted.",
        icon: "⚒️",
      },
      farmlands: {
        name: "Farmlands",
        description: "Fertile fields where villagers grow crops.",
        icon: "🌾",
      },
      river_crossing: {
        name: "River Crossing",
        description: "A stone bridge spanning the gentle stream.",
        icon: "🌉",
      },
      witch_hut: {
        name: "Herbalist's Hut",
        description: "A small cottage surrounded by gardens of strange plants.",
        icon: "🧙‍♀️",
      },
      agency_euro: {
        name: "Model Agency",
        description: "",
        icon: "👗",
        services: ["modeling", "styling", "casting"],
      },
      studio: {
        name: "Model Studio",
        description: "",
        icon: "📸",
        services: ["filming", "photography"],
      },
      doctor: {
        name: "Doctor",
        description: "",
        icon: "🩺",
        services: [
          "vaccination",
          "consultation",
          "treatment",
          "circumcision",
          "breast augmentation",
          "family planning",
          "laboratory",
          "pharmacy",
          "ultrasound",
          "x-ray",
        ],
      },
    },
  },

  // Scenes definition
  scenes: {
    appartment: {
      title: "Your Appartment",
      description:
        "You stand in the small, cozy appartment you call home. The fire crackles in the hearth, casting a warm glow over the room.",
      image: "/images/locations/appartment.jpg",
      location: "appartment",
      characters: [
         {
          id: "flatmate_1",
          name: "Sonja",
          description: "The obvious goth girl.",
        },
        {
          id: "flatmate_2",
          name: "Carmen",
          description: "The clean economics student.",
        },
        {
          id: "flatmate_3",
          name: "Frank",
          description: "The quiet guy who is always reading.",
        },
      ],
      choices: [
        {
          text: "Go to the village square",
          nextScene: "village_square",
        },
        {
          text: "Rest by the fire",
          nextScene: "rest_by_fire",
        },
        {
          text: "Check your inventory",
          nextScene: "inventory",
        },
        {
          text: "Look out the window",
          nextScene: "window_view",
        },
        {
          text: "Practice for next scene",
          requirements: [
            {
              skills: [
                {
                  acting: true,
                },
              ],
              items: ["script"],
              experience: 20,
              location_discovered: "studio",
            },
          ],
          nextScene: "practice",
        },
      ],
    },
    village_square: {
      title: "Village Square",
      description:
        "You find yourself in the center of a small village. People are going about their business, but there's a somber mood in the air. An old man sits on a bench, staring at the ground.",
      image: "/images/locations/village_square.jpg",
      location: "village_square", // This links the scene to a map location
      characters: [
        {
          id: "thaddeus",
          name: "Old Man Thaddeus",
          description: "A village elder with a worried look.",
        },
      ],
      choices: [
        {
          text: "Approach the old man and talk to him",
          nextScene: "talking_to_thaddeus",
        },
        {
          text: "Explore another location",
          showMap: true, // This choice will open the map for travel
        },
        {
          text: "Check the notice board nearby",
          nextScene: "notice_board",
        },
      ],
    },

    talking_to_thaddeus: {
      title: "A Conversation with Thaddeus",
      description:
        "The old man looks up as you approach. 'Ah, a new face. You've come at a troubled time, stranger. Our village has been plagued by mysterious disappearances.'",
      location: "village_square",
      characters: [
        {
          id: "thaddeus",
          name: "Old Man Thaddeus",
          description: "His eyes show a glimmer of hope upon seeing you.",
        },
      ],
      choices: [
        {
          text: "Ask about the disappearances",
          nextScene: "thaddeus_explains",
        },
        {
          text: "Offer to help investigate",
          nextScene: "thaddeus_quest",
          consequences: {
            experience: 10,
          },
        },
        {
          text: "Return to the village square",
          nextScene: "village_square",
        },
      ],
    },

    // Add a scene for each location on the map
    tavern: {
      title: "The Silver Tankard Tavern",
      description:
        "You push open the heavy wooden door of the tavern. The air inside is warm and filled with the smell of ale and stew. A few patrons sit at tables, talking in hushed voices.",
      image: "/images/scenes/tavern.jpg",
      location: "tavern",
      characters: [
        {
          id: "barkeeper",
          name: "Mira the Barkeeper",
          description: "A stout woman with a no-nonsense attitude.",
        },
        {
          id: "mysterious_stranger",
          name: "Hooded Stranger",
          description: "A figure in a dark cloak sits alone in the corner.",
        },
      ],
      choices: [
        {
          text: "Speak with the barkeeper",
          nextScene: "talking_to_barkeeper",
        },
        {
          text: "Approach the hooded stranger",
          nextScene: "approach_stranger",
        },
        {
          text: "Leave the tavern",
          showMap: true,
        },
      ],
    },

    market: {
      title: "Village Market",
      description:
        "The market is bustling with activity. Vendors call out to passersby, advertising fresh produce, handcrafted goods, and other wares.",
      location: "market",
      characters: [
        {
          id: "merchant",
          name: "Elias the Merchant",
          description: "A shrewd trader with goods from distant lands.",
        },
      ],
      choices: [
        {
          text: "Browse the merchant's wares",
          nextScene: "merchant_shop",
        },
        {
          text: "Listen to village gossip",
          nextScene: "market_gossip",
        },
        {
          text: "Leave the market",
          showMap: true,
        },
      ],
    },

    // Continue with scenes for other locations...
    forest_path: {
      title: "Forest Path",
      description:
        "The path winds through ancient trees whose branches form a canopy overhead. Sunlight filters through the leaves, creating dappled patterns on the ground.",
      location: "forest_path",
      choices: [
        {
          text: "Venture deeper into the forest",
          skillCheck: {
            skill: "perception",
            difficulty: 3,
            successScene: "discover_ruins_entrance",
            failScene: "forest_lost",
          },
        },
        {
          text: "Search for herbs",
          skillCheck: {
            skill: "alchemy",
            difficulty: 2,
            successScene: "find_herbs",
            failScene: "find_nothing",
          },
        },
        {
          text: "Return to another location",
          showMap: true,
        },
      ],
    },

    // Special scene that reveals a hidden location
    discover_ruins_entrance: {
      title: "Hidden Path Discovered",
      description:
        "Your keen eye notices a barely visible trail branching off from the main path. Pushing aside some overgrown vegetation, you discover what appears to be an ancient stone marker with strange symbols.",
      location: "forest_path",
      choices: [
        {
          text: "Examine the stone marker",
          nextScene: "examine_ruins_marker",
        },
        {
          text: "Follow the hidden path",
          nextScene: "approach_ruins",
          consequences: {
            items: [
              {
                id: "ruins_map",
                name: "Map to Ancient Ruins",
                description:
                  "A rough map showing the location of hidden ruins in the forest.",
              },
            ],
            revealLocation: "ancient_ruins", // This will make the ruins visible on the map
          },
        },
        {
          text: "Return to another location",
          showMap: true,
        },
      ],
    },

    // More scenes...
  },
};
