// stories/mainStory.js

export const gameStory = {
  title: "The Forgotten Kingdom",
  startingScene: "village_square",
  startingLocation: "village_square",

  // Map configuration
  map: {
    image: "/images/world_map.jpg", // Background image for your map
    width: 800,
    height: 600,

    // Define all locations on the map
    locations: {
      village_square: {
        name: "Village Square",
        description: "The central gathering place of Willowbrook village.",
        x: 400, // X coordinate on the map
        y: 300, // Y coordinate on the map
        icon: "🏠", // Emoji or custom icon
      },
      tavern: {
        name: "Silver Tankard Tavern",
        description:
          "A cozy establishment where villagers gather for drinks and gossip.",
        x: 350,
        y: 200,
        icon: "🍺",
      },
      forest_path: {
        name: "Forest Path",
        description: "A winding trail leading into the dense woods.",
        x: 500,
        y: 150,
        icon: "🌲",
      },
      ancient_ruins: {
        name: "Ancient Ruins",
        description: "The crumbling remains of a once-grand structure.",
        x: 620,
        y: 100,
        icon: "🏛️",
        // Requires a specific quest or condition to discover
        discoveryConditions: {
          requiredItem: "ruins_map",
        },
      },
      market: {
        name: "Village Market",
        description: "Bustling stalls selling goods from surrounding farms.",
        x: 450,
        y: 360,
        icon: "🛒",
      },
      blacksmith: {
        name: "Blacksmith",
        description:
          "The forge glows with heat as weapons and tools are crafted.",
        x: 320,
        y: 340,
        icon: "⚒️",
      },
      farmlands: {
        name: "Farmlands",
        description: "Fertile fields where villagers grow crops.",
        x: 250,
        y: 400,
        icon: "🌾",
      },
      river_crossing: {
        name: "River Crossing",
        description: "A stone bridge spanning the gentle stream.",
        x: 550,
        y: 380,
        icon: "🌉",
      },
      witch_hut: {
        name: "Herbalist's Hut",
        description: "A small cottage surrounded by gardens of strange plants.",
        x: 650,
        y: 300,
        icon: "🧙‍♀️",
      },
      agency_euro: {
        name: "Model Agency",
        description: "",
        x: 100,
        y: 100,
        icon; "👗"
      }
    },

    // Define paths between locations
    paths: [
      { from: "village_square", to: "tavern", bidirectional: true },
      { from: "village_square", to: "market", bidirectional: true },
      { from: "village_square", to: "blacksmith", bidirectional: true },
      { from: "village_square", to: "farmlands", bidirectional: true },
      { from: "village_square", to: "river_crossing", bidirectional: true },
      { from: "market", to: "blacksmith", bidirectional: true },
      { from: "tavern", to: "forest_path", bidirectional: true },
      {
        from: "forest_path",
        to: "ancient_ruins",
        bidirectional: true,
        hidden: true,
      },
      { from: "river_crossing", to: "witch_hut", bidirectional: true },
    ],

    // Raster map data
    rasterMap: {
      image: "/images/world_map_full.jpg", // High-resolution map image
      width: 1600,
      height: 1200,
      playerAvatar: "🧙‍♂️", // Or use a character sprite
      moveSpeed: 5, // Pixels per frame

      // Starting position
      startingPosition: { x: 800, y: 600 },

      // Areas where the player can't walk (obstacles)
      obstacles: [
        // Buildings
        {
          type: "rect",
          x: 200,
          y: 150,
          width: 100,
          height: 80,
          description: "House",
        },
        {
          type: "rect",
          x: 400,
          y: 200,
          width: 150,
          height: 120,
          description: "Tavern",
        },
        {
          type: "rect",
          x: 700,
          y: 300,
          width: 120,
          height: 100,
          description: "Blacksmith",
        },

        // Natural obstacles
        {
          type: "circle",
          x: 900,
          y: 500,
          radius: 80,
          description: "Large Tree",
        },
        {
          type: "rect",
          x: 1200,
          y: 400,
          width: 300,
          height: 200,
          description: "Lake",
        },
        {
          type: "rect",
          x: 100,
          y: 800,
          width: 400,
          height: 30,
          description: "River",
        },
        {
          type: "rect",
          x: 300,
          y: 700,
          width: 30,
          height: 400,
          description: "River",
        },

        // Map boundaries (if needed)
        {
          type: "rect",
          x: 0,
          y: 0,
          width: 1600,
          height: 20,
          description: "North Border",
        },
        {
          type: "rect",
          x: 0,
          y: 1180,
          width: 1600,
          height: 20,
          description: "South Border",
        },
        {
          type: "rect",
          x: 0,
          y: 0,
          width: 20,
          height: 1200,
          description: "West Border",
        },
        {
          type: "rect",
          x: 1580,
          y: 0,
          width: 20,
          height: 1200,
          description: "East Border",
        },
      ],

      // Interactive areas that trigger events/scenes
      interactiveAreas: [
        {
          id: "village_square",
          type: "circle",
          x: 800,
          y: 600,
          radius: 50,
          name: "Village Square",
          description: "The central gathering place of Willowbrook village.",
          sceneId: "village_square",
        },
        {
          id: "tavern",
          type: "rect",
          x: 380,
          y: 180,
          width: 40,
          height: 30,
          name: "Silver Tankard Tavern",
          description:
            "A cozy establishment where villagers gather for drinks and gossip.",
          sceneId: "tavern",
        },
        {
          id: "blacksmith",
          type: "rect",
          x: 680,
          y: 280,
          width: 40,
          height: 30,
          name: "Blacksmith",
          description:
            "The forge glows with heat as weapons and tools are crafted.",
          sceneId: "blacksmith",
        },
        {
          id: "forest_path",
          type: "circle",
          x: 1100,
          y: 200,
          radius: 40,
          name: "Forest Path",
          description: "A trail leading into the dense woods.",
          sceneId: "forest_path",
        },
        {
          id: "river_crossing",
          type: "rect",
          x: 300,
          y: 770,
          width: 60,
          height: 40,
          name: "River Crossing",
          description: "A stone bridge spanning the gentle stream.",
          sceneId: "river_crossing",
        },
      ],

      // Map regions (optional - for ambient descriptions)
      regions: [
        {
          id: "village",
          type: "rect",
          x: 600,
          y: 400,
          width: 400,
          height: 400,
          name: "Willowbrook Village",
          ambience:
            "The sounds of village life surround you - merchants calling their wares, children playing, and the occasional chicken squawking.",
        },
        {
          id: "forest",
          type: "rect",
          x: 1000,
          y: 0,
          width: 600,
          height: 500,
          name: "Northern Forest",
          ambience:
            "The dense canopy filters sunlight into dappled patterns on the forest floor. Birds call from the branches above.",
        },
        {
          id: "farmlands",
          type: "rect",
          x: 0,
          y: 400,
          width: 500,
          height: 400,
          name: "Western Farmlands",
          ambience:
            "Fields of grain sway gently in the breeze. The rich smell of tilled earth fills the air.",
        },
      ],
    },
  },

  // Scenes definition
  scenes: {
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

export const oldGameStory = {
  title: "The Forgotten Kingdom",
  startingScene: "village_square",

  scenes: {
    village_square: {
      title: "Village Square",
      description:
        "You find yourself in the center of a small village. People are going about their business, but there's a somber mood in the air. An old man sits on a bench, staring at the ground.",
      image: "/images/locations/village_square.jpg",
      characters: [
        {
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
          text: "Check the notice board nearby",
          nextScene: "notice_board",
        },
        {
          text: "Head to the village tavern",
          nextScene: "tavern_entrance",
        },
      ],
    },

    talking_to_thaddeus: {
      title: "A Conversation with Thaddeus",
      description:
        "The old man looks up as you approach. 'Ah, a new face. You've come at a troubled time, stranger. Our village has been plagued by mysterious disappearances.'",
      characters: [
        {
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
          text: "Politely excuse yourself",
          nextScene: "village_square",
        },
      ],
    },

    thaddeus_explains: {
      title: "The Village's Troubles",
      description:
        "Thaddeus sighs deeply. 'It started a month ago. People began disappearing at night. No signs of struggle, just... gone. The local guard is overwhelmed, and the mayor refuses to send for help from the capital. Says it would hurt our reputation as a peaceful trading post.'",
      characters: [{ name: "Old Man Thaddeus" }],
      choices: [
        {
          text: "Offer to help investigate",
          nextScene: "thaddeus_quest",
          consequences: {
            experience: 10,
          },
        },
        {
          text: "Ask if he has any theories",
          skillCheck: {
            skill: "persuasion",
            difficulty: 2,
            successScene: "thaddeus_theory",
            failScene: "thaddeus_reluctant",
          },
        },
        {
          text: "Return to the village square",
          nextScene: "village_square",
        },
      ],
    },

    thaddeus_theory: {
      title: "Thaddeus's Theory",
      description:
        "Thaddeus leans closer, lowering his voice. 'I shouldn't be saying this, but... there are ruins in the forest north of here. Ancient ones. The disappearances started after a group of scholars visited those ruins. I think they awakened something that should have remained dormant.'",
      characters: [
        {
          name: "Old Man Thaddeus",
          description: "Speaking in hushed, worried tones.",
        },
      ],
      choices: [
        {
          text: "Ask for directions to the ruins",
          nextScene: "forest_path_directions",
          consequences: {
            experience: 15,
            items: [
              {
                id: "crude_map",
                name: "Crude Map",
                description:
                  "A hand-drawn map showing the path to the ancient ruins",
              },
            ],
          },
        },
        {
          text: "Thank him and return to the village square",
          nextScene: "village_square",
        },
      ],
    },

    tavern_entrance: {
      title: "The Silver Tankard Tavern",
      description:
        "You push open the heavy wooden door of the tavern. The air inside is warm and filled with the smell of ale and stew. A few patrons sit at tables, talking in hushed voices. The barkeeper eyes you curiously.",
      characters: [
        {
          name: "Mira the Barkeeper",
          description: "A stout woman with a no-nonsense attitude.",
        },
        {
          name: "Mysterious Hooded Figure",
          description: "Sitting alone in the corner, face obscured.",
        },
      ],
      choices: [
        {
          text: "Approach the barkeeper",
          nextScene: "talking_to_barkeeper",
        },
        {
          text: "Sit near the mysterious figure",
          nextScene: "mysterious_figure",
        },
        {
          text: "Leave the tavern",
          nextScene: "village_square",
        },
      ],
    },

    // More scenes would be defined here...

    forest_path_directions: {
      title: "Path to the Ruins",
      description:
        "Thaddeus draws you a rough map on a scrap of parchment. 'Follow the northern path out of the village. When you reach the split oak, take the eastern fork. The ruins are about an hour's walk from there. But be careful, stranger. Whatever is happening... it's not natural.'",
      choices: [
        {
          text: "Thank Thaddeus and head north immediately",
          nextScene: "forest_path_entrance",
        },
        {
          text: "Return to the village square to prepare",
          nextScene: "village_square",
        },
      ],
    },

    forest_path_entrance: {
      title: "The Edge of the Forest",
      description:
        "The village gives way to thick forest. The path ahead is overgrown but visible, winding between ancient trees whose branches form a canopy overhead. You can hear birds singing, but something feels wrong about this place.",
      choices: [
        {
          text: "Continue along the path cautiously",
          nextScene: "forest_split_oak",
        },
        {
          text: "Examine the surrounding area",
          skillCheck: {
            skill: "perception",
            difficulty: 3,
            successScene: "forest_hidden_signs",
            failScene: "forest_path_continue",
          },
        },
        {
          text: "Return to the village",
          nextScene: "village_square",
        },
      ],
    },

    // And many more scenes to build out the complete story...
    forest_hidden_signs: {
      title: "Hidden Signs",
      description:
        "You notice subtle signs of disturbance in the underbrush. Broken twigs, disturbed leaves, and faint footprints that don't belong to any animal you recognize. Someone or something has been through here recently.",
      choices: [
        {
          text: "Follow the trail quietly",
          nextScene: "forest_ambush",
        },
        {
          text: "Return to the main path",
          nextScene: "forest_path_continue",
        },
      ],
    },
  },
};
