import { insertSeedData } from "./src/db.js";
import { generateSeedData } from "./src/seed.js";

export async function handler(event, context) {
  const seedData = generateSeedData(event.number);

  const response = await insertSeedData(seedData);

  return response;
}
