// src/lib/utils/gameUtils.js
import { gameStory } from "$lib/stories/mainStory.js";

// Get a scene by ID
export function getScene(sceneId) {
  if (!sceneId || typeof sceneId !== "string") {
    console.error("Invalid scene ID:", sceneId);
    return null;
  }

  const scene = gameStory.scenes[sceneId];

  if (!scene) {
    console.error(`Scene ID "${sceneId}" not found!`);
    return null;
  }

  return scene;
}

// Get scene for a location
export function getSceneForLocation(locationId) {
  // First check if there's a scene with the same ID as the location
  if (gameStory.scenes[locationId]) {
    return gameStory.scenes[locationId];
  }

  // Otherwise, find a scene that references this location
  const sceneEntry = Object.entries(gameStory.scenes).find(
    ([_, scene]) => scene.location === locationId,
  );

  return sceneEntry ? sceneEntry[1] : null;
}

// Check if player has required item
export function playerHasItem(inventory, itemId) {
  return inventory.some((item) => item.id === itemId);
}

// Get available locations from current one
export function getAvailableLocations(currentLocationId, mapData) {
  return mapData.paths
    .filter(
      (path) =>
        path.from === currentLocationId ||
        (path.bidirectional && path.to === currentLocationId),
    )
    .map((path) => (path.from === currentLocationId ? path.to : path.from));
}

// Reveal a hidden path
export function revealPath(fromLocationId, toLocationId, mapData) {
  const path = mapData.paths.find(
    (p) =>
      (p.from === fromLocationId && p.to === toLocationId) ||
      (p.bidirectional && p.from === toLocationId && p.to === fromLocationId),
  );

  if (path) {
    path.hidden = false;
    return true;
  }
  return false;
}
