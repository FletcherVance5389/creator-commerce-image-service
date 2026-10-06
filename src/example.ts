import { generateAndStore } from "./creator_image_service.js";

const asset = await generateAndStore({
  creatorId: "creator-42",
  prompt: "A warm editorial still life of a handmade ceramic mug beside a sketchbook",
  subscriberNote: "A new studio preview is ready for subscribers.",
});

console.log(JSON.stringify(asset, null, 2));
