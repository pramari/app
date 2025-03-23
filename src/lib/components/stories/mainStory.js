// stories/mainStory.js

export const gameStory = {
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
