import { z } from "zod";

export const creatorRequest = z.object({
  creatorId: z.string().min(1),
  prompt: z.string().min(8),
  subscriberNote: z.string().min(1),
});

export type CreatorRequest = z.infer<typeof creatorRequest>;

export function subscriberUpdate(note: string, imageUrl: string): string {
  const clean = note.trim();
  if (clean.length < 24) {
    return `${clean} New image: ${imageUrl}`;
  }
  return clean;
}
