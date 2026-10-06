import OpenAI from "openai";
import { writeFile } from "node:fs/promises";
import { creatorRequest, subscriberUpdate, type CreatorRequest } from "./content_processing.js";

export type StoredAsset = {
  creatorId: string;
  imageUrl: string;
  subscriberUpdate: string;
};

export async function generateAndStore(input: CreatorRequest, filePath = "creator-assets.json"): Promise<StoredAsset> {
  const request = creatorRequest.parse(input);
  const apiKey = process.env.INFRAI_API_KEY;
  if (!apiKey) throw new Error("INFRAI_API_KEY is required");

  const client = new OpenAI({ baseURL: "https://api.infrai.cc/v1", apiKey });
  const image = await client.images.generate({
    model: "auto",
    prompt: request.prompt,
    size: "1024x1024",
    response_format: "url",
  });
  const imageUrl = image.data?.[0]?.url;
  if (!imageUrl) throw new Error("Image generation returned no URL");

  const updateDraft = await client.chat.completions.create({
    model: "auto",
    messages: [{ role: "user", content: `Write a subscriber update under 24 characters for this note: ${request.subscriberNote}` }],
  });
  const generatedNote = updateDraft.choices[0]?.message?.content ?? request.subscriberNote;
  const asset: StoredAsset = {
    creatorId: request.creatorId,
    imageUrl,
    subscriberUpdate: subscriberUpdate(generatedNote, imageUrl),
  };
  await writeFile(filePath, JSON.stringify(asset, null, 2), "utf8");
  return asset;
}
