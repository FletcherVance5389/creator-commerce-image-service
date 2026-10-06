import assert from "node:assert/strict";
import { subscriberUpdate } from "./content_processing.js";

const result = subscriberUpdate("Fresh preview", "https://cdn.example/image.png");
assert.equal(result, "Fresh preview New image: https://cdn.example/image.png");
console.log("subscriber update decision passed");
